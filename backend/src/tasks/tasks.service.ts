import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  listTasks() {
    return this.prisma.task.findMany({
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async getTask(id: string) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task ${id} not found`);
    }
    return task;
  }

  async createTask(dto: CreateTaskDto) {
    // Build a short single-line preview that the task board renders in the list.
    const preview = dto.description.trim().replace(/\s+/g, ' ').slice(0, 140);

    const task = await this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        preview,
        priority: dto.priority ?? 2,
      },
    });

    // Let the notifications layer know a task was created.
    await this.notifications.notifyTaskCreated(task.id);

    return task;
  }
}
