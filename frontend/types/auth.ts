// Types pour la connexion
export interface LoginCredentials {
  phone: string;
  password: string;
}

// Types pour l'inscription
export interface RegisterCredentials {
  phone: string;
  password: string;
  nom: string;
  prenom: string;
}

// Types pour la vérification OTP
export interface OTPVerificationCredentials {
  phone: string;
  otp: string;
}

// Types pour la réponse utilisateur
export interface UserResponse {
  id: number;
  phone: string;
  nom: string;
  prenom: string;
  role: string;
  isConfirme?: boolean;
}

// Types pour la réponse d'authentification
export interface AuthResponse {
  message: string;
  token: string;
  user: UserResponse;
}

// Types pour la réponse d'inscription
export interface RegisterResponse {
  message: string;
  userId: number;
  remainingAttempts: number;
  attemptCount: number;
}

// Types pour la réponse de vérification OTP
export interface OTPVerificationResponse {
  message: string;
  remainingAttempts?: number;
}

// Types optionnels pour la réinitialisation du mot de passe
export interface PasswordResetRequest {
  phone: string;
}

export interface PasswordResetCredentials {
  phone: string;
  otp: string;
  newPassword: string;
}

export interface PasswordResetResponse {
  message: string;
  remainingAttempts?: number;
  nextResetAvailable?: Date;
}