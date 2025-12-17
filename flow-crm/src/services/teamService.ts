import api from '@/lib/axios';

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    title?: string;
    avatar?: string;
    status?: string;
    deals_count?: number;
    tickets_count?: number;
    tasks_count?: number;
    created_at: string;
}

export const teamService = {
    getAll: async () => {
        const response = await api.get<User[]>('/team');
        return response.data;
    },

    getOne: async (id: number) => {
        const response = await api.get<User>(`/team/${id}`);
        return response.data;
    },

    create: async (data: Partial<User>) => {
        const response = await api.post<User>('/team', data);
        return response.data;
    },

    update: async (id: number, data: Partial<User>) => {
        const response = await api.put<User>(`/team/${id}`, data);
        return response.data;
    },

    delete: async (id: number) => {
        await api.delete(`/team/${id}`);
    }
};
