// cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import {CartItem, DeliveryInfo} from "@/types";

// Mise à jour du type DeliveryInfo pour inclure isRequired
interface DeliveryInfoWithOption extends DeliveryInfo {
    isRequired?: boolean;
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;
    deliveryInfo: DeliveryInfoWithOption;
}

const initialState: CartState = {
    items: [],
    isOpen: false,
    deliveryInfo: {
        address: '',
        note: '',
        isRequired: false
    }
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem: (state, action: PayloadAction<CartItem>) => {
            const existingItem = state.items.find(
                item => item.id === action.payload.id && item.type === action.payload.type
                    && JSON.stringify(item.contentDetails) === JSON.stringify(action.payload.contentDetails) // Comparaison des détails
            );

            if (existingItem) {
                // Si l'élément existe déjà AVEC les mêmes détails, incrémenter la quantité
                existingItem.quantite += action.payload.quantite;
            } else {
                // Sinon, ajouter un nouvel élément
                state.items.push(action.payload);
            }
        },
        removeItem: (state, action: PayloadAction<{ id: number; type: string }>) => {
            state.items = state.items.filter(
                item => !(item.id === action.payload.id && item.type === action.payload.type)
            );
        },
        updateQuantity: (
            state,
            action: PayloadAction<{ id: number; type: string; quantite: number }>
        ) => {
            const item = state.items.find(
                item => item.id === action.payload.id && item.type === action.payload.type
            );
            if (item) {
                item.quantite = action.payload.quantite;
            }
        },
        updateDeliveryInfo: (state, action: PayloadAction<DeliveryInfoWithOption>) => {
            state.deliveryInfo = action.payload;
        },
        toggleDeliveryRequired: (state) => {
            state.deliveryInfo.isRequired = !state.deliveryInfo.isRequired;
        },
        clearCart: (state) => {
            state.items = [];
            state.deliveryInfo = initialState.deliveryInfo;
        },
        setCartOpen: (state, action: PayloadAction<boolean>) => {
            state.isOpen = action.payload;
        }
    }
});

export const {
    addItem,
    removeItem,
    updateQuantity,
    updateDeliveryInfo,
    toggleDeliveryRequired,
    clearCart,
    setCartOpen
} = cartSlice.actions;

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartTotal = (state: RootState) =>
    state.cart.items.reduce((total, item) => total + item.prix * item.quantite, 0); //sera redefini dans le CartDrawer
export const selectIsCartOpen = (state: RootState) => state.cart.isOpen;
export const selectDeliveryInfo = (state: RootState) => state.cart.deliveryInfo;

export default cartSlice.reducer;