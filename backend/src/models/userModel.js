class User {
  constructor(id, name, email, password, createdAt = null) {
    this.id = Number(id);
    this.name = name;
    this.email = email.toLowerCase().trim();
    this.password = password; // Hashed password
    this.createdAt = createdAt || new Date().toISOString();
  }

  toSafeUser() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      createdAt: this.createdAt
    };
  }
}

module.exports = User;
