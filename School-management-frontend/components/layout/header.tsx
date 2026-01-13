"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, LogOut, Moon, Settings, Sun, User, UserCog, UserPlus, GraduationCap, Users, X, AlertTriangle, Calendar as CalendarIcon, Award, Menu } from "lucide-react"
import { Tooltip as HeadlessTooltip } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useTheme } from "next-themes"
import { useAuthStore } from "@/hooks/useAuthStore"
import { useImpersonationStore } from "@/hooks/useImpersonationStore"
import { MOCK_BREADCRUMBS, USER_ROLES } from "@/lib/constants"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AddStudentModal } from "@/components/forms/add-student-modal"

// Unified Add Student Modal Component
function QuickAddStudentForm() {
  return (
    <AddStudentModal
      trigger={
        <Button variant="outline" size="sm" className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add Student
        </Button>
      }
      onSuccess={(studentData) => {
        // Handle successful student addition from dashboard header
        console.log("Student added from dashboard header:", studentData)
        // You can add any dashboard-specific logic here
        // For example, refresh dashboard stats, update notifications, etc.
      }}
    />
  )
}

const mockNotifications = [
  {
    id: 1,
    type: "warning",
    title: "Fee Collection Alert",
    message: "15 students have overdue fees totaling ₹45,000",
    action: "View Details",
    href: "/schooladmin/fees",
    icon: AlertTriangle,
    time: "2h ago"
  },
  {
    id: 2,
    type: "info",
    title: "Staff Meeting",
    message: "Monthly staff meeting scheduled for tomorrow at 3:00 PM",
    action: "View Calendar",
    href: "/schooladmin/events",
    icon: CalendarIcon,
    time: "3h ago"
  },
  {
    id: 3,
    type: "success",
    title: "Academic Achievement",
    message: "Class 10-A achieved 98% pass rate in mid-term exams",
    action: "View Results",
    href: "/schooladmin/results",
    icon: Award,
    time: "5h ago"
  }
]

export function Header() {
  const { setTheme, theme } = useTheme()
  const { user, logout, setRole } = useAuthStore()
  const { isImpersonating, impersonatedUser, stopImpersonation } = useImpersonationStore()
  const pathname = usePathname()
  const [notifications, setNotifications] = React.useState(mockNotifications)
  const [popoverOpen, setPopoverOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const hasUnread = notifications.length > 0

  // Ensure hydration consistency
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Avoid hydration mismatch by not rendering theme icons until mounted
  const ThemeIcon = React.useMemo(() => {
    if (!mounted) return null
    return theme === "light" ? (
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-transform duration-300" />
    ) : (
      <Moon className="h-[1.2rem] w-[1.2rem] rotate-180 scale-100 transition-transform duration-300" />
    )
  }, [theme, mounted])

  const breadcrumbs = MOCK_BREADCRUMBS[pathname] || [{ label: "Dashboard", href: "/" }]

  const handleLogout = () => {
    logout()
    // Clear cookie for middleware
    document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    // Redirect to login page
    window.location.href = "/login"
  }

  const handleStopImpersonation = () => {
    stopImpersonation()
    // Restore original role if needed, or redirect to original dashboard
    setRole(USER_ROLES.SUPER_ADMIN) // Assuming super admin was the original role
    window.location.href = "/superadmin/dashboard"
  }

  // Show Add Student button only for school admin
  const showAddStudent = user?.role === USER_ROLES.SCHOOL_ADMIN

  return (
    <div className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white/90 shadow-sm sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <SidebarTrigger className="-ml-1 md:hidden" /> {/* Mobile sidebar trigger */}
      <Separator orientation="vertical" className="mr-2 h-4 hidden md:block" />
      {/* Breadcrumbs only (no brand) */}
      <nav aria-label="Breadcrumb" className="flex-1 min-w-0">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground overflow-x-auto whitespace-nowrap">
          {(() => {
            const crumbs = breadcrumbs
            if (crumbs.length > 2 && typeof window !== 'undefined' && window.innerWidth < 640) {
              // On mobile, show only last 2
              return [
                <li key="ellipsis" className="px-1">…</li>,
                ...crumbs.slice(-2).map((crumb, index) => (
                  <li key={crumb.href} className="flex items-center gap-1">
                    {index > 0 && <span className="mx-1">/</span>}
                    {index === crumbs.slice(-2).length - 1 ? (
                      <span className="font-semibold text-foreground">{crumb.label}</span>
                    ) : (
                      <Link href={crumb.href} className="hover:underline focus:underline outline-none">{crumb.label}</Link>
                    )}
                  </li>
                ))
              ]
            }
            // On desktop, show all
            return crumbs.map((crumb, index) => (
              <li key={crumb.href} className="flex items-center gap-1">
                {index > 0 && <span className="mx-1">/</span>}
                {index === crumbs.length - 1 ? (
                  <span className="font-semibold text-foreground">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className="hover:underline focus:underline outline-none">{crumb.label}</Link>
                )}
              </li>
            ))
          })()}
        </ol>
      </nav>
      <div className="ml-auto flex items-center gap-2">
        {isImpersonating && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <UserCog className="h-4 w-4" />
            <span>
              Impersonating: {impersonatedUser?.name} ({impersonatedUser?.role})
            </span>
            <Button variant="outline" size="sm" onClick={handleStopImpersonation}>
              Stop Impersonating
            </Button>
          </div>
        )}

        {/* Add Student Button - Only for School Admin */}
        {showAddStudent && <QuickAddStudentForm />}

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 relative focus-visible:ring-2 focus-visible:ring-blue-400"
                    aria-label="Open notifications"
                  >
                    <Bell className="h-4 w-4" />
                    {hasUnread && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80 p-0 rounded-xl shadow-xl border border-blue-100">
                  <div className="flex items-center justify-between px-4 py-2 border-b bg-blue-50 rounded-t-xl">
                    <span className="font-semibold text-blue-700">Notifications</span>
                    {hasUnread && (
                      <Button variant="ghost" size="sm" className="text-xs" onClick={() => setNotifications([])}>
                        Mark all as read
                      </Button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y">
                    {notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground text-sm">
                        <Bell className="h-8 w-8 mb-2 text-blue-200" />
                        <span>No new notifications</span>
                      </div>
                    ) : (
                      notifications.map((n) => {
                        let border, bg, iconColor
                        if (n.type === "warning") {
                          border = "border-orange-400"
                          bg = "bg-orange-50"
                          iconColor = "text-orange-500"
                        } else if (n.type === "info") {
                          border = "border-blue-400"
                          bg = "bg-blue-50"
                          iconColor = "text-blue-500"
                        } else if (n.type === "success") {
                          border = "border-green-400"
                          bg = "bg-green-50"
                          iconColor = "text-green-500"
                        } else {
                          border = "border-gray-200"
                          bg = "bg-gray-50"
                          iconColor = "text-gray-400"
                        }
                        const Icon = n.icon
                        return (
                          <div
                            key={n.id}
                            className={`flex items-start gap-3 p-4 ${bg} border-l-4 ${border} hover:bg-blue-100/60 transition rounded-none`}
                          >
                            <div className="mt-1">
                              <Icon className={`h-5 w-5 ${iconColor}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-sm mb-1 flex items-center gap-2">
                                {n.title}
                                <span className="text-xs text-muted-foreground font-normal">· {n.time}</span>
                              </div>
                              <div className="text-xs text-muted-foreground mb-1 leading-snug">{n.message}</div>
                              <Button asChild variant="link" size="sm" className="px-0 text-xs font-semibold">
                                <Link href={n.href}>{n.action}</Link>
                              </Button>
                            </div>
                            <Button variant="ghost" size="icon" className="ml-2" onClick={() => setNotifications(notifications.filter(x => x.id !== n.id))} aria-label="Dismiss notification">
                              <X className="h-4 w-4 text-gray-400" />
                            </Button>
                          </div>
                        )
                      })
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </TooltipTrigger>
            <TooltipContent side="bottom">Notifications</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 focus-visible:ring-2 focus-visible:ring-blue-400"
                    aria-label="Toggle theme"
                  >
                    <span className="sr-only">Toggle theme</span>
                    {mounted && (
                      <span className="transition-transform duration-300">
                        {ThemeIcon}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TooltipTrigger>
            <TooltipContent side="bottom">{mounted && theme === "light" ? "Switch to dark mode" : mounted ? "Switch to light mode" : "Toggle theme"}</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full focus-visible:ring-2 focus-visible:ring-blue-400"
                    aria-label="User menu"
                  >
                    <Avatar>
                      <AvatarFallback>{user?.name?.split(" ").map(n => n[0]).join("") || "U"}</AvatarFallback>
                    </Avatar>
                    <span className="sr-only">User menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name || "Guest User"}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email || "guest@example.com"}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={user?.role === USER_ROLES.STUDENT_PARENT ? "/student-parent/profile" : `/${user?.role.toLowerCase().replace("_", "")}/profile`}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={user?.role === USER_ROLES.STUDENT_PARENT ? "/student-parent/profile/settings" : `/${user?.role.toLowerCase().replace("_", "")}/profile/settings`}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TooltipTrigger>
            <TooltipContent side="bottom">User menu</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
