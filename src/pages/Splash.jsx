import { faComments } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

function Splash() {
    return (
        <div className='w-full h-screen flex flex-col absolute top-0 justify-between py-10 items-center bg-zinc-900'>
            <div></div>
            <div className='flex justify-center items-center flex-col'>
                <div className='w-28 h-28 grid place-content-center bg-green-500/10 border border-green-500/10 rounded-full'>
                    <FontAwesomeIcon
                        icon={faComments}
                        className='text-[50px] text-green-500'
                    />
                </div>
                <p className='mt-3 text-zinc-200 text-lg font-bold'>iChat</p>
            </div>
            <div className='w-5 h-5 animate-spin rounded-full border-2 border-b-zinc-500 border-l-zinc-500 border-r-zinc-500 border-t-zinc-900'></div>
        </div>
    )
}

export default Splash
