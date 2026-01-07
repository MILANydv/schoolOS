"use client"

import type * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { useAuthStore } from "@/hooks/useAuthStore"
import { NAV_LINKS, Icons, USER_ROLES } from "@/lib/constants"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { user } = useAuthStore()
  const currentRole = user?.role || USER_ROLES.SUPER_ADMIN // Default to Super Admin for demo

  const navItems = NAV_LINKS[currentRole] || []

  return (
    <Sidebar {...props}>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          {/* Using a placeholder for the school icon, replace with your actual logo/icon */}
          <Icons.Building2 className="h-6 w-6" />
          <span className="text-lg">SchoolWise Pro</span>
        </Link>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = Icons[item.icon as keyof typeof Icons]
                const isActive = pathname.startsWith(item.href || "")

                if (item.subLinks) {
                  const isSubMenuOpen = item.subLinks.some((sub) => pathname.startsWith(sub.href))
                  return (
                    <Collapsible key={item.title} defaultOpen={isSubMenuOpen} className="group/collapsible">
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton isActive={isSubMenuOpen}>
                            {Icon && <Icon className="h-4 w-4" />}
                            <span>{item.title}</span>
                            <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.subLinks.map((subItem) => {
                              const isSubActive = pathname.startsWith(subItem.href)
                              return (
                                <SidebarMenuSubItem key={subItem.href}>
                                  <SidebarMenuSubButton asChild isActive={isSubActive}>
                                    <Link href={subItem.href}>{subItem.title}</Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              )
                            })}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  )
                }

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.href}>
                        {Icon && <Icon className="h-4 w-4" />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
