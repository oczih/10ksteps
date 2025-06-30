'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { useUser } from '@/app/context/UserContext';
import { motion } from 'motion/react';
import Link from 'next/link';
import { BsStars, BsMap, BsSpeedometer2, BsGraphUp, BsHeart, BsGeoAlt } from 'react-icons/bs';

export default function SubscribePage() {
    const { data: session, status } = useSession();
    const { user } = useUser();
    const router = useRouter();

    useEffect(() => {
        // If not logged in, redirect to home
        if (status === 'unauthenticated') {
            router.replace('/');
        }
        // If logged in and has access (either membership or hasAccess), redirect to map
        if (session?.user?.membership || session?.user?.hasAccess) {
            router.replace('/map');
        }
    }, [status, session, router]);

    // Show loading while checking auth status
    if (status === 'loading' || !session) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#181f2a] via-[#232b39] to-[#10141a]">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    const features = [
        {
            icon: <BsMap className="w-8 h-8" />,
            title: "AI-Powered Route Planning",
            description: "Get personalized walking routes suggested by AI based on your location and preferences"
        },
        {
            icon: <BsGeoAlt className="w-8 h-8" />,
            title: "GPS Route Tracking",
            description: "Track your walks in real-time with precise GPS mapping and route visualization"
        },
        {
            icon: <BsSpeedometer2 className="w-8 h-8" />,
            title: "Smart Analytics",
            description: "Monitor your pace, calories burned, distance, and step count with detailed analytics"
        },
        {
            icon: <BsGraphUp className="w-8 h-8" />,
            title: "Progress Tracking",
            description: "View your walking history, set goals, and track your progress over time"
        },
        {
            icon: <BsHeart className="w-8 h-8" />,
            title: "Health Insights",
            description: "Get personalized health insights and recommendations based on your activity"
        },
        {
            icon: <BsStars className="w-8 h-8" />,
            title: "Premium Features",
            description: "Access advanced features like route optimization, custom goals, and detailed reports"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#181f2a] via-[#232b39] to-[#10141a]">
            <Header user={user} setUser={() => {}} />
            
            <main className="pt-20 px-4">
                {/* Hero Section */}
                <section className="max-w-6xl mx-auto text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                            Unlock Your Full
                            <span className="text-yellow-400 block">Walking Potential</span>
                        </h1>
                        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                            You&apos;re already logged in! Upgrade to premium and start tracking your walks with AI-powered route planning, 
                            real-time GPS tracking, and detailed analytics.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link href="/checkout">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-4 rounded-xl text-lg font-bold transition-colors duration-200"
                                >
                                    Start Your Premium Journey
                                </motion.button>
                            </Link>
                            <button
                                onClick={() => router.back()}
                                className="text-gray-400 hover:text-white px-6 py-4 rounded-xl text-lg font-medium transition-colors duration-200"
                            >
                                Maybe Later
                            </button>
                        </div>
                    </motion.div>
                </section>

                {/* Features Grid */}
                <section className="max-w-6xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            What You&apos;ll Get with Premium
                        </h2>
                        <p className="text-gray-300 text-lg">
                            Everything you need to make every step count
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 * index }}
                                className="bg-[#232b39] bg-opacity-90 rounded-2xl p-6 border border-[#2d3748] hover:border-yellow-400 transition-colors duration-200"
                            >
                                <div className="text-yellow-400 mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-300">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="max-w-4xl mx-auto text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl p-8 md:p-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Ready to Transform Your Walking Experience?
                        </h2>
                        <p className="text-gray-800 text-lg mb-8">
                            Join thousands of users who are already achieving their fitness goals with 10K Steps
                        </p>
                        <Link href="/checkout">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-xl text-lg font-bold transition-colors duration-200"
                            >
                                Get Premium Access Now
                            </motion.button>
                        </Link>
                    </motion.div>
                </section>
            </main>
        </div>
    );
} 