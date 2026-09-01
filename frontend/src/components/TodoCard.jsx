import React from 'react';
import { Link } from 'react-router-dom';

export default function TodoCard({ todo, onToggleStatus, onEdit, onDelete }) {
  const { id, title, description, completed } = todo;

  return (
    <div className={`todo-card ${completed ? 'completed' : ''}`}>
      <div className="card-header">
        <div
          className={`checkbox-custom ${completed ? 'checked' : ''}`}
          onClick={() => onToggleStatus(id, !completed)}
          title={completed ? 'Mark as active' : 'Mark as completed'}
        >
          {completed && '✓'}
        </div>
        <div className="todo-info">
          <h3 className="todo-title">{title}</h3>
          {description && <p className="todo-description">{description}</p>}
        </div>
      </div>

      <div className="card-footer">
        <span className={`status-tag ${completed ? 'completed' : 'active'}`}>
          {completed ? 'Completed' : 'Active'}
        </span>

        <div className="card-actions">
          <Link
            to={`/todos/${id}`}
            className="icon-btn"
            title="View details"
          >
            👁️
          </Link>
          <button
            type="button"
            className="icon-btn"
            onClick={() => onEdit(todo)}
            title="Edit todo"
          >
            ✏️
          </button>
          <button
            type="button"
            className="icon-btn delete"
            onClick={() => onDelete(id)}
            title="Delete todo"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
