// lib/redux/store.ts
"use client";
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { api } from './api';
import authReducer from './slices/authSlice';
import ordersReducer from './slices/ordersSlice';
import reservationsReducer from './slices/reservationsSlice';
import { authApi } from './api/authApi';

// Configuration de la persistance
const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    whitelist: ['auth'],
    blacklist: [api.reducerPath, authApi.reducerPath]
};

// Combine tous les reducers
const rootReducer = combineReducers({
    auth: authReducer,
    orders: ordersReducer,
    reservations: reservationsReducer,
    [api.reducerPath]: api.reducer,
    [authApi.reducerPath]: authApi.reducer,
});

// Crée le reducer persisté
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configuration du store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        })
            .concat(api.middleware)
            .concat(authApi.middleware),
    devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;