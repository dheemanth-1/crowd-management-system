import { getToken, removeToken } from './auth';

const API_BASE = process.env.NEXT_PUBLIC_API_ENDPOINT;

interface FetchOptions extends RequestInit {
    requiresAuth?: boolean;
}

export class ApiError extends Error {
    constructor(
        public status: number,
        public statusText: string,
        message: string
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

export const apiClient = async (
    endpoint: string,
    options: FetchOptions = {}
) => {
    const { requiresAuth = true, ...fetchOptions } = options;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(fetchOptions.headers as Record<string, string>),
    };

    if (requiresAuth) {
        const token = getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...fetchOptions,
        headers,
    });

    if (response.status === 401) {
        removeToken();
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
        throw new ApiError(401, 'Unauthorized', 'Session expired. Please login again.');
    }

    if (!response.ok) {
        const text = await response.text();
        let errorMessage = text;

        try {
            const errorData = JSON.parse(text);
            errorMessage = errorData.message || errorData.error || text;
        } catch {
            console.log()
        }

        throw new ApiError(
            response.status,
            response.statusText,
            errorMessage
        );
    }

    return response;
};

export const api = {
    get: async (endpoint: string, options?: FetchOptions) => {
        const response = await apiClient(endpoint, { ...options, method: 'GET' });
        return response.json();
    },

    post: async (endpoint: string, data?: any, options?: FetchOptions) => {
        const response = await apiClient(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(data),
        });
        return response.json();
    },

    put: async (endpoint: string, data?: any, options?: FetchOptions) => {
        const response = await apiClient(endpoint, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(data),
        });
        return response.json();
    },

    delete: async (endpoint: string, options?: FetchOptions) => {
        const response = await apiClient(endpoint, { ...options, method: 'DELETE' });
        return response.json();
    },
};
