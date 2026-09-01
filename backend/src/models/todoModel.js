class Todo {
  constructor(id, userId, title, description = "", completed = false, createdAt = null, updatedAt = null) {
    this.id = Number(id);
    this.userId = Number(userId || 1);
    this.title = title;
    this.description = description;
    this.completed = Boolean(completed);
    this.createdAt = createdAt || new Date().toISOString();
    this.updatedAt = updatedAt || new Date().toISOString();
  }
}

module.exports = Todo;