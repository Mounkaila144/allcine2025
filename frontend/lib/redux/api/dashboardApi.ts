// dashboardApi.ts
import { api } from '../api';

export interface DashboardStats {
    users: number;
    orders: number;
    loyaltyStamps: number;
    totalFilms: number;
    totalSeries: number;
    totalMangas: number;
    totalTechProducts: number;
    articleReads: number;
    userActivity: Array<{
        date: string;
        activity: number;
    }>;
}

export const dashboardApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getDashboardStats: builder.query<DashboardStats, void>({
            query: () => '/dashboard/stats',
            providesTags: ['DashboardStats'],
        }),
    }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;