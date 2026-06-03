import { CheckCircle2, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useTaskStore } from '@/store/useTaskStore';
import type { Task } from '@/api';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

const PRIORITY: Record<number, { label: string; variant: BadgeVariant }> = {
  1: { label: 'Low', variant: 'outline' },
  2: { label: 'Medium', variant: 'secondary' },
  3: { label: 'High', variant: 'destructive' },
};

export function TaskCard({ task }: { task: Task }) {
  const completeTask = useTaskStore((s) => s.completeTask);
  const completingId = useTaskStore((s) => s.completingId);

  const isDone = task.status === 'DONE';
  const isCompleting = completingId === task.id;
  const priority = PRIORITY[task.priority] ?? PRIORITY[2];

  return (
    <Card className={cn(isDone && 'opacity-60')}>
      <CardHeader>
        <CardTitle className={cn(isDone && 'line-through')}>{task.title}</CardTitle>
        <CardAction>
          <Badge variant={priority.variant}>{priority.label}</Badge>
        </CardAction>
      </CardHeader>

      {task.preview && (
        <CardContent className="text-muted-foreground text-sm">{task.preview}</CardContent>
      )}

      <CardFooter className="justify-between">
        <Badge variant={isDone ? 'default' : 'outline'}>{task.status}</Badge>
        {!isDone && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => completeTask(task.id)}
            disabled={isCompleting}
          >
            {isCompleting ? <Loader2 className="animate-spin" /> : <CheckCircle2 />}
            Mark complete
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
