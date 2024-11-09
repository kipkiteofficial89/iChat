import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { iChatApi } from './services/iChatApi'

export const store = configureStore({
    reducer: {
        [iChatApi.reducerPath]: iChatApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(iChatApi.middleware),
})
setupListeners(store.dispatch)