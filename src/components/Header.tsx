'use client';

import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { User } from '@/types';
import { motion } from 'motion/react';
import { useUser } from '@/app/context/UserContext';
import { FaCheckSquare } from "react-icons/fa";
import { useEffect, useState } from 'react';
import userservice from '@/app/services/userservice';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  useEffect(() => {
    const fetchUser = async () => {
      if (session?.user?.id && !user) {
        try {
          const userData = await userservice.get(session.user.id);
          setUser(userData.user);
        } catch (error) {
          console.error('Error fetching user in Header:', error);
        }
      }
    };
    fetchUser();
  }, [session?.user?.id, setUser, user]);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    setUser(null);
    localStorage.removeItem('user');
    router.push('/');
    toast.success('Signed out successfully');
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = (link: { to: string; label: string }) => {
    if (!session?.user) {
      toast.error(`You need to be signed in to access ${link.label.toLowerCase()}`);
      return;
    }
    router.push(link.to);
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const renderAuth = () => {
    if (status === 'loading') {
      return <span className="text-white">Loading...</span>;
    }

    return (
      <>
        {session?.user ? (
          <div className="flex items-center gap-2 text-white font-bold text-sm sm:text-base">
            <UserCircleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">{user?.username} logged in</span>
            <span className="sm:hidden">{user?.username}</span>
          </div>
        ) : (
          <Link href="/login">
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              className="bg-yellow-400 shadow-lg hover:bg-yellow-500 transition text-gray-900 px-4 sm:px-8 py-2 sm:py-3 rounded-xl text-sm sm:text-lg font-bold focus:outline-none focus:ring-4 focus:ring-yellow-300"
            >
              Sign in
            </motion.button>
          </Link>
        )}
        {session?.user && session?.user.hasAccess && (
          <div className="flex items-center gap-2 text-white font-bold text-sm sm:text-base">
            <div className="flex items-center gap-1 sm:gap-2 text-green-500">
              <span className="hidden sm:inline">Membership</span>
              <span className="sm:hidden">Premium</span>
            </div>
            <FaCheckSquare className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
          </div>
        )}
      </>
    );
  };

  const renderMobileMenu = () => (
    <div className={`fixed inset-0 z-50 lg:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closeMobileMenu} />
      <div className="fixed right-0 top-0 h-full w-64 bg-[#1c232b] shadow-xl transform transition-transform duration-300 ease-in-out">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-white font-bold">Menu</h2>
          <button
            onClick={closeMobileMenu}
            className="text-white hover:text-gray-300"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          {renderAuth()}
          
          <div className="border-t border-gray-700 pt-4">
            <div className="space-y-2">
              {navLinks.map(link => (
                <div key={link.to}>
                  {session?.user ? (
                    <Link
                      href={link.to}
                      onClick={closeMobileMenu}
                      className={`block w-full text-left px-4 py-3 rounded-lg font-bold transition duration-150 hover:bg-sky-500/50 ${
                        pathname === link.to ? 'text-yellow-300 bg-sky-500/20' : 'text-white'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleNavClick(link)}
                      className={`block w-full text-left px-4 py-3 rounded-lg font-bold transition duration-150 hover:bg-sky-500/50 ${
                        pathname === link.to ? 'text-yellow-300 bg-sky-500/20' : 'text-white'
                      }`}
                    >
                      {link.label}
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            {session?.user && (
              <div className="border-t border-gray-700 pt-4 space-y-2">
                <button 
                  onClick={handleSignOut} 
                  className="block w-full text-left px-4 py-3 rounded-lg text-white border border-white hover:bg-sky-500/50 transition duration-150"
                >
                  Sign Out
                </button>
                {user && !user.hasAccess && (
                  <Link href="/subscribe">
                    <button 
                      onClick={closeMobileMenu}
                      className="block w-full text-left px-4 py-3 rounded-lg text-white border border-white hover:bg-sky-500/50 transition duration-150"
                    >
                      Get Premium
                    </button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDesktopNav = () => (
    <div className="hidden lg:flex flex-wrap justify-end gap-3">
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
            <Link href="/subscribe">
              <button className="btn btn-outline text-white border-white hover:bg-sky-500/50">Get Premium</button>
            </Link>
          )}
        </>
      )}
    </div>
  );

  return (
    <div className="w-full flex justify-center">
      <div className="navbar bg-[#1c232b] text-base-content rounded-box w-full max-w-6xl px-4 py-2 flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        {/* Mobile menu button */}
        <div className="flex lg:hidden w-full justify-between items-center">
          <div className="flex items-center gap-2">
            {renderAuth()}
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white hover:text-gray-300 p-2"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
        </div>

        {/* Desktop layout */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-between lg:items-center">
          <div className="flex items-center gap-3">
            {renderAuth()}
          </div>
          {renderDesktopNav()}
        </div>

        {/* Mobile menu */}
        {renderMobileMenu()}
      </div>
    </div>
  );
};
