import axios from 'axios';
import type { CreateTaskRequest, TaskResponse } from '../types/task';
import { TaskStatus } from '../types/task';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5062/api';

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const TaskService = {
    list: async (page: number = 1, pageSize: number = 10) => {
        const response = await apiClient.get<TaskResponse>('/tasks', {
            params: { page, pageSize }
        });
        return response.data;
    },

    create: async (task: CreateTaskRequest) => {
        const response = await apiClient.post('/tasks', task);
        return response.data;
    },

    update: async (id: number, body: { id: number; title: string; description: string }) => {
        const response = await apiClient.put(`/tasks/${id}`, body);
        return response.data;
    },

    updateStatus: async (id: number, status: TaskStatus) => {
        const response = await apiClient.put(`/tasks/${id}/status`, { id, status });
        return response.data;
    },

    delete: async (id: number) => {
        await apiClient.delete(`/tasks/${id}`);
    }
};

export default TaskService;