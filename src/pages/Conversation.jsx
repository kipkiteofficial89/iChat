import React, { useContext, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo, faPaperclip } from '@fortawesome/free-solid-svg-icons'
import InfoSingle from '../components/InfoSingle'
import { useParams } from 'react-router-dom'
import { peoples, messages } from '../utils/utils'
import { DataContext } from '../context/DataContext'

function Conversation() {
    const [isInfo, setIsInfo] = useState(false);
    const { userid } = useParams();
    let receiverInfo = peoples.find((user) => user.id === userid);
    const { loginUser } = useContext(DataContext);

    return (
        <div className='w-full flex h-screen'>
            <div className='h-screen' style={{ width: !isInfo ? 'calc(100% - 300px)' : '100%' }}>
                <div className='h-[65px] border-b border-zinc-800 flex px-3 items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <img className='w-9 h-9 rounded-full object-cover' src={receiverInfo?.profile} alt="receiverprofile" />
                        <div className='flex flex-col'>
                            <p className='text-sm font-medium text-zinc-200'>{receiverInfo?.name}</p>
                            <p className='text-xs text-zinc-400'>Online</p>
                        </div>
                    </div>
                    <button onClick={() => setIsInfo(val => !val)} className='bg-zinc-800 h-9 w-9 grid place-content-center rounded-full text-zinc-200 hover:cursor-pointer flex-shrink-0 hover:bg-zinc-700 active:scale-90 transition-all'>
                        <FontAwesomeIcon
                            icon={faCircleInfo}
                            className='text-sm'
                        />
                    </button>
                </div>
                {/* Right conversation body section */}
                <div className='conversationbody p-6 overflow-y-scroll bg-[url("/wbg.png")]'>
                    {
                        messages.map((item, index) => {
                            return (
                                <div className={`w-full flex ${item.sender === loginUser?.id ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`group w-max flex gap-2 items-center ${item.sender === loginUser?.id && 'flex-row-reverse'}`}>
                                        <div className={`mt-1 flex flex-col ${item.sender === loginUser?.id ? 'items-end' : 'items-start'}`}>
                                            <p className={`text-sm max-w-96 px-3 py-2 w-max mb-1 ${item.sender === loginUser?.id ? 'rounded-l-md rounded-b-md' : 'rounded-r-md rounded-b-md'} text-zinc-200 bg-zinc-800`} key={index}>{item.msg}</p>
                                            <p className={`bg-zinc-800/70 border border-zinc-700 -mt-3 px-1 py-[2px] w-max rounded-md text-xs text-zinc-200`}>😀 2</p>
                                        </div>
                                        <p className='invisible group-hover:visible delay-300 h-7 w-7 grid place-content-center rounded-full hover:cursor-pointer bg-zinc-800 select-none'>😀</p>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                {/* Right conversation message section */}
                <div className='h-[55px] border-t border-zinc-800 px-3 flex items-center gap-4'>
                    <FontAwesomeIcon
                        icon={faPaperclip}
                        className='text-md text-zinc-500 hover:cursor-pointer'
                    />
                    <input autoFocus={true} className='bg-transparent border-none outline-none placeholder:text-zinc-500 text-md caret-zinc-500 w-full text-zinc-200' type="text" placeholder='Type a message' />
                    <p className='text-sm font-medium text-zinc-500 select-none'>enter</p>
                </div>
            </div>
            <div className={`w-[300px] border-l border-zinc-800 overflow-y-scroll pb-3 ${isInfo && 'hidden'}`}>
                <div className='flex flex-col items-center justify-center pt-10'>
                    <img className='h-32 w-32 rounded-full object-cover' src={receiverInfo?.profile} alt="" />
                    <p className='text-lg font-medium text-zinc-200 mt-3'>{receiverInfo?.name}</p>
                    <p className='text-sm font-medium text-zinc-500 mt-1'>{'~' + receiverInfo?.username}</p>
                </div>
                <InfoSingle title={'About'} data={'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Est, non?'} />
                <InfoSingle title={'Email'} data={'palshuvo13@gmail.com'} />
                <InfoSingle title={'Phone'} data={'+8801738198296'} />
                <InfoSingle title={'Joined on'} data={'24 May 2024'} />
                <div className='mt-5 pt-3 border-t border-zinc-800 flex gap-3 mx-3'>
                    <button className='text-sm py-[6px] rounded-md w-full hover:cursor-pointer hover:bg-zinc-700 bg-zinc-800 text-zinc-200'>Block</button>
                    <button className='text-sm py-[6px] rounded-md w-full hover:cursor-pointer hover:bg-zinc-700 bg-zinc-800 text-red-300'>Report</button>
                </div>
            </div>
        </div>
    )
}

export default Conversation
