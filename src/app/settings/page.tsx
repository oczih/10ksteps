'use client';

import { useSession } from 'next-auth/react';
import { Header } from '@/components/Header';
import { useEffect, useState } from 'react';
import { useUser } from '@/app/context/UserContext';
import routeservice from '@/app/services/routeservice';
import { WalkRoute } from '@/types';
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
    const [routes, setRoutes] = useState<WalkRoute[]>([]);
    useEffect(() => {
        const fetchRoutes = async () => {
            const fetchedRoutes: WalkRoute[] = await routeservice.getUserRoutes();
            setRoutes(fetchedRoutes);
        };
        fetchRoutes();
    }, []);
    return (
        <div>
            <Header user={user} setUser={setUser} />
            <div className="min-h-screen bg-base-200 p-6">
                <h1 className='text-2xl font-bold text-center mt-10 mb-10'>Settings</h1>
                <div className='flex flex-col items-center justify-center'>
                    <h2 className='text-lg font-bold'>User Information</h2>
                    <div className='flex flex-col items-center justify-center'>
                        <p>Name: {name}</p>
                        <p>Email: {email}</p>
                        <p>Age: {age}</p>
                        <p>Weight: {weight}</p>
                    </div>
                    <div> 
                        <div>Your current routes:</div>
                        <div>
                            {routes.map((route) => (
                                console.log(route),
                                <div key={route.id}>
                                    <p>Name: {route.routeName}</p>
                                    <p>{route.steps} steps</p>

                                    <p>Distance: {route.distance} kilometers</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}