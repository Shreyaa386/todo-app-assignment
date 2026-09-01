import React from 'react';

export default function TaskOverviewCard({ totalCount = 0, completedCount = 0 }) {
  const pendingCount = Math.max(0, totalCount - completedCount);
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Circle SVG calculations for ring gauge
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="task-overview-card">
      <div className="overview-header">
        <div>
          <h3 className="overview-title">Quick Overview</h3>
          <p className="overview-subtitle">Real-time task completion progress</p>
        </div>
        <span className="completion-badge">{percentage}% Complete</span>
      </div>

      <div className="overview-body">
        <div className="gauge-container">
          <svg className="gauge-svg" width="96" height="96" viewBox="0 0 96 96">
            <circle
              className="gauge-bg"
              cx="48"
              cy="48"
              r={radius}
              strokeWidth="8"
            />
            <circle
              className="gauge-fill"
              cx="48"
              cy="48"
              r={radius}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <div className="gauge-text">
            <span className="gauge-val">{percentage}%</span>
          </div>
        </div>

        <div className="overview-metrics-grid">
          <div className="metric-box">
            <span className="metric-num">{totalCount}</span>
            <span className="metric-lbl">Total Tasks</span>
          </div>
          <div className="metric-box pending">
            <span className="metric-num">{pendingCount}</span>
            <span className="metric-lbl">Pending</span>
          </div>
          <div className="metric-box completed">
            <span className="metric-num">{completedCount}</span>
            <span className="metric-lbl">Completed</span>
          </div>
        </div>
      </div>

      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{ width: `${percentage}%` }}
          aria-label={`${percentage}% tasks completed`}
        ></div>
      </div>
    </div>
  );
}
