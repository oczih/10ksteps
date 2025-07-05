'use client';

import { Header } from "@/components/Header";
import { UserProvider } from "@/app/context/UserContext";
import { Toaster } from 'react-hot-toast';
import { motion } from "motion/react"
import Link from "next/link";
import { useState, useEffect } from "react";
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
export default function Page() {
  return (
    <UserProvider>
      <App />
    </UserProvider>
  );
}

import { useUser } from "@/app/context/UserContext";

function App() {
  const { user, setUser } = useUser();
  const { data: session } = useSession();
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading && session?.user) {
      if (session.user.hasAccess) {
        router.replace('/map');
      } else {
        router.replace('/subscribe');
      }
    }
  }, [session, isLoading, router]);


  useEffect(() => {
    if (
      user && (
        user.height === 0 ||
        user.weight === 0 ||
        user.age === undefined || user.age === null
      )
    ) {
      const seen = localStorage.getItem('seen-missing-info-modal');
      if (!seen) {
        setShowModal(true);
        localStorage.setItem('seen-missing-info-modal', 'true');
      }
    }
  }, [user]);

  if (user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#181f2a] via-[#232b39] to-[#10141a]">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#181f2a] via-[#232b39] to-[#10141a] relative overflow-hidden">
      <Header user={user} setUser={setUser} />
      <Toaster position="top-right" reverseOrder={false} />
      <Dialog open={showModal} onClose={() => setShowModal(false)} className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="fixed inset-0 bg-black bg-opacity-60" aria-hidden="true" />
        <DialogPanel className="bg-[#232b39] rounded-2xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center gap-4 border border-[#2d3748]">
          <DialogTitle as="h2" className="text-xl font-bold text-yellow-400 text-center">Complete your profile</DialogTitle>
          <p className="text-white text-center">You haven&apos;t added your height, weight, or age yet. This info is needed for accurate tracking.</p>
          <Link href="/settings" className="text-sky-400 hover:text-sky-300 font-bold underline">Go to Settings</Link>
          <button onClick={() => setShowModal(false)} className="mt-2 px-4 py-2 rounded bg-yellow-400 text-gray-900 font-bold hover:bg-yellow-500">Dismiss</button>
        </DialogPanel>
      </Dialog>
      <main className="z-10 flex flex-col gap-6 items-center mx-auto mb-3 justify-center align-middle mt-24">
        <h3 className="text-5xl md:text-6xl font-extrabold text-center leading-tight relative text-white">
          Walk around with a goal
        </h3>
        <p className="text-4xl md:text-5xl font-extrabold text-white text-center relative">
          <span className="highlighted-text text-white">10K Steps</span>
        </p>
        <p className="text-lg md:text-xl text-gray-300 text-center max-w-xl mt-2">
          Track your daily walks, set goals, and explore new routes. Make every step count!
        </p>
        <Link href="/login">
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            className="bg-yellow-400 shadow-lg hover:bg-yellow-500 transition text-gray-900 px-8 py-3 rounded-xl text-lg font-bold mt-4 focus:outline-none focus:ring-4 focus:ring-yellow-300"
          >
            Get your steps in
          </motion.button>
        </Link>
      </main>
      <section className="z-10 flex flex-col md:flex-row items-center justify-center w-full mt-6 gap-6">
        <div className="bg-[#232b39] bg-opacity-90 rounded-2xl shadow-xl p-6 max-w-md w-full flex flex-col gap-4 border border-[#2d3748]">
          <h4 className="text-2xl font-bold text-green-400 text-center mb-2 flex items-center justify-center gap-2">
            <span className="font-bold text-3xl">+</span> Why use 10K Steps?
          </h4>
          <ul className="flex flex-col gap-2">
            <li className="flex items-center gap-3 text-green-400 text-lg">
              <span className="font-bold text-2xl">+</span>
              <span className="text-white">Motivates you to walk more and reach your daily goals</span>
            </li>
            <li className="flex items-center gap-3 text-green-400 text-lg">
              <span className="font-bold text-2xl">+</span>
              <span className="text-white">Track your routes and progress visually on a map</span>
            </li>
          </ul>
        </div>
        <div className="bg-[#232b39] bg-opacity-90 rounded-2xl shadow-xl p-6 max-w-md w-full flex flex-col gap-4 border border-[#2d3748]">
          <h4 className="text-2xl font-bold text-red-400 text-center mb-2 flex items-center justify-center gap-2">
            <span className="font-bold text-3xl">-</span> Potential Downsides
          </h4>
          <ul className="flex flex-col gap-2">
            <li className="flex items-center gap-3 text-red-400 text-lg">
              <span className="font-bold text-2xl">-</span>
              <span className="text-white">May increase your step count obsession!</span>
            </li>
            <li className="flex items-center gap-3 text-red-400 text-lg">
              <span className="font-bold text-2xl">-</span>
              <span className="text-white">Can lead to unhealthy competition or comparison with others</span>
            </li>
            <li className="flex items-center gap-3 text-red-400 text-lg">
              <span className="font-bold text-2xl">-</span>
              <span className="text-white">May cause you to focus on quantity over quality of movement</span>
            </li>
            <li className="flex items-center gap-3 text-red-400 text-lg">
              <span className="font-bold text-2xl">-</span>
              <span className="text-white">Battery drain from GPS tracking</span>
            </li>
            <li className="flex items-center gap-3 text-red-400 text-lg">
              <span className="font-bold text-2xl">-</span>
              <span className="text-white">Privacy concerns with location data</span>
            </li>
          </ul>
        </div>
      </section>
      <div className="z-10 flex flex-col items-center justify-center w-full mt-4">
        <div className="bg-[#232b39] bg-opacity-90 rounded-2xl shadow-xl p-6 max-w-md w-full flex flex-col gap-4 border border-[#ffd700]">
          <h4 className="text-2xl font-bold text-yellow-300 text-center mb-2 flex items-center justify-center gap-2">
            <span className="font-bold text-3xl">🤖</span> AI-Powered Suggestions
          </h4>
          <p className="text-white text-center">Set custom goals and get personalized route and activity suggestions powered by AI.</p>
        </div>
      </div>
      <style jsx>{`
        .highlighted-text {
          position: relative;
          display: inline-block;
        }
        .highlighted-text::before {
          content: '';
          position: absolute;
          left: 0; right: 0; bottom: 0.1em; height: 0.6em;
          background: linear-gradient(90deg, #ff6666 60%, #ff0000 100%);
          border-radius: 0.2em;
          z-index: -1;
          opacity: 0.85;
        }
      `}</style>
    </div>
  );
}
