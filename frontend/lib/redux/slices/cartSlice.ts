import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { CartItem, DeliveryInfo } from '../../../types';

interface CartState {
    items: CartItem[];
    isOpen: boolean;
    deliveryInfo: DeliveryInfo;
}

const initialState: CartState = {
    items: [],
    isOpen: false,
    deliveryInfo: {
        address: '',
        note: '',
    }
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem: (state, action: PayloadAction<CartItem>) => {
            const existingItem = state.items.find(
                item => item.id === action.payload.id && item.type === action.payload.type
            );

            if (existingItem) {
                existingItem.quantite += action.payload.quantite;
            } else {
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
        updateDeliveryInfo: (state, action: PayloadAction<DeliveryInfo>) => {
            state.deliveryInfo = action.payload;
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
    clearCart,
    setCartOpen
} = cartSlice.actions;

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartTotal = (state: RootState) =>
    state.cart.items.reduce((total, item) => total + item.prix * item.quantite, 0);
export const selectIsCartOpen = (state: RootState) => state.cart.isOpen;
export const selectDeliveryInfo = (state: RootState) => state.cart.deliveryInfo;

export default cartSlice.reducer;