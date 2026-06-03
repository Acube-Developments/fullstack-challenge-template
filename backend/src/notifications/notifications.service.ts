import { Injectable } from '@nestjs/common';
import { TasksService } from '../tasks/tasks.service';

@Injectable()
export class NotificationsService {
  // Most recent notifications, newest first. Surfaced at GET /api/notifications.
  private readonly recent: string[] = [];

  constructor(private readonly tasksService: TasksService) {}

  // Build a human-readable notification by looking the task back up by id.
  async notifyTaskCreated(taskId: string) {
    const task = await this.tasksService.getTask(taskId);
    const message = `New task created: "${task.title}" (priority ${task.priority})`;
    this.recent.unshift(message);
    return message;
  }

  list() {
    return this.recent;
  }
}
