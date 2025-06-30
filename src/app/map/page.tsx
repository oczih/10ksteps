'use client';
import RouteMap from '@/components/RouteMap';
import { Header } from '@/components/Header';
import { useUser } from '@/app/context/UserContext';
import GeminiChat from '@/components/GeminiChat';
import SubscriptionGuard from '@/components/SubscriptionGuard';

export default function Map() {
    const { user, setUser } = useUser();

    return (
        <SubscriptionGuard>
            <div>
                <GeminiChat />
                <Header user={user} setUser={setUser}  />
                <RouteMap />
            </div>
        </SubscriptionGuard>
    );
}