import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ todosCount = 0, completedCount = 0 }) {
  const pendingCount = todosCount - completedCount;

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/todos" className="navbar-brand">
          <div className="navbar-icon">✓</div>
          <span className="navbar-title">TaskPulse</span>
        </Link>

        <div className="navbar-stats">
          <div className="stat-badge">
            Total: <strong>{todosCount}</strong>
          </div>
          <div className="stat-badge pending">
            Pending: <strong>{pendingCount}</strong>
          </div>
          <div className="stat-badge completed">
            Completed: <strong>{completedCount}</strong>
          </div>
        </div>
      </div>
    </header>
  );
}
