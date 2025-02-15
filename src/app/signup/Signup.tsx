"use client"
import React, { useCallback, useEffect, useState } from 'react'
import { isValidEmail, isValidPassword, isValiedUsername } from '@/validations/inputValidation';

function Signup() {
    const [user, setUser] = useState<WithEmail<User>>({email: '', username: '', password: ''});

    const [isInvalid, setIsInvalid] = useState({
        email: false,
        username: false,
        password: false
    });

    const onSignup = useCallback(async() => {

        const validEmail = isValidEmail(user.email);
        const validUsername = isValiedUsername(user.username);
        const validPassword = isValidPassword(user.password);

        if(!validEmail || !validUsername || !validPassword) {
            setIsInvalid(({email: !validEmail, username: !validUsername, password: !validPassword}));
            return;
        }
        const res = await fetch(`/api/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'applicaiton/json'
            },
            body: JSON.stringify(user)
        })
        if(res.status === 201) {
            window.location.href = '/';
        }
    }, [user]);

    useEffect(() => {
        if(isInvalid.email || isInvalid.username || isInvalid.password) {
            setTimeout(() => {
                setIsInvalid(({email: false, username: false, password: false}));
            }, 2000)
        }
    }, [isInvalid])
    return (
        <div className='w-screen h-screen fixed inset-0 flex flex-col justify-center items-center z-[1] bg-[#000]/90 select-none'>
            <div className='bg-white flex flex-col gap-y-4 rounded-md p-10 text-[#161616]'>
                <h1 className='w-full mx-auto text-xl text-center '>Signup</h1>
                <div className='flex gap-x-2'>
                    <span>Username</span>
                    <input className={`border ${isInvalid.username ? 'border-red-500' : ''}`} type='text' value={user.username} onChange={(e) => setUser(prev => ({...prev, username: e.target.value}))}/>
                </div>

                <div className='flex gqp-x-2'>
                    <span>Email</span>
                    <input className={`border ${isInvalid.email ? 'border-red-500' : ''}`}  type='email' value={user.email} onChange={(e) => setUser(prev => ({...prev, email: e.target.value}))}/>
                </div>

                <div className='flex gqp-x-2'>
                    <span>Password</span>
                    <input  className={`border ${isInvalid.password ? 'border-red-500' : ''}`} type='password' value={user.password} onChange={(e) => setUser(prev => ({...prev, password: e.target.value}))}/>
                </div>

                <button className='border p-2 w-fit text-center mx-auto' onClick={() => onSignup()}>Signup</button>
                <div className='underline cursor-pointer text-blue-500 text-center mx-auto ' onClick={() => window.location.href = '/login'}>Back to login</div>

            </div>
        </div>
    )
}

export default Signup