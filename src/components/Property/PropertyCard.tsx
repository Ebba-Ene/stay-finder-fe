import type { Property } from "@/types/property"
import Link from "next/link"
import PropertyDetails from "./PropertyDetails"

type PropertyCardProps = {
  property: Property
}

export function PropertyCard({property}: PropertyCardProps) {
  return(
    <Link
      href={`/properties/${property.property_id}`}
      className="block transition duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
    >
      <PropertyDetails property={property} mode="card" />
    </Link>
  )
}