"use server"

import { signIn } from "@/lib/auth-client"

export async function signInMailgunAction(formData: FormData) {
  const values = Object.fromEntries(formData.entries())
  await signIn("mailgun", values)
}