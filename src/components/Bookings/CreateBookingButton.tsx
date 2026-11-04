"use client"

import { useAuth } from "@/contexts/AuthContext"
import Link from "next/link"

type CreateBookingButtonProps = {
  propertyId: string
  ownerId: string | null
}

export default function CreateBookingButton({
  propertyId,
  ownerId,
}: CreateBookingButtonProps) {
  const { user } = useAuth()

  //Ägaren kan inte se knappen
if (user?.id === ownerId) {
  return null
}

//Länkar till att logga in för att kunna boka
if (!user) {
  return (
    <Link
      href="/auth/login"
      className="inline-flex min-h-10 items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
    >
      Log in to book
    </Link>
  )
}

  return (
    <Link
      href={`/properties/${propertyId}/book_stay`}
      className="inline-flex min-h-10 items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
    >
      Book this stay
    </Link>
  )
}
