"use client"

import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileInfoSection } from "@/components/profile/profile-info"
import { useAuthStore } from "@/hooks/useAuthStore"
import { Book, Calendar, Contact, Droplets, Mail, MapPin, Phone, User } from "lucide-react"

export default function StudentProfilePage() {
  const { user } = useAuthStore()

  // Mock extended data
  const extendedData = {
    phone: "+1 (555) 345-6789",
    location: "Springfield, IL",
    admissionDate: "April 1, 2022",
    class: "Grade 10",
    section: "A",
    rollNumber: "10-A-23",
    bloodGroup: "O+",
    parentName: "Robert & Sarah Smith",
    parentPhone: "+1 (555) 999-8888",
    address: "789 Student Lane, Springfield, IL 62704",
    bio: "Enthusiastic student interested in science and robotics. Member of the school debate club and soccer team.",
    coverImage: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2071&auto=format&fit=crop"
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
    { label: "Date of Birth", value: "May 15, 2008", icon: Calendar },
    { label: "Blood Group", value: extendedData.bloodGroup, icon: Droplets },
    { label: "Address", value: extendedData.address, icon: MapPin },
  ]

  const academicInfo = [
    { label: "Class & Section", value: `${extendedData.class} - ${extendedData.section}`, icon: Book },
    { label: "Roll Number", value: extendedData.rollNumber, icon: User },
    { label: "Admission Date", value: extendedData.admissionDate, icon: Calendar },
    { label: "Attendance", value: "96%", icon: Calendar },
  ]

  const parentInfo = [
    { label: "Parent/Guardian Name", value: extendedData.parentName, icon: Contact },
    { label: "Parent Phone", value: extendedData.parentPhone, icon: Phone },
    { label: "Parent Email", value: "parents@example.com", icon: Mail },
  ]

  return (
    <div className="container mx-auto p-6 max-w-5xl space-y-6">
      <ProfileHeader user={headerUser} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProfileInfoSection title="Student Details" items={personalInfo} />
        <ProfileInfoSection title="Academic Information" items={academicInfo} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <ProfileInfoSection title="Parent/Guardian Details" items={parentInfo} columns={1} />
      </div>
    </div>
  )
}