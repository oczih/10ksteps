"use server"
import { signIn } from "@/lib/auth-client"
 
export default function SignInTwitter() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("twitter")
      }}
    >
      <button type="submit" className="btn btn-outline text-white border-white hover:bg-sky-500/50">Signin with Twitter</button>
    </form>
  )
} 