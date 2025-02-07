import { api } from '../api';


interface User {
  id: number;
  nom: string;
  prenom: string;
  phone: string;
}

interface OrderArticle {
  id: number;
  prix: number;
  titre: string;
  quantite: number;
}

interface OrderContent {
  id: number;
  prix: number;
  type: 'film' | 'serie' | 'manga';
  titre: string;
  saisons_possedees?: number;
}

// Mise à jour de l'interface Order pour inclure la propriété user
interface Order {
  id: number;
  user_id: number;
  user: User;
  data: {
    total: number;
    articles?: OrderArticle[];
    contents?: OrderContent[];
  };
  statut: 'en_attente' | 'confirme' | 'livre';
  createdAt: string;
  updatedAt: string;
}

export const ordersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<Order[], void>({
      query: () => 'orders',
      providesTags: ['Orders'],
    }),
    updateOrderStatus: builder.mutation<Order, { id: number; statut: Order['statut'] }>({
      query: ({ id, statut }) => ({
        url: `orders/${id}/status`,
        method: 'PUT',
        body: { statut },
      }),
      invalidatesTags: ['Orders'],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
} = ordersApi;