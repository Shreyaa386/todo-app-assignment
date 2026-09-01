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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Title is required');
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
      setError(err.message || 'Failed to save todo item');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditMode ? 'Edit Todo Task' : 'Create New Task'}</h2>
          <button type="button" className="close-btn" onClick={onCancel}>
            ×
          </button>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="todo-title">Title *</label>
            <input
              id="todo-title"
              type="text"
              placeholder="e.g. Complete project assignment"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="todo-desc">Description</label>
            <textarea
              id="todo-desc"
              rows="4"
              placeholder="Add details, notes, or subtasks..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {isEditMode && (
            <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.75rem' }}>
              <input
                id="todo-completed"
                type="checkbox"
                checked={completed}
                onChange={(e) => setCompleted(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <label htmlFor="todo-completed" style={{ cursor: 'pointer' }}>
                Mark as completed
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
