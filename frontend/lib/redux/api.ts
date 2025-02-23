"use client";
import { createApi, fetchBaseQuery, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { RootState } from './store';
import { toast } from 'sonner';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;

    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});
const customBaseQuery = async (args: any, api: any, extraOptions: any) => {
  // Créez une instance de fetchBaseQuery sans définir de Content-Type par défaut
  const rawBaseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      // Si args.body n'est pas une instance de FormData, on ajoute le header
      if (!(args && args.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
      }
      return headers;
    },
  });
  return rawBaseQuery(args, api, extraOptions);
};
const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
  let result = await customBaseQuery(args, api, extraOptions);

  if (result.error) {
    const { status } = result.error as { status: number };

    switch (status) {
      case 401:
        toast.error('Session expirée. Veuillez vous reconnecter.');
        window.location.href = '/';
        break;
      case 403:
        toast.error('Accès non autorisé');
        break;
      case 404:
        toast.error('Ressource non trouvée');
        break;
      case 500:
        toast.error('Erreur serveur. Veuillez réessayer plus tard.');
        break;
      default:
        toast.error('Une erreur est survenue');
    }
  }

  return result;
};


export const api = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Contents','Orders', 'Category', 'Users','Auth','DashboardStats','Articles','Loyalty'],
  endpoints: () => ({}),
});