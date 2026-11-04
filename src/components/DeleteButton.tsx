"use client"

import { useState } from "react"
import { deleteProperty } from "@/utils/propertyService"
import { useAuth } from "@/contexts/AuthContext"
import { deleteBooking } from "@/utils/bookingService"

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
        setMessage("Stay have been deleted.")
      } else if(entityType === "booking"){
        await deleteBooking(entityId)
        setMessage("Booking have been deleted.")
      }
      onDeleted?.()
    } catch {
      setMessage(`Could not delete ${entityType}.`)
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
        aria-label={`Delete ${entityType}`}
        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {deleting ? "Deleting..." : `Delete ${entityType}.`}
      </button>
      {message && (
        <p role="status" className="mt-2 text-sm">
          {message}
        </p>
      )}
    </div>
  )
}
