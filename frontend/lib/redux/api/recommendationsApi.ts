// src/lib/redux/api/recommendationsApi.ts

import { api } from '../api';
import { Content } from './contentsApi';

export const recommendationsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getRecommendations: builder.query<Content[], void>({
            query: () => '/recommendations',
            providesTags: ['Recommendations'],
        }),
    }),
});

export const { useGetRecommendationsQuery } = recommendationsApi;