import { api } from '../api';

export type ContentStatus = 'released' | 'upcoming' | 'cancelled';
export type ContentRating = 'G' | 'PG' | 'PG-13' | 'R' | 'NC-17' | 'NR';

export interface Content {
    id: number;
    titre: string;
    type: 'film' | 'serie' | 'manga';
    saisons_possedees: number;
    tmdb_id: string | null;
    genre: string | null;
    description: string | null;
    image_url: string | null;
    release_date: string; // Format: "YYYY-MM-DD"
    added_date: string;   // Date d'ajout à la collection
    status: ContentStatus;
    rating: ContentRating | null;
    duration_minutes?: number; // Pour les films
    episodes_count?: number;  // Pour les séries
    original_title?: string;  // Titre original si différent
    language: string;        // Langue originale
    production_country: string | null;
    average_rating?: number;  // Note moyenne /10
}

export interface ContentFilters {
    search?: string;
    type?: 'film' | 'serie' | 'manga' | null;
    genre?: string | null;
    startDate?: string;
    endDate?: string;
    status?: ContentStatus | null;
    rating?: ContentRating | null;
    language?: string | null;
}

export interface CreateContentDto extends Omit<Content, 'id' | 'added_date'> {}
export interface UpdateContentDto extends Partial<CreateContentDto> {}

export const contentsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getContents: builder.query<{ contents: Content[], pagination: any }, any>({
            query: (params) => ({
                url: '/contents',
                params,
            }),
            // Amélioration de la gestion des tags
            providesTags: (result) =>
                result
                    ? [
                        // Tag pour la liste entière
                        { type: 'Contents', id: 'LIST' },
                        // Tag pour chaque contenu
                        ...result.contents.map(({ id }) => ({ type: 'Contents', id })),
                    ]
                    : [{ type: 'Contents', id: 'LIST' }]
        }),
        createContent: builder.mutation<Content, CreateContentDto>({
            query: (content) => ({
                url: '/contents',
                method: 'POST',
                body: content,
            }),
            // Invalide la liste complète après création
            invalidatesTags: [{ type: 'Contents', id: 'LIST' }]
        }),
        updateContent: builder.mutation<Content, { id: number; content: Partial<Content> }>({
            query: ({ id, content }) => ({
                url: `/contents/${id}`,
                method: 'PUT',
                body: content,
            }),
            // Invalide à la fois l'élément spécifique et la liste
            invalidatesTags: (result, error, { id }) => [
                { type: 'Contents', id },
                { type: 'Contents', id: 'LIST' }
            ]
        }),
        deleteContent: builder.mutation<void, number>({
            query: (id) => ({
                url: `/contents/${id}`,
                method: 'DELETE',
            }),
            // Invalide à la fois l'élément spécifique et la liste
            invalidatesTags: (result, error, id) => [
                { type: 'Contents', id },
                { type: 'Contents', id: 'LIST' }
            ]
        }),
    }),
});
export const {
    useGetContentsQuery,
    useCreateContentMutation,
    useUpdateContentMutation,
    useDeleteContentMutation,
} = contentsApi;