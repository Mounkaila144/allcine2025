'use client';
import React from 'react';

const LoadingSpinner = () => {
    return (
        <div className="h-screen w-screen gradient-bg flex flex-col items-center justify-center gap-4">
        <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent animate-spin"></div>
            <div className="absolute top-1 left-1 w-14 h-14 rounded-full border-4 border-t-blue-400 border-r-blue-400 border-b-transparent border-l-transparent animate-spin-slow"></div>
        </div>
        <p className="text-blue-100/80 animate-pulse">Chargement...</p>
    </div>
);
};

export default LoadingSpinner;