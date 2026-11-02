import { Property } from "@/types/property"
import Image from "next/image"

type PropertyCardProps = {
  property: Property
}

export function PropertyCard({property}: PropertyCardProps) {
  const propertyImage = property.image_url ?? "https://plus.unsplash.com/premium_photo-1770660113219-49fc5937bc74?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"

  return(
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <Image
          src={propertyImage}
          alt={property.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        {property.kind_of_property && (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-slate-800 shadow-sm">
            {property.kind_of_property}
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold text-slate-900">
              {property.title}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {property.city}, {property.country}
            </p>
          </div>
          <p className="shrink-0 text-right text-sm text-slate-600">
            <span className="font-bold text-slate-900">
              {property.price_per_night} kr
            </span>
            <span className="block text-xs">per night</span>
          </p>
        </div>
        {property.description && (
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
            {property.description}
          </p>
        )}
        <p className="mt-4 border-t border-slate-100 pt-3 text-sm text-slate-500">
          Up to {property.max_guests} guests
        </p>
      </div>
    </article>
  )
}