"use client"

import { useState } from "react"
import BookingList from "@/components/Bookings/BookingList"

type BookingMode = "mine" | "properties"

export default function BookingsPage() {
  const [mode, setMode] = useState<BookingMode>("mine")

  return (
    <div className="flex min-h-screen flex-1 flex-col items-center bg-slate-50 font-sans">
      <main className="w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Bookings
          </h1>
          <p className="mt-2 text-slate-600">
            View the bookings you have made or bookings for your properties.
          </p>
        </header>

        <div
          className="mb-8 flex w-full max-w-xl rounded-xl border border-slate-200 bg-white p-1 shadow-sm"
          role="tablist"
          aria-label="Booking lists"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === "mine"}
            onClick={() => setMode("mine")}
            className={`flex-1 rounded-lg px-4 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 ${
              mode === "mine"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            My bookings
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "properties"}
            onClick={() => setMode("properties")}
            className={`flex-1 rounded-lg px-4 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 ${
              mode === "properties"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            My property bookings
          </button>
        </div>

        <BookingList mode={mode} />
      </main>
    </div>
  )
}