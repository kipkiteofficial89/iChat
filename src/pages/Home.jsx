import React, { useContext, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faCompass, faUser, faPlus } from '@fortawesome/free-solid-svg-icons'
import { peoples } from '../utils/utils';
import People from '../components/People';
import { Outlet, useLocation } from 'react-router-dom';
import DefaultConversation from '../components/DefaultConversation'
import OwnProfile from '../components/OwnProfile';
import { DataContext } from '../context/DataContext';
import Splash from './Splash';
import SessionPopup from '../components/popups/SessionPopup';
import LogoutSession from '../components/popups/LogoutSession';
import { useGetUserQuery } from '../services/iChatApi';

function Home() {
    const [isLoading, setIsLoading] = useState(true);
    const path = useLocation().pathname;
    const { isOwnProfile, setIsOwnProfile, isLogout } = useContext(DataContext);
    const { isError, refetch } = useGetUserQuery();

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 3000);
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

    return (
        <>
            <div className='w-full h-screen bg-zinc-900 flex'>
                <div className='w-[350px] h-screen border-r border-zinc-800'>
                    <div className='w-full h-[65px] flex items-center px-3 justify-between border-b border-zinc-800'>
                        <div className='relative'>
                            <input className='bg-zinc-800 text-sm py-[9px] pl-[34px] pr-3 w-[235px] rounded-full outline-none caret-zinc-500 text-zinc-200 placeholder:text-zinc-500 focus:outline-zinc-500 focus:outline-2' type="text" placeholder='Search' />
                            <FontAwesomeIcon
                                icon={faMagnifyingGlass}
                                className='absolute text-zinc-500 text-sm top-[12px] left-[13px]'
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
                        <div className='w-full h-full flex items-center justify-center flex-col'>
                            <p className='text-zinc-500 text-sm mt-4'>Connect people by searching at the top</p>
                        </div>
                        {/* {
                            peoples.map(({ id, name, profile, message }) => {
                                return (
                                    <People
                                        key={id}
                                        id={id}
                                        name={name}
                                        profile={profile}
                                        message={message}
                                    />
                                )
                            })
                        } */}
                    </div>
                </div>
                <div className='h-screen conversationsection'>
                    {
                        path.includes('conversation/') ? <Outlet /> : <DefaultConversation />
                    }
                </div>
            </div>

            {isOwnProfile && <OwnProfile />}
            {isLoading && <Splash />}
            {isError && <SessionPopup />}
            {isLogout && <LogoutSession />}
        </>
    )
}

export default Home