import React from 'react'

function SessionPopup() {
    const logoutHandler = () => {
        document.location = '/join';
        localStorage.removeItem('__utoken');
    }
    return (
        <div className='w-full h-screen absolute top-0 grid place-content-center backdrop-blur-md'>
            <div className='w-96 h-max bg-zinc-800 rounded-md p-6 shadow-black'>
                <p className='text-md font-semibold text-zinc-200'>Session has been expired or token verification failed!</p>
                <button onClick={logoutHandler} className='text-sm font-semibold bg-green-500 text-zinc-900 rounded-full border-none outline-none float-end mt-5 py-2 px-5 hover:bg-green-600 active:scale-90 transition-all'>Login again</button>
            </div>
        </div>
    )
}

export default SessionPopup
