"use client"

import * as React from "react"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import {
  CreditCard,
  Users,
  Search,
  Download,
  Printer,
  Eye,
  QrCode,
  RefreshCw,
  X,
  AlertTriangle,
  CheckCircle,
  Settings,
  MapPin,
  Phone,
  Mail,
  Globe,
  Palette,
  Type,
  Layout,
  EyeOff
} from "lucide-react"
import { MOCK_STUDENTS, SCHOOL_INFO } from "@/lib/constants"
import { format } from "date-fns"

type Student = (typeof MOCK_STUDENTS)[number]

const IdentityCard: React.FC<{ 
  student: Student; 
  onClick: () => void; 
  viewMode: 'landscape' | 'portrait';
  customization?: any;
}> = ({ student, onClick, viewMode, customization = {} }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-emerald-500'
      case 'Inactive': return 'bg-amber-500'
      case 'Suspended': return 'bg-red-500'
      case 'Graduated': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Active': return 'Active'
      case 'Inactive': return 'Inactive'
      case 'Suspended': return 'Suspended'
      case 'Graduated': return 'Graduated'
      default: return 'Unknown'
    }
  }

  if (viewMode === 'portrait') {
    return (
      <div 
        className="bg-white rounded-lg shadow-lg border border-gray-300 relative overflow-hidden print:shadow-none print:border-2 print:rounded-none cursor-pointer hover:shadow-xl transition-all duration-200 hover:scale-[1.02] print:cursor-default print:hover:shadow-lg print:hover:scale-100"
        style={{
          width: '70mm',
          height: '85.6mm',
          backgroundColor: customization.backgroundColor || '#ffffff',
          borderRadius: `${customization.borderRadius || 8}px`,
          padding: `${customization.cardPadding || 8}px`,
          fontFamily: customization.fontFamily || 'Inter',
          boxShadow: customization.shadowIntensity === 'none' ? 'none' : 
                     customization.shadowIntensity === 'light' ? '0 1px 3px rgba(0,0,0,0.1)' :
                     customization.shadowIntensity === 'heavy' ? '0 10px 25px rgba(0,0,0,0.2)' :
                     '0 4px 6px rgba(0,0,0,0.1)'
        }}
        onClick={onClick}
      >
        {/* School Logo Watermark */}
        {customization.showWatermark !== false && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 z-0">
            <div className="text-6xl font-bold text-gray-400 transform -rotate-45">
              EA
            </div>
          </div>
        )}

        {/* Header - Portrait */}
        <div 
          className="text-white p-2 relative z-10"
          style={{ backgroundColor: customization.primaryColor || '#1d4ed8' }}
        >
          <div className="flex items-center justify-start gap-2">
            {/* School Logo */}
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold" style={{ color: customization.primaryColor || '#1d4ed8' }}>EA</span>
            </div>
            
            {/* School Info */}
            <div className="text-left min-w-0">
              <div className="font-bold tracking-wide truncate" style={{ fontSize: `${customization.headerFontSize || 14}px` }}>{SCHOOL_INFO.name}</div>
              <div className="opacity-90 truncate" style={{ fontSize: `${customization.labelFontSize || 11}px` }}>{SCHOOL_INFO.motto}</div>
            </div>
          </div>
        </div>

        {/* Content - Portrait Layout */}
        <div 
          className="h-[calc(100%-36px)] flex flex-col gap-2 relative z-10"
          style={{ padding: `${customization.cardPadding || 8}px` }}
        >
          {/* Top Row: Content starts from left, QR/Image on right */}
          <div className="flex justify-between items-start" style={{ gap: `${customization.elementSpacing || 4}px` }}>
            {/* Content Section - Left Side */}
            <div className="flex-1 space-y-1.5" style={{ fontSize: `${customization.contentFontSize || 12}px` }}>
              <div className="flex items-center" style={{ gap: `${customization.elementSpacing || 4}px` }}>
                <span className="font-semibold w-14" style={{ color: customization.primaryColor || '#1d4ed8' }}>Name:</span>
                <span className="font-bold truncate" style={{ color: customization.textColor || '#111827' }}>{student.name}</span>
              </div>

              <div className="flex items-center" style={{ gap: `${customization.elementSpacing || 4}px` }}>
                <span className="font-semibold w-14" style={{ color: customization.primaryColor || '#1d4ed8' }}>Class:</span>
                <span style={{ color: customization.textColor || '#111827' }}>{student.class}</span>
              </div>

              <div className="flex items-center" style={{ gap: `${customization.elementSpacing || 4}px` }}>
                <span className="font-semibold w-14" style={{ color: customization.primaryColor || '#1d4ed8' }}>Roll:</span>
                <span className="font-medium" style={{ color: customization.textColor || '#111827' }}>{student.rollNumber}</span>
              </div>

              <div className="flex items-center" style={{ gap: `${customization.elementSpacing || 4}px` }}>
                <span className="font-semibold w-14" style={{ color: customization.primaryColor || '#1d4ed8' }}>ID:</span>
                <span className="font-mono truncate" style={{ color: customization.textColor || '#111827' }}>{student.id}</span>
              </div>

              <div className="flex items-center" style={{ gap: `${customization.elementSpacing || 4}px` }}>
                <span className="font-semibold w-14" style={{ color: customization.primaryColor || '#1d4ed8' }}>Blood:</span>
                <span className="font-medium" style={{ color: customization.textColor || '#111827' }}>{student.bloodGroup}</span>
              </div>

              <div className="flex items-center" style={{ gap: `${customization.elementSpacing || 4}px` }}>
                <span className="font-semibold w-14" style={{ color: customization.primaryColor || '#1d4ed8' }}>Gender:</span>
                <span style={{ color: customization.textColor || '#111827' }}>{student.gender}</span>
              </div>

              <div className="flex items-center" style={{ gap: `${customization.elementSpacing || 4}px` }}>
                <span className="font-semibold w-14" style={{ color: customization.primaryColor || '#1d4ed8' }}>DOB:</span>
                <span style={{ color: customization.textColor || '#111827' }}>
                  {format(new Date(student.dateOfBirth), 'dd/MM/yyyy')}
                </span>
              </div>

              <div className="flex items-center" style={{ gap: `${customization.elementSpacing || 4}px` }}>
                <span className="font-semibold w-14" style={{ color: customization.primaryColor || '#1d4ed8' }}>Guardian:</span>
                <span className="truncate" style={{ color: customization.textColor || '#111827' }}>{student.parentName}</span>
              </div>

              <div className="flex items-center" style={{ gap: `${customization.elementSpacing || 4}px` }}>
                <span className="font-semibold w-14" style={{ color: customization.primaryColor || '#1d4ed8' }}>Contact:</span>
                <span className="font-mono truncate" style={{ color: customization.textColor || '#111827' }}>{student.parentContact}</span>
              </div>
            </div>

            {/* Photo and QR Section - Right Side */}
            {customization.showPhoto !== false && (
              <div className="flex flex-col items-center gap-1.5 ml-2">
                <Avatar className="border-2 border-gray-300 shadow-sm" style={{ width: '48px', height: '48px' }}>
                  <AvatarImage src={student.profileImage} alt={student.name} />
                  <AvatarFallback className="bg-gray-100 text-gray-700 font-bold text-xs">
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                {customization.showQRCode !== false && (
                  <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                    <QrCode className="h-3 w-3 text-gray-600" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Row: Card Number and Academic Year */}
          <div className="flex justify-between items-center mt-auto">
            {customization.showCardNumber !== false && (
              <div 
                className="text-white text-xs font-mono px-2 py-1 rounded"
                style={{ backgroundColor: customization.primaryColor || '#1d4ed8' }}
              >
                #{student.id.replace('std', '')}
              </div>
            )}
            {customization.showAcademicYear !== false && (
              <div 
                className="text-gray-700 text-xs px-2 py-1 rounded border border-gray-300 font-medium"
                style={{ backgroundColor: customization.backgroundColor || '#ffffff' }}
              >
                2024-25
              </div>
            )}
          </div>
        </div>

        {/* Footer - Portrait - More Compact */}
        <div 
          className="absolute bottom-0 left-0 right-0 text-white p-1 text-center z-10"
          style={{ backgroundColor: customization.secondaryColor || '#374151' }}
        >
          <div className="text-xs truncate">{SCHOOL_INFO.address}</div>
          <div className="text-xs opacity-80 truncate">{SCHOOL_INFO.phone} • {SCHOOL_INFO.email}</div>
        </div>

        {/* Principal Signature Place - Portrait - Adjusted for Compact Footer */}
        {customization.showSignature !== false && (
          <div className="absolute bottom-10 right-2 z-10 print:block">
            <div className="text-center">
              <div className="h-0.5 bg-gray-400 mb-1" style={{ width: '56px' }}></div>
              <div className="text-xs text-gray-600 font-medium">Principal</div>
            </div>
          </div>
        )}

        {/* Status Badge - Same as Landscape */}
        {customization.showStatus !== false && (
          <div 
            className="text-white text-xs px-2 py-1 rounded font-medium"
            style={{ 
              backgroundColor: customization.accentColor || '#059669',
              position: 'absolute',
              top: '8px',
              left: '8px'
            }}
          >
            {getStatusText(student.status)}
          </div>
        )}

        {/* Card Number - Same as Landscape */}
        <div className="absolute top-2 right-2 bg-blue-700 text-white text-xs font-mono px-2 py-1 rounded">
          #{student.id.replace('std', '')}
        </div>

        {/* Academic Year - Same as Landscape */}
        <div className="absolute bottom-2 right-2 bg-white text-gray-700 text-xs px-2 py-1 rounded border border-gray-300 font-medium">
          2024-25
        </div>

        {/* Hover Effect Indicator */}
        <div className="absolute inset-0 bg-blue-500 opacity-0 hover:opacity-5 transition-opacity duration-200 pointer-events-none print:hidden"></div>
      </div>
    )
  }

  // Landscape View (Original)
  return (
    <div 
      className="bg-white rounded-lg shadow-lg border border-gray-300 relative overflow-hidden print:shadow-none print:border-2 print:rounded-none cursor-pointer hover:shadow-xl transition-all duration-200 hover:scale-[1.02] print:cursor-default print:hover:shadow-lg print:hover:scale-100"
      style={{
        width: '90mm',
        height: '60mm',
        backgroundColor: customization.backgroundColor || '#ffffff',
        borderRadius: `${customization.borderRadius || 8}px`,
        padding: `${customization.cardPadding || 8}px`,
        fontFamily: customization.fontFamily || 'Inter',
        boxShadow: customization.shadowIntensity === 'none' ? 'none' : 
                   customization.shadowIntensity === 'light' ? '0 1px 3px rgba(0,0,0,0.1)' :
                   customization.shadowIntensity === 'heavy' ? '0 10px 25px rgba(0,0,0,0.2)' :
                   '0 4px 6px rgba(0,0,0,0.1)'
      }}
      onClick={onClick}
    >
      {/* School Logo Watermark */}
      {customization.showWatermark !== false && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 z-0">
          <div className="text-8xl font-bold text-gray-400 transform -rotate-45">
            EA
          </div>
        </div>
      )}

      {/* Header */}
      <div 
        className="text-white p-2 text-center relative z-10"
        style={{ backgroundColor: customization.primaryColor || '#1d4ed8' }}
      >
        <div className="flex items-center justify-start gap-3 px-2">
          {/* School Logo */}
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-lg font-bold" style={{ color: customization.primaryColor || '#1d4ed8' }}>EA</span>
          </div>
          
          {/* School Info */}
          <div className="text-left">
            <div className="font-bold tracking-wide" style={{ fontSize: `${customization.headerFontSize || 14}px` }}>{SCHOOL_INFO.name}</div>
            <div className="opacity-90" style={{ fontSize: `${customization.labelFontSize || 11}px` }}>{SCHOOL_INFO.motto}</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div 
        className="h-[calc(100%-44px)] flex gap-2.5 relative z-10"
        style={{ padding: `${customization.cardPadding || 8}px` }}
      >
        {/* Photo Section */}
        {customization.showPhoto !== false && (
          <div className="flex flex-col items-center gap-1.5">
            <Avatar className="border-2 border-gray-300 shadow-sm" style={{ width: '56px', height: '56px' }}>
              <AvatarImage src={student.profileImage} alt={student.name} />
              <AvatarFallback className="bg-gray-100 text-gray-700 font-bold text-xs">
                {student.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            {customization.showQRCode !== false && (
              <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                <QrCode className="h-4 w-4 text-gray-600" />
              </div>
            )}
          </div>
        )}

        {/* Details Section */}
        <div className="flex-1 space-y-1" style={{ fontSize: `${customization.contentFontSize || 12}px` }}>
          <div className="flex items-center" style={{ gap: `${customization.elementSpacing || 4}px` }}>
            <span className="font-semibold w-16" style={{ color: customization.primaryColor || '#1d4ed8' }}>Name:</span>
            <span className="font-bold truncate" style={{ color: customization.textColor || '#111827' }}>{student.name}</span>
          </div>

          <div className="flex items-center" style={{ gap: `${customization.elementSpacing || 4}px` }}>
            <span className="font-semibold w-16" style={{ color: customization.primaryColor || '#1d4ed8' }}>Class:</span>
            <span style={{ color: customization.textColor || '#111827' }}>{student.class}</span>
          </div>

          <div className="flex items-center" style={{ gap: `${customization.elementSpacing || 4}px` }}>
            <span className="font-semibold w-16" style={{ color: customization.primaryColor || '#1d4ed8' }}>Roll:</span>
            <span className="font-medium" style={{ color: customization.textColor || '#111827' }}>{student.rollNumber}</span>
          </div>

          <div className="flex items-center" style={{ gap: `${customization.elementSpacing || 4}px` }}>
            <span className="font-semibold w-16" style={{ color: customization.primaryColor || '#1d4ed8' }}>ID:</span>
            <span className="font-mono truncate" style={{ color: customization.textColor || '#111827' }}>{student.id}</span>
          </div>

          <div className="flex items-center" style={{ gap: `${customization.elementSpacing || 4}px` }}>
            <span className="font-semibold w-16" style={{ color: customization.primaryColor || '#1d4ed8' }}>Blood:</span>
            <span className="font-medium" style={{ color: customization.textColor || '#111827' }}>{student.bloodGroup}</span>
          </div>

          <div className="flex items-center" style={{ gap: `${customization.elementSpacing || 4}px` }}>
            <span className="font-semibold w-16" style={{ color: customization.primaryColor || '#1d4ed8' }}>Gender:</span>
            <span style={{ color: customization.textColor || '#111827' }}>{student.gender}</span>
          </div>

          <div className="flex items-center" style={{ gap: `${customization.elementSpacing || 4}px` }}>
            <span className="font-semibold w-16" style={{ color: customization.primaryColor || '#1d4ed8' }}>DOB:</span>
            <span style={{ color: customization.textColor || '#111827' }}>
              {format(new Date(student.dateOfBirth), 'dd/MM/yyyy')}
            </span>
          </div>

          <div className="flex items-center" style={{ gap: `${customization.elementSpacing || 4}px` }}>
            <span className="font-semibold w-16" style={{ color: customization.primaryColor || '#1d4ed8' }}>Guardian:</span>
            <span className="truncate" style={{ color: customization.textColor || '#111827' }}>{student.parentName}</span>
          </div>

          <div className="flex items-center" style={{ gap: `${customization.elementSpacing || 4}px` }}>
            <span className="font-semibold w-16" style={{ color: customization.primaryColor || '#1d4ed8' }}>Contact:</span>
            <span className="font-mono truncate" style={{ color: customization.textColor || '#111827' }}>{student.parentContact}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div 
        className="absolute bottom-0 left-0 right-0 text-white p-1 text-center z-10"
        style={{ backgroundColor: customization.secondaryColor || '#374151' }}
      >
        <div className="text-xs mb-0.5">{SCHOOL_INFO.address}</div>
        <div className="text-xs opacity-80">{SCHOOL_INFO.phone} • {SCHOOL_INFO.email}</div>
      </div>

      {/* Principal Signature Place - Moved lower and adjusted */}
      {customization.showSignature !== false && (
        <div className="absolute bottom-12 right-2 z-10 print:block">
          <div className="text-center">
            <div className="h-0.5 bg-gray-400 mb-1" style={{ width: '64px' }}></div>
            <div className="text-xs text-gray-600 font-medium">Principal</div>
          </div>
        </div>
      )}

      {/* Status Badge */}
      {customization.showStatus !== false && (
        <div 
          className="text-white text-xs px-2 py-1 rounded font-medium"
          style={{ 
            backgroundColor: customization.accentColor || '#059669',
            position: 'absolute',
            top: '8px',
            left: '8px'
          }}
        >
          {getStatusText(student.status)}
        </div>
      )}

      {/* Card Number */}
      {customization.showCardNumber !== false && (
        <div 
          className="text-white text-xs font-mono px-2 py-1 rounded"
          style={{ 
            backgroundColor: customization.primaryColor || '#1d4ed8',
            position: 'absolute',
            top: '8px',
            right: '8px'
          }}
        >
          #{student.id.replace('std', '')}
        </div>
      )}

      {/* Academic Year */}
      {customization.showAcademicYear !== false && (
        <div 
          className="text-gray-700 text-xs px-2 py-1 rounded border border-gray-300 font-medium"
          style={{ 
            backgroundColor: customization.backgroundColor || '#ffffff',
            position: 'absolute',
            bottom: '8px',
            right: '8px'
          }}
        >
          2024-25
        </div>
      )}

      {/* Hover Effect Indicator */}
      <div className="absolute inset-0 bg-blue-500 opacity-0 hover:opacity-5 transition-opacity duration-200 pointer-events-none print:hidden"></div>
    </div>
  )
}

export default function IdentityCardsPage() {
  const [students] = useState<Student[]>(MOCK_STUDENTS)
  const [searchTerm, setSearchTerm] = useState("")
  const [classFilter, setClassFilter] = useState("all")
  const [bloodGroupFilter, setBloodGroupFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'landscape' | 'portrait'>('landscape')
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false)
  const { toast } = useToast()

  // Customization state
  const [customization, setCustomization] = useState({
    // Color schemes
    primaryColor: '#1d4ed8', // Blue
    secondaryColor: '#374151', // Gray
    accentColor: '#059669', // Green
    backgroundColor: '#ffffff', // White
    textColor: '#111827', // Dark gray
    
    // Font settings
    headerFontSize: 14,
    contentFontSize: 12,
    labelFontSize: 11,
    fontFamily: 'Inter',
    
    // Layout options
    showQRCode: true,
    showPhoto: true,
    showWatermark: true,
    showSignature: true,
    showStatus: true,
    showCardNumber: true,
    showAcademicYear: true,
    
    // Spacing
    cardPadding: 8,
    elementSpacing: 4,
    
    // Border and shadow
    borderRadius: 8,
    shadowIntensity: 'medium',
    
    // Theme presets
    currentTheme: 'default'
  })

  // Theme presets
  const themePresets = {
    default: {
      primaryColor: '#1d4ed8',
      secondaryColor: '#374151',
      accentColor: '#059669',
      backgroundColor: '#ffffff',
      textColor: '#111827'
    },
    modern: {
      primaryColor: '#7c3aed',
      secondaryColor: '#1f2937',
      accentColor: '#10b981',
      backgroundColor: '#f8fafc',
      textColor: '#0f172a'
    },
    classic: {
      primaryColor: '#dc2626',
      secondaryColor: '#1f2937',
      accentColor: '#059669',
      backgroundColor: '#ffffff',
      textColor: '#111827'
    },
    corporate: {
      primaryColor: '#0f172a',
      secondaryColor: '#475569',
      accentColor: '#0284c7',
      backgroundColor: '#ffffff',
      textColor: '#0f172a'
    },
    vibrant: {
      primaryColor: '#f59e0b',
      secondaryColor: '#1f2937',
      accentColor: '#ef4444',
      backgroundColor: '#ffffff',
      textColor: '#111827'
    }
  }

  // Apply theme preset
  const applyTheme = (themeName: string) => {
    if (themePresets[themeName as keyof typeof themePresets]) {
      setCustomization(prev => ({
        ...prev,
        ...themePresets[themeName as keyof typeof themePresets],
        currentTheme: themeName
      }))
      toast({
        title: "Theme Applied",
        description: `${themeName.charAt(0).toUpperCase() + themeName.slice(1)} theme has been applied to all cards.`
      })
    }
  }

  // Reset to default
  const resetCustomization = () => {
    setCustomization({
      primaryColor: '#1d4ed8',
      secondaryColor: '#374151',
      accentColor: '#059669',
      backgroundColor: '#ffffff',
      textColor: '#111827',
      headerFontSize: 14,
      contentFontSize: 12,
      labelFontSize: 11,
      fontFamily: 'Inter',
      showQRCode: true,
      showPhoto: true,
      showWatermark: true,
      showSignature: true,
      showStatus: true,
      showCardNumber: true,
      showAcademicYear: true,
      cardPadding: 8,
      elementSpacing: 4,
      borderRadius: 8,
      shadowIntensity: 'medium',
      currentTheme: 'default'
    })
    toast({
      title: "Customization Reset",
      description: "All cards have been reset to default settings."
    })
  }

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.id.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesClass = classFilter === "all" || student.class === classFilter
      const matchesBloodGroup = bloodGroupFilter === "all" || student.bloodGroup === bloodGroupFilter
      const matchesStatus = statusFilter === "all" || student.status === statusFilter
      return matchesSearch && matchesClass && matchesBloodGroup && matchesStatus
    })
  }, [students, searchTerm, classFilter, bloodGroupFilter, statusFilter])

  const uniqueClasses = useMemo(() => {
    const classes = [...new Set(students.map(s => s.class))]
    return classes.sort()
  }, [students])

  const uniqueBloodGroups = useMemo(() => {
    const bloodGroups = [...new Set(students.map(s => s.bloodGroup))]
    return bloodGroups.sort()
  }, [students])

  const uniqueStatuses = useMemo(() => {
    const statuses = [...new Set(students.map(s => s.status))]
    return statuses.sort()
  }, [students])

  const handlePreviewCard = (student: Student) => {
    setSelectedStudent(student)
    setIsPreviewModalOpen(true)
  }

  const clearAllFilters = () => {
    setSearchTerm("")
    setClassFilter("all")
    setBloodGroupFilter("all")
    setStatusFilter("all")
  }

  return (
    <div className="w-full space-y-6">
      {/* Print Header - Only visible when printing */}
      <div className="hidden print:block print:fixed print:top-0 print:left-0 print:right-0 print:bg-white print:border-b-2 print:border-gray-300 print:p-4 print:z-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{SCHOOL_INFO.name}</h1>
          <p className="text-gray-600 mb-1">{SCHOOL_INFO.motto}</p>
          <p className="text-sm text-gray-500">{SCHOOL_INFO.address}</p>
          <p className="text-xs text-gray-400 mt-2">
            Generated on: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
          .print\\:fixed { position: fixed !important; }
          .print\\:top-0 { top: 0 !important; }
          .print\\:left-0 { left: 0 !important; }
          .print\\:right-0 { right: 0 !important; }
          .print\\:bg-white { background-color: white !important; }
          .print\\:border-b-2 { border-bottom-width: 2px !important; }
          .print\\:border-gray-300 { border-color: #d1d5db !important; }
          .print\\:p-4 { padding: 1rem !important; }
          .print\\:z-50 { z-index: 50 !important; }
          .print\\:p-0 { padding: 0 !important; }
          .print\\:w-full { width: 100% !important; }
          .print\\:bg-white { background-color: white !important; }
          .print\\:border-none { border: none !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:border-2 { border-width: 2px !important; }
          .print\\:rounded-none { border-radius: 0 !important; }
          
          body { 
            margin: 0 !important; 
            padding: 0 !important; 
            background: white !important; 
          }
          
          .card-grid { 
            display: grid !important; 
            grid-template-columns: repeat(auto-fill, minmax(${viewMode === 'portrait' ? '70mm' : '90mm'}, 1fr)) !important; 
            gap: 10mm !important; 
            padding: 10mm !important; 
            margin-top: 80px !important;
          }
        }
      `}</style>

      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 print:hidden">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-100 rounded-full">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Student Identity Cards</h1>
              <p className="text-gray-600">
                Generate, customize, and manage student identification cards
              </p>
            </div>
          </div>
          
          {/* School Info Banner */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-white">EA</span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-blue-900">{SCHOOL_INFO.name}</h2>
                  <p className="text-blue-700 text-sm">{SCHOOL_INFO.motto}</p>
                </div>
              </div>
              
              <div className="text-right text-blue-800">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm font-medium">{SCHOOL_INFO.address}</span>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {SCHOOL_INFO.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {SCHOOL_INFO.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    {SCHOOL_INFO.website}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Filters Section - Moved to header */}
          <div className="space-y-4">
            {/* View Mode Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">View Mode:</span>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('landscape')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                      viewMode === 'landscape'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    Landscape
                  </button>
                  <button
                    onClick={() => setViewMode('portrait')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                      viewMode === 'portrait'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    Portrait
                  </button>
                </div>
                
                {/* Customization Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCustomizationOpen(true)}
                  className="ml-4 text-purple-600 hover:text-purple-700 hover:bg-purple-50 border-purple-200"
                >
                  <Palette className="h-4 w-4 mr-2" />
                  Customize
                </Button>
              </div>
              
              {/* Card Count Display */}
              <div className="text-sm text-gray-600">
                {viewMode === 'landscape' ? '90×60mm' : '70×85.6mm'} Cards
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {uniqueClasses.map(cls => (
                    <SelectItem key={cls} value={cls}>Class {cls}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={bloodGroupFilter} onValueChange={setBloodGroupFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Blood Groups" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Blood Groups</SelectItem>
                  {uniqueBloodGroups.map(bg => (
                    <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {uniqueStatuses.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                onClick={clearAllFilters}
                className="h-10 px-4 hover:bg-gray-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
            
            {/* Active Filter Indicators */}
            {(searchTerm || classFilter !== "all" || bloodGroupFilter !== "all" || statusFilter !== "all") && (
              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-gray-500 font-medium">Active filters:</span>
                  {searchTerm && (
                    <Badge variant="outline" className="text-xs h-6">
                      Search: "{searchTerm}"
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-3 w-3 p-0 ml-1 hover:bg-gray-100"
                        onClick={() => setSearchTerm("")}
                      >
                        <X className="h-2 w-2" />
                      </Button>
                    </Badge>
                  )}
                  {classFilter !== "all" && (
                    <Badge variant="outline" className="text-xs h-6">
                      Class: {classFilter}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-3 w-3 p-0 ml-1 hover:bg-gray-100"
                        onClick={() => setClassFilter("all")}
                      >
                        <X className="h-2 w-2" />
                      </Button>
                    </Badge>
                  )}
                  {bloodGroupFilter !== "all" && (
                    <Badge variant="outline" className="text-xs h-6">
                      Blood: {bloodGroupFilter}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-3 w-3 p-0 ml-1 hover:bg-gray-100"
                        onClick={() => setBloodGroupFilter("all")}
                      >
                        <X className="h-2 w-2" />
                      </Button>
                    </Badge>
                  )}
                  {statusFilter !== "all" && (
                    <Badge variant="outline" className="text-xs h-6">
                      Status: {statusFilter}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-3 w-3 p-0 ml-1 hover:bg-gray-100"
                        onClick={() => setStatusFilter("all")}
                      >
                        <X className="h-2 w-2" />
                      </Button>
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <Card className="border-0 shadow-lg print:block print:w-full print:bg-white print:border-none print:shadow-none">
        <CardHeader className="print:hidden">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Users className="h-5 w-5 text-blue-600" />
              Student Cards ({filteredStudents.length})
            </CardTitle>
            
            {/* Statistics Summary and Actions */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Total: {students.length}
                </span>
                <span className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Active: {students.filter(s => s.status === 'Active').length}
                </span>
                <span className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full">
                  <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                  Filtered: {filteredStudents.length}
                </span>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => window.print()}
                  className="hover:bg-green-50 hover:border-green-200 text-green-700"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print All
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    toast({
                      title: "Download All",
                      description: `Downloading ${filteredStudents.length} ID cards`,
                    })
                  }}
                  className="hover:bg-purple-50 hover:border-purple-200 text-purple-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download All
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="print:p-0">
          {filteredStudents.length === 0 ? (
            <div className="text-center py-12 print:hidden">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className={`grid gap-6 card-grid ${
              viewMode === 'portrait' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5' 
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            }`}>
              {filteredStudents.map((student) => (
                <div key={student.id} className="flex flex-col items-center gap-4">
                  <IdentityCard 
                    student={student} 
                    onClick={() => handlePreviewCard(student)} 
                    viewMode={viewMode}
                    customization={customization}
                  />
                  
                  {/* Click Hint - Hidden when printing */}
                  <div className="text-center print:hidden">
                    <p className="text-xs text-gray-500">Click card to view details</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Modal */}
      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600" />
              Student Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedStudent && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="scale-150 transform origin-center">
                  <IdentityCard student={selectedStudent} onClick={() => {}} viewMode={viewMode} customization={customization} />
                </div>
              </div>
              
              <div className="flex justify-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    toast({
                      title: "Print Card",
                      description: `Printing ID card for ${selectedStudent.name}`,
                    })
                  }}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print Card
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    toast({
                      title: "Download Card",
                      description: `Downloading ID card for ${selectedStudent.name}`,
                    })
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Card
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Customization Modal */}
      <Dialog open={isCustomizationOpen} onOpenChange={setIsCustomizationOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-purple-600" />
              Customize Identity Cards
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Theme Presets */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Theme Presets</Label>
              <div className="grid grid-cols-5 gap-3">
                {Object.entries(themePresets).map(([name, theme]) => (
                  <button
                    key={name}
                    onClick={() => applyTheme(name)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      customization.currentTheme === name
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex gap-1">
                        <div 
                          className="w-4 h-4 rounded" 
                          style={{ backgroundColor: theme.primaryColor }}
                        />
                        <div 
                          className="w-4 h-4 rounded" 
                          style={{ backgroundColor: theme.secondaryColor }}
                        />
                        <div 
                          className="w-4 h-4 rounded" 
                          style={{ backgroundColor: theme.accentColor }}
                        />
                      </div>
                      <div className="text-xs font-medium capitalize">{name}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Customization */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Label className="text-sm font-medium">Primary Colors</Label>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600">Primary Color</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="color"
                        value={customization.primaryColor}
                        onChange={(e) => setCustomization(prev => ({ ...prev, primaryColor: e.target.value }))}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={customization.primaryColor}
                        onChange={(e) => setCustomization(prev => ({ ...prev, primaryColor: e.target.value }))}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600">Secondary Color</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="color"
                        value={customization.secondaryColor}
                        onChange={(e) => setCustomization(prev => ({ ...prev, secondaryColor: e.target.value }))}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={customization.secondaryColor}
                        onChange={(e) => setCustomization(prev => ({ ...prev, secondaryColor: e.target.value }))}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600">Accent Color</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="color"
                        value={customization.accentColor}
                        onChange={(e) => setCustomization(prev => ({ ...prev, accentColor: e.target.value }))}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={customization.accentColor}
                        onChange={(e) => setCustomization(prev => ({ ...prev, accentColor: e.target.value }))}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-medium">Background & Text</Label>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600">Background Color</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="color"
                        value={customization.backgroundColor}
                        onChange={(e) => setCustomization(prev => ({ ...prev, backgroundColor: e.target.value }))}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={customization.backgroundColor}
                        onChange={(e) => setCustomization(prev => ({ ...prev, backgroundColor: e.target.value }))}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600">Text Color</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="color"
                        value={customization.textColor}
                        onChange={(e) => setCustomization(prev => ({ ...prev, textColor: e.target.value }))}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={customization.textColor}
                        onChange={(e) => setCustomization(prev => ({ ...prev, textColor: e.target.value }))}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Font Settings */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Typography</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600">Header Font Size: {customization.headerFontSize}px</Label>
                    <Slider
                      value={[customization.headerFontSize]}
                      onValueChange={(value) => setCustomization(prev => ({ ...prev, headerFontSize: value[0] }))}
                      max={20}
                      min={10}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600">Content Font Size: {customization.contentFontSize}px</Label>
                    <Slider
                      value={[customization.contentFontSize]}
                      onValueChange={(value) => setCustomization(prev => ({ ...prev, contentFontSize: value[0] }))}
                      max={16}
                      min={8}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600">Label Font Size: {customization.labelFontSize}px</Label>
                    <Slider
                      value={[customization.labelFontSize]}
                      onValueChange={(value) => setCustomization(prev => ({ ...prev, labelFontSize: value[0] }))}
                      max={14}
                      min={8}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600">Font Family</Label>
                    <Select value={customization.fontFamily} onValueChange={(value) => setCustomization(prev => ({ ...prev, fontFamily: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inter">Inter</SelectItem>
                        <SelectItem value="Roboto">Roboto</SelectItem>
                        <SelectItem value="Open Sans">Open Sans</SelectItem>
                        <SelectItem value="Lato">Lato</SelectItem>
                        <SelectItem value="Poppins">Poppins</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Layout Options */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Layout Elements</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="showQRCode"
                    checked={customization.showQRCode}
                    onCheckedChange={(checked) => setCustomization(prev => ({ ...prev, showQRCode: checked }))}
                  />
                  <Label htmlFor="showQRCode" className="text-sm">QR Code</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="showPhoto"
                    checked={customization.showPhoto}
                    onCheckedChange={(checked) => setCustomization(prev => ({ ...prev, showPhoto: checked }))}
                  />
                  <Label htmlFor="showPhoto" className="text-sm">Photo</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="showWatermark"
                    checked={customization.showWatermark}
                    onCheckedChange={(checked) => setCustomization(prev => ({ ...prev, showWatermark: checked }))}
                  />
                  <Label htmlFor="showWatermark" className="text-sm">Watermark</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="showSignature"
                    checked={customization.showSignature}
                    onCheckedChange={(checked) => setCustomization(prev => ({ ...prev, showSignature: checked }))}
                  />
                  <Label htmlFor="showSignature" className="text-sm">Signature</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="showStatus"
                    checked={customization.showStatus}
                    onCheckedChange={(checked) => setCustomization(prev => ({ ...prev, showStatus: checked }))}
                  />
                  <Label htmlFor="showStatus" className="text-sm">Status Badge</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="showCardNumber"
                    checked={customization.showCardNumber}
                    onCheckedChange={(checked) => setCustomization(prev => ({ ...prev, showCardNumber: checked }))}
                  />
                  <Label htmlFor="showCardNumber" className="text-sm">Card Number</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="showAcademicYear"
                    checked={customization.showAcademicYear}
                    onCheckedChange={(checked) => setCustomization(prev => ({ ...prev, showAcademicYear: checked }))}
                  />
                  <Label htmlFor="showAcademicYear" className="text-sm">Academic Year</Label>
                </div>
              </div>
            </div>

            {/* Spacing and Layout */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Spacing & Layout</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600">Card Padding: {customization.cardPadding}px</Label>
                    <Slider
                      value={[customization.cardPadding]}
                      onValueChange={(value) => setCustomization(prev => ({ ...prev, cardPadding: value[0] }))}
                      max={16}
                      min={4}
                      step={2}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600">Element Spacing: {customization.elementSpacing}px</Label>
                    <Slider
                      value={[customization.elementSpacing]}
                      onValueChange={(value) => setCustomization(prev => ({ ...prev, elementSpacing: value[0] }))}
                      max={8}
                      min={2}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600">Border Radius: {customization.borderRadius}px</Label>
                    <Slider
                      value={[customization.borderRadius]}
                      onValueChange={(value) => setCustomization(prev => ({ ...prev, borderRadius: value[0] }))}
                      max={16}
                      min={0}
                      step={2}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600">Shadow Intensity</Label>
                    <Select value={customization.shadowIntensity} onValueChange={(value) => setCustomization(prev => ({ ...prev, shadowIntensity: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="heavy">Heavy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Live Preview</Label>
              <div className="flex justify-center">
                <div className="scale-75 transform origin-center">
                  <IdentityCard 
                    student={students[0]} 
                    onClick={() => {}} 
                    viewMode={viewMode}
                    customization={customization}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={resetCustomization}
              className="text-orange-600 border-orange-200 hover:bg-orange-50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset to Default
            </Button>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setIsCustomizationOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setIsCustomizationOpen(false)
                  toast({
                    title: "Customization Applied",
                    description: "All identity cards have been updated with your custom settings."
                  })
                }}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Apply Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
