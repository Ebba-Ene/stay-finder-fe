import { Booking } from "@/types/booking";

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