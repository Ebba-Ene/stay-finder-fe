import { Property } from "@/types/property"

export async function getProperties(): Promise<Property[]> {
  try{
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/properties/`
    )
    const properties: Property[] = await response.json()
    return properties
  } catch(e) {
    return []
  }
}