import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { USER_ROLES } from "@/lib/constants"

interface User {
  id: string
  name: string
  email: string
  role: (typeof USER_ROLES)[keyof typeof USER_ROLES]
}

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  login: (token: string, user: User) => void
  logout: () => void
  setRole: (role: (typeof USER_ROLES)[keyof typeof USER_ROLES]) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: (token, user) => set({ token, user, isAuthenticated: true }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
      setRole: (role) =>
        set((state) => ({
          user: state.user ? { ...state.user, role } : null,
        })),
    }),
    {
      name: "auth-storage", // name of the item in storage (must be unique)
      storage: createJSONStorage(() => localStorage), // use localStorage for persistence
    },
  ),
)
