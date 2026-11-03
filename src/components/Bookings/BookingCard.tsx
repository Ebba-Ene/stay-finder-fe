import type { Booking } from "@/types/booking"
import Link from "next/link"

type BookingCardProps = {
  booking: Booking
  mode: "mine" | "properties"
}

const statusStyles: Record<Booking["status"], string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-slate-100 text-slate-600",
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function BookingCard({ booking, mode }: BookingCardProps) {
  return(
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {mode === "mine" ? "Your booking" : "Booking for your property"}
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">
            {formatDate(booking.check_in)} – {formatDate(booking.check_out)}
          </h2>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[booking.status]}`}
        >
          {booking.status}
        </span>
      </div>

      <div className="space-y-4 p-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Guest
          </p>
          <p className="mt-1 font-medium text-slate-900">{booking.guest_name}</p>
          <p className="text-sm text-slate-600">{booking.guest_email}</p>
        </div>

        {mode === "mine" && booking.property_id ? (
          <Link
            href={`/properties/${booking.property_id}`}
            className="inline-flex text-sm font-semibold text-blue-700 hover:text-blue-800 hover:underline"
          >
            View property
          </Link>
        ) : mode === "mine" ? (
          <p className="text-sm text-slate-500">Property is no longer available.</p>
        ) : null}

        <div className="flex items-end justify-between gap-4 border-t border-slate-100 pt-4">
          <p className="text-sm text-slate-600">
            {booking.guests} {booking.guests === 1 ? "guest" : "guests"}
          </p>
          <p className="text-right font-semibold text-slate-900">
            {booking.total_price} kr
            <span className="block text-xs font-normal text-slate-500">
              total
            </span>
          </p>
        </div>
      </div>
    </article>
  )
}