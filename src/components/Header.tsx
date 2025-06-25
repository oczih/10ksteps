'use client';

import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { User } from '@/types';
import SignIn from './sign-in';

export const Header = ({
  user: _user,
  setUser,
}: {
  user: User | null;
  setUser: (user: User | null) => void;
}) => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { to: '/', label: 'Dashboard' },
    { to: '/profile', label: 'Profile' },
    { to: '/map', label: 'Map' },
    { to: '/settings', label: 'Settings' },
  ];

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    setUser(null);
    router.push('/');
    toast.success('Signed out successfully');
  };

  const renderAuth = () => {
    if (status === 'loading') {
      return <span className="text-white">Loading...</span>;
    }
    if (session?.user) {
      console.log(session.user);

      return (
        <>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
            <div className="flex items-center gap-2 text-white font-bold">
              <UserCircleIcon className="w-5 h-5" />
              <div>{session.user.username} logged in</div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center md:justify-end gap-3">
            {navLinks.map(link => (
              <div key={link.to}>
                <Link
                  href={link.to}
                  className={`btn btn-ghost font-bold transition duration-150 ${
                    pathname === link.to ? 'text-yellow-300' : ''
                  }`}
                >
                  {link.label}
                </Link>
              </div>
            ))}

            <button onClick={handleSignOut} className="btn btn-outline text-white border-white">
              Sign Out
            </button>
          </div>
        </>
      );
    }

    return <SignIn />;
  };

  return (
    <div className="w-full flex justify-center">
      <div className="navbar bg-[#9D79BC] text-base-content rounded-box w-full max-w-6xl px-4 py-2 flex-col md:flex-row md:justify-between md:items-center gap-4">
        {renderAuth()}
      </div>
    </div>
  );
};
