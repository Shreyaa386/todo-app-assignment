import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar({ statusFilter, onSelectFilter }) {
  const location = useLocation();
  const isDetailsPage = location.pathname.startsWith('/todo') && location.pathname !== '/todos';

  return (
    <aside className="sidebar" aria-label="Main Navigation Sidebar">
      <div className="sidebar-header">
        <Link to="/todos" className="sidebar-brand" aria-label="TaskPulse Dashboard">
          <div className="sidebar-logo">
            <span aria-hidden="true">✓</span>
          </div>
          <div className="sidebar-title-group">
            <span className="sidebar-brand-name">TaskPulse</span>
            <span className="sidebar-brand-tag">Productivity</span>
          </div>
        </Link>
      </div>

      <nav className="sidebar-nav" aria-label="Dashboard Menu">
        <div className="nav-section-label">MENU</div>

        <button
          type="button"
          className={`nav-item ${!isDetailsPage && statusFilter === 'all' ? 'active' : ''}`}
          onClick={() => onSelectFilter('all')}
        >
          <span className="nav-icon" aria-hidden="true">📊</span>
          <span className="nav-label">Dashboard</span>
        </button>

        <button
          type="button"
          className={`nav-item ${!isDetailsPage && statusFilter === 'all_list' ? 'active' : ''}`}
          onClick={() => onSelectFilter('all')}
        >
          <span className="nav-icon" aria-hidden="true">📝</span>
          <span className="nav-label">All Tasks</span>
        </button>

        <button
          type="button"
          className={`nav-item ${!isDetailsPage && statusFilter === 'active' ? 'active' : ''}`}
          onClick={() => onSelectFilter('active')}
        >
          <span className="nav-icon" aria-hidden="true">⏳</span>
          <span className="nav-label">Pending</span>
        </button>

        <button
          type="button"
          className={`nav-item ${!isDetailsPage && statusFilter === 'completed' ? 'active' : ''}`}
          onClick={() => onSelectFilter('completed')}
        >
          <span className="nav-icon" aria-hidden="true">✅</span>
          <span className="nav-label">Completed</span>
        </button>
      </nav>
    </aside>
  );
}