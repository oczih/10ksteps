'use client';

import { useSession } from 'next-auth/react';
import { Header } from '@/components/Header';
import { useEffect, useState } from 'react';
import { useUser } from '@/app/context/UserContext';
export default function Settings() {
    const { user, setUser } = useUser();
    const { data: session, status } = useSession();
    console.log(session?.user)
    const [name, setName] = useState(session?.user?.name || '');
    const [email, setEmail] = useState(session?.user?.email || '');
    const [age, setAge] = useState(session?.user?.age || '');
    const [weight, setWeight] = useState(session?.user?.weight || '');
    const [pace, setPace] = useState(session?.user?.pace || '');
    const [activityLevel, setActivityLevel] = useState(session?.user?.activityLevel || '');
    return (
        <div>
            <Header user={user} setUser={setUser} />
            <div>
                <h1 className='text-2xl font-bold'>Settings</h1>
                <div className='flex flex-col items-center justify-center'>
                    <h2 className='text-lg font-bold'>User Information</h2>
                    <div className='flex flex-col items-center justify-center'>
                        <p>Name: {name}</p>
                        <p>Email: {email}</p>
                        <p>Age: {age}</p>
                        <p>Weight: {weight}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}