import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { NewTaskForm } from '@/components/new-task-form';
import { TaskCard } from '@/components/task-card';
import { useTaskStore } from '@/store/useTaskStore';

export default function App() {
  const tasks = useTaskStore((s) => s.tasks);
  const loading = useTaskStore((s) => s.loading);
  const error = useTaskStore((s) => s.error);
  const loadTasks = useTaskStore((s) => s.loadTasks);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  return (
    <div className="bg-background text-foreground min-h-screen">
      <main className="mx-auto max-w-2xl px-5 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">Task Board</h1>
          <p className="text-muted-foreground mt-1">
            NestJS + Prisma + React — fullstack challenge starter
          </p>
        </header>

        <div className="mb-6">
          <NewTaskForm />
        </div>

        {error && (
          <div className="border-destructive/50 bg-destructive/10 text-destructive mb-6 flex items-center gap-2 rounded-md border px-4 py-3 text-sm">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <section className="grid gap-3">
          {loading && tasks.length === 0 && (
            <p className="text-muted-foreground text-sm">Loading…</p>
          )}
          {!loading && tasks.length === 0 && (
            <p className="text-muted-foreground text-sm">No tasks yet.</p>
          )}
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </section>
      </main>
    </div>
  );
}
