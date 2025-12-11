import api from '@/lib/axios';

export interface Ticket {
    id: number;
    subject: string;
    description?: string;
    status: string;
    priority: string;
    client_id: number;
    assigned_to?: number;
    created_at: string;
}

export const ticketService = {
    getAll: async () => {
        const response = await api.get<Ticket[]>('/tickets');
        return response.data;
    },

    getOne: async (id: number) => {
        const response = await api.get<Ticket>(`/tickets/${id}`);
        return response.data;
    },

    create: async (data: Partial<Ticket>) => {
        const response = await api.post<Ticket>('/tickets', data);
        return response.data;
    },

    update: async (id: number, data: Partial<Ticket>) => {
        const response = await api.put<Ticket>(`/tickets/${id}`, data);
        return response.data;
    },

    delete: async (id: number) => {
        await api.delete(`/tickets/${id}`);
    }
};
