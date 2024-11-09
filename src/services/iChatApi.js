import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const API_URL =
    import.meta.env.MODE === 'development'
        ? `${import.meta.env.VITE_DEV_API_URL}/users/v1`
        : `${import.meta.env.VITE_PROD_API_URL}/users/v1`

const token = {
    Authorization: `Bearer ${localStorage.getItem("__utoken")}`,
}

export const iChatApi = createApi({
    reducerPath: 'iChatApi',
    baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
    endpoints: (builder) => ({
        joinUser: builder.mutation({
            query: (user) => ({
                url: '/joinUser',
                method: 'POST',
                body: user
            }),
        }),
        getUser: builder.query({
            query: () => ({
                url: '/getUser',
                method: 'GET',
                headers: token
            })
        })
    }),
})

export const { useJoinUserMutation, useGetUserQuery } = iChatApi