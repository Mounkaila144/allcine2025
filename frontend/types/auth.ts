export interface LoginCredentials {
  phone: string;
  password: string;
}

export interface UserResponse {
  id: number;
  phone: string;
  nom: string;
  prenom: string;
  role: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: UserResponse;
}
