"use client"

import { useAuth } from "@/contexts/AuthContext"
import T from "../typography"

import type { SubmitEvent } from "react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"

interface AuthFormProps{
  mode: "login" | "register"
}

export default function AuthForm({mode}: AuthFormProps) {
  const auth = useAuth()
  const router = useRouter()

  const [error, setError] = useState<string>()
  const [pending, setPending] = useState(false)

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    setPending(true)

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get("email")).trim()
    const password = String(formData.get("password"))
    const name = String(formData.get("name")).trim()

    setError(undefined)
    
    try{
      let result: void | string
      if(mode === "register") {
        console.log("Auth form submitted", { mode, email, name })
        result = await auth.register(email, password, name)
      } else {
        console.log("Auth form submitted", { mode, email })
        result = await auth.login(email, password)
      }

      if (typeof result === "string") {
        setError(result)
        return
      }

      router.push("/")
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setPending(false)
    }
  }

  const isLogin = mode === "login"

  return(
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-md space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8"
    >
      <div className="space-y-2 text-center">
        <T.Header size="lg" className="text-slate-900">
          {isLogin ? "Log in to StayFinder" : "Create your account"}
        </T.Header>
        <p className="text-sm text-slate-600">
          {isLogin
            ? "Enter your details to access your account."
            : "Create an account to find your next stay."}
        </p>
      </div>

      <div className="space-y-4">
        {!isLogin && (
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-sm font-medium text-slate-700">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Your name"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={isLogin ? "current-password" : "new-password"}
            placeholder="Enter your password"
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="space-y-4">
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending
            ? (isLogin ? "Logging in..." : "Creating account...")
            : (isLogin ? "Log in" : "Create account")}
        </button>

        <p className="text-center text-sm text-slate-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <Link
            href={isLogin ? "/auth/register" : "/auth/login"}
            className="font-semibold text-blue-700 underline-offset-4 hover:underline"
          >
            {isLogin ? "Register" : "Log in"}
          </Link>
        </p>
      </div>
    </form>
  )
}