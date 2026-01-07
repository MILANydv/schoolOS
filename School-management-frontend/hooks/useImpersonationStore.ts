"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { USER_ROLES } from "@/lib/constants"

type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]

interface ImpersonatedUser {
  id: string
  name: string
  email: string
  role: UserRole
}

interface ImpersonationState {
  isImpersonating: boolean
  impersonatedUser: ImpersonatedUser | null
  startImpersonation: (user: ImpersonatedUser) => void
  stopImpersonation: () => void
}

export const useImpersonationStore = create<ImpersonationState>()(
  persist(
    (set) => ({
      isImpersonating: false,
      impersonatedUser: null,
      startImpersonation: (user) => set({ isImpersonating: true, impersonatedUser: user }),
      stopImpersonation: () => set({ isImpersonating: false, impersonatedUser: null }),
    }),
    {
      name: "impersonation-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
