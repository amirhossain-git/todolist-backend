const Todo = require("../models/Todo");
const { asyncHandler } = require("../utils/asyncHandler");

function parsePositiveInt(value, fallback) {
  const n = Number.parseInt(String(value), 10);
  if (Number.isNaN(n) || n <= 0) return fallback;
  return n;
}

/**
 * GET /api/todos
 * Supports:
 * - pagination: page, limit
 * - search: q (matches title/notes)
 * - status: all | active | completed
 * - sort: newest | oldest
 */
const getTodos = asyncHandler(async (req, res) => {
  const page = parsePositiveInt(req.query.page, 1);
  const limit = parsePositiveInt(req.query.limit, 10);
  const status = String(req.query.status || "all");
  const q = String(req.query.q || "").trim();
  const sort = String(req.query.sort || "newest");

  const filter = {};
  if (status === "completed") filter.completed = true;
  if (status === "active") filter.completed = false;

  if (q) {
    filter.$text = { $search: q };
  }

  const sortSpec = sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Todo.find(filter)
      .sort(sortSpec)
      .skip(skip)
      .limit(limit)
      .lean(),
    Todo.countDocuments(filter)
  ]);

  res.status(200).json({
    items,
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit))
  });
});

/**
 * POST /api/todos
 */
const createTodo = asyncHandler(async (req, res) => {
  const { title, notes = "", dueDate = null, completed = false } = req.body;

  const todo = await Todo.create({
    title: title.trim(),
    notes,
    completed,
    dueDate: dueDate ? new Date(dueDate) : null
  });

  res.status(201).json(todo);
});

/**
 * PUT /api/todos/:id
 */
const updateTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const patch = {};

  if (req.body.title !== undefined) patch.title = req.body.title.trim();
  if (req.body.notes !== undefined) patch.notes = req.body.notes;
  if (req.body.completed !== undefined) patch.completed = req.body.completed;
  if (req.body.dueDate !== undefined) {
    patch.dueDate = req.body.dueDate ? new Date(req.body.dueDate) : null;
  }

  const updated = await Todo.findByIdAndUpdate(id, patch, {
    new: true,
    runValidators: true
  });

  if (!updated) {
    return res.status(404).json({ message: "Todo not found" });
  }

  res.status(200).json(updated);
});

/**
 * DELETE /api/todos/:id
 */
const deleteTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleted = await Todo.findByIdAndDelete(id);

  if (!deleted) {
    return res.status(404).json({ message: "Todo not found" });
  }

  res.status(204).send();
});

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo
};

