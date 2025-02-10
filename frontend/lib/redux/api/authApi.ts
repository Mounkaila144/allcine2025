import { api } from '../api'
import {
    AuthResponse,
    LoginCredentials,
    RegisterCredentials,
    PasswordResetRequest,
    PasswordResetResponse
} from '@/types/auth'

export const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<AuthResponse, LoginCredentials>({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Auth'],
        }),
        register: builder.mutation<{ message: string; userId: number }, RegisterCredentials>({
            query: (credentials) => ({
                url: '/auth/register',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Auth'],
        }),
        verifyOTP: builder.mutation<{ message: string }, { phone: string; otp: string }>({
            query: (data) => ({
                url: '/auth/verify-otp',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Auth'],
        }),
        resendOTP: builder.mutation<{ message: string }, { phone: string }>({
            query: (data) => ({
                url: '/auth/resend-otp',
                method: 'POST',
                body: data,
            }),
        }),
        requestPasswordReset: builder.mutation<PasswordResetResponse, PasswordResetRequest>({
            query: (data) => ({
                url: '/auth/request-password-reset',
                method: 'POST',
                body: data,
            }),
        }),
        resetPassword: builder.mutation<{ message: string }, { phone: string; otp: string; newPassword: string }>({
            query: (data) => ({
                url: '/auth/reset-password',
                method: 'POST',
                body: data,
            }),
        }),
        logout: builder.mutation<void, void>({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            invalidatesTags: ['Auth'],
        }),
        refreshToken: builder.mutation<AuthResponse, void>({
            query: () => ({
                url: '/auth/refresh',
                method: 'POST',
            }),
            invalidatesTags: ['Auth'],
        }),
    }),
    overrideExisting: false,
})

export const {
    useLoginMutation,
    useRegisterMutation,
    useVerifyOTPMutation,
    useResendOTPMutation,
    useRequestPasswordResetMutation,
    useLogoutMutation,
    useResetPasswordMutation,
    useRefreshTokenMutation,
} = authApi