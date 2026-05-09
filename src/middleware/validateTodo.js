function isNonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}

function isBoolean(v) {
  return typeof v === "boolean";
}

function validateCreateTodo(req, res, next) {
  const { title, notes, dueDate, completed } = req.body ?? {};

  if (!isNonEmptyString(title)) {
    return res.status(400).json({ message: "Title is required" });
  }
  if (notes !== undefined && typeof notes !== "string") {
    return res.status(400).json({ message: "Notes must be a string" });
  }
  if (completed !== undefined && !isBoolean(completed)) {
    return res.status(400).json({ message: "Completed must be a boolean" });
  }
  if (dueDate !== undefined && dueDate !== null) {
    const d = new Date(dueDate);
    if (Number.isNaN(d.getTime())) {
      return res.status(400).json({ message: "Due date must be a valid date" });
    }
  }

  next();
}

function validateUpdateTodo(req, res, next) {
  const { title, notes, dueDate, completed } = req.body ?? {};

  if (title !== undefined && !isNonEmptyString(title)) {
    return res.status(400).json({ message: "Title must be a non-empty string" });
  }
  if (notes !== undefined && typeof notes !== "string") {
    return res.status(400).json({ message: "Notes must be a string" });
  }
  if (completed !== undefined && !isBoolean(completed)) {
    return res.status(400).json({ message: "Completed must be a boolean" });
  }
  if (dueDate !== undefined) {
    if (dueDate === null || dueDate === "") return next();
    const d = new Date(dueDate);
    if (Number.isNaN(d.getTime())) {
      return res.status(400).json({ message: "Due date must be a valid date" });
    }
  }

  next();
}

module.exports = { validateCreateTodo, validateUpdateTodo };

