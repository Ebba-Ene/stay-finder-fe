"use client"

import { useAuth } from "@/contexts/AuthContext"
import T from "../typography"
import Link from "next/link"

export default function AuthHeader() {
  const auth = useAuth()

  return(
    <div>
      {!auth.user && <Link href={"/auth/login"}>Log In</Link>}
      {auth.user && <T.Header>Welcome {auth.user.email}</T.Header>}

    </div>
  )
}