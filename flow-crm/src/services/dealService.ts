import api from '@/lib/axios';

export interface Deal {
    id: number;
    title: string;
    value: number;
    currency: string;
    stage: string;
    probability: number;
    client_id: number;
    assigned_to?: number;
    expected_close_date?: string;
    client?: {
        id: number;
        name: string;
    };
    created_at: string;
}

export const dealService = {
    getAll: async () => {
        const response = await api.get<Deal[]>('/deals');
        return response.data;
    },

    getOne: async (id: number) => {
        const response = await api.get<Deal>(`/deals/${id}`);
        return response.data;
    },

    create: async (data: Partial<Deal>) => {
        const response = await api.post<Deal>('/deals', data);
        return response.data;
    },

    update: async (id: number, data: Partial<Deal>) => {
        const response = await api.put<Deal>(`/deals/${id}`, data);
        return response.data;
    },

    delete: async (id: number) => {
        await api.delete(`/deals/${id}`);
    }
};
