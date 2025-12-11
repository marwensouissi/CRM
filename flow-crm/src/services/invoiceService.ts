import api from '@/lib/axios';

export interface Invoice {
    id: number;
    invoice_number: string;
    client_id: number;
    issue_date: string;
    due_date?: string;
    amount: number;
    status: string;
    created_at: string;
}

export const invoiceService = {
    getAll: async () => {
        const response = await api.get<Invoice[]>('/invoices');
        return response.data;
    },

    getOne: async (id: number) => {
        const response = await api.get<Invoice>(`/invoices/${id}`);
        return response.data;
    },

    create: async (data: Partial<Invoice>) => {
        const response = await api.post<Invoice>('/invoices', data);
        return response.data;
    },

    update: async (id: number, data: Partial<Invoice>) => {
        const response = await api.put<Invoice>(`/invoices/${id}`, data);
        return response.data;
    },

    delete: async (id: number) => {
        await api.delete(`/invoices/${id}`);
    }
};
