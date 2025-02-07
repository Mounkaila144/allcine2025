import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Reservation } from '@/types/reservation';

interface ReservationsState {
  reservations: Reservation[];
  selectedReservation: Reservation | null;
  loading: boolean;
  error: string | null;
}

const initialState: ReservationsState = {
  reservations: [],
  selectedReservation: null,
  loading: false,
  error: null,
};

const reservationsSlice = createSlice({
  name: 'reservations',
  initialState,
  reducers: {
    setReservations: (state, action: PayloadAction<Reservation[]>) => {
      state.reservations = action.payload;
    },
    setSelectedReservation: (state, action: PayloadAction<Reservation | null>) => {
      state.selectedReservation = action.payload;
    },
    addReservation: (state, action: PayloadAction<Reservation>) => {
      state.reservations.push(action.payload);
    },
    updateReservation: (state, action: PayloadAction<Reservation>) => {
      const index = state.reservations.findIndex(res => res.id === action.payload.id);
      if (index !== -1) {
        state.reservations[index] = action.payload;
      }
    },
    deleteReservation: (state, action: PayloadAction<number>) => {
      state.reservations = state.reservations.filter(res => res.id !== action.payload);
    },
  },
});

export const {
  setReservations,
  setSelectedReservation,
  addReservation,
  updateReservation,
  deleteReservation,
} = reservationsSlice.actions;
export default reservationsSlice.reducer;