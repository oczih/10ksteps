'use client'
import { signIn } from 'next-auth/react'

export default function SignInTwitter() {
  return (
    <button
      onClick={() => signIn('twitter')}
      className="btn btn-outline text-white border-white hover:bg-sky-500/50"
    >
      Sign in with Twitter
    </button>
  )
}
