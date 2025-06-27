'use client';

import { useSession } from 'next-auth/react';
import { Header } from '@/components/Header';
import { useEffect, useState } from 'react';
import { useUser } from '@/app/context/UserContext';
import routeservice from '@/app/services/routeservice';
import { WalkRoute } from '@/types';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Settings() {
    const router = useRouter();
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

    const handleViewRoute = (route: WalkRoute) => {
        localStorage.setItem('selectedRoute', JSON.stringify(route));
        router.push('/map');
    };

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
                    <div className="mt-8 w-full max-w-2xl"> 
                        <h3 className="text-lg font-bold mb-4">Your Routes:</h3>
                        <div className="space-y-4">
                            {routes.map((route) => (
                                <div key={route.id} className="card bg-base-100 shadow-xl">
                                    <div className="card-body">
                                        <h4 className="card-title">{route.routeName}</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            <p>Steps: {route.steps}</p>
                                            <p>Distance: {route.distance} kilometers</p>
                                            <p>Time: {route.time} minutes</p>
                                            <p>Calories: {route.calories}</p>
                                        </div>
                                        <div className="card-actions justify-end mt-4">
                                            <button 
                                                className="btn btn-primary"
                                                onClick={() => handleViewRoute(route)}
                                            >
                                                View Route
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}