import React, { useEffect, useState } from 'react'
import { faComments } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useGoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { useJoinUserMutation } from '../services/iChatUsersApi';

function Join() {
    const [isLoading, setIsLoading] = useState(false);
    const [joinUser] = useJoinUserMutation();
    const join = useGoogleLogin({
        onSuccess: (token) => {
            setIsLoading(true);
            fetchData(token.access_token);
        },
        onError: () => {
            console.log('Login failed!');
        },
        flow: 'implicit'
    })
    const fetchData = async (access_token) => {
        try {
            const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            });

            const json = await res.json();
            const user = {
                name: json?.name,
                username: json?.family_name.toLowerCase() + json?.id.slice(-2),
                email: json?.email,
                phone: '',
                about: 'Available for work.',
                profile: json?.picture
            }
            const result = await joinUser(user).unwrap();
            toast.success(result?.msg, {
                style: {
                    background: "#27272a",
                    color: "#e4e4e7",
                    fontSize: "14px",
                    padding: "15px 20px",
                    border: "1px solid #3f3f46",
                },
            });
            setIsLoading(false);
            localStorage.setItem('__utoken', result?.token);
            setTimeout(() => {
                document.location = '/';
            }, 2000)
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if (localStorage.getItem("__utoken")) {
            document.location = '/';
        }
    }, []);

    return (
        <div className='w-full h-screen flex flex-col justify-center items-center bg-zinc-900'>
            <FontAwesomeIcon
                icon={faComments}
                className='text-[60px] text-green-500'
            />
            <p className='text-xl font-bold mt-8 text-zinc-200'>JOIN ON iChat TODAY</p>
            <p className='w-96 text-center text-sm text-zinc-500 mt-2'>The most secure and powerfull tool for one way communication ever.</p>
            <div className='mt-5 pt-5 border-t w-96 flex justify-center border-zinc-800'>
                <button onClick={join} className='w-80 py-[10px] bg-zinc-800 rounded-md flex justify-center items-center gap-3 active:bg-zinc-700 transition-all active:scale-95'>
                    <img className='h-5' src="google.png" alt="googlephoto" />
                    <p className='text-sm text-zinc-200'>Join with google</p>
                </button>
            </div>
            {
                isLoading && (
                    <div className='w-5 h-5 animate-spin rounded-full border-2 border-b-zinc-500 border-l-zinc-500 border-r-zinc-500 border-t-zinc-900 mt-5'></div>
                )
            }
        </div>
    )
}

export default Join
