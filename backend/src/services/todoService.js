const fs = require("fs").promises;
const path = require("path");
const Todo = require("../models/todoModel");

const DATA_FILE = path.join(__dirname, "../../data/todos.json");

// Helper to read data from JSON file
async function readTodosFromFile() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf8");
    const rawTodos = JSON.parse(data);
    return rawTodos.map(
      (item) =>
        new Todo(
          item.id,
          item.title,
          item.description,
          item.completed,
          item.createdAt,
          item.updatedAt
        )
    );
  } catch (error) {
    if (error.code === "ENOENT") {
      // If file doesn't exist, return empty list
      return [];
    }
    throw error;
  }
}

// Helper to write data to JSON file
async function writeTodosToFile(todos) {
  const data = JSON.stringify(todos, null, 2);
  await fs.writeFile(DATA_FILE, data, "utf8");
}

class TodoService {
  static async getAllTodos({ search, status } = {}) {
    let todos = await readTodosFromFile();

    if (search && search.trim() !== "") {
      const query = search.toLowerCase().trim();
      todos = todos.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query)
      );
    }

    if (status) {
      if (status === "completed") {
        todos = todos.filter((t) => t.completed === true);
      } else if (status === "active") {
        todos = todos.filter((t) => t.completed === false);
      }
    }

    return todos;
  }

  static async getTodoById(id) {
    const todos = await readTodosFromFile();
    const todo = todos.find((t) => t.id === Number(id));
    return todo || null;
  }

  static async createTodo({ title, description = "" }) {
    const todos = await readTodosFromFile();
    const newId = todos.length > 0 ? Math.max(...todos.map((t) => t.id)) + 1 : 1;
    const newTodo = new Todo(newId, title.trim(), description.trim(), false);
    todos.push(newTodo);
    await writeTodosToFile(todos);
    return newTodo;
  }

  static async updateTodo(id, { title, description, completed }) {
    const todos = await readTodosFromFile();
    const index = todos.findIndex((t) => t.id === Number(id));
    if (index === -1) return null;

    const current = todos[index];
    const updatedTitle = title !== undefined ? title.trim() : current.title;
    const updatedDesc = description !== undefined ? description.trim() : current.description;
    const updatedCompleted = completed !== undefined ? Boolean(completed) : current.completed;

    const updatedTodo = new Todo(
      current.id,
      updatedTitle,
      updatedDesc,
      updatedCompleted,
      current.createdAt,
      new Date().toISOString()
    );

    todos[index] = updatedTodo;
    await writeTodosToFile(todos);
    return updatedTodo;
  }

  static async deleteTodo(id) {
    const todos = await readTodosFromFile();
    const index = todos.findIndex((t) => t.id === Number(id));
    if (index === -1) return false;

    todos.splice(index, 1);
    await writeTodosToFile(todos);
    return true;
  }
}

module.exports = TodoService;
