"use client"

import { useAuth } from "@/contexts/AuthContext"
import { Booking } from "@/types/booking"
import { cancelBooking, confirmBooking } from "@/utils/bookingService"
import { useState } from "react"

type BookingStatusButtonProps = {
  status: "confirm" | "cancell"
  bookingId: string
  onStatusChanged: (newStatus: Booking["status"]) => void
}

export default function BookingStatusButton({
  status,
  bookingId,
  onStatusChanged
}: BookingStatusButtonProps) {
  const { user } = useAuth()
  const [message, setMessage] = useState("")
  const [statusChange, setStatusChange] = useState(false)

  if (!user) {
    return null
  }

  async function handleStatusChange() {
    if (!user) {
      return
    }

    setStatusChange(true)
    setMessage("")

    try {
      if (status === "confirm") {
        await confirmBooking(bookingId)
        setMessage("Booking has been confirmed.")
        onStatusChanged("confirmed")
      } else if (status === "cancell") {
        await cancelBooking(bookingId)
        onStatusChanged("cancelled")
        setMessage("Booking has been cancelled.")
      }
    } catch {
      setMessage("Could not change the booking status.")
    } finally{
      setStatusChange(false)
    }
  }

  const actionLabel = status === "confirm" ? "Confirm" : "Cancel"
  const buttonStyle = status === "confirm"
    ? "border-emerald-700 bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-200"
    : "border-red-700 bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-200"

  return (
    <div>
      <button
        type="button"
        onClick={handleStatusChange}
        disabled={statusChange}
        aria-label={`${actionLabel} booking`}
        className={`inline-flex min-h-10 items-center justify-center rounded-xl border px-4 py-2 text-sm font-semibold shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${buttonStyle}`}
      >
        {statusChange
          ? "Changing..."
          : `${actionLabel} booking`}
      </button>
      {message && (
        <p role="status" className="mt-2 text-sm">
          {message}
        </p>
      )}
    </div>
  )
}