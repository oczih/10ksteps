'use client';

import { Header } from "@/components/Header";
import { UserProvider } from "@/app/context/UserContext";
import toast, { Toaster } from 'react-hot-toast';

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
    <div>
      <Header user={user} setUser={setUser} />
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
      {/* You can now use user/setUser anywhere */}
    </div>
  );
}
