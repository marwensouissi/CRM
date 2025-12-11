import api from '@/lib/axios';

export interface Client {
    id: number;
    name: string;
    email: string;
    phone?: string;
    industry?: string;
    status: string;
    avatar?: string;
    total_spent: number;
    created_at: string;
}

export const clientService = {
    getAll: async () => {
        const response = await api.get<Client[]>('/clients');
        return response.data;
    },

    getOne: async (id: number) => {
        const response = await api.get<Client>(`/clients/${id}`);
        return response.data;
    },

    create: async (data: Partial<Client>) => {
        const response = await api.post<Client>('/clients', data);
        return response.data;
    },

    update: async (id: number, data: Partial<Client>) => {
        const response = await api.put<Client>(`/clients/${id}`, data);
        return response.data;
    },

    delete: async (id: number) => {
        await api.delete(`/clients/${id}`);
    }
};
