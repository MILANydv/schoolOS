import type React from "react"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { USER_ROLES } from "@/lib/constants"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Header } from "@/components/layout/header"

export default async function StudentParentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const userRole = cookieStore.get("userRole")?.value

  if (
    userRole !== USER_ROLES.STUDENT_PARENT &&
    userRole !== USER_ROLES.SUPER_ADMIN &&
    userRole !== USER_ROLES.SCHOOL_ADMIN
  ) {
    redirect("/login")
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
    <div className="flex flex-1 flex-col min-h-screen">

        <Header />
        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
