import { createContext, useState } from "react";

export const DataContext = createContext();

export function DataContextProvider({ children }) {
    const [isOwnProfile, setIsOwnProfile] = useState(false);
    const [isLogout, setIsLogout] = useState(false);
    const [chatId, setChatId] = useState(null);
    const [isReactBox, setIsReactBox] = useState(false);
    return (
        <DataContext.Provider value={{
            chatId, setChatId,
            isOwnProfile, setIsOwnProfile,
            isLogout, setIsLogout,
            isReactBox, setIsReactBox,
        }}>
            {children}
        </DataContext.Provider>
    )
}