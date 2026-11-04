"use client"

import BookingForm from "@/components/Bookings/BookingForm"
import T from "@/components/typography"
import type { Booking } from "@/types/booking"
import type { Property } from "@/types/property"
import { editBooking, getBookingById } from "@/utils/bookingService"
import { getPropertyById } from "@/utils/propertyService"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Suspense, useEffect, useState } from "react"

export default function EditBookingPage() {
  return(
    <Suspense fallback={<main className="px-6 py-10">Loading edit page...</main>}>
      <EditBookingContent/>
    </Suspense>
  )
}

function EditBookingContent() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState("")

  useEffect(() => {
    async function loadBooking() {
      try {
        const result = await getBookingById(id)
        if (!result) {
          setBooking(null)
          return
        }

        setBooking(result)
        if (result.property_id) {
          setProperty(await getPropertyById(result.property_id))
        }
      } catch {
        setLoadError("Could not load this booking. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    void loadBooking()
  }, [id])

  async function onEdit(formData: FormData) {
    const result = await editBooking(formData, id)

    if(!result.error) {
      router.push(`/bookings/mine`)
    }

    return result
  }

  if (loading) {
    return <main className="px-6 py-10">Loading booking...</main>
  }

  if (loadError) {
    return (
      <main className="mx-auto w-full max-w-3xl px-6 py-10">
        <p role="alert" className="text-red-700">{loadError}</p>
      </main>
    )
  }

  if (!booking || !property) {
    return (
      <main className="mx-auto w-full max-w-3xl space-y-4 px-6 py-10">
        <p className="text-slate-700">
          {!booking ? "Booking not found." : "The property for this booking is unavailable."}
        </p>
        <Link
          href="/bookings/mine"
          className="inline-flex font-semibold text-blue-700 hover:underline"
        >
          Back to my bookings
        </Link>
      </main>
    )
  }

  return(
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-10">
      <T.Header size="lg">Edit your booking</T.Header>
      <BookingForm
        values={{
          guest_name: booking.guest_name,
          guest_email: booking.guest_email,
          guests: booking.guests,
          check_in: booking.check_in,
          check_out: booking.check_out,
        }}
        action={onEdit}
        pricePerNight={property.price_per_night}
        maxGuests={property.max_guests}
        submitLabel="Save changes"
        pendingLabel="Saving..."
      />
    </main>
  )
}