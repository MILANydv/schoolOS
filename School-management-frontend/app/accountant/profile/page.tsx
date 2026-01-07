"use client"

import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileInfoSection } from "@/components/profile/profile-info"
import { useAuthStore } from "@/hooks/useAuthStore"
import { Award, Building, Calculator, Calendar, FileText, Mail, MapPin, Phone, User } from "lucide-react"

export default function AccountantProfilePage() {
    const { user } = useAuthStore()

    // Mock extended data
    const extendedData = {
        phone: "+1 (555) 444-3333",
        location: "New York, USA",
        joinDate: "January 10, 2021",
        department: "Finance & Accounts",
        qualification: "CPA, MBA Finance",
        employeeId: "ACC-2021-015",
        address: "789 Finance Blvd, New York, NY 10001",
        bio: "Detail-oriented accountant with expertise in school financial management, budgeting, and auditing. Committed to transparency and fiscal responsibility.",
        coverImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2072&auto=format&fit=crop"
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

    const professionalInfo = [
        { label: "Department", value: extendedData.department, icon: Building },
        { label: "Qualifications", value: extendedData.qualification, icon: Award },
        { label: "Employee ID", value: extendedData.employeeId, icon: FileText },
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
                <h3 className="text-lg font-medium mb-4">Professional Summary</h3>
                <p className="text-muted-foreground leading-relaxed">
                    {extendedData.bio}
                </p>
            </div>
        </div>
    )
}
