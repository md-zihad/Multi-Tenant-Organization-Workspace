export interface CreateTaskDto {
    title: string;
    description?: string | null;
    projectId: string;
    assignedTo?: string | null;
    priority?: string;
    dueDate?: Date | null;
}

export interface UpdateTaskDto {
    title?: string;
    description?: string | null;
    status?: string;
    priority?: string;
    assignedTo?: string | null;
    dueDate?: Date | null;
    isActive?: boolean;
}

export interface AssignTaskDto {
    assignedTo: string | null;
}

export interface TaskResponseDto {
    status: number;
    message: string;
    data: {
        id: string;
        title: string;
        description: string | null;
        status: string;
        priority: string;
        projectId: string;
        assignedTo: string | null;
        createdBy: string;
        dueDate: Date | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    };
}

export interface TaskListResponseDto {
    status: number;
    message: string;
    data: {
        id: string;
        title: string;
        description: string | null;
        status: string;
        priority: string;
        projectId: string;
        assignedTo: string | null;
        createdBy: string;
        dueDate: Date | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[];
}
