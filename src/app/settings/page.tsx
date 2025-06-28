'use client';

import { useSession } from 'next-auth/react';
import { Header } from '@/components/Header';
import { useEffect, useState } from 'react';
import { useUser } from '@/app/context/UserContext';
import routeservice from '@/app/services/routeservice';
import { WalkRoute } from '@/types';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ChangePace from '@/components/ChangePace';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import userservice from '@/app/services/userservice';
import Input from '@mui/material/Input';
import Grid from '@mui/material/Grid';
export default function Settings() {
    const router = useRouter();
    const { user, setUser } = useUser();
    const { data: session, status } = useSession();
    console.log(session?.user)
    const [name, setName] = useState(session?.user?.name || '');
    const [email, setEmail] = useState(session?.user?.email || '');
    const [age, setAge] = useState(session?.user?.age || '');
    const [weight, setWeight] = useState<number>(session?.user?.weight || 70);
    const [pace, setPace] = useState<number>(session?.user?.pace || 5);
    const [activityLevel, setActivityLevel] = useState(session?.user?.activityLevel || '');
    const [routes, setRoutes] = useState<WalkRoute[]>([]);
    const [height, setHeight] = useState<number>(session?.user?.height || 170);
    useEffect(() => {
        const fetchRoutes = async () => {
            const fetchedRoutes: WalkRoute[] = await routeservice.getUserRoutes();
            setRoutes(fetchedRoutes);
        };
        fetchRoutes();
    }, []);
    useEffect(() => {
        const fetchUser = async () => { 
            const fetchedUser = await userservice.get(session?.user?.id ?? '');
            console.log("Fetched user:",fetchedUser)
            setName(fetchedUser.user.name);
            setEmail(fetchedUser.user.email);
            setAge(fetchedUser.user.age);
            setWeight(fetchedUser.user.weight);
            setHeight(fetchedUser.user.height);
            setPace(fetchedUser.user.pace);
            setActivityLevel(fetchedUser.user.activityLevel);
        }
        fetchUser();
    }, [session?.user?.id]);
    const handleViewRoute = (route: WalkRoute) => {
        localStorage.setItem('selectedRoute', JSON.stringify(route));
        router.push('/map');
    };

    const handleSliderChange = (event: Event, value: number | number[]) => {
        setPace(value as number);
    };

    const handlePaceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPace(Number(e.target.value));
    };
    const handleWeightChange = async(event: Event, value: number | number[]) => {
        setWeight(value as number);
        try {
            const routereq = await userservice.update(session?.user?.id ?? '', {weight: value as number})
            console.log(routereq)
        } catch (error) {
            console.error('Error updating weight:', error);
        }
    }
    const handleHeightChange = async(event: Event, value: number | number[]) => {
        setHeight(value as number);
        try {
            const routereq = await userservice.update(session?.user?.id ?? '', {height: value as number})
            console.log(routereq)
        }catch(error){
            console.error('Error updating height:', error);
        }
    }
    const handleInputChange = async(event: React.ChangeEvent<HTMLInputElement>) => {
        const newWeight = event.target.value === '' ? 0 : Number(event.target.value);
        setWeight(newWeight);
        try {
            const routereq = await userservice.update(session?.user?.id ?? '', {weight: newWeight})
            console.log(routereq)
        } catch (error) {
            console.error('Error updating weight:', error);
        }
    };
    const handleBlur = () => {
        if (Number(weight) < 30) {
            setWeight(30);
        } else if (Number(weight) > 300) {
            setWeight(300);
        }
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
                        <p>Weight: {weight} kg</p>
                        <p>Pace: {pace} km/h</p>
                        <p>Activity Level: {activityLevel}</p>
                        <p>Height: {height} cm</p>
                        <div>
                        <ChangePace handleSliderChange={handleSliderChange} handlePaceChange={handlePaceChange} pace={pace} /></div>
                        <Box className="ml-10" sx={{ width: 300 }}>
                            <Typography id="input-slider" gutterBottom>
                                Weight: {weight} kg
                            </Typography>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <Slider
                                    aria-label="Weight"
                                    value={weight}
                                    onChange={handleWeightChange}
                                    valueLabelDisplay="off"
                                    step={0.1}
                                    min={30}
                                    max={300}
                                    sx={{ flex: 1 }}
                                />
                                <Input
                                    value={weight}
                                    size="small"
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    sx={{ 
                                        width: 80,
                                        color: 'white',
                                        '& .MuiInputBase-input': {
                                            color: 'white'
                                        }
                                    }}
                                    inputProps={{
                                        step: 10,
                                        min: 30,
                                        max: 300,
                                        type: 'number',
                                        'aria-labelledby': 'input-slider',
                                    }}
                                />
                            </div>
                        </Box>
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