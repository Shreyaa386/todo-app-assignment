const TodoService = require("../services/todoService");

class TodoController {
  static async getTodos(req, res) {
    try {
      const userId = 1;
      const { search, status } = req.query;

      const todos = await TodoService.getAllTodos(userId, { search, status });

      return res.status(200).json(todos);
    } catch (error) {
      console.error("Error fetching todos:", error);
      return res.status(500).json({ error: "Failed to fetch todos" });
    }
  }

  static async getTodoById(req, res) {
    try {
      const userId = 1;
      const { id } = req.params;
      const numericId = Number(id);

      if (isNaN(numericId) || !Number.isInteger(numericId) || numericId <= 0) {
        return res
          .status(400)
          .json({ error: "Invalid Todo ID. ID must be a positive integer" });
      }

      const todo = await TodoService.getTodoById(userId, numericId);

      if (!todo) {
        return res.status(404).json({
          error: `Todo with ID ${id} not found`
        });
      }

      return res.status(200).json(todo);
    } catch (error) {
      console.error("Error fetching todo:", error);
      return res.status(500).json({
        error: "Failed to fetch todo details"
      });
    }
  }

  static async createTodo(req, res) {
    try {
      const userId = 1;
      const { title, description = "" } = req.body;

      if (!title || typeof title !== "string" || title.trim() === "") {
        return res.status(400).json({
          error: "Title is required and cannot be empty"
        });
      }

      const newTodo = await TodoService.createTodo(userId, {
        title,
        description
      });

      return res.status(201).json(newTodo);
    } catch (error) {
      console.error("Error creating todo:", error);
      return res.status(500).json({
        error: "Failed to create todo"
      });
    }
  }

  static async updateTodo(req, res) {
    try {
      const userId = 1;
      const { id } = req.params;
      const numericId = Number(id);

      if (isNaN(numericId) || !Number.isInteger(numericId) || numericId <= 0) {
        return res
          .status(400)
          .json({ error: "Invalid Todo ID. ID must be a positive integer" });
      }

      const { title, description, completed } = req.body;

      if (
        title !== undefined &&
        (typeof title !== "string" || title.trim() === "")
      ) {
        return res.status(400).json({
          error: "Title cannot be empty"
        });
      }

      const updatedTodo = await TodoService.updateTodo(userId, numericId, {
        title,
        description,
        completed
      });

      if (!updatedTodo) {
        return res.status(404).json({
          error: `Todo with ID ${id} not found`
        });
      }

      return res.status(200).json(updatedTodo);
    } catch (error) {
      console.error("Error updating todo:", error);
      return res.status(500).json({
        error: "Failed to update todo"
      });
    }
  }

  static async deleteTodo(req, res) {
    try {
      const userId = 1;
      const { id } = req.params;
      const numericId = Number(id);

      if (isNaN(numericId) || !Number.isInteger(numericId) || numericId <= 0) {
        return res
          .status(400)
          .json({ error: "Invalid Todo ID. ID must be a positive integer" });
      }

      const deleted = await TodoService.deleteTodo(userId, numericId);

      if (!deleted) {
        return res.status(404).json({
          error: `Todo with ID ${id} not found`
        });
      }

      return res.status(200).json({
        message: "Todo deleted successfully",
        id: numericId
      });
    } catch (error) {
      console.error("Error deleting todo:", error);
      return res.status(500).json({
        error: "Failed to delete todo"
      });
    }
  }
}

module.exports = TodoController;