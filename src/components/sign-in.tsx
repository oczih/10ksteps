
"use client"

import { signIn } from "next-auth/react"
 
export default function SignIn() {
  return <button onClick={() => signIn("google", {
    callbackUrl: '/',
})} className="w-full rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Sign in with Google</button>
}