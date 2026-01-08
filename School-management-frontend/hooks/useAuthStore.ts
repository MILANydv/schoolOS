"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { USER_ROLES } from "@/lib/constants"

type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]

interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  login: (token: string, user: User) => void
  logout: () => void
  setRole: (role: UserRole) => void
}

const setUserRoleCookie = (role: string | null) => {
  if (typeof document === "undefined") return

  if (!role) {
    document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    return
  }

  document.cookie = `userRole=${role}; path=/; max-age=604800; SameSite=Lax`
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: (token, user) => {
        set({ token, user, isAuthenticated: true })

        if (typeof window !== "undefined") {
          localStorage.setItem("token", token)
        }
        setUserRoleCookie(user.role)
      },
      logout: () => {
        set({ token: null, user: null, isAuthenticated: false })

        if (typeof window !== "undefined") {
          localStorage.removeItem("token")
        }
        setUserRoleCookie(null)
      },
      setRole: (role) => {
        set((state) => ({
          user: state.user ? { ...state.user, role } : null,
        }))
        setUserRoleCookie(role)
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
