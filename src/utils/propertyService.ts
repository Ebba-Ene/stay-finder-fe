import { Property, PropertyKind } from "@/types/property"

export type PropertiesFilter = {
  city?: string,
  country?: string,
  maxGuests?: number,
  maxPrice?: number
  kind?: PropertyKind
  sortPrice?: "asc" | "desc"
}

export type CreatePropertyState = {
  error?: string;
  propertyId?: string
}

const kinds: PropertyKind[] = ["Apartment", "Villa"]

function isPropertyKind(value: string): value is PropertyKind {
  return kinds.includes(value as PropertyKind)
}

export async function getProperties(
  filters: PropertiesFilter = {}
): Promise<Property[]> {
  const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/properties/`)
  const params = new URLSearchParams()

  if (filters.city) params.set("city", filters.city)
  if (filters.country) params.set("country", filters.country)
  if (filters.maxGuests !== undefined) {
    params.set("max_guests", String(filters.maxGuests))
  }
  if (filters.maxPrice !== undefined) {
    params.set("max_price", String(filters.maxPrice))
  }
  if (filters.kind) params.set("kind", filters.kind)
  if (filters.sortPrice) params.set("sort_price", filters.sortPrice)

  url.search = params.toString()
  
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Could not fetch properties (${response.status})`)
  }

  return response.json()
}