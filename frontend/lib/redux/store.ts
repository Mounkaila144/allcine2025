// lib/redux/store.ts
"use client";
import {configureStore, combineReducers} from '@reduxjs/toolkit';
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
import {api} from './api';
import authReducer from './slices/authSlice';
import ordersReducer from './slices/ordersSlice';
import reservationsReducer from './slices/reservationsSlice';
import {authApi} from './api/authApi';

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    whitelist: ['auth'],
    blacklist: [api.reducerPath, authApi.reducerPath],
    // Ajout d'un timeout pour éviter les problèmes de persistance
    timeout: 2000,
};

const rootReducer = combineReducers({
    auth: authReducer,
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
            // Ajout du mode debug
            debug: process.env.NODE_ENV !== 'production',
        })
            .concat(api.middleware)
            .concat(authApi.middleware),
    devTools: true, // Activer les devTools même en production pour le débogage
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;