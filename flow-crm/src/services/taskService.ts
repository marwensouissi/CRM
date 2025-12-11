import api from '@/lib/axios';

export interface Task {
    id: number;
    title: string;
    description?: string;
    due_date?: string;
    priority: string;
    status: string;
    assigned_to?: number;
    related_to_type?: string;
    related_to_id?: number;
    created_at: string;
}

export const taskService = {
    getAll: async () => {
        const response = await api.get<Task[]>('/tasks');
        return response.data;
    },

    getOne: async (id: number) => {
        const response = await api.get<Task>(`/tasks/${id}`);
        return response.data;
    },

    create: async (data: Partial<Task>) => {
        const response = await api.post<Task>('/tasks', data);
        return response.data;
    },

    update: async (id: number, data: Partial<Task>) => {
        const response = await api.put<Task>(`/tasks/${id}`, data);
        return response.data;
    },

    delete: async (id: number) => {
        await api.delete(`/tasks/${id}`);
    }
};
