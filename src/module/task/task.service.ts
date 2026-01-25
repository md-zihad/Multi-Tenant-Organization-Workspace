import * as taskRepo from './task.repository.js';
import * as projectRepo from '../project/project.repository.js';
import * as userRepo from '../user/user.repository.js';

import type {
  CreateTaskDto,
  TaskResponseDto,
  TaskListResponseDto,


} from './task.dto.js';



export async function createTask(
  data: CreateTaskDto,
  caller: object
): Promise<TaskResponseDto> {
  if ((caller as any).role !== 'ORG_ADMIN') {
    throw new Error('Only organization admins can create tasks');
  }

  const orgId = (caller as any).organizationId;
  if (!orgId) {
    throw new Error('Organization admin must belong to an organization');
  }

  const projects = await projectRepo.findByOrganization(orgId);
  if (projects.length === 0) {
    throw new Error('No projects found for this organization');
  }

  const project = projects.find(p => p.id === data.projectId);
  if (!project) {
    throw new Error('Project not found or does not belong to your organization');
  }


  const task = await taskRepo.create({
    title: data.title,
    description: data.description ?? null,
    status: 'PENDING',
    priority: data.priority || 'MEDIUM',
    projectId: project.id,
    assignedTo: data.assignedTo || null,
    createdBy: (caller as any).id,
    dueDate: data.dueDate || null,
    isActive: true,
  });

  return {
    status: 201,
    message: 'Task created successfully',
    data: {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      projectId: task.projectId,
      assignedTo: task.assignedTo,
      createdBy: task.createdBy,
      dueDate: task.dueDate,
      isActive: task.isActive,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    },
  };
}


export async function getMyTasks(caller: object): Promise<TaskListResponseDto> {
  if ((caller as any).role !== 'MEMBER') {
    throw new Error('This endpoint is only for organization members');
  }

  const callerId = (caller as any).id;
  const callerOrgId = (caller as any).organizationId;

  const tasks = await taskRepo.findByAssignedUser(callerId);
  const filteredTasks = tasks.filter(
    (t: any) => t.project && t.project.organizationId === callerOrgId
  );

  return {
    status: 200,
    message: 'Tasks fetched successfully',
    data: filteredTasks.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      status: t.status,
      priority: t.priority,
      projectId: t.projectId,
      assignedTo: t.assignedTo,
      createdBy: t.createdBy,
      dueDate: t.dueDate,
      isActive: t.isActive,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    })),
  };
}


export async function assignTask(
  taskId: string,
  assignedTo: string | null,
  caller: object
): Promise<TaskResponseDto> {
  if ((caller as any).role !== 'ORG_ADMIN') {
    throw new Error('Only organization admins can assign tasks');
  }

  const orgId = (caller as any).organizationId;
  if (!orgId) {
    throw new Error('Organization admin must belong to an organization');
  }

  const task = await taskRepo.findById(taskId);
  if (!task) {
    throw new Error('Task not found');
  }

  if (task.project.organizationId !== orgId) {
    throw new Error('You can only assign tasks within your organization');
  }

  if (assignedTo != null) {
    const user = await userRepo.findById(assignedTo);
    if (!user) {
      throw new Error('Assigned user not found');
    }
    if ((user as any).organizationId !== orgId) {
      throw new Error('Cannot assign task to user from different organization');
    }
  }

  await taskRepo.update(taskId, { assignedTo });

  const updated = await taskRepo.findById(taskId);
  if (!updated) {
    throw new Error('Failed to fetch updated task');
  }

  return {
    status: 200,
    message: assignedTo != null ? 'Task assigned successfully' : 'Task unassigned successfully',
    data: {
      id: updated.id,
      title: updated.title,
      description: updated.description,
      status: updated.status,
      priority: updated.priority,
      projectId: updated.projectId,
      assignedTo: updated.assignedTo,
      createdBy: updated.createdBy,
      dueDate: updated.dueDate,
      isActive: updated.isActive,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    },
  };
}
