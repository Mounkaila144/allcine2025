// usersApi.ts
import { api } from '../api';

export interface User {
    id: number;
    nom: string;
    prenom: string;
    phone: string;
    role: 'client' | 'admin';
    isConfirme: boolean;
}

export const usersApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query<User[], void>({
            query: () => '/users/all',
            providesTags: ['Users'],
        }),
        updateUser: builder.mutation<User, Partial<User> & { id: number }>({
            query: ({ id, ...body }) => ({
                url: `/users/profile/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['Users'],
        }),
        changePassword: builder.mutation<void, { id: number; oldPassword: string; newPassword: string }>({
            query: ({ id, ...body }) => ({
                url: `/users/change-password/${id}`,
                method: 'PUT',
                body,
            }),
        }),
        deleteUser: builder.mutation<void, number>({
            query: (id) => ({
                url: `/users/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Users'],
        }),
    }),
});

export const {
    useGetUsersQuery,
    useUpdateUserMutation,
    useChangePasswordMutation,
    useDeleteUserMutation,
} = usersApi;