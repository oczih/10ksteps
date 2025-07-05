'use client';

import { useSession } from 'next-auth/react';
import { Header } from '@/components/Header';
import { useEffect, useState } from 'react';
import { useUser } from '@/app/context/UserContext';
import { getUserRoutes } from '@/app/services/routeservice';
import { WalkRoute } from '@/types';
import { useRouter } from 'next/navigation';
import ChangePace from '@/components/ChangePace';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import userservice from '@/app/services/userservice';
import Input from '@mui/material/Input';
import { FaUser, FaDumbbell, FaRoute, FaCog } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';

export default function Settings() {
    const router = useRouter();
    const { user, setUser } = useUser();
    const { data: session} = useSession();
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState<number>(25);
    const [weight, setWeight] = useState<number>(70);
    const [pace, setPace] = useState<number>(5);
    const [activityLevel, setActivityLevel] = useState('');
    const [routes, setRoutes] = useState<WalkRoute[]>([]);
    const [height, setHeight] = useState<number>(170);
    const [isLoading, setIsLoading] = useState(true);
    const [gender, setGender] = useState<string>('male');
    const [username, setUsername] = useState<string>('');
    const [isUsernameChangeBlocked, setIsUsernameChangeBlocked] = useState(false);

    useEffect(() => {
        const fetchUser = async () => { 
            if (session?.user?.id) {
                try {
                    const fetchedUser = await userservice.get(session.user.id);
                    setName(fetchedUser.user.name || '');
                    setEmail(fetchedUser.user.email || '');
                    setAge(fetchedUser.user.age || 25);
                    setWeight(fetchedUser.user.weight || 70);
                    setHeight(fetchedUser.user.height || 170);
                    setPace(fetchedUser.user.pace || 5);
                    setActivityLevel(fetchedUser.user.activityLevel || '');
                    setGender(fetchedUser.user.gender || 'male');
                    setUsername(fetchedUser.user.username || '');
                } catch (error) {
                    console.error('Error fetching user:', error);
                    toast.error('Error fetching user');
                } finally {
                    setIsLoading(false);
                }
            }
        }
        fetchUser();
    }, [session?.user?.id]);

    useEffect(() => {
        if (session?.user?.isUsernameChangeBlocked) {
            setIsUsernameChangeBlocked(true);
        }
    }, [session?.user?.isUsernameChangeBlocked]);
    
    useEffect(() => {
        let lastChange = session?.user?.lastUsernameChange;
        if (lastChange && typeof lastChange === 'string') {
            lastChange = new Date(lastChange);
        }
        const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000; // ms
        const now = Date.now();
        if (lastChange && now - new Date(lastChange).getTime() < SEVEN_DAYS) {
            setIsUsernameChangeBlocked(true);
        } else {
            setIsUsernameChangeBlocked(false);
        }
    }, [session?.user?.id, session?.user?.lastUsernameChange]);

    useEffect(() => {
        const fetchRoutes = async () => {
            if (user) {
                const fetchedRoutes: WalkRoute[] = await getUserRoutes(user);
                setRoutes(fetchedRoutes);
            }
        };
        fetchRoutes();
    }, [user]);

    const stridelength = Math.round(height * (gender === 'male' ? 0.415 : 0.413));
    
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
            await userservice.update(session?.user?.id ?? '', {weight: value as number});
        } catch (error) {
            console.error('Error updating weight:', error);
        }
    };

    const handleActivityLevelChange = async(event: React.ChangeEvent<HTMLSelectElement>) => {
        setActivityLevel(event.target.value);
        try {
            await userservice.update(session?.user?.id ?? '', {activityLevel: event.target.value});
        } catch (error) {
            console.error('Error updating activity level:', error);
        }
    }

    const handleHeightChange = async(event: Event, value: number | number[]) => {
        setHeight(value as number);
        try {
            await userservice.update(session?.user?.id ?? '', {height: value as number});
        } catch(error) {
            console.error('Error updating height:', error);
        }
    };

    const handleAgeChange = async(event: Event, value: number | number[]) => {
        setAge(value as number);
        try {
            await userservice.update(session?.user?.id ?? '', {age: value as number});
        } catch(error) {
            console.error('Error updating age:', error);
        }
    };

    const handleWeightInputChange = async(event: React.ChangeEvent<HTMLInputElement>) => {
        const newWeight = event.target.value === '' ? 0 : Number(event.target.value);
        setWeight(newWeight);
        try {
            await userservice.update(session?.user?.id ?? '', {weight: newWeight});
        } catch (error) {
            console.error('Error updating weight:', error);
        }
    };

    const handleHeightInputChange = async(event: React.ChangeEvent<HTMLInputElement>) => {
        const newHeight = event.target.value === '' ? 0 : Number(event.target.value);
        setHeight(newHeight);
        try {
            await userservice.update(session?.user?.id ?? '', {height: newHeight});
        } catch (error) {
            console.error('Error updating height:', error);
        }
    };

    const handleAgeInputChange = async(event: React.ChangeEvent<HTMLInputElement>) => {
        const newAge = event.target.value === '' ? 0 : Number(event.target.value);
        setAge(newAge);
        try {
            await userservice.update(session?.user?.id ?? '', {age: newAge});
        } catch (error) {
            console.error('Error updating age:', error);
        }
    };

    const handleWeightBlur = () => {
        if (Number(weight) < 30) {
            setWeight(30);
        } else if (Number(weight) > 300) {
            setWeight(300);
        }
    };

    const handleHeightBlur = () => {
        if (Number(height) < 100) {
            setHeight(100);
        } else if (Number(height) > 250) {
            setHeight(250);
        }
    };

    const handleAgeBlur = () => {
        if (Number(age) < 13) {
            setAge(13);
        } else if (Number(age) > 120) {
            setAge(120);
        }
    };

    const handleUserNameChange = async(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isUsernameChangeBlocked) {
            toast.error('You can only change your username or password once every 7 days.');
            return;
        }
        try {
            await userservice.update(session?.user?.id ?? '', {username: username, lastUsernameChange: new Date()});
            toast.success('Username updated successfully');
        } catch (error) {
            console.error('Error updating username:', error);
            toast.error('Error updating username');
        }
    }

    if (!session?.user && !isLoading) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <Header user={user} setUser={setUser} />
                <div>
                    <p className="text-lg text-center">You must be logged in to view settings.</p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-base-200">
                <Header user={user} setUser={setUser} />
                <div className="flex items-center justify-center min-h-screen">
                    <div className="loading loading-spinner loading-lg"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200">
            <ToastContainer />
            <Header user={user} setUser={setUser} />
            
            <div className="container mx-auto px-4 py-4 sm:py-8">
                <div className="flex items-center justify-center mb-6 sm:mb-8">
                    <FaCog className="text-3xl sm:text-4xl text-primary mr-2 sm:mr-3" />
                    <h1 className="text-3xl sm:text-4xl font-bold text-base-content">Settings</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
                    {/* Personal Information Card */}
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body p-4 sm:p-6">
                            <div className="flex items-center mb-4 sm:mb-6">
                                <FaUser className="text-xl sm:text-2xl text-primary mr-2 sm:mr-3" />
                                <h2 className="card-title text-xl sm:text-2xl font-bold text-base-content">
                                    Personal Information
                                </h2>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="bg-base-200 p-3 sm:p-4 rounded-lg">
                                    <div className="text-sm text-base-content/70 mb-1">
                                        Name
                                    </div>
                                    <div className="text-base sm:text-lg font-semibold text-base-content">
                                        {name}
                                    </div>
                                </div>
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1">Username</label>
                                    {isUsernameChangeBlocked && (
                                        <div className="text-red-500 text-xs sm:text-sm mb-1">
                                            You can only change your username once every 7 days.
                                        </div>
                                    )}
                                    <form onSubmit={handleUserNameChange} className='flex flex-col sm:flex-row items-stretch sm:items-center gap-2'>
                                        <input
                                            disabled={isUsernameChangeBlocked}
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className='input input-bordered w-full bg-base-100 text-base-content text-sm sm:text-base'
                                        />
                                        <button
                                            type="submit"
                                            className='btn btn-primary text-sm sm:text-base px-4 py-2'
                                        >
                                            Save
                                        </button>
                                    </form>
                                </div>
                                
                                <div className="bg-base-200 p-3 sm:p-4 rounded-lg">
                                    <div className="text-sm text-base-content/70 mb-1">
                                        Email
                                    </div>
                                    <div className="text-base sm:text-lg font-semibold text-base-content">
                                        {email}
                                    </div>
                                </div>
                                
                                <div className="bg-base-200 p-3 sm:p-4 rounded-lg">
                                    <div className="text-sm text-base-content/70 mb-1">
                                        Activity Level
                                    </div>
                                    <select 
                                        className="select select-bordered w-full bg-base-100 text-base-content text-sm sm:text-base"
                                        value={activityLevel}
                                        onChange={handleActivityLevelChange}
                                    >
                                        <option value="sedentary">Sedentary</option>
                                        <option value="lightly">Lightly Active</option>
                                        <option value="moderately">Moderately Active</option>
                                        <option value="very">Very Active</option>
                                        <option value="extra">Extra Active</option>
                                    </select>
                                </div>
                                
                                <div className='bg-base-200 p-3 sm:p-4 rounded-lg'>
                                    <div className='text-sm text-base-content/70 mb-1'>
                                        Gender
                                    </div>
                                    <select 
                                        className="select select-bordered w-full bg-base-100 text-base-content text-sm sm:text-base"
                                        value={gender}
                                        onChange={async (e) => {
                                            const newGender = e.target.value;
                                            setGender(newGender);
                                            try {
                                                await userservice.update(session?.user?.id ?? '', {gender: newGender});
                                            } catch (error) {
                                                console.error('Error updating gender:', error);
                                            }
                                        }}
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Physical Metrics Card */}
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center mb-4 sm:mb-6">
                                <div className="flex items-center mb-2 sm:mb-0">
                                    <FaDumbbell className="text-xl sm:text-2xl text-primary mr-2 sm:mr-3" />
                                    <h2 className="card-title text-xl sm:text-2xl font-bold text-base-content">
                                        Physical Metrics
                                    </h2>
                                </div>
                                <div className='text-white text-sm sm:text-base ml-0 sm:ml-10'>
                                    Your current stride length is {stridelength} cm
                                </div>
                            </div>

                            {/* Age Slider */}
                            <Box sx={{ mb: 4 }}>
                                <div className="text-base sm:text-lg font-semibold text-white mb-2">
                                    Age: {age} years
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <Slider
                                        aria-label="Age"
                                        value={age}
                                        onChange={handleAgeChange}
                                        valueLabelDisplay="off"
                                        step={1}
                                        min={13}
                                        max={120}
                                        sx={{ 
                                            width: '100%',
                                            '& .MuiSlider-track': {
                                                backgroundColor: 'hsl(var(--p))',
                                            },
                                            '& .MuiSlider-thumb': {
                                                backgroundColor: 'hsl(var(--p))',
                                            },
                                            '& .MuiSlider-rail': {
                                                backgroundColor: 'hsl(var(--bc) / 0.2)',
                                            }
                                        }}
                                    />
                                    <Input
                                        value={age}
                                        size="small"
                                        onChange={handleAgeInputChange}
                                        onBlur={handleAgeBlur}
                                        sx={{ 
                                            width: '100%',
                                            maxWidth: '120px',
                                            '& .MuiInputBase-input': {
                                                textAlign: 'center',
                                                color: 'white',
                                                backgroundColor: 'hsl(var(--b2))',
                                                borderRadius: '0.5rem',
                                                border: '1px solid hsl(var(--bc) / 0.2)',
                                                fontSize: '0.875rem'
                                            }
                                        }}
                                        inputProps={{
                                            step: 1,
                                            min: 13,
                                            max: 120,
                                            type: 'number',
                                            'aria-labelledby': 'age-slider',
                                        }}
                                    />
                                </div>
                            </Box>

                            {/* Weight Slider */}
                            <Box sx={{ mb: 4 }}>
                                <div className="text-base sm:text-lg font-semibold text-white mb-2">
                                    Weight: {weight} kg
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <Slider
                                        aria-label="Weight"
                                        value={weight}
                                        onChange={handleWeightChange}
                                        valueLabelDisplay="off"
                                        step={1}
                                        min={30}
                                        max={300}
                                        sx={{ 
                                            width: '100%',
                                            '& .MuiSlider-track': {
                                                backgroundColor: 'hsl(var(--p))',
                                            },
                                            '& .MuiSlider-thumb': {
                                                backgroundColor: 'hsl(var(--p))',
                                            },
                                            '& .MuiSlider-rail': {
                                                backgroundColor: 'hsl(var(--bc) / 0.2)',
                                            }
                                        }}
                                    />
                                    <Input
                                        value={weight}
                                        size="small"
                                        onChange={handleWeightInputChange}
                                        onBlur={handleWeightBlur}
                                        sx={{ 
                                            width: '100%',
                                            maxWidth: '120px',
                                            '& .MuiInputBase-input': {
                                                textAlign: 'center',
                                                color: 'white',
                                                backgroundColor: 'hsl(var(--b2))',
                                                borderRadius: '0.5rem',
                                                border: '1px solid hsl(var(--bc) / 0.2)',
                                                fontSize: '0.875rem'
                                            }
                                        }}
                                        inputProps={{
                                            step: 1,
                                            min: 30,
                                            max: 300,
                                            type: 'number',
                                            'aria-labelledby': 'weight-slider',
                                        }}
                                    />
                                </div>
                            </Box>

                            {/* Height Slider */}
                            <Box sx={{ mb: 4 }}>
                                <div className="text-base sm:text-lg font-semibold text-white mb-2">
                                    Height: {height} cm
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <Slider
                                        aria-label="Height"
                                        value={height}
                                        onChange={handleHeightChange}
                                        valueLabelDisplay="off"
                                        step={1}
                                        min={100}
                                        max={250}
                                        sx={{ 
                                            width: '100%',
                                            '& .MuiSlider-track': {
                                                backgroundColor: 'hsl(var(--p))',
                                            },
                                            '& .MuiSlider-thumb': {
                                                backgroundColor: 'hsl(var(--p))',
                                            },
                                            '& .MuiSlider-rail': {
                                                backgroundColor: 'hsl(var(--bc) / 0.2)',
                                            }
                                        }}
                                    />
                                    <Input
                                        value={height}
                                        size="small"
                                        onChange={handleHeightInputChange}
                                        onBlur={handleHeightBlur}
                                        sx={{ 
                                            width: '100%',
                                            maxWidth: '120px',
                                            '& .MuiInputBase-input': {
                                                textAlign: 'center',
                                                color: 'white',
                                                backgroundColor: 'hsl(var(--b2))',
                                                borderRadius: '0.5rem',
                                                border: '1px solid hsl(var(--bc) / 0.2)',
                                                fontSize: '0.875rem'
                                            }
                                        }}
                                        inputProps={{
                                            step: 1,
                                            min: 100,
                                            max: 250,
                                            type: 'number',
                                            'aria-labelledby': 'height-slider',
                                        }}
                                    />
                                </div>
                            </Box>

                            {/* Pace Settings */}
                            <div className="mb-4">
                                <div className="text-base sm:text-lg font-semibold text-white mb-2">
                                    Walking Pace
                                </div>
                                <ChangePace 
                                    handleSliderChange={handleSliderChange} 
                                    handlePaceChange={handlePaceChange} 
                                    pace={pace} 
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Routes Card */}
                <div className="mt-6 sm:mt-8 max-w-6xl mx-auto">
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body p-4 sm:p-6">
                            <div className="flex items-center mb-4 sm:mb-6">
                                <FaRoute className="text-xl sm:text-2xl text-primary mr-2 sm:mr-3" />
                                <h2 className="card-title text-xl sm:text-2xl font-bold text-base-content">
                                    Your Routes
                                </h2>
                            </div>
                            
                            {routes.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-base-content/70 text-sm sm:text-base">No routes saved yet. Create your first route on the map!</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {routes.map((route) => (
                                        <div key={route.id} className="bg-base-200 p-3 sm:p-4 rounded-lg">
                                            <h3 className="font-semibold text-base-content text-sm sm:text-base mb-2">
                                                {route.routeName}
                                            </h3>
                                            <p className="text-base-content/70 text-xs sm:text-sm mb-2">
                                                {route.routeDescription}
                                            </p>
                                            <div className="text-xs sm:text-sm text-base-content/60 mb-3">
                                                <div>Distance: {(route.distance / 1000).toFixed(2)} km</div>
                                                <div>Duration: {Math.round(route.time)} min</div>
                                            </div>
                                            <button
                                                onClick={() => handleViewRoute(route)}
                                                className="btn btn-primary btn-sm w-full text-xs sm:text-sm"
                                            >
                                                View Route
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}