import React, { useContext } from 'react'
import { DataContext } from '../../context/DataContext';

function LogoutSession() {
    const { setIsLogout } = useContext(DataContext);
    const handleClick = (e) => {
        if (e.target.classList.contains('parent')) {
            setIsLogout(false)
        }
    }
    const logoutHandler = () => {
        document.location = "/join";
        localStorage.removeItem('__utoken');
    }
    return (
        <div onClick={handleClick} className={`w-full h-screen absolute top-0 grid parent place-content-center bg-zinc-900/50`}>
            <div className='w-96 rounded-md bg-zinc-800 shadow-2xl'>
                <div className='bg-zinc-700 p-5 rounded-t-md'>
                    <p className='text-xl font-medium text-zinc-200'>Log out confirmation</p>
                    <p className='text-sm text-zinc-400 mt-3'>Are you sure you want to log out?</p>
                </div>
                <div className='p-5 flex items-center gap-3'>
                    <button onClick={logoutHandler} className='w-full bg-green-500 text-zinc-900 text-sm font-semibold py-[7px] rounded-md hover:bg-green-600 active:scale-95 transition-all active:bg-green-700'>Yes</button>
                    <button onClick={() => setIsLogout(false)} className='w-full bg-zinc-700 text-zinc-200 text-sm font-semibold py-[7px] rounded-md hover:bg-zinc-600 active:scale-95 transition-all active:bg-zinc-700'>No</button>
                </div>
            </div>
        </div>
    )
}

export default LogoutSession
