"use client"

import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileInfoSection } from "@/components/profile/profile-info"
import { useAuthStore } from "@/hooks/useAuthStore"
import { Calendar, Globe, Lock, Mail, MapPin, Phone, Server, User } from "lucide-react"

export default function SuperAdminProfilePage() {
  const { user } = useAuthStore()

  // Mock extended data
  const extendedData = {
    phone: "+1 (555) 000-1111",
    location: "San Francisco, CA",
    lastLogin: "Today, 10:42 AM",
    accessLevel: "Root / Full Access",
    systemRole: "System Administrator",
    managedSchools: 12,
    address: "1 Tech Plaza, San Francisco, CA 94105",
    bio: "Overseeing the entire school management platform. Responsible for system stability, security, and global configurations.",
    coverImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
  }

  if (!user) return null

  const headerUser = {
    name: user.name,
    role: user.role,
    email: user.email,
    phone: extendedData.phone,
    location: extendedData.location,
    avatar: undefined,
    coverImage: extendedData.coverImage
  }

  const personalInfo = [
    { label: "Full Name", value: user.name, icon: User },
    { label: "Email Address", value: user.email, icon: Mail },
    { label: "Phone Number", value: extendedData.phone, icon: Phone },
    { label: "Office Location", value: extendedData.location, icon: MapPin },
  ]

  const systemInfo = [
    { label: "Access Level", value: extendedData.accessLevel, icon: Lock },
    { label: "System Role", value: extendedData.systemRole, icon: Server },
    { label: "Managed Schools", value: extendedData.managedSchools, icon: Globe },
    { label: "Last Login", value: extendedData.lastLogin, icon: Calendar },
  ]

  return (
    <div className="container mx-auto p-6 max-w-5xl space-y-6">
      <ProfileHeader user={headerUser} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProfileInfoSection title="Administrator Details" items={personalInfo} />
        <ProfileInfoSection title="System Information" items={systemInfo} />
      </div>
    </div>
  )
}
