"use client"

import { Booking } from "@/types/booking"
import { getMyBookings, getPropertyBookings } from "@/utils/bookingService"
import { useCallback, useEffect, useState } from "react"
import { BookingCard } from "./BookingCard"
import EditButton from "../EditButton"
import DeleteButton from "../DeleteButton"

type BookingListPage = {
  mode: "mine" | "properties"
}

export default function BookingList({mode}: BookingListPage) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  const loadBookings = useCallback(
    async () => {
      setLoading(true)
      setError("")

      try{
        if(mode === "mine"){
          setBookings(await getMyBookings())
        } else if(mode === "properties"){
          setBookings(await getPropertyBookings())
        }
      } catch{
        setError("Could not get bookings")
      } finally{
        setLoading(false)
      }
    }, [mode]
  )

  useEffect(() => {
    void loadBookings()
  }, [loadBookings])

  return (
    <section className="w-full">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {mode==="mine" ? "My Bookings" : "My Property Bookings"}
          </h1>
          {!loading && !error && (
            <p className="mt-1 text-sm text-slate-500">
              {bookings.length} {bookings.length === 1 ? "booking" : "bookings"} found
            </p>
          )}
        </div>
      </div>

      {error && (
        <p role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {message && (
        <p role="status" className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </p>
      )}

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
            >
              <div className="aspect-[4/3] animate-pulse bg-slate-200" />
              <div className="space-y-3 p-4">
                <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />
                <div className="h-4 w-1/3 animate-pulse rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      ) : bookings.length === 0 && !error ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <h2 className="text-lg font-semibold text-slate-900">No bookings found</h2>
        </div>
      ) : (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {bookings.map((booking) => (
          <div key={booking.booking_id}>
            <BookingCard booking={booking} mode={mode} 
                        onStatusChanged={(newStatus) => {
                setBookings((current) =>
                  current.map((item) =>
                    item.booking_id === booking.booking_id
                      ? { ...item, status: newStatus }
                      : item
                  )
                )
              }}
            />
            {mode === "mine" && (
              <div className="mt-3 flex flex-wrap items-start gap-3">
                <EditButton
                  entityType="booking"
                  entityId={booking.booking_id}
                  ownerId={booking.owner_id}
                />
                {booking.status === "cancelled" && (
                  <DeleteButton
                    entityType="booking"
                    entityId={booking.booking_id}
                    ownerId={booking.owner_id}
                    onDeleted={() => {
                      setBookings((current) =>
                        current.filter(
                          (item) => item.booking_id !== booking.booking_id
                        )
                      )
                      setMessage("Booking have been deleted.")
                    }}
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      )}
    </section>
  )
}