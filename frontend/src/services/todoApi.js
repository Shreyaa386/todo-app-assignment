const API_BASE_URL = "http://localhost:5000/api/todos";

export async function fetchTodos({ search = "", status = "" } = {}) {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (status && status !== "all") params.append("status", status);

  const url = `${API_BASE_URL}?${params.toString()}`;
  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to fetch todos");
  }
  return response.json();
}

export async function fetchTodoById(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to fetch todo #${id}`);
  }
  return response.json();
}

export async function createTodo({ title, description }) {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ title, description })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to create todo");
  }
  return response.json();
}

export async function updateTodo(id, updates) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updates)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to update todo");
  }
  return response.json();
}

export async function deleteTodo(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to delete todo");
  }
  return response.json();
}
