import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ todosCount = 0, completedCount = 0 }) {
  const pendingCount = Math.max(0, todosCount - completedCount);

  // Dynamic time-of-day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const currentDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <header className="dashboard-top-navbar" role="banner">
      <div className="top-navbar-left">
        <div className="greeting-group">
          <h2 className="greeting-title">{getGreeting()}, Developer!</h2>
          <p className="greeting-subtitle">Stay focused and get things done.</p>
        </div>
      </div>

      <div className="top-navbar-right">
        <div className="date-chip">
          <span className="date-icon" aria-hidden="true">📅</span>
          <span>{currentDateStr}</span>
        </div>

        <div className="header-stats-row" aria-label="Task Statistics Summary">
          <div className="header-stat-pill" title="Total Tasks">
            <span className="stat-dot total"></span>
            <span>Total:</span>
            <strong>{todosCount}</strong>
          </div>

          <div className="header-stat-pill pending" title="Pending Tasks">
            <span className="stat-dot pending"></span>
            <span>Pending:</span>
            <strong>{pendingCount}</strong>
          </div>

          <div className="header-stat-pill completed" title="Completed Tasks">
            <span className="stat-dot completed"></span>
            <span>Completed:</span>
            <strong>{completedCount}</strong>
          </div>
        </div>
      </div>
    </header>
  );
}
