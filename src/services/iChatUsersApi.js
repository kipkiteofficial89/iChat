import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const API_URL =
    import.meta.env.MODE === 'development'
        ? `${import.meta.env.VITE_DEV_API_URL}/users/v1`
        : `${import.meta.env.VITE_PROD_API_URL}/users/v1`

const token = {
    Authorization: `Bearer ${localStorage.getItem("__utoken")}`,
}

export const iChatUsersApi = createApi({
    reducerPath: 'iChatUsersApi',
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
        }),
        searchPeople: builder.query({
            query: (value) => ({
                url: '/searchPeople',
                method: 'GET',
                params: { value },
                headers: token
            })
        }),
        getUserInfo: builder.query({
            query: (id) => ({
                url: '/getUserInfo',
                method: 'GET',
                params: { userId: id },
                headers: token
            })
        }),
        fetchConnectedPeoples: builder.query({
            query: () => ({
                url: '/fetchConnectedPeoples',
                method: 'GET',
                headers: token
            })
        })
    }),
})

export const { useJoinUserMutation, useGetUserQuery, useSearchPeopleQuery, useGetUserInfoQuery, useFetchConnectedPeoplesQuery } = iChatUsersApi