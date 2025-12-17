import api from '@/lib/axios';

export interface Lead {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    company?: string;
    status: string;
    source?: string;
    value: number;
    assigned_to?: number;
    assigned_user?: {
        id: number;
        name: string;
    };
    created_at: string;
}

export const leadService = {
    getAll: async () => {
        const response = await api.get<Lead[]>('/leads');
        return response.data;
    },

    getById: async (id: number) => {
        const response = await api.get<Lead>(`/leads/${id}`);
        return response.data;
    },

    create: async (data: Partial<Lead>) => {
        const response = await api.post<Lead>('/leads', data);
        return response.data;
    },

    update: async (id: number, data: Partial<Lead>) => {
        const response = await api.put<Lead>(`/leads/${id}`, data);
        return response.data;
    },

    delete: async (id: number) => {
        await api.delete(`/leads/${id}`);
    },

    updateStatus: async (id: number, status: string) => {
        const response = await api.patch<Lead>(`/leads/${id}/status`, { status });
        return response.data;
    }
};
