'use client';

import { Header } from "@/components/Header";
import { UserProvider } from "@/app/context/UserContext";

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
      {/* You can now use user/setUser anywhere */}
    </div>
  );
}
