import { api } from '../api';

export interface Category {
    id: number;
    nom: string;
    createdAt: string;
    updatedAt: string;
}

export interface CategoryResponse {
    categories: Category[];
    pagination: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
    };
}

export interface CreateCategoryDto {
    nom: string;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}

export const categoriesApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query<CategoryResponse, { page?: number; limit?: number; search?: string }>({
            query: (params) => ({
                url: '/categories',
                params: {
                    ...params,
                    page: params.page || 1,
                    limit: params.limit || 10
                }
            }),
            transformResponse: (response: any) => ({
                categories: response.categories,
                pagination: {
                    totalItems: response.totalItems,
                    totalPages: response.totalPages,
                    currentPage: response.currentPage
                }
            })
        }),

        getCategory: builder.query<Category, number>({
            query: (id) => `/categories/${id}`,
            providesTags: (_result, _err, id) => [{ type: 'Categories', id }],
        }),

        createCategory: builder.mutation<Category, CreateCategoryDto>({
            query: (category) => ({
                url: '/categories',
                method: 'POST',
                body: category,
            }),
            invalidatesTags: ['Categories'],
        }),

        updateCategory: builder.mutation<Category, { id: number; category: UpdateCategoryDto }>({
            query: ({ id, category }) => ({
                url: `/categories/${id}`,
                method: 'PUT',
                body: category,
            }),
            invalidatesTags: (_result, _err, { id }) => [{ type: 'Categories', id }, 'Categories'],
        }),

        deleteCategory: builder.mutation<void, number>({
            query: (id) => ({
                url: `/categories/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Categories'],
        }),
    }),
});

export const {
    useGetCategoriesQuery,
    useGetCategoryQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} = categoriesApi;