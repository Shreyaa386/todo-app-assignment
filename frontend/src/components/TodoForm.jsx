import React, { useState, useEffect } from 'react';

export default function TodoForm({ initialData = null, onSubmit, onCancel }) {
  const isEditMode = Boolean(initialData);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setCompleted(Boolean(initialData.completed));
    } else {
      setTitle('');
      setDescription('');
      setCompleted(false);
    }
    setError('');
  }, [initialData]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !submitting) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel, submitting]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        completed
      });
    } catch (err) {
      setError(err.message || 'An error occurred while saving task.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="modal-backdrop-overlay"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title-text"
    >
      <div className="dashboard-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="dashboard-modal-header">
          <div className="modal-title-box">
            <span className="modal-icon">{isEditMode ? '✏️' : '✨'}</span>
            <h2 id="modal-title-text">{isEditMode ? 'Edit Task' : 'Quick Add Task'}</h2>
          </div>
          <button
            type="button"
            className="modal-close-icon"
            onClick={onCancel}
            aria-label="Close modal dialog"
            disabled={submitting}
          >
            ×
          </button>
        </div>

        {error && (
          <div className="modal-error-alert" role="alert">
            <span aria-hidden="true">⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="dashboard-modal-form">
          <div className="modal-form-field">
            <label htmlFor="modal-task-title">
              Task Title <span className="req-star">*</span>
            </label>
            <input
              id="modal-task-title"
              type="text"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              required
              autoFocus
              disabled={submitting}
            />
          </div>

          <div className="modal-form-field">
            <label htmlFor="modal-task-desc">Task Description</label>
            <textarea
              id="modal-task-desc"
              rows="4"
              placeholder="Add optional notes, criteria, or subtasks..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={submitting}
            />
          </div>

          {isEditMode && (
            <div className="modal-form-checkbox-row">
              <input
                id="modal-task-status"
                type="checkbox"
                checked={completed}
                onChange={(e) => setCompleted(e.target.checked)}
                disabled={submitting}
              />
              <label htmlFor="modal-task-status">Mark task as completed</label>
            </div>
          )}

          <div className="modal-actions-footer">
            <button
              type="button"
              className="dashboard-btn btn-glass"
              onClick={onCancel}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="dashboard-btn btn-glow-primary"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="btn-spinner"></span> Saving...
                </>
              ) : isEditMode ? (
                'Save Changes'
              ) : (
                'Create Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
