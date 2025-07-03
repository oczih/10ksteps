"use client";

import SignIn from "@/components/sign-in";

export default function Login() {
  return (
    <section className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="bg-slate-800 p-8 rounded-lg shadow-xl border border-slate-700 max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-slate-400">Sign in to your account</p>
        </div>
        
        <SignIn />
      
      </div>
    </section>
  );
}
