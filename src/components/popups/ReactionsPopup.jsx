import React, { useContext, useEffect, useState } from 'react'
import { DataContext } from '../../context/DataContext';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { socket } from '../../main';
import { useGetUserQuery } from '../../services/iChatUsersApi';
import { iChatMessagesApi } from '../../services/iChatMessagesApi';

const ReactPeople = ({ name, profile, react, userId, genc_id }) => {
    const { userid } = useParams();
    const dispatch = useDispatch();
    const { data: loginUser } = useGetUserQuery();
    const roomId = [loginUser?.user?._id, userid].sort().join('_');
    const { setIsReactBox } = useContext(DataContext);

    const removeReaction = () => {
        socket.emit('removeReact', {
            userId,
            genc_id,
            roomId
        })
    }

    useEffect(() => {
        socket.on('removeReactServer', (data) => {
            dispatch(
                iChatMessagesApi.util.updateQueryData('getConversation', userid, (draft) => {
                    const message = draft.find((msg) => msg.genc_id === data.genc_id);
                    if (message) {
                        const reactionIndex = message.reactions.findIndex((r) => r.userId === data.userId);
                        message.reactions.splice(reactionIndex, 1);
                        setIsReactBox(false);
                    }
                })
            )
        })
    }, []);

    return (
        <div className='flex items-center justify-between hover:cursor-pointer'>
            <div className='flex items-center gap-3'>
                <img className='w-10 h-10 rounded-full object-cover' src={profile} alt="" />
                <div className='flex flex-col text-zinc-200'>
                    <p className='text-md font-medium'>{name}</p>
                    {userId !== userid && <p onClick={removeReaction} className='text-xs text-zinc-400'>Click to remove</p>}
                </div>
            </div>
            <p className='text-2xl'>{react}</p>
        </div>
    )
}

const ReactedPeople = ({ items }) => {
    return (
        items.map((item, index) => {
            return (
                <ReactPeople
                    key={index}
                    name={item?.name}
                    profile={item?.profile}
                    react={item?.react}
                    userId={item?.userId}
                    genc_id={item?.genc_id}
                />
            )
        })
    )
}

function ReactionsPopup() {
    const [activeTab, setActiveTab] = useState("All");
    const { setIsReactBox, reactions } = useContext(DataContext);
    const handleClick = (e) => {
        if (e.target.classList.contains('parent')) {
            setIsReactBox(false);
        }
    }

    const liked = reactions.filter((item) => item?.react === '👍');
    const loved = reactions.filter((item) => item?.react === '❤');
    const smiled = reactions.filter((item) => item?.react === '😂');
    const surprised = reactions.filter((item) => item?.react === '😮');
    const carried = reactions.filter((item) => item?.react === '😥');
    const angried = reactions.filter((item) => item?.react === '😡');

    const options = [
        { id: 1, title: 'All', num: reactions.length },
        { id: 2, title: '👍', num: liked.length },
        { id: 3, title: '❤', num: loved.length },
        { id: 4, title: '😂', num: smiled.length },
        { id: 5, title: '😮', num: surprised.length },
        { id: 6, title: '😥', num: carried.length },
        { id: 7, title: '😡', num: angried.length },
    ]

    return (
        <div onClick={handleClick} className={`w-full h-screen absolute top-0 grid parent place-content-center bg-zinc-900/50`}>
            <div className='w-[500px] rounded-md bg-zinc-800 shadow-2xl'>
                <div className='flex items-center justify-between p-4 border-b border-zinc-700'>
                    <div></div>
                    <p className='text-xl font-medium text-zinc-200'>Message reactions</p>
                    <button onClick={() => setIsReactBox(false)} className='bg-zinc-700 h-9 w-9 grid place-content-center rounded-full text-zinc-200 hover:cursor-pointer flex-shrink-0 hover:bg-zinc-600 active:scale-90 transition-all'>
                        <FontAwesomeIcon
                            icon={faXmark}
                            className='text-lg'
                        />
                    </button>
                </div>
                <div className='flex item-center gap-1 p-4'>
                    {
                        options.map((item, index) => {
                            return (
                                <div className={`select-none ${item.num === 0 ? 'hidden' : ''}`} key={index} onClick={() => setActiveTab(item.title)}>
                                    <p className={`text-md hover:cursor-pointer hover:bg-zinc-700 rounded-md p-3 active:bg-zinc-600 font-medium ${activeTab === item.title ? 'text-green-500' : 'text-zinc-400'}`}>{`${item.title} ${item.num}`}</p>
                                    <div className={`w-full h-[3px] rounded-3xl ${activeTab === item.title ? 'bg-green-500' : 'bg-zinc-800 mt-1'}`}></div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className='px-6 flex flex-col gap-5 min-h-32 max-h-96 overflow-y-scroll pb-4'>
                    {activeTab === "All" && <ReactedPeople items={reactions} />}
                    {activeTab === "👍" && <ReactedPeople items={liked} />}
                    {activeTab === "❤" && <ReactedPeople items={loved} />}
                    {activeTab === "😂" && <ReactedPeople items={smiled} />}
                    {activeTab === "😮" && <ReactedPeople items={surprised} />}
                    {activeTab === "😥" && <ReactedPeople items={carried} />}
                    {activeTab === "😡" && <ReactedPeople items={angried} />}
                </div>
            </div>
        </div>
    )
}

export default ReactionsPopup;