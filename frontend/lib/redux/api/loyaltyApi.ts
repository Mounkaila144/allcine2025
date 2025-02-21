// loyaltyApi.ts
import { api } from '../api';

export interface LoyaltyStatus {
    id: number;
    user_id: number;
    stamp_count: number;
    card_count: number;
}

export const loyaltyApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getLoyaltyStatus: builder.query<LoyaltyStatus, void>({
            query: () => '/loyalty/status',
            providesTags: ['Loyalty'],
        }),

        updateLoyaltyStamps: builder.mutation<LoyaltyStatus, { user_id: number; stamp_count: number; card_count: number }>({
            query: (data) => ({
                url: '/loyalty/stamps',
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Loyalty'],
        }),

        resetLoyaltyStamps: builder.mutation<LoyaltyStatus, number>({
            query: (user_id) => ({
                url: '/loyalty/reset',
                method: 'PUT',
                body: { user_id },
            }),
            invalidatesTags: ['Loyalty'],
        }),

        createLoyaltyStatus: builder.mutation<LoyaltyStatus, number>({
            query: (user_id) => ({
                url: '/loyalty/create',
                method: 'POST',
                body: { user_id },
            }),
            invalidatesTags: ['Loyalty'],
        }),
    }),
});

export const {
    useGetLoyaltyStatusQuery,
    useUpdateLoyaltyStampsMutation,
    useResetLoyaltyStampsMutation,
    useCreateLoyaltyStatusMutation,
} = loyaltyApi;