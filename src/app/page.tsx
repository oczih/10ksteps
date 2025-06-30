'use client';

import { Header } from "@/components/Header";
import { UserProvider } from "@/app/context/UserContext";
import toast, { Toaster } from 'react-hot-toast';
import { motion } from "motion/react"
import Link from "next/link";

export default function Page() {
  return (
    <UserProvider>
      <App />
    </UserProvider>
  );
}

// Separate the app logic
import { useUser } from "@/app/context/UserContext";

function App() {
  const { user, setUser } = useUser();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#181f2a] via-[#232b39] to-[#10141a] relative overflow-hidden">
      {/* Header at the very top */}
      <Header user={user} setUser={setUser} />
      <Toaster position="top-right" reverseOrder={false} />
      {/* Globe SVG as subtle accent, smaller and in the bottom right */}
      <img src="/globe.svg" alt="Globe" className="fixed bottom-4 right-4 w-32 opacity-10 pointer-events-none select-none z-0" />
      <main className="z-10 flex flex-col gap-6 items-center mx-auto mb-3 justify-center align-middle mt-24">
        <h3 className="text-5xl md:text-6xl font-extrabold text-center leading-tight relative text-white">
          Walk around with a goal
        </h3>
        <p className="text-4xl md:text-5xl font-black text-center relative">
          <span className="highlighted-text">10K Steps</span>
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
      {/* Pros and Cons Section */}
      <section className="z-10 flex flex-col items-center justify-center w-full mt-6">
        <div className="bg-[#232b39] bg-opacity-90 rounded-2xl shadow-xl p-6 max-w-2xl w-full flex flex-col gap-4 border border-[#2d3748]">
          <h4 className="text-2xl font-bold text-white text-center mb-2">Why use 10K Steps?</h4>
          <ul className="flex flex-col gap-2">
            <li className="flex items-center gap-3 text-green-400 text-lg">
              <span className="font-bold text-2xl">+</span>
              <span className="text-white">Motivates you to walk more and reach your daily goals</span>
            </li>
            <li className="flex items-center gap-3 text-green-400 text-lg">
              <span className="font-bold text-2xl">+</span>
              <span className="text-white">Track your routes and progress visually on a map</span>
            </li>
            <li className="flex items-center gap-3 text-green-400 text-lg">
              <span className="font-bold text-2xl">+</span>
              <span className="text-white">Set custom goals and get AI-powered suggestions</span>
            </li>
            <li className="flex items-center gap-3 text-red-400 text-lg">
              <span className="font-bold text-2xl">-</span>
              <span className="text-white">May increase your step count obsession!</span>
            </li>
          </ul>
        </div>
      </section>
      {/* Custom highlighter effect style for dark background */}
      <style jsx>{`
        .highlighted-text {
          position: relative;
          display: inline-block;
          color: #181f2a;
        }
        .highlighted-text::before {
          content: '';
          position: absolute;
          left: 0; right: 0; bottom: 0.1em; height: 0.6em;
          background: linear-gradient(90deg, #ffe066 60%, #ffd700 100%);
          border-radius: 0.2em;
          z-index: -1;
          opacity: 0.85;
        }
      `}</style>
    </div>
  );
}
