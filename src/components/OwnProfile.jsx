import React, { useContext, useState, useEffect } from 'react'
import { DataContext } from '../context/DataContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { useGetUserQuery } from '../services/iChatApi';

function OwnProfile() {
    const [isVisible, setIsVisible] = useState(false);
    const { setIsOwnProfile, setIsLogout } = useContext(DataContext);
    const { data } = useGetUserQuery();
    const handleClick = (e) => {
        if (e.target.classList.contains('parent')) {
            setIsOwnProfile(false)
            setIsVisible(true)
        }
    }
    useEffect(() => {
        setIsVisible(true);
    }, []);

    const logoutHandler = () => {
        setIsLogout(true)
    }

    return (
        <div className={`w-full h-screen absolute top-0 parent slide-in duration-500 ${isVisible ? 'visible' : ''}`} onClick={handleClick}>
            <div className={`w-[350px] h-max bg-zinc-800 shadow-lg m-3 p-6 rounded-md shadow-zinc-950`}>
                <img className='w-24 h-24 rounded-full object-cover' src={data?.user?.profile} alt="" />
                <div className='flex justify-between items-center mt-4'>
                    <p className='text-lg font-medium text-zinc-200'>{data?.user?.name}</p>
                    <button className='h-6 w-6 flex justify-center hover:bg-zinc-700 items-center rounded-md active:bg-zinc-600'>
                        <FontAwesomeIcon
                            icon={faPen}
                            className='text-xs text-zinc-400'
                        />
                    </button>
                </div>
                <p className='text-sm text-zinc-400 mt-4'>About</p>
                <div className='flex justify-between items-center mt-2'>
                    <p className='text-sm text-zinc-200 w-64'>{data?.user?.about === '' ? 'Available for work.' : data?.user?.about}</p>
                    <button className='h-6 w-6 flex justify-center hover:bg-zinc-700 items-center rounded-md active:bg-zinc-600'>
                        <FontAwesomeIcon
                            icon={faPen}
                            className='text-xs text-zinc-400'
                        />
                    </button>
                </div>
                <p className='text-sm text-zinc-400 mt-4'>Email address</p>
                <p className='text-sm text-zinc-200 w-64 mt-2'>{data?.user?.email}</p>

                <div className='mt-4 pt-4 border-t border-zinc-700'>
                    <button onClick={logoutHandler} className='text-sm py-[6px] rounded-md w-28 hover:cursor-pointer hover:bg-zinc-600 bg-zinc-700 text-red-300'>Log out</button>
                </div>
            </div>
        </div>
    )
}

export default OwnProfile
