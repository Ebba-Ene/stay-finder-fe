import { Property } from "@/types/property"
import Image from "next/image"

type PropertyCardProps = {
  property: Property
}

export function PropertyCard({property}: PropertyCardProps) {
  const property_image = property.image_url ?? "https://plus.unsplash.com/premium_photo-1770660113219-49fc5937bc74?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
  return(
    <article>
      <Image
        src={property_image}
        alt="Image of property"
        width={300}
        height={200}

      />
      <h2>{property.title}</h2>
      <p>{property.city}, {property.country}</p>
      <p>{property.price_per_night} kr / natt</p>
    </article>
  )
}