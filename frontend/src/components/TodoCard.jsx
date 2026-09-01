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
      className={`todo-card ${completed ? 'completed' : ''}`}
      aria-labelledby={`todo-title-${id}`}
    >
      <div className="card-header">
        <button
          type="button"
          className={`checkbox-custom ${completed ? 'checked' : ''}`}
          onClick={() => onToggleStatus(id, !completed)}
          onKeyDown={handleKeyDownToggle}
          aria-label={completed ? `Mark "${title}" as pending` : `Mark "${title}" as completed`}
          title={completed ? 'Mark task as pending' : 'Mark task as completed'}
        >
          {completed && <span aria-hidden="true">✓</span>}
        </button>
        
        <div className="todo-info">
          <h3 id={`todo-title-${id}`} className="todo-title">
            {title}
          </h3>
          {description && <p className="todo-description">{description}</p>}
        </div>
      </div>

      <div className="card-footer">
        <span className={`status-tag ${completed ? 'completed' : 'active'}`}>
          {completed ? 'Completed' : 'Pending'}
        </span>

        <div className="card-actions">
          <Link
            to={`/todo?id=${id}`}
            className="icon-btn"
            aria-label={`View details for "${title}"`}
            title="View Details"
          >
            <span aria-hidden="true">👁️</span>
          </Link>
          <button
            type="button"
            className="icon-btn"
            onClick={() => onEdit(todo)}
            aria-label={`Edit task "${title}"`}
            title="Edit Task"
          >
            <span aria-hidden="true">✏️</span>
          </button>
          <button
            type="button"
            className="icon-btn delete"
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
