import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import TaskOverviewCard from '../components/TaskOverviewCard';
import TodoCard from '../components/TodoCard';
import TodoForm from '../components/TodoForm';
import { fetchTodos, createTodo, updateTodo, deleteTodo } from '../services/todoApi';

export default function TodoList() {
  const [allTodos, setAllTodos] = useState([]);
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
      // Fetch full list of todos from backend API for real workspace data
      const data = await fetchTodos({ status: 'all' });
      setAllTodos(data);
    } catch (err) {
      console.error('Error fetching todos:', err);
      setError(
        err.message || 'Unable to connect to backend server. Make sure Express API is running at http://localhost:5000'
      );
    } finally {
      setLoading(false);
    }
  }, []);

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
      setAllTodos((prev) =>
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
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        setAllTodos((prev) => prev.filter((t) => t.id !== id));
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

  // Master workspace statistics from real API data
  const totalCount = allTodos.length;
  const completedCount = allTodos.filter((t) => t.completed).length;
  const pendingTodos = allTodos.filter((t) => !t.completed);
  const pendingCount = pendingTodos.length;

  // Filter tasks for main display based on search query and status filter tab
  const displayedTodos = allTodos.filter((t) => {
    // 1. Search text filter
    if (search && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      const titleMatch = t.title ? t.title.toLowerCase().includes(q) : false;
      const descMatch = t.description ? t.description.toLowerCase().includes(q) : false;
      if (!titleMatch && !descMatch) return false;
    }

    // 2. Status filter tab
    if (statusFilter === 'active') return !t.completed;
    if (statusFilter === 'completed') return t.completed;
    return true; // 'all'
  });

  return (
    <div className="dashboard-layout-container">
      <Sidebar statusFilter={statusFilter} onSelectFilter={(s) => setStatusFilter(s)} />

      <div className="dashboard-main-area">
        <Navbar todosCount={totalCount} completedCount={completedCount} />

        <main className="dashboard-content-grid">
          {/* Top Row: Task Overview & Quick Action */}
          <div className="dashboard-top-widgets">
            <TaskOverviewCard totalCount={totalCount} completedCount={completedCount} />

            <div className="quick-action-widget-card">
              <div className="widget-header">
                <h3>Quick Actions</h3>
                <p>Manage priorities and add new tasks</p>
              </div>

              <div className="widget-action-body">
                <button
                  type="button"
                  className="dashboard-btn btn-glow-primary btn-lg"
                  onClick={() => {
                    setEditingTodo(null);
                    setIsFormOpen(true);
                  }}
                  aria-label="Create new task"
                >
                  <span className="plus-icon" aria-hidden="true">+</span> Create New Task
                </button>

                <div className="quick-stats-mini">
                  <div className="mini-stat">
                    <span className="mini-val">{pendingCount}</span>
                    <span className="mini-lbl">Action Required</span>
                  </div>
                  <div className="mini-stat">
                    <span className="mini-val">{completedCount}</span>
                    <span className="mini-lbl">Finished Tasks</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls Bar: Search & Status Filters */}
          <div className="dashboard-controls-section">
            <div className="dashboard-search-box">
              <span className="search-icon" aria-hidden="true">🔍</span>
              <input
                id="search-todos-input"
                type="text"
                placeholder="Search tasks by title or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search tasks"
              />
            </div>

            <div className="dashboard-filter-pills" role="tablist" aria-label="Filter tasks by status">
              <button
                type="button"
                role="tab"
                aria-selected={statusFilter === 'all'}
                className={`filter-pill ${statusFilter === 'all' ? 'active' : ''}`}
                onClick={() => setStatusFilter('all')}
              >
                All Tasks ({totalCount})
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={statusFilter === 'active'}
                className={`filter-pill ${statusFilter === 'active' ? 'active' : ''}`}
                onClick={() => setStatusFilter('active')}
              >
                Pending ({pendingCount})
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={statusFilter === 'completed'}
                className={`filter-pill ${statusFilter === 'completed' ? 'active' : ''}`}
                onClick={() => setStatusFilter('completed')}
              >
                Completed ({completedCount})
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="dashboard-alert-banner" role="alert">
              <span className="alert-icon" aria-hidden="true">⚠️</span> {error}
            </div>
          )}

          {/* Main Grid & Secondary Sidebar */}
          <div className="dashboard-tasks-container">
            <div className="tasks-primary-column">
              <div className="section-title-bar">
                <h2>Tasks List</h2>
                <span className="tasks-count-tag">{displayedTodos.length} Items</span>
              </div>

              {loading ? (
                <div className="dashboard-loading-card" aria-live="polite">
                  <div className="dashboard-spinner" aria-hidden="true"></div>
                  <p>Fetching dashboard tasks...</p>
                </div>
              ) : displayedTodos.length === 0 ? (
                <div className="dashboard-empty-card">
                  <span className="empty-icon" aria-hidden="true">📌</span>
                  <h3>No tasks found</h3>
                  <p>
                    {search
                      ? `No tasks matching "${search}"`
                      : statusFilter !== 'all'
                      ? `No ${statusFilter === 'active' ? 'pending' : 'completed'} tasks currently available.`
                      : 'Create your first task to populate your workspace dashboard!'}
                  </p>
                  <button
                    type="button"
                    className="dashboard-btn btn-glow-primary"
                    style={{ marginTop: '1rem' }}
                    onClick={() => {
                      setEditingTodo(null);
                      setIsFormOpen(true);
                    }}
                  >
                    + Create Task
                  </button>
                </div>
              ) : (
                <div className="dashboard-todo-grid">
                  {displayedTodos.map((todo) => (
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
            </div>

            {/* Widget Column: Pending Priorities */}
            <aside className="tasks-secondary-column" aria-label="Pending Priority Widget">
              <div className="priority-widget-card">
                <div className="widget-header">
                  <h3>Pending Priorities</h3>
                  <span className="widget-badge">{pendingCount} Active</span>
                </div>

                {pendingTodos.length === 0 ? (
                  <p className="widget-empty-text">🎉 All caught up! No pending tasks.</p>
                ) : (
                  <div className="priority-list">
                    {pendingTodos.slice(0, 5).map((item) => (
                      <div key={item.id} className="priority-item">
                        <div
                          className="priority-dot"
                          onClick={() => handleToggleStatus(item.id, true)}
                          title="Mark complete"
                          style={{ cursor: 'pointer' }}
                        ></div>
                        <div className="priority-info">
                          <span className="priority-title">{item.title}</span>
                          <span className="priority-id">ID: #{item.id}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </aside>
          </div>
        </main>
      </div>

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
