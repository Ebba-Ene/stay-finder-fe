"use client"

import { getMe, login, logOut, register } from "@/utils/authService";
import { createContext, useContext, useEffect, useState } from "react";
import type { PropsWithChildren } from "react";

// Beskriver vilka värden och funktioner som ska finnas tillgängliga
// för komponenter som använder AuthContext.
type AuthContextState = {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void | string>,
  register: (email: string, password: string, name: string) => Promise<void | string>,
  logout: () => Promise<void | string>;
}

// Standardvärden för contexten. De används om en komponent läser contexten
// utanför en AuthProvider.
const defaultState: AuthContextState = {
  user: null,
  login: () => Promise.resolve(),
  register: () => Promise.resolve(),
  logout: () => Promise.resolve(),
}

// Skapar contexten med standardvärdena ovan.
const AuthContext = createContext<AuthContextState>(defaultState)

// Providern omsluter delar av appen som behöver tillgång till auth-state.
const AuthProvider = ({children}: PropsWithChildren) => {
  // Lagrar användaren i React-state. Börjar som null, alltså ingen inloggad användare.
  const [user, setUser] = useState<typeof defaultState.user>(null)

  // Funktionen som exponeras från contexten för att logga in.
 const _register: typeof defaultState.register = async (email, password, name) => {
   try {
     // Skickar e-post och lösenord till auth-servicen.
     const authenticated = await register(email, password, name)
 
     // Om servicen rapporterar misslyckad inloggning går koden till catch-blocket.
     if(!authenticated) {
       throw "Registration failed"
     }
     
     // Vid lyckad regristrering avslutas funktionen här.
     return
   } catch(e) {
        console.warn("error in registration", e)
        return e instanceof Error ? e.message : "Registration failed"
   }
 }
 // Funktionen som exponeras från contexten för att logga in.
  const _login: typeof defaultState.login = async (email, password) => {
    try {
      // Skickar e-post och lösenord till auth-servicen.
      const authenticated = await login(email, password)

      // Om servicen rapporterar misslyckad inloggning går koden till catch-blocket.
      if(!authenticated) {
        throw "Invald credentials"
      }

      
      // Vid lyckad inloggning avslutas funktionen här.
      return
    } catch(e) {
        console.warn("error in logging in", e)
        return e instanceof Error ? e.message : "Invalid credentials"
    }
  }


  const _logout: typeof defaultState.logout = async () => {
    try {
      const loggedOut = await logOut()

      if(!loggedOut) {
        return "Logout failed"
      }

      setUser(null)
    } catch(e) {
      console.warn("Error logging out", e);
      return "Logout failed";
    }
  }

  const _getMe = async () => {
    try{
      const user = await getMe()
      if(!user){
        throw "User not found"
      }
      setUser(user)
    } catch(e) {
      console.warn("error in getting me", e)
    }
  }

  useEffect(() => {
    _getMe()
  }, [])

  // Gör user och login tillgängliga för komponenter inuti providern.
  return(
    <AuthContext.Provider
      value = {{
        user,
        register: _register,
        login: _login,
        logout: _logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Hook som komponenter kan använda för att läsa contexten.
const useAuth = () => {
    return useContext(AuthContext)
}

// Exporterar providern och hooken så andra filer kan använda dem.
export {
    AuthProvider,
    useAuth
}