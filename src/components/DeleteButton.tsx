"use client"

import { useState } from "react"
import { deleteProperty } from "@/utils/propertyService"
import { useAuth } from "@/contexts/AuthContext"

type DeleteButtonProps = {
  entityId: string,
  entityType: "property" | "booking"
  ownerId: string | null
  onDeleted?: () => void
}

export default function DeleteButton({
  entityId,
  ownerId,
  onDeleted,
  entityType,
}: DeleteButtonProps) {
  const { user } = useAuth()
  const [message, setMessage] = useState("")
  const [deleting, setDeleting] = useState(false)

  if (!user || user.id !== ownerId) {
    return null
  }

  async function handleDelete() {
    setDeleting(true)
    setMessage("")

    try {
      if(entityType === "property") {
        await deleteProperty(entityId)
        setMessage("Boendet have been deleted.")
      } else if(entityType === "booking"){
        // await deleteBooking(entityId)
        setMessage("Booking har raderats.")
      }
      onDeleted?.()
    } catch {
      setMessage("Kunde inte radera boendet.")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        aria-label="Radera boende"
        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {deleting ? "Raderar..." : "Radera boende"}
      </button>
      {message && (
        <p role="status" className="mt-2 text-sm">
          {message}
        </p>
      )}
    </div>
  )
}
