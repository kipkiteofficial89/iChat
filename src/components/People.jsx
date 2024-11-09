import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function People({ id, profile, name, message }) {
    const { userid } = useParams();
    const navigate = useNavigate();

    const clickHandler = async () => {
        navigate(`conversation/${id}`);
    }

    return (
        <div onClick={clickHandler} className={`w-full px-3 flex items-center justify-between py-[10px] hover:bg-zinc-800 ${id === userid && 'bg-zinc-800'} hover:cursor-pointer active:bg-zinc-700 transition-all`}>
            <div className='flex items-center gap-3'>
                <img src={profile} className='w-10 h-10 object-cover flex-shrink-0 rounded-full' alt="profilepic" />
                <div className='flex flex-col gap-1'>
                    <p className='text-sm font-medium text-zinc-200'>{name}</p>
                    <p className='text-sm text-zinc-400'>{message.slice(0, 20) + "..."}</p>
                </div>
            </div>
            <p className='px-[6px] py-[1px] text-xs bg-green-500 rounded-full text-center font-bold'>{2}</p>
        </div>
    )
}

export default People
