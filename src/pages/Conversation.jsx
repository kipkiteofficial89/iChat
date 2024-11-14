import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faPaperclip } from '@fortawesome/free-solid-svg-icons';
import InfoSingle from '../components/InfoSingle';
import { useParams } from 'react-router-dom';
import { useGetUserInfoQuery, useGetUserQuery } from '../services/iChatUsersApi';
import { useGetConversationQuery } from '../services/iChatMessagesApi';
import moment from 'moment';
import { socket } from '../main'
import { useDispatch } from 'react-redux';
import { iChatMessagesApi } from '../services/iChatMessagesApi';

const allReactionEmojis = [
    { id: 1, emoji: '👍' },
    { id: 1, emoji: '❤' },
    { id: 1, emoji: '😂' },
    { id: 1, emoji: '😮' },
    { id: 1, emoji: '😥' },
    { id: 1, emoji: '😡' },
]

function Conversation() {
    const [msg, setMsg] = useState("");
    const [isInfo, setIsInfo] = useState(false);
    const [currMsg, setCurrMsg] = useState("");
    const { userid } = useParams();
    const { data } = useGetUserInfoQuery(userid);
    const { data: loginUser } = useGetUserQuery();
    const { data: messages } = useGetConversationQuery(userid);
    const dispatch = useDispatch();

    const scrollRef = useRef(null);
    const allReactRef = useRef(null);

    const roomId = [loginUser?.user?._id, userid].sort().join('_');

    const sendMessageInputHandler = async (e) => {
        if (e.key === 'Enter' && msg !== "") {
            socket.emit('sendMessage', {
                roomId,
                msg,
                sender: loginUser?.user?._id,
                receiver: userid
            })
            setMsg('');
        }
    }

    useEffect(() => {
        socket.emit('joinRoom', roomId);

        socket.on('sendFromServer', (data) => {
            const message = {
                ...data,
                _id: crypto.randomUUID()
            }
            dispatch(
                iChatMessagesApi.util.updateQueryData('getConversation', userid, (draft) => {
                    draft.push(message);
                })
            )
        })

        return () => {
            socket.emit('joinRoom', roomId);
            socket.off('sendFromServer');
        };
    }, [roomId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({});
        }
    }, [messages])

    const handleCreateReaction = (id) => {
        if (currMsg === "" && currMsg !== id) {
            setCurrMsg(id);
        } else if (currMsg !== "" && currMsg !== id) {
            setCurrMsg(id);
        } else {
            setCurrMsg("");
        }
    }

    const handleClickOutside = (event) => {
        if (allReactRef.current && !allReactRef.current.contains(event.target)) {
            setCurrMsg("");
        }
    };

    useEffect(() => {
        if (currMsg !== "") {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [currMsg])

    const reactHandler = (emoji, msgId) => {
        socket.emit('react', {
            roomId,
            userId: loginUser?.user?._id,
            msgId,
            name: loginUser?.user?.name,
            profile: loginUser?.user?.profile,
            react: emoji,
        })
        setCurrMsg("");
    }

    useEffect(() => {
        socket.on('reactFromServer', (data) => {
            dispatch(
                iChatMessagesApi.util.updateQueryData('getConversation', userid, (draft) => {
                    const message = draft.find((msg) => msg._id === data.msgId);
                    if (message) {
                        const reactionIndex = message.reactions.findIndex((r) => r.userId === data.userId);
                        if (reactionIndex === -1) {
                            message.reactions.push(data);
                        } else {
                            message.reactions[reactionIndex].react = data.react;
                        }
                    }
                })
            );
        });

        return () => {
            socket.off('reactFromServer');
        };
    }, [dispatch, userid]);



    return (
        <div className='w-full flex h-screen'>
            <div className='h-screen' style={{ width: !isInfo ? 'calc(100% - 300px)' : '100%' }}>
                <div className='h-[65px] border-b border-zinc-800 flex px-3 items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <img className='w-9 h-9 rounded-full object-cover' src={data?.usr?.profile} alt="receiverprofile" />
                        <div className='flex flex-col'>
                            <p className='text-sm font-medium text-zinc-200'>{data?.usr?.name}</p>
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
                <div className='conversationbody p-6 overflow-y-scroll'>
                    {
                        messages?.map((item, index) => {
                            return (
                                <div key={index} className={`w-full flex ${item?.sender === loginUser?.user?._id ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`group w-max flex gap-2 items-center ${item?.sender === loginUser?.user?._id && 'flex-row-reverse'}`}>
                                        <div className={`mt-[2px] flex flex-col ${item?.sender === loginUser?.user?._id ? 'items-start' : 'items-end'}`}>
                                            <p className={`text-sm max-w-96 w-max px-3 py-2 ${item?.sender === loginUser?.user?._id ? 'rounded-l-md rounded-b-md bg-green-600' : 'rounded-r-md rounded-b-md bg-zinc-800'} text-zinc-200`} key={index}>{item?.msg}</p>
                                            {
                                                item?.reactions?.length !== 0 && (
                                                    <p className={`bg-zinc-900 -mt-2 ${item?.sender === loginUser?.user?._id ? 'ml-1' : 'mr-1'} py-[1px] px-[5px] border border-zinc-700 w-max rounded-full text-sm text-zinc-200 hover:cursor-pointer select-none`}>{`❤ ${item?.reactions?.length}`}</p>
                                                )
                                            }
                                        </div>
                                        <div className={`relative`}>
                                            <p onClick={() => handleCreateReaction(item?._id)} className={`h-7 w-7 ${currMsg !== "" && currMsg === item?._id ? 'visible' : 'invisible'} group-hover:visible grid place-content-center rounded-full hover:cursor-pointer hover:bg-zinc-800 cursor-pointer select-none`}>❤</p>
                                            {
                                                item?._id === currMsg && (
                                                    <div ref={allReactRef} className={`flex absolute items-center -top-[3px] ${item?.sender === loginUser?.user?._id ? '-left-48' : '-right-48'} bg-zinc-700 shadow-zinc-900 shadow-2xl w-max px-2 py-1 rounded-lg`}>
                                                        {
                                                            allReactionEmojis.map((react, index) => {
                                                                return (
                                                                    <div key={index} onClick={() => reactHandler(react.emoji, item?._id)} className='h-7 w-7 hover:bg-zinc-800 grid place-content-center cursor-pointer rounded-full'>
                                                                        <p className='text-md'>{react.emoji}</p>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                    <div ref={scrollRef}></div>
                </div>
                {/* Right conversation message section */}
                <div className='h-[55px] border-t border-zinc-800 px-3 flex items-center gap-4'>
                    <FontAwesomeIcon
                        icon={faPaperclip}
                        className='text-md text-zinc-500 hover:cursor-pointer'
                    />
                    <input onChange={(e) => setMsg(e.target.value)} onKeyDown={sendMessageInputHandler} autoFocus={true} className='bg-transparent border-none outline-none placeholder:text-zinc-500 text-md caret-zinc-500 w-full text-zinc-200' type="text" placeholder='Type a message' value={msg} />
                    <p className='text-sm font-medium text-zinc-500 select-none'>enter</p>
                </div>
            </div>
            <div className={`w-[300px] border-l border-zinc-800 overflow-y-scroll pb-3 ${isInfo && 'hidden'}`}>
                <div className='flex flex-col items-center justify-center pt-10'>
                    <img className='h-32 w-32 rounded-full object-cover' src={data?.usr?.profile} alt="" />
                    <p className='text-lg font-medium text-zinc-200 mt-3'>{data?.usr?.name}</p>
                    <p className='text-sm font-medium text-zinc-500 mt-1'>{'~' + data?.usr?.username}</p>
                </div>
                <InfoSingle title={'About'} data={data?.usr?.about} />
                <InfoSingle title={'Email'} data={data?.usr?.email} />
                <InfoSingle title={'Phone'} data={data?.usr?.phone ? data?.usr?.phone : 'Not verified'} />
                <InfoSingle title={'Joined on'} data={moment(data?.usr?.createAt).format('LL')} />
                <div className='mt-5 pt-3 border-t border-zinc-800 flex gap-3 mx-3'>
                    <button className='text-sm py-[6px] rounded-md w-full hover:cursor-pointer hover:bg-zinc-700 bg-zinc-800 text-zinc-200'>Block</button>
                    <button className='text-sm py-[6px] rounded-md w-full hover:cursor-pointer hover:bg-zinc-700 bg-zinc-800 text-red-300'>Report</button>
                </div>
            </div>
        </div>
    )
}

export default Conversation