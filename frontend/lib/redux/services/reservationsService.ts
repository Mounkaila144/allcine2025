import { api } from '../api';
import { Reservation, CreateReservationDto, UpdateReservationDto } from '@/types/reservation';

export const reservationsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getReservations: builder.query<Reservation[], void>({
      query: () => '/reservations',
      providesTags: ['Reservations'],
    }),
    getReservation: builder.query<Reservation, number>({
      query: (id) => `/reservations/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Reservations', id }],
    }),
    createReservation: builder.mutation<Reservation, CreateReservationDto>({
      query: (reservation) => ({
        url: '/reservations',
        method: 'POST',
        body: reservation,
      }),
      invalidatesTags: ['Reservations'],
    }),
    updateReservation: builder.mutation<Reservation, { id: number; reservation: UpdateReservationDto }>({
      query: ({ id, reservation }) => ({
        url: `/reservations/${id}`,
        method: 'PUT',
        body: reservation,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Reservations', id }],
    }),
    deleteReservation: builder.mutation<void, number>({
      query: (id) => ({
        url: `/reservations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Reservations'],
    }),
  }),
});