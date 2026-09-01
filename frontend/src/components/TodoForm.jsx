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

  // Support closing modal with Escape key
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
      setError('Title is required and cannot be empty.');
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
      setError(err.message || 'An error occurred while saving the todo task.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-heading"
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 id="modal-heading">{isEditMode ? 'Edit Todo Task' : 'Create New Task'}</h2>
          <button
            type="button"
            className="close-btn"
            onClick={onCancel}
            aria-label="Close dialog"
            disabled={submitting}
          >
            ×
          </button>
        </div>

        {error && (
          <div className="error-banner" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="todo-title-input">
              Title <span style={{ color: 'var(--accent-rose)' }}>*</span>
            </label>
            <input
              id="todo-title-input"
              type="text"
              placeholder="e.g. Complete React assignment"
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

          <div className="form-group">
            <label htmlFor="todo-desc-input">Description</label>
            <textarea
              id="todo-desc-input"
              rows="4"
              placeholder="Add optional notes, requirements, or details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={submitting}
            />
          </div>

          {isEditMode && (
            <div
              className="form-group"
              style={{ flexDirection: 'row', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}
            >
              <input
                id="todo-completed-checkbox"
                type="checkbox"
                checked={completed}
                onChange={(e) => setCompleted(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                disabled={submitting}
              />
              <label htmlFor="todo-completed-checkbox" style={{ cursor: 'pointer', margin: 0 }}>
                Mark task as completed
              </label>
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : isEditMode ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
