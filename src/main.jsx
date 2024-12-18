import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { DataContextProvider } from './context/DataContext.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { store } from './store.js'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast';
import { io } from 'socket.io-client';

const SOCKET_SERVER_URL =
  import.meta.env.MODE === 'development'
    ? "http://localhost:8080/"
    : "https://ichat-server.vercel.app/";

export const socket = io(SOCKET_SERVER_URL, {
  transports: ['websocket']
});

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId='228117787593-jtl4s7s5mcsc5nnfplm1hqor3ioejfnm.apps.googleusercontent.com'>
      <DataContextProvider>
        <StrictMode>
          <App />
        </StrictMode>
        <Toaster />
      </DataContextProvider>
    </GoogleOAuthProvider>
  </Provider>
)
