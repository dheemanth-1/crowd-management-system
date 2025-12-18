import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { setToken, removeToken } from '@/lib/auth';

interface LoginCredentials {
    email: string;
    password: string;
}

interface LoginResponse {
    token: string;
    user?: {
        id: string;
        username: string;
        email: string;
    };
}

export const useLogin = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: async (credentials: LoginCredentials) => {
            const response = await api.post('/auth/login', credentials, {
                requiresAuth: false,
            });
            return response as LoginResponse;
        },
        onSuccess: (data) => {
            setToken(data.token);
            document.cookie = `auth_token=${data.token}; path=/; max-age=86400; SameSite=Strict`;
            router.push('/overview');
            router.refresh();
        },
    });
};

export const useLogout = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: async () => {
            removeToken();
            document.cookie = 'auth_token=; path=/; max-age=0';
        },
        onSuccess: () => {
            router.push('/login');
            router.refresh();
        },
    });
};