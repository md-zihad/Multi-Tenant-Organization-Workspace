import { AppDataSource } from '../../config/db.js';
import { Task } from './Task.entity.js';

const getTaskRepository = () => AppDataSource.getRepository(Task);

export async function create(taskData: Partial<Task>): Promise<Task> {
  const repo = getTaskRepository();
  const task = repo.create(taskData);
  return repo.save(task);
}

export async function findById(id: string): Promise<Task | null> {
  const repo = getTaskRepository();
  return repo.findOne({
    where: { id },
    relations: ['project', 'assignedUser', 'creator', 'project.organization'],
  });
}

export async function findByProject(projectId: string): Promise<Task[]> {
  const repo = getTaskRepository();
  return repo.find({
    where: { projectId },
    relations: ['project', 'assignedUser', 'creator', 'project.organization'],
    order: { createdAt: 'DESC' },
  });
}

export async function findByAssignedUser(userId: string): Promise<Task[]> {
  const repo = getTaskRepository();
  return repo.find({
    where: { assignedTo: userId },
    relations: ['project', 'assignedUser', 'creator', 'project.organization'],
    order: { createdAt: 'DESC' },
  });
}


export async function update(id: string, taskData: Partial<Task>): Promise<void> {
  const repo = getTaskRepository();
  await repo.update(id, taskData);
}

