export interface Task {
  id: string;
  title: string;
  description: string | null;
  preview: string | null;
  status: string;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: number;
}

const BASE = '/api';

async function parseError(res: Response): Promise<string> {
  try {
    const body = await res.json();
    if (body && typeof body.message !== 'undefined') {
      return Array.isArray(body.message) ? body.message.join(', ') : String(body.message);
    }
  } catch {
    /* fall through to status text */
  }
  return `${res.status} ${res.statusText}`;
}

export async function fetchTasks(): Promise<Task[]> {
  const res = await fetch(`${BASE}/tasks`);
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const res = await fetch(`${BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

// NOTE: This endpoint does not exist in the starter backend yet.
// Implementing PATCH /api/tasks/:id/complete is part of the challenge.
export async function completeTask(id: string): Promise<Task> {
  const res = await fetch(`${BASE}/tasks/${id}/complete`, { method: 'PATCH' });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}
