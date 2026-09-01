const TodoService = require("../services/todoService");

class TodoController {
  static async getTodos(req, res) {
    try {
      const { search, status } = req.query;
      const todos = await TodoService.getAllTodos({ search, status });
      return res.status(200).json(todos);
    } catch (error) {
      console.error("Error fetching todos:", error);
      return res.status(500).json({ error: "Failed to fetch todos" });
    }
  }

  static async getTodoById(req, res) {
    try {
      const { id } = req.params;
      const todo = await TodoService.getTodoById(id);
      if (!todo) {
        return res.status(404).json({ error: `Todo with ID ${id} not found` });
      }
      return res.status(200).json(todo);
    } catch (error) {
      console.error("Error fetching todo:", error);
      return res.status(500).json({ error: "Failed to fetch todo details" });
    }
  }

  static async createTodo(req, res) {
    try {
      const { title, description } = req.body;

      if (!title || typeof title !== "string" || title.trim() === "") {
        return res.status(400).json({ error: "Title is required and cannot be empty" });
      }

      const newTodo = await TodoService.createTodo({ title, description });
      return res.status(201).json(newTodo);
    } catch (error) {
      console.error("Error creating todo:", error);
      return res.status(500).json({ error: "Failed to create todo" });
    }
  }

  static async updateTodo(req, res) {
    try {
      const { id } = req.params;
      const { title, description, completed } = req.body;

      if (title !== undefined && (typeof title !== "string" || title.trim() === "")) {
        return res.status(400).json({ error: "Title cannot be empty" });
      }

      const updatedTodo = await TodoService.updateTodo(id, {
        title,
        description,
        completed
      });

      if (!updatedTodo) {
        return res.status(404).json({ error: `Todo with ID ${id} not found` });
      }

      return res.status(200).json(updatedTodo);
    } catch (error) {
      console.error("Error updating todo:", error);
      return res.status(500).json({ error: "Failed to update todo" });
    }
  }

  static async deleteTodo(req, res) {
    try {
      const { id } = req.params;
      const deleted = await TodoService.deleteTodo(id);

      if (!deleted) {
        return res.status(404).json({ error: `Todo with ID ${id} not found` });
      }

      return res.status(200).json({ message: "Todo deleted successfully", id: Number(id) });
    } catch (error) {
      console.error("Error deleting todo:", error);
      return res.status(500).json({ error: "Failed to delete todo" });
    }
  }
}

module.exports = TodoController;
