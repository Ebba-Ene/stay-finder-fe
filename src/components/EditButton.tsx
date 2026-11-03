"use client"

import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"

type EditButtonProps = {
  entityType: "property" | "booking"
  entityId: string
  ownerId: string | null
}

export default function EditButton({
  entityType,
  entityId,
  ownerId,
}: EditButtonProps) {
  const { user } = useAuth()

  if (!user || user.id !== ownerId) {
    return null
  }

  const href =
    entityType === "property"
      ? `/properties/${entityId}/edit`
      : `/bookings/${entityId}/edit`

  return (
    <Link
      href={href}
      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        className="h-4 w-4"
      >
        <path
          d="m13.5 3.5 3 3M4 16l3.5-.7L16 6.8a2.12 2.12 0 0 0-3-3L4.5 12.3 4 16Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </svg>
      Edit {entityType}
    </Link>
  )
}
