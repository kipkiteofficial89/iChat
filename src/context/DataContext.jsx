import { createContext, useState } from "react";

export const DataContext = createContext();

export function DataContextProvider({ children }) {
    const [isOwnProfile, setIsOwnProfile] = useState(false);
    const [isLogout, setIsLogout] = useState(false);
    const [chatId, setChatId] = useState(null);
    const [loginUser, setLoginUser] = useState({
        id: '7dyg7fduydef',
        name: 'David Jackson',
        username: '@david_son',
        email: 'palshuvo13@gmail.com',
        about: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Est, non?',
        phone: '+8801738198296',
        profile: 'https://img.freepik.com/premium-photo/stylish-guy-city_1157-11376.jpg?w=74',
        created: '2024-11-07T13:22:52.215Z',
    })
    return (
        <DataContext.Provider value={{
            chatId, setChatId,
            loginUser, setLoginUser,
            isOwnProfile, setIsOwnProfile,
            isLogout, setIsLogout
        }}>
            {children}
        </DataContext.Provider>
    )
}