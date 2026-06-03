import { useEffect, useState } from 'react';
import { completeTask, createTask, fetchTasks, type Task } from './api';

const PRIORITY_LABELS: Record<number, string> = {
  1: 'Low',
  2: 'Medium',
  3: 'High',
};

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(2);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    try {
      setTasks(await fetchTasks());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await createTask({
        title,
        // description is intentionally optional in the UI
        description: description.trim() ? description : undefined,
        priority,
      });
      setTitle('');
      setDescription('');
      setPriority(2);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
    } finally {
      setBusy(false);
    }
  }

  async function onComplete(id: string) {
    setError(null);
    try {
      await completeTask(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete task');
    }
  }

  return (
    <main className="app">
      <header>
        <h1>Task Board</h1>
        <p className="subtitle">NestJS + Prisma + React — fullstack challenge starter</p>
      </header>

      <form className="card create-form" onSubmit={onCreate}>
        <h2>New task</h2>
        <label>
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ship the thing"
            required
          />
        </label>
        <label>
          Description <span className="muted">(optional)</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Leave this blank to exercise the bug…"
            rows={3}
          />
        </label>
        <label>
          Priority
          <select value={priority} onChange={(e) => setPriority(Number(e.target.value))}>
            <option value={1}>Low</option>
            <option value={2}>Medium</option>
            <option value={3}>High</option>
          </select>
        </label>
        <button type="submit" disabled={busy || !title.trim()}>
          {busy ? 'Adding…' : 'Add task'}
        </button>
      </form>

      {error && <div className="error">⚠️ {error}</div>}

      <section className="list">
        {tasks.length === 0 && <p className="muted">No tasks yet.</p>}
        {tasks.map((task) => (
          <article key={task.id} className={`card task status-${task.status.toLowerCase()}`}>
            <div className="task-head">
              <h3>{task.title}</h3>
              <span className="badge">{PRIORITY_LABELS[task.priority] ?? task.priority}</span>
            </div>
            {task.preview && <p className="preview">{task.preview}</p>}
            <div className="task-foot">
              <span className={`status status-${task.status.toLowerCase()}`}>{task.status}</span>
              {task.status !== 'DONE' && (
                <button className="secondary" onClick={() => onComplete(task.id)}>
                  Mark complete
                </button>
              )}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
