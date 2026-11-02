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

export async function getPropertyById(id: string): Promise<Property | null> {
    try {
    const url = new URL(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/properties/id/${id}`,
    );
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }
    const property: Property = await response.json();
    return property;
  } catch {
    return null;
  }
}

export async function getMyProperties(): Promise<Property[]> {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/properties/mine`
  );

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Could not fetch your properties (${response.status})`);
  }

  const properties: Property[] = await response.json();
  return properties;
}

export async function createProperty(
  formData: FormData
): Promise<CreatePropertyState> {
    const title = String(formData.get("title") ?? "").trim()
    const description = String(formData.get("description") ?? "").trim()
    const country = String(formData.get("country") ?? "").trim()
    const city = String(formData.get("city") ?? "").trim()
    const kindOfProperty = String(formData.get("kind") ?? "")
    const maxGuests = Number(formData.get("max_guests"))
    const pricePerNight = Number(formData.get("price_per_night"))
    const imageUrl = String(formData.get("image_url") ?? "").trim()

    if (!isPropertyKind(kindOfProperty)) {
      return { error: "Choose apartment or villa." }
    };

    const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/properties/`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        country,
        city,
        kind_of_property: kindOfProperty,
        max_guests: maxGuests,
        price_per_night: pricePerNight,
        ...(imageUrl ? { image_url: imageUrl } : {}),
      })
    }
  );

  if (response.status === 401) {
    return { error: "You need to be signed in to list a stay." };
  }

  if (!response.ok) {
    return {
      error: "Could not create the stay. Check the fields and try again.",
    };
  }

  const property: Property = await response.json();
  return { propertyId: property.property_id };
}