import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import TodoForm from '../components/TodoForm';
import { fetchTodoById, updateTodo, deleteTodo } from '../services/todoApi';

export default function TodoDetails() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const navigate = useNavigate();

  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function loadTodo() {
      if (!id || isNaN(Number(id))) {
        setError('Invalid or missing Todo ID parameter. Please specify a valid ID, e.g. /todo?id=1');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await fetchTodoById(id);
        setTodo(data);
      } catch (err) {
        console.error('Error fetching todo details:', err);
        setError(err.message || `Todo task #${id} could not be found or loaded.`);
      } finally {
        setLoading(false);
      }
    }
    loadTodo();
  }, [id]);

  const handleToggleStatus = async () => {
    if (!todo) return;
    try {
      const updated = await updateTodo(todo.id, { completed: !todo.completed });
      setTodo(updated);
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const handleUpdateTodo = async (formData) => {
    if (!todo) return;
    const updated = await updateTodo(todo.id, formData);
    setTodo(updated);
    setIsEditing(false);
  };

  const handleDeleteTodo = async () => {
    if (!todo) return;
    if (window.confirm(`Are you sure you want to delete "${todo.title}"?`)) {
      try {
        await deleteTodo(todo.id);
        navigate('/todos');
      } catch (err) {
        console.error('Failed to delete todo:', err);
      }
    }
  };

  return (
    <div className="dashboard-layout-container">
      <Sidebar statusFilter="all" onSelectFilter={() => navigate('/todos')} />

      <div className="dashboard-main-area">
        <Navbar todosCount={todo ? 1 : 0} completedCount={todo?.completed ? 1 : 0} />

        <main className="dashboard-content-grid single-column">
          <Link to="/todos" className="dashboard-back-link">
            ← Return to Dashboard
          </Link>

          {loading ? (
            <div className="dashboard-loading-card" aria-live="polite">
              <div className="dashboard-spinner" aria-hidden="true"></div>
              <p>Loading task details...</p>
            </div>
          ) : error ? (
            <div className="dashboard-empty-card">
              <span className="empty-icon" aria-hidden="true">⚠️</span>
              <h3>Task Not Found</h3>
              <p>{error}</p>
              <button
                type="button"
                className="dashboard-btn btn-glow-primary"
                style={{ marginTop: '1rem' }}
                onClick={() => navigate('/todos')}
              >
                Back to Dashboard
              </button>
            </div>
          ) : todo ? (
            <article className="dashboard-details-card">
              <div className="details-header-row">
                <div className="details-title-group">
                  <h1 className="details-main-title">{todo.title}</h1>
                  <div className="details-meta-tags">
                    <span className="meta-tag">Task ID: #{todo.id}</span>
                    {todo.createdAt && (
                      <span className="meta-tag">Created: {new Date(todo.createdAt).toLocaleString()}</span>
                    )}
                    {todo.updatedAt && (
                      <span className="meta-tag">Updated: {new Date(todo.updatedAt).toLocaleString()}</span>
                    )}
                  </div>
                </div>

                <span className={`status-badge-pill lg ${todo.completed ? 'completed' : 'pending'}`}>
                  <span className="pill-dot" aria-hidden="true"></span>
                  {todo.completed ? 'Completed' : 'Pending'}
                </span>
              </div>

              <div className="details-body-box">
                <h4 className="body-box-heading">Description</h4>
                <p className="body-box-text">
                  {todo.description ? (
                    todo.description
                  ) : (
                    <em style={{ color: 'var(--text-dim)' }}>No additional description provided for this task.</em>
                  )}
                </p>
              </div>

              <div className="details-footer-actions">
                <button
                  type="button"
                  className={`dashboard-btn ${todo.completed ? 'btn-glass' : 'btn-glow-primary'}`}
                  onClick={handleToggleStatus}
                >
                  {todo.completed ? 'Mark as Pending' : 'Mark as Completed'}
                </button>

                <div className="details-action-buttons">
                  <button
                    type="button"
                    className="dashboard-btn btn-glass"
                    onClick={() => setIsEditing(true)}
                  >
                    ✏️ Edit Task
                  </button>
                  <button
                    type="button"
                    className="dashboard-btn btn-danger-glass"
                    onClick={handleDeleteTodo}
                  >
                    🗑️ Delete Task
                  </button>
                </div>
              </div>
            </article>
          ) : null}
        </main>
      </div>

      {isEditing && todo && (
        <TodoForm
          initialData={todo}
          onSubmit={handleUpdateTodo}
          onCancel={() => setIsEditing(false)}
        />
      )}
    </div>
  );
}
