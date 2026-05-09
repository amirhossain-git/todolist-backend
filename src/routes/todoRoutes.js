const express = require("express");

const {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo
} = require("../controllers/todoController");
const { validateObjectId } = require("../middleware/validateObjectId");
const { validateCreateTodo, validateUpdateTodo } = require("../middleware/validateTodo");

const router = express.Router();

router.get("/", getTodos);
router.post("/", validateCreateTodo, createTodo);
router.put("/:id", validateObjectId("id"), validateUpdateTodo, updateTodo);
router.delete("/:id", validateObjectId("id"), deleteTodo);

module.exports = router;

