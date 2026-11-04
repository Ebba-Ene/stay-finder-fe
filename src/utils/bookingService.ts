import { Booking } from "@/types/booking";

export type BookingActionResult = {
  error?: string;
  bookingId?: string
}

async function getBookingError(
  response: Response,
  action: "create" | "update" = "create"
): Promise<string> {
  const actionLabel = action === "create" ? "create" : "update"
  try {
    const body: unknown = await response.json()
    if (typeof body !== "object" || body === null) {
      return `Could not ${actionLabel} the booking. Please check the details.`
    }

    if ("errors" in body && Array.isArray(body.errors)) {
      for (const entry of body.errors) {
        if (Array.isArray(entry) && typeof entry[1] === "string") {
          return entry[1]
        }
      }
    }

    if ("error" in body && typeof body.error === "string") {
      return body.error
    }

    if ("message" in body && typeof body.message === "string") {
      return body.message
    }
  } catch {
    return `Could not ${actionLabel} the booking (${response.status}). Please try again.`
  }

  return `Could not ${actionLabel} the booking (${response.status}). Please check the details.`
}

export async function getMyBookings(): Promise<Booking[]> {
  return getBookings("mine")
}

export async function getPropertyBookings(): Promise<Booking[]> {
  return getBookings("properties/mine")
}

async function getBookings(path: string): Promise<Booking[]> {
  try {
    const url = new URL(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings/${path}`
    )
    const response = await fetch(url, {
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error(`Could not fetch bookings (${response.status})`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Failed to fetch bookings from ${path}`, error)
    throw error
  }
}

export async function getBookingById(id: string): Promise<Booking | null> {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings/${id}`
  )

  const response = await fetch(url, {
    credentials: "include",
  })

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error(`Could not fetch booking (${response.status})`)
  }

  return response.json()
}

export async function createBooking(
  formData: FormData,
  propertyId: string
): Promise<BookingActionResult> {
  const guest_name = String(formData.get("guest_name") ?? "").trim()
  const guest_email = String(formData.get("guest_email") ?? "").trim()
  const guests = Number(formData.get("guests"))
  const check_in = String(formData.get("check_in") ?? "").trim()
  const check_out = String(formData.get("check_out") ?? "").trim()

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings/property/${propertyId}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        guest_name,
        guest_email,
        guests,
        check_in,
        check_out,
      }),
    })

    if (response.status === 401) {
      return { error: "You need to be signed in to book a stay." }
    }

    if (!response.ok) {
      return { error: await getBookingError(response) }
    }

    const booking: Booking = await response.json()
    return { bookingId: booking.booking_id }
  } catch (error) {
    console.error("Failed to create booking:", error)
    return { error: "Something went wrong. Check your connection and try again." }
  }
}

export async function editBooking(
  formData: FormData, id: string
): Promise<BookingActionResult> {
  const guest_name = String(formData.get("guest_name") ?? "").trim()
  const guest_email = String(formData.get("guest_email") ?? "").trim()
  const guests = Number(formData.get("guests"))
  const check_in = String(formData.get("check_in") ?? "").trim()
  const check_out = String(formData.get("check_out") ?? "").trim()

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings/${id}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          guest_name,
          guest_email,
          guests,
          check_in,
          check_out,
        }),
      },
    )

    if (response.status === 401) {
      return { error: "You need to be signed in to edit a booking." }
    }

    if (!response.ok) {
      return { error: await getBookingError(response, "update") }
    }

    const booking: Booking = await response.json()
    return { bookingId: booking.booking_id }
  } catch (error) {
    console.error("Failed to update booking:", error)
    return { error: "Something went wrong. Check your connection and try again." }
  }
}

export async function deleteBooking(id: string): Promise<void> {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings/${id}`
  )
  
  const response = await fetch(url, {
    method: "DELETE",
    credentials: "include"
  })

  if(!response.ok){
    throw new Error (`Could not delete booking (${response.status})`)
  }
}

export async function confirmBooking(id: string){
  const url = new URL(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings/properties/${id}/confirm`
  )
  
  const response = await fetch(url, {
    method: "PATCH",
    credentials: "include"
  })

  if(!response.ok){
    throw new Error (`Could not update booking (${response.status})`)
  }
}

export async function cancelBooking(id: string){
  const url = new URL(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings/properties/${id}/cancell`
  )

  const response = await fetch(url, {
    method: "PATCH",
    credentials: "include"
  })

  if(!response.ok){
    throw new Error (`Could not update booking (${response.status})`)
  }
}