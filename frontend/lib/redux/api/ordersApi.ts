// ordersApi.ts
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
    isRequired: boolean; // Ajout de isRequired pour indiquer si la livraison est demandée
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
        deliveryInfo?: DeliveryInfo; // deliveryInfo peut être optionnel
        filmDiscount?: number; // Assurez-vous que ces champs existent dans votre Order type
        seriesDiscount?: number; // Assurez-vous que ces champs existent dans votre Order type
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

        deleteOrder: builder.mutation<void, number>({ // Mutation pour supprimer une commande
            query: (id) => ({
                url: `/orders/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Orders'],
        }),
    }),
});

export const {
    useGetOrdersQuery,
    useCreateOrderMutation,
    useUpdateOrderStatusMutation,
    useDeleteOrderMutation // Exportez le nouveau hook useDeleteOrderMutation
} = ordersApi;