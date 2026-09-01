# TaskPulse - Todo Application

A full-stack Todo application built as part of the Ziptripp developer assignment.

## Project Overview

TaskPulse is a Todo management application with a React frontend and Node.js + Express backend.

The application allows users to create, view, update, delete, search and filter their Todo tasks.

Todo data is persisted using a JSON file.

## Tech Stack

### Frontend
- React
- Vite
- React Router
- JavaScript
- CSS

### Backend
- Node.js
- Express.js
- CORS

### Storage
- JSON file

## Main Features

- Create Todo
- View all Todos
- View Todo details
- Update Todo
- Delete Todo
- Mark Todo as completed
- Search Todos by title or description
- Filter Todos by status
- Display task statistics
- Persistent Todo storage
- Multiple frontend pages
- Query parameter based Todo details

## Project Structure

```text
zip-trip-assignment/
│
├── backend/
│   ├── data/
│   │   └── todos.json
│   └── src/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── services/
│       └── server.js
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       └── App.jsx
│
├── README.md
├── FEATURES.md
└── API.md