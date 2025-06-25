'use client';

import { Header } from "@/components/Header";
import { User } from "@/types";
import { useState } from "react";

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  return (
    <div>
      <Header user={user} setUser={setUser} />
    </div>
  )
}


export default App
