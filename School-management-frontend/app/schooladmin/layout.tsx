import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { USER_ROLES } from "@/lib/constants"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Header } from "@/components/layout/header"

export default async function SchoolAdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const userRole = (await cookieStore).get("userRole")?.value;

  if (userRole !== USER_ROLES.SCHOOL_ADMIN && userRole !== USER_ROLES.SUPER_ADMIN) {
    redirect("/login");
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-white">
        {/* Sidebar */}
        <aside className="w-[250px] shrink-0 border-r print:hidden">
          <AppSidebar />
        </aside>

        {/* Main Area */}
        <div className="flex-1 flex flex-col w-full overflow-hidden">
          {/* Header */}
          <header className="fixed top-0 left-0 right-0 z-0 bg-white shadow print:hidden w-full">
            <Header />
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto bg-gray-50 px-0 py-0 md:px-0 pt-[64px]">
            <div className="w-full">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
