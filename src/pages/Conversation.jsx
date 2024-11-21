import React, { useContext, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faPaperclip, faSmile, faReply, faEllipsisVertical, faXmark } from '@fortawesome/free-solid-svg-icons';
import InfoSingle from '../components/InfoSingle';
import { useParams } from 'react-router-dom';
import { iChatUsersApi, useGetUserInfoQuery, useGetUserQuery } from '../services/iChatUsersApi';
import { useGetConversationQuery } from '../services/iChatMessagesApi';
import moment from 'moment';
import { socket } from '../main'
import { useDispatch } from 'react-redux';
import { iChatMessagesApi } from '../services/iChatMessagesApi';
import { DataContext } from '../context/DataContext';
import ReactionsPopup from '../components/popups/ReactionsPopup';

const allReactionEmojis = [
    { id: 1, emoji: '👍' },
    { id: 1, emoji: '❤' },
    { id: 1, emoji: '😂' },
    { id: 1, emoji: '😮' },
    { id: 1, emoji: '😥' },
    { id: 1, emoji: '😡' },
]

const msgOptions = [
    { id: 1, opt: faSmile },
    { id: 2, opt: faReply },
    { id: 3, opt: faEllipsisVertical },
]

function Conversation() {
    const [msg, setMsg] = useState("");
    const [isInfo, setIsInfo] = useState(false);
    const [currMsg, setCurrMsg] = useState("");
    const [selMsgId, setSelMsgId] = useState("");
    const { userid } = useParams();
    const { data } = useGetUserInfoQuery(userid);
    const [repliedMsg, setRepliedMsg] = useState(null);
    const { data: loginUser } = useGetUserQuery();
    const { data: messages } = useGetConversationQuery(userid);
    const dispatch = useDispatch();
    const { setIsReactBox, isReactBox, onlineUsers } = useContext(DataContext);

    const scrollRef = useRef(null);
    const allReactRef = useRef(null);

    const roomId = [loginUser?.user?._id, userid].sort().join('_');

    const sendMessageInputHandler = async (e) => {
        if (e.key === 'Enter' && msg !== "") {
            socket.emit('sendMessage', {
                roomId,
                genc_id: crypto.randomUUID(),
                msg,
                sender: loginUser?.user?._id,
                receiver: userid,
                replyMsg: {
                    genc_id: repliedMsg?.genc_id,
                    msg: repliedMsg?.msg
                }
            })
            socket.emit('selectedUserId', { receiver: userid, sender: loginUser?.user?._id, roomId });
            setMsg('');
            setRepliedMsg(null);
        }
    }

    useEffect(() => {
        if (socket && roomId) {
            socket.emit('joinRoom', roomId);
        }
    }, [socket, roomId]);

    useEffect(() => {
        socket.on('sendFromServer', (data) => {
            if (data.sender === userid || data.receiver === userid) {
                dispatch(
                    iChatMessagesApi.util.updateQueryData('getConversation', userid, (draft) => {
                        draft.push(data);
                    })
                );
            }
        });

        return () => {
            socket.emit('joinRoom', roomId);
            socket.off('sendFromServer');
        };
    }, [roomId, userid, dispatch]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({});
        }
    }, [messages])

    const handleCreateReaction = (id, optId) => {
        if (optId === 1) {
            if (currMsg === "" && currMsg !== id) {
                setCurrMsg(id);
            } else if (currMsg !== "" && currMsg !== id) {
                setCurrMsg(id);
            } else {
                setCurrMsg("");
            }
        } else if (optId === 2) {
            const rmsg = messages.find((msg) => msg.genc_id === id);
            setRepliedMsg(rmsg);
        } else {
            alert(optId);
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

    const reactHandler = (emoji, genc_id) => {
        socket.emit('react', {
            roomId,
            userId: loginUser?.user?._id,
            genc_id,
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
                    const message = draft.find((msg) => msg.genc_id === data.genc_id);
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

        socket.on('removeReactServer', (data) => {
            dispatch(
                iChatMessagesApi.util.updateQueryData('getConversation', userid, (draft) => {
                    const message = draft.find((msg) => msg.genc_id === data.genc_id);
                    const afterRemoved = message.reactions.filter((react) => react.userId !== data.userId);
                    message.reactions = afterRemoved;
                })
            );
        });

        return () => {
            socket.off('reactFromServer');
            socket.off('removeReactServer');
        };
    }, [dispatch, userid, roomId]);

    const isOnline = onlineUsers.find((user) => user.userId === userid);

    useEffect(() => {
        socket.on('selectedUserIdServer', (data) => {
            dispatch(
                iChatUsersApi.util.updateQueryData('fetchConnectedPeoples', undefined, (draft) => {
                    const findCPR = draft?.connected_peoples?.find((cp) => cp._id === data.receiver);
                    const findCPS = draft?.connected_peoples?.find((cp) => cp._id === data.sender);
                    if (findCPR) {
                        findCPR.updatedAt = new Date().toISOString();
                    }
                    if (findCPS) {
                        findCPS.updatedAt = new Date().toISOString();
                    }
                })
            )
        })

        return () => {
            socket.off('selectedUserIdServer');
        };
    }, [dispatch, userid, roomId]);

    return (
        <div className='w-full flex h-screen'>
            <div className='h-screen' style={{ width: !isInfo ? 'calc(100% - 300px)' : '100%' }}>
                <div className='h-[65px] border-b border-zinc-800 flex px-3 items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <img className='w-9 h-9 rounded-full object-cover' src={data?.usr?.profile} alt="receiverprofile" />
                        <div className='flex flex-col'>
                            <p className='text-sm font-medium text-zinc-200'>{data?.usr?.name}</p>
                            <p className={`text-[13px] font-normal ${isOnline ? 'text-green-500' : 'text-zinc-400'}`}>
                                {
                                    isOnline ? 'online' : 'offline'
                                }
                            </p>
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
                                            <div className={`text-sm relative max-w-96 w-max px-3 py-2 ${item?.sender === loginUser?.user?._id ? 'rounded-l-md rounded-b-md bg-green-600' : 'rounded-r-md rounded-b-md bg-zinc-800'} text-zinc-200`} key={index}>
                                                {
                                                    item?.replyMsg?.msg && (
                                                        <div className={`w-44 mb-2 rounded-[4px] ${item?.sender === loginUser?.user?._id ? 'bg-green-800/90' : 'bg-zinc-700/70'} py-1 px-2`}>
                                                            <p>{item?.replyMsg?.msg?.length > 50 ? item?.replyMsg?.msg?.slice(0, 50) + '....' : item?.replyMsg?.msg}</p>
                                                        </div>
                                                    )
                                                }
                                                <p>{item?.msg}</p>
                                                {
                                                    item?.reactions?.length !== 0 && (
                                                        <p onClick={() => {
                                                            setIsReactBox(true)
                                                            setSelMsgId(item?.genc_id);
                                                        }} className={`bg-zinc-700 -mt-2 ${item?.sender === loginUser?.user?._id ? 'float-start' : 'float-end'} py-[1px] px-[5px] w-max rounded-full text-sm text-zinc-200 hover:cursor-pointer select-none mt-1`}>{`${item?.reactions?.map(rt => rt?.react)} ${item?.reactions?.length}`}</p>
                                                    )
                                                }
                                            </div>
                                        </div>
                                        <div className={`relative`}>
                                            <div className={`${currMsg !== "" && currMsg === item?.genc_id ? 'visible' : 'invisible'} ${item?.sender === loginUser?.user?._id && 'flex-row-reverse'} group-hover:visible flex items-center gap-2`}>
                                                {
                                                    msgOptions.map((opt) => {
                                                        return (
                                                            <div key={opt.id} onClick={() => handleCreateReaction(item?.genc_id, opt.id)} className={`h-7 w-7 grid place-content-center rounded-full hover:cursor-pointer hover:bg-zinc-800 cursor-pointer select-none`}>
                                                                <FontAwesomeIcon
                                                                    icon={opt.opt}
                                                                    className='text-lg text-zinc-500'
                                                                />
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                            {
                                                item?.genc_id === currMsg && (
                                                    <div ref={allReactRef} className={`flex absolute items-center -top-[3px] ${item?.sender === loginUser?.user?._id ? 'right-0 flex-row-reverse' : 'left-0'} bg-zinc-700 shadow-zinc-900 shadow-2xl w-max px-2 py-1 rounded-lg`}>
                                                        {
                                                            allReactionEmojis.map((react, index) => {
                                                                return (
                                                                    <div key={index} onClick={() => reactHandler(react.emoji, item?.genc_id)} className={`h-7 w-7 hover:bg-zinc-800 grid place-content-center cursor-pointer rounded-full ${react.emoji === item?.reactions?.find(item => item?.userId === loginUser?.user?._id)?.react && 'bg-zinc-800'}`}>
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
                <div className='relative'>
                    {
                        repliedMsg && (
                            <div className='w-full flex items-center justify-between px-3 py-1 bg-zinc-800 absolute -top-5 border-t border-b border-zinc-700'>
                                <div className='flex items-center gap-3'>
                                    <FontAwesomeIcon
                                        icon={faReply}
                                        className='text-sm text-zinc-500'
                                    />
                                    <p className='text-sm text-zinc-500'>{repliedMsg?.msg?.length >= 50 ? repliedMsg?.msg?.slice(0, 50) + ' .....' : repliedMsg?.msg}</p>
                                </div>
                                <FontAwesomeIcon
                                    icon={faXmark}
                                    onClick={() => {
                                        setRepliedMsg(null);
                                    }}
                                    className='text-sm font-normal text-zinc-500 hover:cursor-pointer'
                                />
                            </div>
                        )
                    }
                    <div className='h-[55px] px-3 border-t border-zinc-800 flex items-center gap-4'>
                        <FontAwesomeIcon
                            icon={faPaperclip}
                            className='text-md text-zinc-500 hover:cursor-pointer'
                        />
                        <input onChange={(e) => setMsg(e.target.value)} onKeyDown={sendMessageInputHandler} autoFocus={true} className='bg-transparent border-none outline-none placeholder:text-zinc-500 text-md caret-zinc-500 w-full text-zinc-200' type="text" placeholder='Type a message' value={msg} />
                        <p className='text-sm font-medium text-zinc-500 select-none'>enter</p>
                    </div>
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

            {isReactBox && <ReactionsPopup genc_id={selMsgId} />}
        </div>
    )
}

export default Conversation