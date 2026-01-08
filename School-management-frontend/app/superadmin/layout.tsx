import type React from "react"
import { redirect } from "next/navigation"
import { cookies } from "next/headers" // Import cookies
import { USER_ROLES } from "@/lib/constants"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Header } from "@/components/layout/header"

export default async function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const userRole = cookieStore.get("userRole")?.value // Get user role from cookies

  // Server-side check for role
  if (userRole !== USER_ROLES.SUPER_ADMIN) {
    redirect("/login") // Redirect if not authorized
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <div className="flex flex-1 flex-col min-h-screen">

        <Header />
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </SidebarProvider>
  )
}
