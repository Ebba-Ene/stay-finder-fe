import Image from "next/image"

import type { Property } from "@/types/property"
import EditButton from "../EditButton"
import DeleteButton from "../DeleteButton"
import CreateBookingButton from "../Bookings/CreateBookingButton"

type PropertyDetailsProps = {
  property: Property
  mode: "card" | "detail"
}

export default function PropertyDetails({
  property,
  mode,
}: PropertyDetailsProps) {
  const isCard = mode === "card"
  const propertyImage =
    property.image_url ??
    "https://plus.unsplash.com/premium_photo-1770660113219-49fc5937bc74?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"

  return (
    <article
      className={
        isCard
          ? "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          : "overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
      }
    >
      <div
        className={`relative overflow-hidden bg-slate-100 ${
          isCard ? "aspect-[4/3]" : "aspect-[16/9] max-h-[34rem]"
        }`}
      >
        <Image
          src={propertyImage}
          alt={property.title}
          loading="eager"
          fill
          sizes={
            isCard
              ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              : "(max-width: 768px) 100vw, 768px"
          }
          className="object-cover"
          priority={!isCard}
        />
        {property.kind_of_property && (
          <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-sm">
            {property.kind_of_property}
          </span>
        )}
      </div>

      <div className={isCard ? "p-4" : "space-y-6 p-5 sm:p-8"}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            {isCard ? (
              <h2 className="truncate text-lg font-semibold text-slate-900">
                {property.title}
              </h2>
            ) : (
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {property.title}
              </h1>
            )}
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
          <p
            className={
              isCard
                ? "line-clamp-2 text-sm leading-6 text-slate-600"
                : "max-w-prose leading-7 text-slate-600"
            }
          >
            {property.description}
          </p>
        )}

        <p
          className={
            isCard
              ? "border-t border-slate-100 pt-3 text-sm text-slate-500"
              : "border-t border-slate-100 pt-5 text-sm text-slate-600"
          }
        >
          Up to {property.max_guests} guests
        </p>

        {!isCard && (
          <div className="flex flex-wrap items-start gap-3 border-t border-slate-100 pt-5">
            <CreateBookingButton
              propertyId={property.property_id}
              ownerId={property.owner_id}
            />
            <EditButton
              entityType="property"
              entityId={property.property_id}
              ownerId={property.owner_id}
            />
            <DeleteButton
              entityType="property"
              entityId={property.property_id}
              ownerId={property.owner_id}
            />
          </div>
        )}
      </div>
    </article>
  )
}