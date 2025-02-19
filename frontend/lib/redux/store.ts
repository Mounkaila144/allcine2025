// lib/redux/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import authReducer from './slices/authSlice';
import ordersReducer from './slices/ordersSlice';
import reservationsReducer from './slices/reservationsSlice';
import { api } from './api';
import { authApi } from './api/authApi';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    whitelist: ['auth','cart'],
    blacklist: [api.reducerPath, authApi.reducerPath],
    timeout: 2000,
};

const rootReducer = combineReducers({
    auth: authReducer,
    cart: cartReducer,
    orders: ordersReducer,
    reservations: reservationsReducer,
    [api.reducerPath]: api.reducer,
    [authApi.reducerPath]: authApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
            debug: process.env.NODE_ENV !== 'production',
        })
            .concat(api.middleware)
            .concat(authApi.middleware),
    devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;