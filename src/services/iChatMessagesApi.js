import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const API_URL =
    import.meta.env.MODE === 'development'
        ? `${import.meta.env.VITE_DEV_API_URL}/messages/v1`
        : `${import.meta.env.VITE_PROD_API_URL}/messages/v1`

const token = {
    Authorization: `Bearer ${localStorage.getItem("__utoken")}`,
}

export const iChatMessagesApi = createApi({
    reducerPath: 'iChatMessagesApi',
    baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
    endpoints: (builder) => ({
        getConversation: builder.query({
            query: (receiverId) => ({
                url: '/getConversation',
                method: 'GET',
                params: {
                    receiverId
                },
                headers: token
            }),
        }),
    })
});

export const { useGetConversationQuery } = iChatMessagesApi