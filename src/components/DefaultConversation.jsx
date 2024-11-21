import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComments } from '@fortawesome/free-solid-svg-icons'

function DefaultConversation() {
    return (
        <div className='h-full w-full flex flex-col justify-center items-center'>
            <FontAwesomeIcon
                icon={faComments}
                className='text-[60px] text-zinc-400'
            />
            <h3 className='text-2xl font-bold text-zinc-400 mt-6'>Start a Conversation</h3>
            <p className='text-sm w-[400px] text-center text-zinc-500 mt-2'>Select someone to start the conversation. This conversation will maintain the confirm security without accessing or entering someone else.</p>
            <div className='mt-5'>

            </div>
        </div>
    )
}

export default DefaultConversation
