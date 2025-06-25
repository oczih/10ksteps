"use client";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SignIn from "@/components/sign-in";

export default function Login() {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    if (res?.error) {
      setError(res.error as string);
    }
    if (res?.ok) {
      router.push("/");
    }
  };

  return (
    <section className="w-full h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="p-6 w-full max-w-[400px] flex flex-col justify-between items-center gap-2 
        border border-solid border-black bg-white rounded text-black"
      >
        {error && <div className="text-black">{error}</div>}
        <h1 className="mb-5 w-full text-2xl font-bold">Sign In</h1>
        <label className="w-full text-sm">Email</label>
        <input
          type="email"
          placeholder="Email"
          className="w-full h-8 border border-solid border-black rounded p-2"
          name="email"
          required
        />
        <label className="w-full text-sm">Password</label>
        <input
          type="password"
          placeholder="Password"
          className="w-full h-8 border border-solid border-black rounded p-2"
          name="password"
          required
        />
        <SignIn />
        <Link
          href="/register"
          className="text-sm text-[#888] transition duration-150 ease hover:text-black"
        >
          Don't have an account?
        </Link>
      </form>
    </section>
  );
}
