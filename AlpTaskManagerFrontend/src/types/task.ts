export const TaskStatus = {
    Todo: 0,
    InProgress: 1,
    Done: 2
} as const;

export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];

export interface TaskItem {
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
    createdAt: string;
}

export interface CreateTaskRequest {
    title: string;
    description: string;
    dueDate?: string;
}

export interface TaskResponse {
    items: TaskItem[];
    totalCount: number;
}