const fs = require("fs").promises;
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const USERS_FILE = path.join(__dirname, "../../data/users.json");
const JWT_SECRET = process.env.JWT_SECRET || "zip-trip-taskpulse-jwt-secret-key-2026";

async function readUsersFromFile() {
  try {
    const data = await fs.readFile(USERS_FILE, "utf8");
    const rawUsers = JSON.parse(data);
    return rawUsers.map(
      (u) => new User(u.id, u.name, u.email, u.password, u.createdAt)
    );
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

async function writeUsersToFile(users) {
  const data = JSON.stringify(users, null, 2);
  await fs.writeFile(USERS_FILE, data, "utf8");
}

class AuthService {
  static async findUserByEmail(email) {
    if (!email) return null;
    const users = await readUsersFromFile();
    const cleanEmail = email.toLowerCase().trim();
    const user = users.find((u) => u.email === cleanEmail);
    return user || null;
  }

  static async findUserById(id) {
    const users = await readUsersFromFile();
    const user = users.find((u) => u.id === Number(id));
    return user || null;
  }

  static async createUser({ name, email, password }) {
    const users = await readUsersFromFile();
    const cleanEmail = email.toLowerCase().trim();

    // Check duplicate email
    const existing = users.find((u) => u.email === cleanEmail);
    if (existing) {
      const error = new Error("An account with this email address already exists");
      error.statusCode = 400;
      throw error;
    }

    // Hash password with bcryptjs
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
    const newUser = new User(newId, name.trim(), cleanEmail, hashedPassword);

    users.push(newUser);
    await writeUsersToFile(users);

    return newUser;
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static generateToken(user) {
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
  }

  static verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return null;
    }
  }
}

module.exports = AuthService;
