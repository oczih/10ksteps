'use client';
import RouteMap from '@/components/RouteMap';
import { Header } from '@/components/Header';
import { useUser } from '@/app/context/UserContext';
import GeminiChat from '@/components/GeminiChat';
export default function Map() {
    const { user, setUser } = useUser();
    return (
        <div>
            <GeminiChat />
            <Header user={user} setUser={setUser}  />
            <RouteMap />
        </div>
    )
}