"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LogOutButton() {
  const { logout } = useAuth()
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogout() {
    setLoggingOut(true)
    setMessage("")

    try {
      const error = await logout()
      if (error) {
        setMessage(error)
        return
      }

      router.replace("/")
      router.refresh()
    } catch {
      setMessage("Could not log out.")
    } finally {
      setLoggingOut(false)
    }
  }

  return(
    <div>
      <button
        type="button"
        onClick={handleLogout}
        disabled={loggingOut}
        aria-label="Log out"
        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loggingOut ? "Logging Out..." : "Log Out"}
      </button>
      {message && (
        <p role="status" className="mt-2 text-sm">
          {message}
        </p>
      )}
    </div>
  )
}