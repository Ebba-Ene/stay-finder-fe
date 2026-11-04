
async function ensureSuccessfulResponse(response: Response): Promise<void> {
  if (response.ok) {
    return
  }

  let message = `Request failed (${response.status})`

  try {
    const body: unknown = await response.json()
    if (
      typeof body === "object" &&
      body !== null &&
      "message" in body &&
      typeof body.message === "string"
    ) {
      message = body.message
    }
  } catch {
    // Keep the HTTP status message when the response is not valid JSON.
  }

  throw new Error(message)
}

export async function getMe(): Promise<AuthUser | null> {
  const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me/`)

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
  })

  if (response.status === 401) {
    return null
  }

  await ensureSuccessfulResponse(response)
  const data = await response.json()
  return (data?.user as AuthUser | null) ?? null
}

export async function register(email: string, password: string, name: string){
  const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register/`)

  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email, 
      password,
      name
    })
  })

  await ensureSuccessfulResponse(response)
  return true
}

export async function login(email: string, password: string) {
  const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login/`)
  
  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email, 
      password,
    })
  })

  await ensureSuccessfulResponse(response)
  return true
}

export async function logOut(){
  const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout/`)

    const response = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
  })

  if (response.ok) {
    return true
  }

  return false
}