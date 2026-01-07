"use client"

import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileInfoSection } from "@/components/profile/profile-info"
import { useAuthStore } from "@/hooks/useAuthStore"
import { Building2, Calendar, Mail, MapPin, Phone, Shield, User } from "lucide-react"

export default function SchoolAdminProfilePage() {
    const { user } = useAuthStore()

    // Mock extended data - in a real app this would come from an API
    const extendedData = {
        phone: "+1 (555) 123-4567",
        location: "New York, USA",
        joinDate: "September 1, 2020",
        department: "Administration",
        employeeId: "SA-2020-001",
        schoolName: "Springfield High School",
        address: "123 Education Lane, Springfield, IL 62704",
        emergencyContact: "Jane Doe (+1 555-987-6543)",
        bio: "Experienced school administrator with a passion for educational technology and student success. Dedicated to creating a supportive and inclusive learning environment.",
        coverImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop"
    }

    if (!user) return null

    const headerUser = {
        name: user.name,
        role: user.role,
        email: user.email,
        phone: extendedData.phone,
        location: extendedData.location,
        avatar: undefined, // Will use fallback
        coverImage: extendedData.coverImage
    }

    const personalInfo = [
        { label: "Full Name", value: user.name, icon: User },
        { label: "Email Address", value: user.email, icon: Mail },
        { label: "Phone Number", value: extendedData.phone, icon: Phone },
        { label: "Address", value: extendedData.address, icon: MapPin },
    ]

    const professionalInfo = [
        { label: "Employee ID", value: extendedData.employeeId, icon: Shield },
        { label: "Department", value: extendedData.department, icon: Building2 },
        { label: "School Name", value: extendedData.schoolName, icon: Building2 },
        { label: "Date Joined", value: extendedData.joinDate, icon: Calendar },
    ]

    return (
        <div className="container mx-auto p-6 max-w-5xl space-y-6">
            <ProfileHeader user={headerUser} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProfileInfoSection title="Personal Information" items={personalInfo} />
                <ProfileInfoSection title="Professional Details" items={professionalInfo} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-medium mb-4">About</h3>
                <p className="text-muted-foreground leading-relaxed">
                    {extendedData.bio}
                </p>
            </div>
        </div>
    )
}
