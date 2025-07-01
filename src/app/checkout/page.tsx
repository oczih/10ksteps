'use client';

import ButtonCustomerPortal from '@/components/ButtonCustomerPortal';
import Pricing from '@/components/Checkout';
import Link from 'next/link';
export default function Page() {
    return (
        <>
            <header className="p-4 flex max-w-7xl mx-auto items-center justify-between">
                <div className="flex justify-start">
                    <Link href="/subscribe">
                        <button className="btn btn-outline text-white border-white hover:bg-sky-500/50">Go back</button>
                    </Link>
                </div>
                <div className="flex justify-end">
                    <ButtonCustomerPortal />
                </div>
            </header>
        
            <main className="bg-base-200 min-h-screen">
                <Pricing />
            </main>
        </>
    );
}