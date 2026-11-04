"use client"

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import LogOutButton from "./Auth/LogOutButton";

export default function NavBar() {
  const auth = useAuth()

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group inline-flex items-center gap-2.5 rounded-lg text-slate-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm transition group-hover:bg-blue-700">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
            >
              <path
                d="m3.75 10 8.25-6.5L20.25 10v9.25a1 1 0 0 1-1 1h-5.5v-6h-3.5v6h-5.5a1 1 0 0 1-1-1V10Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.7"
              />
            </svg>
          </span>
          <span className="text-lg font-bold tracking-tight">Stay Finder</span>
        </Link>

        <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
          {auth.user ? (
            <>
              <Link
                href="/properties/mine"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
              >
                My Properties
              </Link>
              <Link
                href="/bookings/mine"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
              >
                My Bookings
              </Link>
              <Link
                href="/properties/create_stay"
                className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
              >
                List a stay
              </Link>
              <span className="hidden border-l border-slate-200 pl-3 text-sm text-slate-500 md:inline">
                Welcome, <span className="font-semibold text-slate-800">{auth.user.name}</span>
              </span>

              <LogOutButton/>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}