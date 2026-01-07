"use client"

import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileInfoSection } from "@/components/profile/profile-info"
import { useAuthStore } from "@/hooks/useAuthStore"
import { BookOpen, Calendar, GraduationCap, Mail, MapPin, Phone, User, Users } from "lucide-react"

export default function TeacherProfilePage() {
  const { user } = useAuthStore()

  // Mock extended data
  const extendedData = {
    phone: "+1 (555) 234-5678",
    location: "Chicago, IL",
    joinDate: "August 15, 2021",
    subject: "Mathematics",
    qualification: "M.Sc. Mathematics, B.Ed",
    classes: "Grade 9A, 10B, 11A",
    employeeId: "TCH-2021-042",
    address: "456 Teacher's Way, Chicago, IL 60601",
    bio: "Passionate mathematics teacher with 5 years of experience. I believe in making math accessible and enjoyable for all students through interactive learning methods.",
    coverImage: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2070&auto=format&fit=crop"
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
    { label: "Address", value: extendedData.address, icon: MapPin },
  ]

  const academicInfo = [
    { label: "Subject Specialization", value: extendedData.subject, icon: BookOpen },
    { label: "Qualifications", value: extendedData.qualification, icon: GraduationCap },
    { label: "Assigned Classes", value: extendedData.classes, icon: Users },
    { label: "Date Joined", value: extendedData.joinDate, icon: Calendar },
  ]

  return (
    <div className="container mx-auto p-6 max-w-5xl space-y-6">
      <ProfileHeader user={headerUser} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProfileInfoSection title="Personal Information" items={personalInfo} />
        <ProfileInfoSection title="Academic Profile" items={academicInfo} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium mb-4">Teaching Philosophy</h3>
        <p className="text-muted-foreground leading-relaxed">
          {extendedData.bio}
        </p>
      </div>
    </div>
  )
}