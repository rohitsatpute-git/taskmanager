"use client"
import React, {  useCallback, useEffect, useState } from 'react'

function Login() {
    const [user, setUser] = useState<User>({ username: '', password: ''});
    const [invalidInput, setInvalidInput] = useState(false);

    const onLogin = useCallback(async() => {

        const res = await fetch(`/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'applicaiton/json'
            },
            body: JSON.stringify(user),
            credentials: "include", // 👈 Required to send & receive cookies
        })
        console.log("response", res)
        if(res.status === 200) {
            window.location.href = '/';
        }else{
            setInvalidInput(true);
        }
    }, [user])

    useEffect(() => {
        if(invalidInput ) {
            setTimeout(() => {
                setInvalidInput(false);
            }, 2000)
        }
    }, [invalidInput])
    return (
        <div className='w-screen h-screen fixed inset-0 flex flex-col justify-center items-center z-[1] bg-[#000]/90 select-none'>
            <div className='bg-white flex flex-col gap-y-4 rounded-md p-10 text-[#161616]'>
                <h1 className='w-full mx-auto text-xl text-center '>Login</h1>
                <div className='flex gap-x-2'>
                    <span>Username</span>
                    <input className={`border ${invalidInput && 'border-red-500'} transition-all ease-in`} type='text' value={user.username} onChange={(e) => setUser(prev => ({...prev, username: e.target.value}))}/>
                </div>

                <div className='flex gqp-x-2'>
                    <span>Password</span>
                    <input  className={`border ${invalidInput && 'border-red-500'} transition-all ease-in`} type='password' value={user.password} onChange={(e) => setUser(prev => ({...prev, password: e.target.value}))}/>
                </div>

                <button className='border p-2 w-fit text-center mx-auto' onClick={() => onLogin()}>Login</button>
                <div className='underline cursor-pointer text-blue-500 text-center mx-auto ' onClick={() => window.location.href = '/signup'}>New here</div>

            </div>
        </div>
    )
}

export default Login