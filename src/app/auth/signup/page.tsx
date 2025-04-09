import type { Metadata } from "next"
import Link from "next/link"
import { SignupForm } from "@/components/signup-form"

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your Connectify account",
}

export default function SignupPage() {
  return (
    <div className="container flex h-screen items-center justify-center">
      <div className="mx-auto grid w-full max-w-md gap-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Sign Up</h1>
          <p className="text-muted-foreground">Create your Connectify account and start connecting</p>
        </div>
        <SignupForm />
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/auth/login" className="underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  )
}
