import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { iChatUsersApi } from './services/iChatUsersApi'
import { iChatMessagesApi } from './services/iChatMessagesApi'

export const store = configureStore({
    reducer: {
        [iChatUsersApi.reducerPath]: iChatUsersApi.reducer,
        [iChatMessagesApi.reducerPath]: iChatMessagesApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(iChatUsersApi.middleware)
            .concat(iChatMessagesApi.middleware),
})
setupListeners(store.dispatch)