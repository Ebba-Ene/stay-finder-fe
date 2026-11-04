"use client"

import BookingForm from "@/components/Bookings/BookingForm"
import type { Property } from "@/types/property"
import { createBooking } from "@/utils/bookingService"
import { useRouter } from "next/navigation"

type BookingFormClientProps = {
  property: Property
}

export default function BookingFormClient({
  property,
}: BookingFormClientProps) {
  const router = useRouter()

  async function onCreate(formData: FormData) {
    const result = await createBooking(formData, property.property_id)

    if (result.bookingId) {
      router.push(`/bookings/mine`)
    }

    return result
  }

  return (
    <BookingForm
      action={onCreate}
      pricePerNight={property.price_per_night}
      maxGuests={property.max_guests}
    />
  )
}
