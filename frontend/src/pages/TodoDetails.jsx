import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
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
    <div className="app-container">
      <Navbar todosCount={todo ? 1 : 0} completedCount={todo?.completed ? 1 : 0} />

      <main className="main-content">
        <div className="detail-container">
          <Link to="/todos" className="back-link" aria-label="Return to todo list">
            ← Back to Todo List
          </Link>

          {loading ? (
            <div className="loading-spinner" aria-live="polite">
              <div className="spinner" aria-hidden="true"></div>
              <p>Loading task details...</p>
            </div>
          ) : error ? (
            <div className="empty-state">
              <span className="empty-icon" aria-hidden="true">⚠️</span>
              <h3>Task Not Found</h3>
              <p>{error}</p>
              <button
                type="button"
                className="btn btn-primary"
                style={{ marginTop: '1.25rem' }}
                onClick={() => navigate('/todos')}
              >
                Return to Todo List
              </button>
            </div>
          ) : todo ? (
            <article className="detail-card">
              <div className="detail-header">
                <div>
                  <h1 className="detail-title">{todo.title}</h1>
                  <div className="detail-meta">
                    <span>Todo ID: #{todo.id}</span>
                    {todo.createdAt && (
                      <span>Created: {new Date(todo.createdAt).toLocaleString()}</span>
                    )}
                    {todo.updatedAt && (
                      <span>Updated: {new Date(todo.updatedAt).toLocaleString()}</span>
                    )}
                  </div>
                </div>

                <span className={`status-tag ${todo.completed ? 'completed' : 'active'}`}>
                  {todo.completed ? 'Completed' : 'Pending'}
                </span>
              </div>

              <div className="detail-body">
                {todo.description ? (
                  todo.description
                ) : (
                  <em style={{ color: 'var(--text-dim)' }}>No additional description provided for this task.</em>
                )}
              </div>

              <div className="detail-actions">
                <button
                  type="button"
                  className={`btn ${todo.completed ? 'btn-secondary' : 'btn-primary'}`}
                  onClick={handleToggleStatus}
                >
                  {todo.completed ? 'Mark as Pending' : 'Mark as Completed'}
                </button>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setIsEditing(true)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleDeleteTodo}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </article>
          ) : null}
        </div>
      </main>

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
