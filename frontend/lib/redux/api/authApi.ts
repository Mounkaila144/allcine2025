import { api } from '../api';
import { LoginCredentials, AuthResponse } from '@/types/auth';
import { setCredentials, logout } from '@/lib/redux/slices/authSlice';


export const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<AuthResponse, LoginCredentials>({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        logout: builder.mutation<void, void>({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            // Optionnel : Réinitialiser l'état après la déconnexion
            onQueryStarted: async (_, { dispatch }) => {
                dispatch(logout());
            },
        }),
        refreshToken: builder.mutation<AuthResponse, void>({
            query: () => ({
                url: '/auth/refresh',
                method: 'POST',
            }),
        }),
    }),
});

export const { useLoginMutation, useLogoutMutation, useRefreshTokenMutation } = authApi;
