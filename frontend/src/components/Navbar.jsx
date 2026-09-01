import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ todosCount = 0, completedCount = 0 }) {
  const pendingCount = Math.max(0, todosCount - completedCount);

  return (
    <header className="navbar" role="banner">
      <div className="navbar-container">
        <Link to="/todos" className="navbar-brand" aria-label="TaskPulse Dashboard Home">
          <div className="navbar-icon" aria-hidden="true">✓</div>
          <span className="navbar-title">TaskPulse</span>
        </Link>

        <div className="navbar-stats" aria-label="Task Statistics Summary">
          <div className="stat-badge" title="Total Tasks">
            <span>Total:</span> <strong>{todosCount}</strong>
          </div>
          <div className="stat-badge pending" title="Pending Tasks">
            <span>Pending:</span> <strong>{pendingCount}</strong>
          </div>
          <div className="stat-badge completed" title="Completed Tasks">
            <span>Completed:</span> <strong>{completedCount}</strong>
          </div>
        </div>
      </div>
    </header>
  );
}
