import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

interface User {
    id: number;
    email: string;
    nom: string;
    prenom: string;
    role: string;
    tenant_id: number;
}

interface AuthState {
    token: string | null;
    user: User | null;
    tenantId: number | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    token: null,
    user: null,
    tenantId: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{
                token: string;
                user: User;
            }>
        ) => {
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.tenantId = action.payload.user.tenant_id;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.token = null;
            state.user = null;
            state.tenantId = null;
            state.isAuthenticated = false;
            // Supprimer le cookie lors de la déconnexion
            Cookies.remove('token');
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;