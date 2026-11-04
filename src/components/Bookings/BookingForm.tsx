"use client"

import { useState, type SubmitEvent } from "react"
import type { BookingActionResult } from "@/utils/bookingService"

const fieldClassName =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"

const labelClassName = "flex flex-col gap-2 text-sm font-medium text-slate-700"

export type BookingFormValues = {
  guest_name?: string
  guest_email?: string
  guests?: number
  check_in?: string
  check_out?: string
}

type BookingFormProps = {
  action: (formData: FormData) => Promise<BookingActionResult>
  values?: BookingFormValues
  pricePerNight: number
  maxGuests: number
  submitLabel?: string
  pendingLabel?: string
}

function getLocalDateString(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function getNightCount(checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut) return 0

  const [inYear, inMonth, inDay] = checkIn.split("-").map(Number)
  const [outYear, outMonth, outDay] = checkOut.split("-").map(Number)
  const start = Date.UTC(inYear, inMonth - 1, inDay)
  const end = Date.UTC(outYear, outMonth - 1, outDay)

  return Math.floor((end - start) / 86_400_000)
}

export default function BookingForm({
  action,
  values,
  pricePerNight,
  maxGuests,
  submitLabel = "Book stay",
  pendingLabel = "Booking...",
}: BookingFormProps) {
  const [error, setError] = useState<string>()
  const [pending, setPending] = useState(false)
  const [checkIn, setCheckIn] = useState(values?.check_in ?? "")
  const [checkOut, setCheckOut] = useState(values?.check_out ?? "")
  const [guests, setGuests] = useState(String(values?.guests ?? 1))

  const nights = getNightCount(checkIn, checkOut)
  const totalPrice = nights > 0 ? nights * pricePerNight : 0
  const today = getLocalDateString(new Date())

  async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const guestName = String(formData.get("guest_name") ?? "").trim()
    const guestEmail = String(formData.get("guest_email") ?? "").trim()
    const guestCount = Number(formData.get("guests"))

    setError(undefined)

    if (guestName.length < 2) {
      setError("Enter your name using at least 2 characters.")
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)) {
      setError("Enter a valid email address, for example name@example.com.")
      return
    }

    if (!Number.isInteger(guestCount) || guestCount < 1) {
      setError("At least 1 guest is required.")
      return
    }

    if (guestCount > maxGuests) {
      setError(`This property allows a maximum of ${maxGuests} guests.`)
      return
    }

    if (!checkIn || !checkOut) {
      setError("Choose both a check-in and check-out date.")
      return
    }

    if (checkIn < today) {
      setError("Check-in date cannot be in the past.")
      return
    }

    if (nights <= 0) {
      setError("Check-out must be at least one night after check-in.")
      return
    }

    setPending(true)
    try {
      const result = await action(formData)
      setError(result.error)
    } catch {
      setError("Could not create the booking. Please try again.")
    } finally {
      setPending(false)
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="mx-auto w-full max-w-2xl space-y-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/50 sm:p-8"
    >
      <div className="border-b border-slate-100 pb-5">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Booking details
        </h2>
        <p className="mt-1 text-sm leading-6 text-slate-500">
          Enter your details and choose your stay dates.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className={labelClassName}>
          Name
          <input
            name="guest_name"
            autoComplete="name"
            required
            minLength={2}
            defaultValue={values?.guest_name}
            className={fieldClassName}
          />
        </label>

        <label className={labelClassName}>
          Email
          <input
            name="guest_email"
            type="email"
            autoComplete="email"
            required
            defaultValue={values?.guest_email}
            className={fieldClassName}
          />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <label className={labelClassName}>
          Guests (maximum {maxGuests})
          <input
            name="guests"
            type="number"
            min={1}
            max={maxGuests}
            step={1}
            required
            value={guests}
            onChange={(event) => setGuests(event.target.value)}
            className={fieldClassName}
          />
        </label>

        <label className={labelClassName}>
          Check-in
          <input
            name="check_in"
            type="date"
            required
            value={checkIn}
            onChange={(event) => setCheckIn(event.target.value)}
            className={fieldClassName}
          />
        </label>

        <label className={labelClassName}>
          Check-out
          <input
            name="check_out"
            type="date"
            required
            value={checkOut}
            onChange={(event) => setCheckOut(event.target.value)}
            className={fieldClassName}
          />
        </label>
      </div>

      <section
        aria-live="polite"
        className="rounded-2xl bg-slate-50 p-5"
      >
        <h3 className="font-semibold text-slate-900">Price summary</h3>
        <div className="mt-3 flex justify-between gap-4 text-sm text-slate-600">
          <span>
            {pricePerNight.toLocaleString("en-US")} kr × {nights}{" "}
            {nights === 1 ? "night" : "nights"}
          </span>
          <span>{totalPrice.toLocaleString("en-US")} kr</span>
        </div>
        {nights <= 0 && (
          <p className="mt-2 text-xs text-slate-500">
            Choose a check-in and check-out date to see the total.
          </p>
        )}
        <div className="mt-4 flex justify-between border-t border-slate-200 pt-4 font-bold text-slate-900">
          <span>Total</span>
          <span>{totalPrice.toLocaleString("en-US")} kr</span>
        </div>
      </section>

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {pending ? pendingLabel : submitLabel}
      </button>
    </form>
  )
}
