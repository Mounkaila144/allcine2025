//articleApi.js
import { api } from '../api';

export interface Article {
    id: number;
    titre: string;
    categorie_id: number;
    prix: number;
    description: string;
    image: string | null;
    Category?: {
        nom: string;
    };
}

export interface ArticleFilters {
    search?: string;
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

export interface ArticleResponse {
    articles: Article[];
    pagination: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
        limit: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}

export const articleApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getArticles: builder.query<ArticleResponse, ArticleFilters>({
            query: (params) => ({
                url: '/articles',
                params: {
                    ...params,
                    page: params.page || 1,
                    limit: params.limit || 10,
                    categorie_id: params.categoryId
                }
            }),
            transformResponse: (response: ArticleResponse) => ({
                articles: response.articles,
                pagination: {
                    totalItems: response.pagination.totalItems,
                    totalPages: response.pagination.totalPages,
                    currentPage: response.pagination.currentPage,
                    limit: response.pagination.limit,
                    hasNextPage: response.pagination.hasNextPage,
                    hasPreviousPage: response.pagination.hasPreviousPage
                }
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.articles.map(({ id }) => ({ type: 'Articles' as const, id })),
                        { type: 'Articles' as const, id: 'LIST' }
                    ]
                    : [{ type: 'Articles' as const, id: 'LIST' }]
        }),
        createArticle: builder.mutation<Article, FormData>({
            query: (formData) => ({
                url: 'articles',
                method: 'POST',
                body: formData,
                formData: true,
            }),
            invalidatesTags: [{ type: 'Articles', id: 'LIST' }]
        }),
        updateArticle: builder.mutation<Article, { id: number; data: FormData }>({
            query: ({ id, data }) => ({
                url: `articles/${id}`,
                method: 'PUT',
                body: data,
                formData: true,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Articles', id },
                { type: 'Articles', id: 'LIST' }
            ]
        }),
        deleteArticle: builder.mutation<void, number>({
            query: (id) => ({
                url: `articles/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Articles', id },
                { type: 'Articles', id: 'LIST' }
            ]
        }),
    }),
});

export const {
    useGetArticlesQuery,
    useCreateArticleMutation,
    useUpdateArticleMutation,
    useDeleteArticleMutation,
} = articleApi;