const BASE_URL = "http://localhost:5000/api/todos";

export async function getTodos({ search = "", status = "" } = {}) {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (status && status !== "all") params.append("status", status);

  const url = `${BASE_URL}?${params.toString()}`;
  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to fetch todos from server");
  }
  return response.json();
}

export async function getTodoById(id) {
  const response = await fetch(`${BASE_URL}/${id}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Todo #${id} not found`);
  }
  return response.json();
}

export async function createTodo(todo) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(todo)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to create todo task");
  }
  return response.json();
}

export async function updateTodo(id, todo) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(todo)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to update todo task");
  }
  return response.json();
}

export async function deleteTodo(id) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to delete todo task");
  }
  return response.json();
}

// Aliases for compatibility
export const fetchTodos = getTodos;
export const fetchTodoById = getTodoById;
