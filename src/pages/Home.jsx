import React, { useContext, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faCompass, faUser, faXmark } from '@fortawesome/free-solid-svg-icons'
import People from '../components/People';
import { Outlet, useLocation } from 'react-router-dom';
import DefaultConversation from '../components/DefaultConversation'
import OwnProfile from '../components/OwnProfile';
import { DataContext } from '../context/DataContext';
import Splash from './Splash';
import SessionPopup from '../components/popups/SessionPopup';
import LogoutSession from '../components/popups/LogoutSession';
import { useFetchConnectedPeoplesQuery, useGetUserQuery, useSearchPeopleQuery } from '../services/iChatUsersApi';
import { socket } from '../main';

function Home() {
    const [isLoading, setIsLoading] = useState(true);
    const [searchInput, setSearchInput] = useState("");
    const [debounce, setDebounce] = useState(searchInput);
    const path = useLocation().pathname;
    const { isOwnProfile, setIsOwnProfile, isLogout, setOnlineUsers } = useContext(DataContext);
    const { isError, refetch } = useGetUserQuery();
    const { data, isFetching } = useSearchPeopleQuery(searchInput, { skip: !debounce });
    const { data: cp } = useFetchConnectedPeoplesQuery();
    const { data: loginUser } = useGetUserQuery();

    const searchInputHandler = (e) => {
        const value = e.target.value;
        setSearchInput(value);
    }

    useEffect(() => {
        const callingTimeHandler = setTimeout(() => {
            setDebounce(searchInput);
        }, 400);

        return () => clearTimeout(callingTimeHandler);
    }, [searchInput])

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, [])

    useEffect(() => {
        window.addEventListener('storage', () => {
            refetch();
        })
    }, [localStorage.getItem("__utoken")])

    useEffect(() => {
        if (!localStorage.getItem("__utoken")) {
            document.location = '/join';
        }
    }, []);

    useEffect(() => {
        socket.emit('onlineUser', loginUser?.user?._id);
        socket.on('onlineUserServer', (data) => {
            setOnlineUsers(data);
        })
    }, [loginUser]);

    return (
        <>
            <div className='w-full h-screen bg-zinc-900 flex'>
                <div className='w-[350px] h-screen border-r border-zinc-800'>
                    <div className='w-full h-[65px] flex items-center px-3 justify-between border-b border-zinc-800'>
                        <div className='relative'>
                            <input onChange={searchInputHandler} className='bg-zinc-800 text-sm py-[9px] pl-[34px] pr-3 w-[235px] rounded-full outline-none caret-zinc-500 text-zinc-200 placeholder:text-zinc-500 focus:outline-zinc-500 focus:outline-2' type="text" placeholder='Search' value={searchInput} />
                            <FontAwesomeIcon
                                icon={faMagnifyingGlass}
                                className='absolute text-zinc-500 text-sm top-[12px] left-[13px]'
                            />
                            <FontAwesomeIcon
                                icon={faXmark}
                                className={`absolute text-zinc-500 text-md top-[11px] hover:cursor-pointer right-[13px] ${searchInput ? 'visible' : 'hidden'}`}
                                onClick={() => setSearchInput("")}
                            />
                        </div>
                        <div className='flex items-center gap-2'>
                            <button className='bg-zinc-800 h-9 w-9 grid place-content-center rounded-full text-zinc-200 hover:cursor-pointer flex-shrink-0 hover:bg-zinc-700 active:scale-90 transition-all'>
                                <FontAwesomeIcon
                                    icon={faCompass}
                                    className='text-md'
                                />
                            </button>
                            <button onClick={() => setIsOwnProfile(true)} className='bg-zinc-800 h-9 w-9 grid place-content-center rounded-full text-zinc-200 hover:cursor-pointer flex-shrink-0 hover:bg-zinc-700 active:scale-90 transition-all'>
                                <FontAwesomeIcon
                                    icon={faUser}
                                    className='text-sm'
                                />
                            </button>
                        </div>
                    </div>
                    <div className='flex flex-col overflow-y-scroll chatpeople'>
                        {
                            searchInput !== "" ? (
                                isFetching ? (
                                    <div className='w-full h-full flex items-center justify-center flex-col'>
                                        <div className='w-5 h-5 animate-spin rounded-full border-2 border-b-zinc-500 border-l-zinc-500 border-r-zinc-500 border-t-zinc-900 mt-5'></div>
                                    </div>
                                ) : (
                                    !data?.connected_peoples?.length ? (
                                        <div className='w-full h-full flex items-center justify-center flex-col'>
                                            <p className='text-zinc-500 text-sm mt-4'>No result found.</p>
                                        </div>
                                    ) : (
                                        data?.connected_peoples?.map(({ _id, name, profile }) => {
                                            return (
                                                <People
                                                    key={_id}
                                                    id={_id}
                                                    name={name}
                                                    profile={profile}
                                                    message={""}
                                                    newMessagesCount={0}
                                                />
                                            )
                                        })
                                    )
                                )
                            ) : (
                                !cp?.connected_peoples?.length ? (
                                    <div className='w-full h-full flex items-center justify-center flex-col'>
                                        <p className='text-zinc-500 text-sm mt-4'>Connect people by searching at the top.</p>
                                    </div>
                                ) : (
                                    cp?.connected_peoples?.slice()
                                        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
                                        ?.map(({ _id, name, profile }) => {
                                            return (
                                                <People
                                                    key={_id}
                                                    id={_id}
                                                    name={name}
                                                    profile={profile}
                                                    message={""}
                                                    newMessagesCount={0}
                                                />
                                            )
                                        })
                                )
                            )
                        }
                    </div>
                </div>
                <div className='h-screen conversationsection'>
                    {
                        path.includes('conversation/') ? <Outlet /> : <DefaultConversation />
                    }
                </div>
            </div>

            {isOwnProfile && <OwnProfile />}
            {/* {isLoading && <Splash />} */}
            {isError && <SessionPopup />}
            {isLogout && <LogoutSession />}

        </>
    )
}

export default Home