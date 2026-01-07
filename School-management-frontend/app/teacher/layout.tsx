import type React from "react"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { USER_ROLES } from "@/lib/constants"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Header } from "@/components/layout/header"

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const userRole = cookieStore.get("userRole")?.value

  if (userRole !== USER_ROLES.TEACHER && userRole !== USER_ROLES.SUPER_ADMIN && userRole !== USER_ROLES.SCHOOL_ADMIN) {
    redirect("/login")
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-[#f7fafd]">
        {/* Sidebar */}
        <aside className="w-[250px] shrink-0 border-r print:hidden">
          <AppSidebar />
        </aside>
        {/* Main Area */}
        <div className="flex-1 flex flex-col w-full overflow-hidden">
                              <div className="fixed top-0 left-[255px] right-0 z-50 bg-white border-b h-16">

        <Header />
      </div>

         
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto px-4 py-6 md:px-6 pt-[64px]">
            <div className="w-full">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
