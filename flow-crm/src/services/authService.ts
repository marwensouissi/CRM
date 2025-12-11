import api from '@/lib/axios';

export interface User {
    id: number;
    name: string;
    email: string;
    role?: string;
    avatar?: string;
}

export interface LoginResponse {
    access_token: string;
    token_type: string;
    user: User;
}

export const authService = {
    csrf: async () => {
        await api.get('/sanctum/csrf-cookie', { baseURL: 'http://localhost:8000' });
    },

    login: async (credentials: Record<string, unknown>) => {
        await authService.csrf();
        const response = await api.post<LoginResponse>('/login', credentials);
        return response.data;
    },

    register: async (data: Record<string, unknown>) => {
        await authService.csrf();
        const response = await api.post<LoginResponse>('/register', data);
        return response.data;
    },

    logout: async () => {
        await api.post('/logout');
    },

    getUser: async () => {
        const response = await api.get<User>('/user');
        return response.data;
    }
};
