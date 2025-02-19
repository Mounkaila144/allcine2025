import { api } from '../api';

export interface User {
    id: number;
    nom: string;
    prenom: string;
    phone: string;
}

export interface OrderArticle {
    id: number;
    prix: number;
    titre: string;
    quantite: number;
}

export interface OrderContent {
    id: number;
    prix: number;
    type: 'film' | 'serie' | 'manga';
    titre: string;
    saisons_possedees?: number;
}

export interface DeliveryInfo {
    address: string;
    note?: string;
}

export interface Order {
    id: number;
    user_id: number;
    User?: User;
    data: {
        total: number;
        articles?: OrderArticle[];
        contents?: OrderContent[];
        deliveryInfo: DeliveryInfo;
    };
    statut: 'en_attente' | 'confirme' | 'livre';
    createdAt: string;
    updatedAt: string;
}

export const ordersApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getOrders: builder.query<Order[], void>({
            query: () => '/orders',
            providesTags: ['Orders'],
        }),

        createOrder: builder.mutation<Order, { data: Order['data'] }>({
            query: (orderData) => ({
                url: '/orders',
                method: 'POST',
                body: orderData,
            }),
            invalidatesTags: ['Orders'],
        }),

        updateOrderStatus: builder.mutation<Order, { id: number; statut: Order['statut'] }>({
            query: ({ id, statut }) => ({
                url: `/orders/${id}`,
                method: 'PUT',
                body: { statut },
            }),
            invalidatesTags: ['Orders'],
        }),
    }),
});

export const {
    useGetOrdersQuery,
    useCreateOrderMutation,
    useUpdateOrderStatusMutation,
} = ordersApi;