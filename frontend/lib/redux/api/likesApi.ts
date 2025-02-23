// src/lib/redux/api/likeApi.ts

import { api } from '../api';

export type Like = {
    id: number;
    user_id: number;
    content_id: number;
    created_at: string;
};

export type ToggleLikeResponse = {
    message: string;
    liked: boolean;
    likesCount: number;
};

export type LikesCountResponse = {
    content_id: number;
    likes_count: number;
    is_liked: boolean;
};

export type UserLike = {
    id: number;
    content: {
        id: number;
        titre: string;
        type: 'film' | 'serie' | 'manga';
        description: string;
        image_url: string;
    };
};

export const likeApi = api.injectEndpoints({
    endpoints: (builder) => ({
        toggleLike: builder.mutation<ToggleLikeResponse, { content_id: number }>({
            query: (body) => ({
                url: '/likes/toggle',
                method: 'POST',
                body,
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Likes', id: arg.content_id },
                { type: 'Recommendations', id: 'LIST' },
            ],
        }),

        getLikesCount: builder.query<LikesCountResponse, number>({
            query: (content_id) => `/likes/count/${content_id}`,
            providesTags: (result, error, content_id) => [
                { type: 'Likes', id: content_id },
            ],
        }),

        getUserLikes: builder.query<UserLike[], void>({
            query: () => '/likes/user',
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'Likes' as const, id })),
                        { type: 'Likes', id: 'LIST' },
                    ]
                    : [{ type: 'Likes', id: 'LIST' }],
        }),
    }),
});

export const {
    useToggleLikeMutation,
    useGetLikesCountQuery,
    useGetUserLikesQuery,
} = likeApi;