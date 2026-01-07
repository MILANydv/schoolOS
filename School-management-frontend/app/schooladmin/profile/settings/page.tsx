"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FormInput } from "@/components/forms/form-input"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/toaster"
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip"
import { 
  Upload, 
  User, 
  Shield, 
  Bell, 
  School,
  Settings,
  Eye,
  EyeOff,
  Key,
  Mail,
  Phone,
  Globe,
  MapPin,
  Clock,
  Palette,
  Languages,
  Lock,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

// Enhanced Schemas for all settings
const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  title: z.string().min(1, "Title is required"),
  bio: z.string().optional(),
  avatar: z.string().optional(),
})

const schoolInfoSchema = z.object({
  schoolName: z.string().min(1, "School name is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  email: z.string().email("Invalid email address"),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  logoUrl: z.string().optional(),
})

const securitySchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type ProfileFormValues = z.infer<typeof profileSchema>
type SchoolInfoFormValues = z.infer<typeof schoolInfoSchema>
type SecurityFormValues = z.infer<typeof securitySchema>

export default function SchoolAdminProfileSettingsPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = React.useState("profile")
  const [showPassword, setShowPassword] = React.useState(false)

  // Mock current user data
  const currentUser = {
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@springfieldhigh.edu",
    phone: "+1 (555) 123-4567",
    title: "School Administrator",
    bio: "Dedicated education professional with 15+ years of experience in school administration.",
    avatar: "/placeholder-user.jpg",
  }

  // Mock school data
  const mockSchoolInfo = {
    schoolName: "Springfield High School",
    address: "123 Main Street, Springfield, IL 62701",
    phone: "+1 (555) 987-6543",
    email: "info@springfieldhigh.edu",
    website: "https://www.springfieldhigh.edu",
    logoUrl: "/placeholder-logo.png",
  }

  // Notification preferences state
  const [notificationSettings, setNotificationSettings] = React.useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    weeklyReports: true,
    systemAlerts: true,
    eventReminders: true,
  })

  // System preferences state
  const [systemSettings, setSystemSettings] = React.useState({
    theme: "light",
    language: "en",
    timezone: "America/Chicago",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
  })

  // Form handlers
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: currentUser,
  })

  const schoolForm = useForm<SchoolInfoFormValues>({
    resolver: zodResolver(schoolInfoSchema),
    defaultValues: mockSchoolInfo,
  })

  const securityForm = useForm<SecurityFormValues>({
    resolver: zodResolver(securitySchema),
  })

  const handleProfileSubmit = async (data: ProfileFormValues) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    })
  }

  const handleSchoolSubmit = async (data: SchoolInfoFormValues) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast({
      title: "School Information Updated",
      description: "School details have been saved successfully.",
    })
  }

  const handleSecuritySubmit = async (data: SecurityFormValues) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast({
      title: "Password Changed",
      description: "Your password has been updated successfully.",
    })
    securityForm.reset()
  }

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        profileForm.setValue("avatar", reader.result as string)
        toast({
          title: "Avatar Updated",
          description: "Profile picture has been updated.",
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        schoolForm.setValue("logoUrl", reader.result as string)
        toast({
          title: "Logo Updated",
          description: "School logo has been updated.",
        })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
        {/* Fixed Header */}
        <div className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
          <div className="p-6 pb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold tracking-tight">Profile & Settings</h1>
                <p className="text-lg text-muted-foreground mt-2">
                  Manage your personal profile, school information, and system preferences
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  School Administrator
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-[500px] h-12">
              <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <User className="w-4 h-4" />
                <span className="font-medium">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="school" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <School className="w-4 h-4" />
                <span className="font-medium">School</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <Shield className="w-4 h-4" />
                <span className="font-medium">Security</span>
              </TabsTrigger>
            </TabsList>

                        {/* Personal Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <div className="grid gap-6">
                {/* Profile Overview Card */}
                <Card className="border shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
                    <div className="flex items-center gap-6">
                      <Avatar className="h-28 w-28 border-4 border-white shadow-lg">
                        <AvatarImage 
                          src={profileForm.watch("avatar") || currentUser.avatar} 
                          alt="Profile Picture" 
                        />
                        <AvatarFallback className="bg-white text-blue-600 text-2xl font-bold">
                          {currentUser.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-white">
                        <h2 className="text-2xl font-bold">{currentUser.name}</h2>
                        <p className="text-blue-100">{currentUser.title}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <Badge className="bg-white/20 text-white border-white/30">
                            <User className="w-3 h-3 mr-1" />
                            Administrator
                          </Badge>
                          <Badge className="bg-white/20 text-white border-white/30">
                            <Clock className="w-3 h-3 mr-1" />
                            Active
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Profile Information Card */}
                <Card className="border shadow-sm">
                  <CardHeader className="bg-gray-50 border-b">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-600" />
                        Personal Information
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700"
                        onClick={() => profileForm.reset(currentUser)}
                      >
                        Edit Profile
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-6">
                      {/* Avatar Upload Section */}
                      <div className="flex items-center justify-center pb-6 border-b">
                        <div className="text-center">
                          <input 
                            id="avatar-upload" 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleAvatarUpload} 
                          />
                          <label htmlFor="avatar-upload">
                            <Button asChild variant="outline" size="sm" className="gap-2">
                    <span>
                                <Upload className="w-4 h-4" />
                                Change Profile Picture
                    </span>
                  </Button>
                </label>
                          <p className="text-xs text-muted-foreground mt-2">
                            JPG or PNG, max 2MB
                          </p>
                        </div>
                      </div>

                      {/* Profile Fields Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Full Name
                          </label>
                          <Input 
                            {...profileForm.register("name")}
                            placeholder="Enter your full name"
                            className="h-11"
                          />
                          {profileForm.formState.errors.name && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {profileForm.formState.errors.name.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                            <Info className="w-4 h-4" />
                            Job Title
                          </label>
                          <Input 
                            {...profileForm.register("title")}
                            placeholder="Enter your job title"
                            className="h-11"
                          />
                          {profileForm.formState.errors.title && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {profileForm.formState.errors.title.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            Email Address
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="w-3 h-3 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Primary contact email</p>
                              </TooltipContent>
                            </Tooltip>
                          </label>
                          <div className="relative">
                            <Input 
                              {...profileForm.register("email")}
                              type="email"
                              placeholder="Enter your email"
                              className="h-11 pl-10 bg-gray-50"
                              readOnly
                            />
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Contact admin to change email address
                          </p>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            Phone Number
                          </label>
                          <div className="relative">
                            <Input 
                              {...profileForm.register("phone")}
                              placeholder="Enter your phone number"
                              className="h-11 pl-10"
                            />
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          </div>
                          {profileForm.formState.errors.phone && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {profileForm.formState.errors.phone.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                          <Info className="w-4 h-4" />
                          Professional Bio
                        </label>
                        <Textarea 
                          {...profileForm.register("bio")}
                          placeholder="Write a brief bio about yourself..."
                          rows={4}
                          className="resize-none"
                        />
                        <p className="text-xs text-muted-foreground">
                          Describe your experience and expertise
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-6 border-t">
                        <div className="text-sm text-muted-foreground">
                          Last updated: {new Date().toLocaleDateString()}
                        </div>
                        <Button 
                          type="submit" 
                          className="bg-blue-600 hover:bg-blue-700 gap-2"
                          disabled={profileForm.formState.isSubmitting}
                        >
                          {profileForm.formState.isSubmitting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

                        {/* School Information Tab */}
            <TabsContent value="school" className="space-y-6">
              <div className="grid gap-6">
                {/* School Overview Card */}
                <Card className="border shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
                    <div className="flex items-center gap-6">
                      <Avatar className="h-28 w-28 rounded-xl border-4 border-white shadow-lg">
                        <AvatarImage 
                          src={schoolForm.watch("logoUrl") || mockSchoolInfo.logoUrl} 
                          alt="School Logo" 
                        />
                        <AvatarFallback className="bg-white text-indigo-600 text-2xl font-bold rounded-xl">
                          SH
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-white">
                        <h2 className="text-2xl font-bold">{mockSchoolInfo.schoolName}</h2>
                        <p className="text-indigo-100 flex items-center gap-2 mt-1">
                          <MapPin className="w-4 h-4" />
                          {mockSchoolInfo.address.split(',')[0]}
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                          <Badge className="bg-white/20 text-white border-white/30">
                            <School className="w-3 h-3 mr-1" />
                            K-12 Education
                          </Badge>
                          <Badge className="bg-white/20 text-white border-white/30">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Accredited
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* School Information Card */}
                <Card className="border shadow-sm">
                  <CardHeader className="bg-gray-50 border-b">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <School className="w-5 h-5 text-blue-600" />
                        School Details
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Update Logo
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <form onSubmit={schoolForm.handleSubmit(handleSchoolSubmit)} className="space-y-6">
                      {/* Logo Upload Section */}
                      <div className="flex items-center justify-center pb-6 border-b">
                        <div className="text-center">
                          <input 
                            id="logo-upload" 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleLogoUpload} 
                          />
                          <label htmlFor="logo-upload">
                            <Button asChild variant="outline" size="sm" className="gap-2">
                              <span>
                                <Upload className="w-4 h-4" />
                                Change School Logo
                              </span>
                            </Button>
                          </label>
                          <p className="text-xs text-muted-foreground mt-2">
                            PNG or SVG, max 2MB, square format
                          </p>
              </div>
            </div>

                      {/* School Fields Grid */}
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                            <School className="w-4 h-4" />
                            School Name
                            <Tooltip>
                              <TooltipTrigger>
                                <Lock className="w-3 h-3 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Contact support to change school name</p>
                              </TooltipContent>
                            </Tooltip>
                          </label>
                          <div className="relative">
                            <Input 
                              {...schoolForm.register("schoolName")}
                              placeholder="Enter school name"
                              className="h-11 pl-10 bg-gray-50"
                              readOnly
                            />
                            <School className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            School Address
              </label>
                          <div className="relative">
              <Textarea
                              {...schoolForm.register("address")}
                              placeholder="Enter complete school address"
                              rows={3}
                              className="resize-none pl-10 pt-3"
                            />
                            <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                          </div>
                          {schoolForm.formState.errors.address && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {schoolForm.formState.errors.address.message}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              School Phone
                            </label>
                            <div className="relative">
                              <Input 
                                {...schoolForm.register("phone")}
                                placeholder="Enter school phone"
                                className="h-11 pl-10"
                              />
                              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                            {schoolForm.formState.errors.phone && (
                              <p className="text-sm text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {schoolForm.formState.errors.phone.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              School Email
                            </label>
                            <div className="relative">
                              <Input 
                                {...schoolForm.register("email")}
                                type="email"
                                placeholder="Enter school email"
                                className="h-11 pl-10"
                              />
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                            {schoolForm.formState.errors.email && (
                              <p className="text-sm text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {schoolForm.formState.errors.email.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            School Website
                          </label>
                          <div className="relative">
                            <Input 
                              {...schoolForm.register("website")}
                              placeholder="https://www.yourschool.edu"
                              className="h-11 pl-10"
                            />
                            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          </div>
                          {schoolForm.formState.errors.website && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {schoolForm.formState.errors.website.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-6 border-t">
                        <div className="text-sm text-muted-foreground">
                          School ID: #SPR-2024-001
            </div>
                        <Button 
                          type="submit" 
                          className="bg-blue-600 hover:bg-blue-700 gap-2"
                          disabled={schoolForm.formState.isSubmitting}
                        >
                          {schoolForm.formState.isSubmitting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Save School Info
                            </>
                          )}
            </Button>
                      </div>
          </form>
        </CardContent>
      </Card>
    </div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <div className="grid gap-6">
                {/* Security Overview Card */}
                <Card className="border shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-red-500 to-orange-600 p-6">
                    <div className="flex items-center justify-between">
                      <div className="text-white">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                          <Shield className="w-8 h-8" />
                          Account Security
                        </h2>
                        <p className="text-red-100 mt-2">
                          Keep your account secure with strong passwords and two-factor authentication
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-white/20 text-white border-white/30 text-lg px-4 py-2">
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Secure
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Change Password Card */}
                <Card className="border shadow-sm">
                  <CardHeader className="bg-gray-50 border-b">
                    <CardTitle className="flex items-center gap-2">
                      <Key className="w-5 h-5 text-blue-600" />
                      Change Password
                    </CardTitle>
                    <CardDescription>
                      Update your password regularly to keep your account secure
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <form onSubmit={securityForm.handleSubmit(handleSecuritySubmit)} className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            Current Password
                          </label>
                          <div className="relative">
                            <Input 
                              {...securityForm.register("currentPassword")}
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your current password"
                              className="h-11 pl-10 pr-12"
                            />
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-400" />
                              )}
                            </Button>
                          </div>
                          {securityForm.formState.errors.currentPassword && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {securityForm.formState.errors.currentPassword.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                            <Key className="w-4 h-4" />
                            New Password
                          </label>
                          <div className="relative">
                            <Input 
                              {...securityForm.register("newPassword")}
                              type="password"
                              placeholder="Enter a new password"
                              className="h-11 pl-10"
                            />
                            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          </div>
                          {securityForm.formState.errors.newPassword && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {securityForm.formState.errors.newPassword.message}
                            </p>
                          )}
                          <div className="mt-2">
                            <p className="text-xs text-muted-foreground mb-2">Password must contain:</p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-3 h-3 text-green-600" />
                                <span>At least 8 characters</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-3 h-3 text-green-600" />
                                <span>One uppercase letter</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-3 h-3 text-green-600" />
                                <span>One lowercase letter</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-3 h-3 text-green-600" />
                                <span>One number</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                            <Key className="w-4 h-4" />
                            Confirm New Password
                          </label>
                          <div className="relative">
                            <Input 
                              {...securityForm.register("confirmPassword")}
                              type="password"
                              placeholder="Confirm your new password"
                              className="h-11 pl-10"
                            />
                            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          </div>
                          {securityForm.formState.errors.confirmPassword && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {securityForm.formState.errors.confirmPassword.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-6 border-t">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => securityForm.reset()}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          className="bg-blue-600 hover:bg-blue-700 gap-2"
                          disabled={securityForm.formState.isSubmitting}
                        >
                          {securityForm.formState.isSubmitting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Updating...
                            </>
                          ) : (
                            <>
                              <Shield className="w-4 h-4" />
                              Update Password
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>

                {/* Security Settings Card */}
                <Card className="border shadow-sm">
                  <CardHeader className="bg-gray-50 border-b">
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5 text-blue-600" />
                      Advanced Security
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    {/* Two-Factor Authentication */}
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Shield className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Two-Factor Authentication (2FA)</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Add an extra layer of security to your account by requiring a verification code
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Key className="w-4 h-4" />
                        Enable 2FA
                      </Button>
                    </div>

                    {/* Login Notifications */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Bell className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Login Notifications</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Get notified when someone logs into your account from a new device
                          </p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    {/* Active Sessions */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Active Sessions
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <div>
                              <p className="text-sm font-medium">Current Session</p>
                              <p className="text-xs text-gray-600">Chrome on Windows • {new Date().toLocaleString()}</p>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-700 border-green-200">Active</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>


          </Tabs>
        </div>
    </div>
      <Toaster />
    </TooltipProvider>
  )
}
