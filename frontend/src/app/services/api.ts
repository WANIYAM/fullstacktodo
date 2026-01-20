import { Task, Priority } from '../types/task';

const API_URL = 'http://127.0.0.1:8000';

// --------------------
// Types
// --------------------
interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

interface User {
  id: number;
  username: string;
  tasks?: Task[];
}

// --------------------
// Token management
// --------------------
export const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
};

export const getAccessToken = (): string | null =>
  localStorage.getItem('access_token');

export const getRefreshToken = (): string | null =>
  localStorage.getItem('refresh_token');

export const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

// --------------------
// Auth API
// --------------------
export const signup = async (
  username: string,
  password: string
): Promise<User> => {
  const response = await fetch(`${API_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail ?? 'Signup failed');
  }

  return response.json();
};

export const login = async (
  username: string,
  password: string
): Promise<TokenResponse> => {
  const response = await fetch(`${API_URL}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail ?? 'Login failed');
  }

  const data = await response.json();
  setTokens(data.access_token, data.refresh_token);
  return data;
};

export const logout = async (): Promise<void> => {
  try {
    await fetch(`${API_URL}/logout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
  } finally {
    clearTokens();
  }
};

// --------------------
// Token refresh
// --------------------
export const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token');

  const response = await fetch(`${API_URL}/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response.ok) {
    clearTokens();
    throw new Error('Session expired');
  }

  const data = await response.json();
  setTokens(data.access_token, data.refresh_token);
  return data.access_token;
};

// --------------------
// Authenticated fetch
// --------------------
const authenticatedFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getAccessToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    const newToken = await refreshAccessToken();
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${newToken}`,
      },
    });
  }

  return response;
};

// --------------------
// User API
// --------------------
export const getCurrentUser = async (): Promise<User> => {
  const response = await authenticatedFetch(`${API_URL}/me`);
  if (!response.ok) throw new Error('Failed to fetch user');
  return response.json();
};

// --------------------
// Tasks API
// --------------------
export const getTasks = async (): Promise<Task[]> => {
  const response = await authenticatedFetch(`${API_URL}/tasks`);
  if (!response.ok) throw new Error('Failed to fetch tasks');
  return response.json();
};

export async function createTask(data: {
  title: string;
  description?: string | null;
  priority?: Priority;
}): Promise<Task> {
  const response = await authenticatedFetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create task');
  }

  return response.json();
}

export const updateTask = async (
  taskId: number,
  task: Partial<Task>
): Promise<Task> => {
  const response = await authenticatedFetch(`${API_URL}/tasks/${taskId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    console.error('Update task error:', {
      status: response.status,
      statusText: response.statusText,
      error,
      url: `${API_URL}/tasks/${taskId}`,
      body: task
    });
    throw new Error(error?.detail ?? `Failed to update task: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

export const deleteTask = async (taskId: number): Promise<void> => {
  const response = await authenticatedFetch(`${API_URL}/tasks/${taskId}`, {
    method: 'DELETE',
  });

  if (!response.ok) throw new Error('Failed to delete task');
};