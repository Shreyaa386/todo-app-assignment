import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import TodoCard from '../components/TodoCard';
import TodoForm from '../components/TodoForm';
import { fetchTodos, createTodo, updateTodo, deleteTodo } from '../services/todoApi';

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);

  const loadTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTodos({ search, status: statusFilter });
      setTodos(data);
    } catch (err) {
      console.error('Error fetching todos:', err);
      setError(err.message || 'Could not connect to backend server. Make sure the API is running on http://localhost:5000');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const handleCreate = async (formData) => {
    await createTodo(formData);
    setIsFormOpen(false);
    loadTodos();
  };

  const handleUpdate = async (formData) => {
    if (!editingTodo) return;
    await updateTodo(editingTodo.id, formData);
    setEditingTodo(null);
    setIsFormOpen(false);
    loadTodos();
  };

  const handleToggleStatus = async (id, newCompletedState) => {
    try {
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: newCompletedState } : t))
      );
      await updateTodo(id, { completed: newCompletedState });
      loadTodos();
    } catch (err) {
      console.error('Failed to update status:', err);
      loadTodos();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this todo task?')) {
      try {
        setTodos((prev) => prev.filter((t) => t.id !== id));
        await deleteTodo(id);
        loadTodos();
      } catch (err) {
        console.error('Failed to delete todo:', err);
        loadTodos();
      }
    }
  };

  const handleOpenEdit = (todo) => {
    setEditingTodo(todo);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTodo(null);
  };

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="app-container">
      <Navbar todosCount={todos.length} completedCount={completedCount} />

      <main className="main-content">
        <div className="dashboard-header">
          <div className="header-top">
            <div className="header-title-group">
              <h1>Todo List</h1>
              <p>Manage, track, and complete your tasks efficiently.</p>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setEditingTodo(null);
                setIsFormOpen(true);
              }}
            >
              <span>+</span> Create Todo
            </button>
          </div>

          <div className="controls-bar">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search todos by title or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="filter-tabs">
              <button
                type="button"
                className={`filter-tab ${statusFilter === 'all' ? 'active' : ''}`}
                onClick={() => setStatusFilter('all')}
              >
                All
              </button>
              <button
                type="button"
                className={`filter-tab ${statusFilter === 'active' ? 'active' : ''}`}
                onClick={() => setStatusFilter('active')}
              >
                Pending
              </button>
              <button
                type="button"
                className={`filter-tab ${statusFilter === 'completed' ? 'active' : ''}`}
                onClick={() => setStatusFilter('completed')}
              >
                Completed
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="error-banner" style={{ marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading your todos...</p>
          </div>
        ) : todos.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📝</span>
            <h3>No Todos Found</h3>
            <p>
              {search
                ? `No todos matching "${search}"`
                : statusFilter !== 'all'
                ? `No ${statusFilter === 'active' ? 'pending' : 'completed'} todos currently available`
                : 'Get started by creating your first Todo!'}
            </p>
            <button
              type="button"
              className="btn btn-primary"
              style={{ marginTop: '1.25rem' }}
              onClick={() => {
                setEditingTodo(null);
                setIsFormOpen(true);
              }}
            >
              Create Todo
            </button>
          </div>
        ) : (
          <div className="todos-grid">
            {todos.map((todo) => (
              <TodoCard
                key={todo.id}
                todo={todo}
                onToggleStatus={handleToggleStatus}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {isFormOpen && (
        <TodoForm
          initialData={editingTodo}
          onSubmit={editingTodo ? handleUpdate : handleCreate}
          onCancel={handleCloseForm}
        />
      )}
    </div>
  );
}
