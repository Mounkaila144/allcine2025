export interface Reservation {
  id: number;
  customer: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
}

export interface CreateReservationDto {
  customer: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  notes?: string;
}

export interface UpdateReservationDto {
  status?: Reservation['status'];
  notes?: string;
}