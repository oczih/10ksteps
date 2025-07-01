'use client';

import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { User } from '@/types';
import { motion } from 'motion/react';
import { useUser } from '@/app/context/UserContext';
import { FaCheckSquare } from "react-icons/fa";

export const Header = ({
  setUser,
}: {
  user: User | null;
  setUser: (user: User | null) => void;
}) => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  // Only show Dashboard (/) if not logged in
  const navLinks = session?.user
    ? [
        { to: '/map', label: 'Map' },
        { to: '/settings', label: 'Settings' },
      ]
    : [
        { to: '/', label: 'Dashboard' },
        { to: '/map', label: 'Map' },
        { to: '/settings', label: 'Settings' },
      ];

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    setUser(null);
    router.push('/');
    toast.success('Signed out successfully');
  };

  const handleNavClick = (link: { to: string; label: string }) => {
    if (!session?.user) {
      toast.error(`You need to be signed in to access ${link.label.toLowerCase()}`);
      return;
    }
    router.push(link.to);
  };

  const renderAuth = () => {
    if (status === 'loading') {
      return <span className="text-white">Loading...</span>;
    }

    return (
      <>
        {session?.user ? (
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
            <div className="flex items-center gap-2 text-white font-bold">
              <UserCircleIcon className="w-5 h-5" />
              <div>{session.user.username} logged in</div>
            </div>
          </div>
        ) : (
          <Link href="/login">
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            className="bg-yellow-400 shadow-lg hover:bg-yellow-500 transition text-gray-900 px-8 py-3 rounded-xl text-lg font-bold mt-4 focus:outline-none focus:ring-4 focus:ring-yellow-300"
          >
            Sign in
          </motion.button>
        </Link>
        )}
        {session?.user && session?.user.hasAccess && (
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
            <div className="flex items-center gap-2 text-white font-bold">
              <div className="flex items-center gap-2 text-green-500">Membership</div><FaCheckSquare className="w-5 h-5 text-green-500" />
            </div>
          </div>
        )}
        <div className="flex flex-wrap justify-center md:justify-end gap-3">
          {navLinks.map(link => (
            <div key={link.to}>
              {session?.user ? (
                <Link
                  href={link.to}
                  className={`btn btn-ghost font-bold transition duration-150 hover:bg-sky-500/50 ${
                    pathname === link.to ? 'text-yellow-300' : ''
                  }`}
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  onClick={() => handleNavClick(link)}
                  className={`btn btn-ghost font-bold transition duration-150 hover:bg-sky-500/50 ${
                    pathname === link.to ? 'text-yellow-300' : ''
                  }`}
                >
                  {link.label}
                </button>
              )}
            </div>
          ))}

          {session?.user && (
            <>
              <button onClick={handleSignOut} className="btn btn-outline text-white border-white hover:bg-sky-500/50">
                Sign Out
              </button>
              {user && !user.hasAccess && (
                <Link href="/subscribe"><button className="btn btn-outline text-white border-white hover:bg-sky-500/50">Get Premium</button></Link>
              )}
            </>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="w-full flex justify-center">
      <div className="navbar bg-[#1c232b] text-base-content rounded-box w-full max-w-6xl px-4 py-2 flex-col md:flex-row md:justify-between md:items-center gap-4">
        {renderAuth()}
      </div>
    </div>
  );
};
