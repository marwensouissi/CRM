import api from '@/lib/axios';

export interface Note {
    id: number;
    content: string;
    user_id: number;
    user: {
        id: number;
        name: string;
    };
    created_at: string;
    updated_at: string;
}

export const noteService = {
    getForLead: async (leadId: number) => {
        const response = await api.get<Note[]>(`/leads/${leadId}/notes`);
        return response.data;
    },

    create: async (leadId: number, content: string) => {
        const response = await api.post<Note>(`/leads/${leadId}/notes`, { content });
        return response.data;
    },

    delete: async (noteId: number) => {
        await api.delete(`/notes/${noteId}`);
    }
};
