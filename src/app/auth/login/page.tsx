import type { Metadata } from "next"
import Link from "next/link"
import { LoginForm } from "@/components/login-form"

export const metadata: Metadata = {
  title: "Log In",
  description: "Log in to your Connectify account",
}

export default function LoginPage() {
  return (
    <div className="container flex h-screen items-center justify-center">
      <div className="mx-auto grid w-full max-w-md gap-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Log In</h1>
          <p className="text-muted-foreground">Welcome back to Connectify</p>
        </div>
        <LoginForm />
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}
