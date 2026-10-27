import { Property } from "@/types/property"
import Image from "next/image"

type PropertyCardProps = {
  property: Property
}

export function PropertyCard({property}: PropertyCardProps) {
  return(
    <article>
      <h2>{property.title}</h2>
      <p>{property.city}, {property.country}</p>
      <p>{property.price_per_night} kr / natt</p>
    </article>
  )
}