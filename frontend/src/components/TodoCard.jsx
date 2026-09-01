import React from 'react';
import { Link } from 'react-router-dom';

export default function TodoCard({ todo, onToggleStatus, onEdit, onDelete }) {
  const { id, title, description, completed } = todo;

  const handleKeyDownToggle = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggleStatus(id, !completed);
    }
  };

  return (
    <article
      className={`dashboard-todo-card ${completed ? 'completed' : ''}`}
      aria-labelledby={`todo-title-${id}`}
    >
      <div className="card-top-row">
        <button
          type="button"
          className={`custom-check-btn ${completed ? 'checked' : ''}`}
          onClick={() => onToggleStatus(id, !completed)}
          onKeyDown={handleKeyDownToggle}
          aria-label={completed ? `Mark "${title}" as pending` : `Mark "${title}" as completed`}
          title={completed ? 'Mark task as pending' : 'Mark task as completed'}
        >
          {completed && <span aria-hidden="true">✓</span>}
        </button>

        <div className="card-content">
          <h3 id={`todo-title-${id}`} className="card-title">
            {title}
          </h3>
          {description && <p className="card-desc">{description}</p>}
        </div>
      </div>

      <div className="card-bottom-row">
        <span className={`status-badge-pill ${completed ? 'completed' : 'pending'}`}>
          <span className="pill-dot" aria-hidden="true"></span>
          {completed ? 'Completed' : 'Pending'}
        </span>

        <div className="card-actions-group">
          <Link
            to={`/todo?id=${id}`}
            className="card-action-btn view-btn"
            aria-label={`View details for "${title}"`}
            title="View Details"
          >
            <span aria-hidden="true">👁️</span>
          </Link>
          <button
            type="button"
            className="card-action-btn edit-btn"
            onClick={() => onEdit(todo)}
            aria-label={`Edit task "${title}"`}
            title="Edit Task"
          >
            <span aria-hidden="true">✏️</span>
          </button>
          <button
            type="button"
            className="card-action-btn delete-btn"
            onClick={() => onDelete(id)}
            aria-label={`Delete task "${title}"`}
            title="Delete Task"
          >
            <span aria-hidden="true">🗑️</span>
          </button>
        </div>
      </div>
    </article>
  );
}
