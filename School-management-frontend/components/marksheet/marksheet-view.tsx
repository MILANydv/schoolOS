"use client"

import * as React from "react"
import { QRCodeSVG } from "qrcode.react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Document, Page, Text, View, Image as PDFImage, StyleSheet, pdf } from '@react-pdf/renderer'
import { useToast } from "@/components/ui/use-toast"
import { MOCK_RESULTS_APPROVAL } from "@/lib/constants"
import { MapPin, Phone, Mail } from "lucide-react"

type ResultApproval = (typeof MOCK_RESULTS_APPROVAL)[number]

interface MarkSheetViewProps {
  result?: ResultApproval
  student?: {
    studentId: string
    studentName: string
    rollNumber: string
    subjects: ResultApproval[]
  }
  onPrint?: () => void
  onDownload?: () => void
  showActions?: boolean
  className?: string
}

// Helper functions for grade and remarks
const getGrade = (marks: number, max: number) => {
  const pct = (marks / max) * 100
  if (pct >= 90) return "A+"
  if (pct >= 80) return "A"
  if (pct >= 70) return "B+"
  if (pct >= 60) return "B"
  if (pct >= 50) return "C"
  return "F"
}

const getRemarks = (marks: number, max: number) => {
  const percentage = Math.round((marks / max) * 100)
  if (percentage >= 90) return "Excellent"
  if (percentage >= 80) return "Very Good"
  if (percentage >= 70) return "Good"
  if (percentage >= 60) return "Needs Improvement"
  return "Fail"
}

export default function MarkSheetView({ 
  result, 
  student, 
  onPrint, 
  onDownload, 
  showActions = true,
  className = ""
}: MarkSheetViewProps) {
  const { toast } = useToast()
  const markSheetRef = React.useRef<HTMLDivElement>(null)

  // Determine which data to use
  const displayData = student || (result ? {
    studentId: result.studentId,
    studentName: result.studentName,
    rollNumber: result.rollNumber,
    subjects: MOCK_RESULTS_APPROVAL.filter(r => 
      r.studentId === result.studentId && 
      r.examName === result.examName && 
      r.class === result.class
    )
  } : null)

  if (!displayData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">No Data Available</h1>
          <p className="text-slate-600 mb-6">No marksheet data found.</p>
        </div>
      </div>
    )
  }

  // Calculate totals
  const totalMarks = displayData.subjects.reduce((sum, r) => sum + r.marks, 0)
  const totalMax = displayData.subjects.reduce((sum, r) => sum + r.maxMarks, 0)
  const percentage = totalMax ? Math.round((totalMarks / totalMax) * 100) : 0
  const examName = displayData.subjects[0]?.examName || ""
  const className_ = displayData.subjects[0]?.class || ""
  const date = new Date().toLocaleDateString()

  // Create PDF Document using @react-pdf/renderer
  const createPDFDocument = () => {
    const MyDocument = () => (
      <Document>
        <Page size="A4" style={{ padding: 40 }}>
          {/* Header */}
          <View style={{ 
            backgroundColor: '#1e40af', 
            color: 'white', 
            padding: 20, 
            marginBottom: 20,
            borderRadius: 8
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <PDFImage 
                src="/placeholder-logo.png" 
                style={{ width: 60, height: 60, marginRight: 20 }}
              />
              <View>
                <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>
                  Springfield International School
                </Text>
                <Text style={{ fontSize: 12, opacity: 0.9 }}>
                  123 Main Street, Anytown, ST 12345
                </Text>
                <Text style={{ fontSize: 12, opacity: 0.9 }}>
                  info@springfield.edu | +1 (555) 123-4567
                </Text>
              </View>
            </View>
          </View>

          {/* Student & Exam Info */}
          <View style={{ 
            backgroundColor: '#f8fafc', 
            padding: 20, 
            marginBottom: 20,
            borderRadius: 8
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>Student Information</Text>
                <Text style={{ fontSize: 12, marginBottom: 5 }}>Name: {displayData.studentName}</Text>
                <Text style={{ fontSize: 12, marginBottom: 5 }}>Roll: {displayData.rollNumber}</Text>
                <Text style={{ fontSize: 12 }}>Class: {className_}</Text>
              </View>
              <View>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>Exam Information</Text>
                <Text style={{ fontSize: 12, marginBottom: 5 }}>Exam: {examName}</Text>
                <Text style={{ fontSize: 12, marginBottom: 5 }}>Year: 2024-25</Text>
                <Text style={{ fontSize: 12 }}>Date: {new Date().toLocaleDateString()}</Text>
              </View>
            </View>
          </View>

          {/* Subject Table */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Subject Performance</Text>
            <View style={{ width: '100%', border: '1px solid #e2e8f0' }}>
              <View style={{ backgroundColor: '#f1f5f9' }}>
                <View style={{ flexDirection: 'row', padding: 8, fontSize: 12, fontWeight: 'bold' }}>
                  <Text style={{ padding: 8, fontSize: 12 }}>Subject</Text>
                  <Text style={{ padding: 8, fontSize: 12, textAlign: 'center', fontWeight: 'bold' }}>Max</Text>
                  <Text style={{ padding: 8, fontSize: 12, textAlign: 'center', fontWeight: 'bold' }}>Marks</Text>
                  <Text style={{ padding: 8, fontSize: 12, textAlign: 'center', fontWeight: 'bold' }}>%</Text>
                  <Text style={{ padding: 8, fontSize: 12, textAlign: 'center', fontWeight: 'bold' }}>Grade</Text>
                  <Text style={{ padding: 8, fontSize: 12, textAlign: 'center', fontWeight: 'bold' }}>Status</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'column' }}>
                {displayData.subjects.map((subject: ResultApproval, index: number) => {
                  const grade = getGrade(subject.marks, subject.maxMarks)
                  const percentage = Math.round((subject.marks / subject.maxMarks) * 100)
                  return (
                    <View key={index} style={{ flexDirection: 'row', backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                      <View style={{ flexDirection: 'column', padding: 8, fontSize: 12 }}>
                        <Text>{subject.subject}</Text>
                      </View>
                      <View style={{ flexDirection: 'column', padding: 8, fontSize: 12, textAlign: 'center' }}>
                        <Text>{subject.maxMarks}</Text>
                      </View>
                      <View style={{ flexDirection: 'column', padding: 8, fontSize: 12, textAlign: 'center', fontWeight: 'bold' }}>
                        <Text>{subject.marks}</Text>
                      </View>
                      <View style={{ flexDirection: 'column', padding: 8, fontSize: 12, textAlign: 'center' }}>
                        <Text>{percentage}%</Text>
                      </View>
                      <View style={{ flexDirection: 'column', padding: 8, fontSize: 12, textAlign: 'center', fontWeight: 'bold' }}>
                        <Text>{grade}</Text>
                      </View>
                      <View style={{ flexDirection: 'column', padding: 8, fontSize: 12, textAlign: 'center' }}>
                        <Text>{percentage >= 40 ? 'PASS' : 'FAIL'}</Text>
                      </View>
                    </View>
                  )
                })}
              </View>
              <View style={{ backgroundColor: '#dbeafe' }}>
                <View style={{ flexDirection: 'row', padding: 8, fontSize: 12, fontWeight: 'bold' }}>
                  <Text style={{ padding: 8, fontSize: 12 }}>Total</Text>
                  <Text style={{ padding: 8, fontSize: 12, textAlign: 'center', fontWeight: 'bold' }}>{totalMax}</Text>
                  <Text style={{ padding: 8, fontSize: 12, textAlign: 'center', fontWeight: 'bold' }}>{totalMarks}</Text>
                  <Text style={{ padding: 8, fontSize: 12, textAlign: 'center', fontWeight: 'bold' }}>{percentage}%</Text>
                  <Text style={{ padding: 8, fontSize: 12, textAlign: 'center', fontWeight: 'bold' }}>{getGrade(totalMarks, totalMax)}</Text>
                  <Text style={{ padding: 8, fontSize: 12, textAlign: 'center', fontWeight: 'bold' }}>{percentage >= 40 ? 'PASS' : 'FAIL'}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View style={{ 
            borderTop: '1px solid #e2e8f0', 
            paddingTop: 20,
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}>
            <View>
              <Text style={{ fontSize: 10, color: '#64748b' }}>Generated on: {new Date().toLocaleDateString()}</Text>
              <Text style={{ fontSize: 10, color: '#64748b', fontStyle: 'italic' }}>Computer-generated document</Text>
            </View>
            <View>
              <Text style={{ fontSize: 10, color: '#64748b' }}>Result ID: {displayData.studentId}</Text>
            </View>
          </View>
        </Page>
      </Document>
    )

    return <MyDocument />
  }

  const handlePrint = () => {
    if (onPrint) {
      onPrint()
    } else {
      window.print()
    }
  }

  const handleDownloadPDF = async () => {
    try {
      const pdfDoc = createPDFDocument()
      const blob = await pdf(pdfDoc).toBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `MarkSheet-${displayData.studentName.replace(/\s+/g, "_")}-${examName}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast({
        title: "PDF Downloaded",
        description: "Marksheet has been downloaded successfully.",
      })
    } catch (error) {
      console.error('PDF generation failed:', error)
      toast({
        title: "PDF Generation Failed",
        description: "There was an error generating the PDF. Please try again.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className={`min-h-screen bg-slate-50 ${className}`}>
      {/* Print-specific styles */}
      <style jsx>{`
        @media print {
          @page {
            margin: 0.05in;
            size: A4;
          }
          body {
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
          .print-break {
            page-break-before: always;
          }
          .print-no-break {
            page-break-inside: avoid;
          }
          .print-page {
            page-break-after: always;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
          }
          .print-header {
            page-break-inside: avoid;
          }
          .print-content {
            flex: 1;
            page-break-inside: avoid;
          }
          .print-footer {
            page-break-inside: avoid;
          }
          .print-compact {
            padding: 0.0625rem !important;
            margin: 0 !important;
          }
          .print-small-text {
            font-size: 0.5rem !important;
            line-height: 1 !important;
          }
          .print-tiny-text {
            font-size: 0.375rem !important;
            line-height: 0.9 !important;
          }
          .print-no-padding {
            padding: 0 !important;
          }
          .print-no-margin {
            margin: 0 !important;
          }
          .print-reduced-gap {
            gap: 0.0625rem !important;
          }
          .print-compact-table {
            font-size: 0.375rem !important;
          }
          .print-compact-table th,
          .print-compact-table td {
            padding: 0.03125rem 0.0625rem !important;
            border: none !important;
          }
          .print-minimal-spacing {
            margin: 0 !important;
            padding: 0.0625rem !important;
          }
          .print-no-borders {
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
          }
          .print-no-background {
            background: none !important;
          }
          .print-clean-table {
            border-collapse: collapse !important;
          }
          .print-clean-table th,
          .print-clean-table td {
            border: 1px solid #e2e8f0 !important;
            border-color: #d1d5db !important;
          }
          .print-ultra-compact {
            padding: 0.03125rem !important;
            margin: 0 !important;
            gap: 0.03125rem !important;
          }
          .print-ultra-small {
            font-size: 0.375rem !important;
            line-height: 0.9 !important;
          }
          .print-ultra-tiny {
            font-size: 0.25rem !important;
            line-height: 0.8 !important;
          }
        }
      `}</style>
      
      {/* Header with Navigation - Full Width */}
      {showActions && (
        <div className="w-full bg-white border-b border-slate-200 print:hidden">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Student Marksheet</h1>
                <p className="text-sm text-slate-600">View and download student marksheet</p>
              </div>
              
              <div className="flex items-center gap-3">
                <Button onClick={handlePrint} variant="outline" className="hover:bg-muted focus:bg-muted outline-none">
                  Print
                </Button>
                <Button onClick={handleDownloadPDF} className="bg-green-600 hover:bg-green-700">
                  Download PDF
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Mark Sheet - Full Width with Print Optimization */}
      <div className="w-full">
        <div ref={markSheetRef} className="bg-white print:shadow-none print:border-none print:bg-white print:p-0 print:m-0 print:w-full print:max-w-full print:min-h-[100vh] print:mb-0 print:break-after-page print-page" data-marksheet-ref>
          {/* Enhanced Header - Rich Typography - Fixed for Print/PDF */}
          <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 text-white p-4 print:p-1 print:bg-blue-700 print:text-white print:border-b print:border-blue-800 print-header print-no-borders print-ultra-compact">
            <div className="flex items-center gap-4 print:gap-1 print:flex-row">
              <Image
                src="/placeholder-logo.png"
                width={48}
                height={48}
                alt="Logo"
                className="rounded-lg bg-white p-1.5 print:w-6 print:h-6 print:p-0.5 shrink-0 shadow-lg print:shadow-none print:border print:border-white print-no-borders"
              />
              <div className="flex-1 print:flex-1">
                <h1 className="text-3xl print:text-sm font-bold tracking-tight print:tracking-tight">
                  Academic Excellence School
                </h1>
                <p className="text-lg print:text-xs opacity-90 print:opacity-100 mt-1 print:mt-0.5">
                  Empowering Minds, Building Futures
                </p>
                <div className="flex items-center gap-4 print:gap-1 mt-2 print:mt-0.5 print:flex-wrap">
                  <div className="flex items-center gap-1 print:gap-0.5">
                    <MapPin className="h-4 w-4 print:h-2 print:w-2" />
                    <span className="text-sm print:text-xs">123 Education Street, City</span>
                  </div>
                  <div className="flex items-center gap-1 print:gap-0.5">
                    <Phone className="h-4 w-4 print:h-2 print:w-2" />
                    <span className="text-sm print:text-xs">+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-1 print:gap-0.5">
                    <Mail className="h-4 w-4 print:h-2 print:w-2" />
                    <span className="text-sm print:text-xs">info@academicexcellence.edu</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Student Information Section - Compact for Print */}
          <div className="bg-white p-6 print:p-1 print-content print-no-borders print-ultra-compact">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:gap-1 print:grid-cols-2">
              {/* Student Details */}
              <div className="space-y-3 print:space-y-1">
                <h2 className="text-2xl print:text-sm font-bold text-slate-900 tracking-tight print:tracking-tight">
                  Student Information
                </h2>
                <div className="grid grid-cols-2 gap-4 print:gap-1 print:grid-cols-1">
                  <div>
                    <label className="block text-sm print:text-xs font-medium text-slate-700 print:text-slate-600 mb-1 print:mb-0.5">Name</label>
                    <p className="text-lg print:text-xs font-semibold text-slate-900">{displayData.studentName}</p>
                  </div>
                  <div>
                    <label className="block text-sm print:text-xs font-medium text-slate-700 print:text-slate-600 mb-1 print:mb-0.5">Roll Number</label>
                    <p className="text-lg print:text-xs font-semibold text-slate-900">{displayData.rollNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm print:text-xs font-medium text-slate-700 print:text-slate-600 mb-1 print:mb-0.5">Class</label>
                    <p className="text-lg print:text-xs font-semibold text-slate-900">{className_}</p>
                  </div>
                  <div>
                    <label className="block text-sm print:text-xs font-medium text-slate-700 print:text-slate-600 mb-1 print:mb-0.5">Academic Year</label>
                    <p className="text-lg print:text-xs font-semibold text-slate-900">{displayData.subjects[0]?.year || "2024-25"}</p>
                  </div>
                </div>
              </div>

              {/* Exam Details */}
              <div className="space-y-3 print:space-y-1">
                <h2 className="text-2xl print:text-sm font-bold text-slate-900 tracking-tight print:tracking-tight">
                  Examination Details
                </h2>
                <div className="grid grid-cols-2 gap-4 print:gap-1 print:grid-cols-1">
                  <div>
                    <label className="block text-sm print:text-xs font-medium text-slate-700 print:text-slate-600 mb-1 print:mb-0.5">Exam Name</label>
                    <p className="text-lg print:text-xs font-semibold text-slate-900">{displayData.subjects[0]?.examName}</p>
                  </div>
                  <div>
                    <label className="block text-sm print:text-xs font-medium text-slate-700 print:text-slate-600 mb-1 print:mb-0.5">Term</label>
                    <p className="text-lg print:text-xs font-semibold text-slate-900">{displayData.subjects[0]?.term}</p>
                  </div>
                  <div>
                    <label className="block text-sm print:text-xs font-medium text-slate-700 print:text-slate-600 mb-1 print:mb-0.5">Subject</label>
                    <p className="text-lg print:text-xs font-semibold text-slate-900">{displayData.subjects[0]?.subject}</p>
                  </div>
                  <div>
                    <label className="block text-sm print:text-xs font-medium text-slate-700 print:text-slate-600 mb-1 print:mb-0.5">Result Type</label>
                    <p className="text-lg print:text-xs font-semibold text-slate-900">{displayData.subjects[0]?.resultType}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Subject-wise Performance - Compact Table */}
          <div className="bg-white px-6 print:px-1 pb-6 print:pb-1 print-no-borders print-ultra-compact">
            <h2 className="text-2xl print:text-sm font-bold text-slate-900 tracking-tight print:tracking-tight mb-4 print:mb-1">
              Subject-wise Performance
            </h2>
            <div className="overflow-x-auto print:overflow-visible">
              <table className="w-full border-collapse border border-slate-300 print:border-slate-400 print-compact-table print-clean-table">
                <thead>
                  <tr className="bg-slate-50 print:bg-slate-100">
                    <th className="border border-slate-300 print:border-slate-400 px-3 print:px-1 py-2 print:py-0.5 text-left text-sm print:text-xs font-semibold text-slate-900">Subject</th>
                    <th className="border border-slate-300 print:border-slate-400 px-3 print:px-1 py-2 print:py-0.5 text-center text-sm print:text-xs font-semibold text-slate-900">Max Marks</th>
                    <th className="border border-slate-300 print:border-slate-400 px-3 print:px-1 py-2 print:py-0.5 text-center text-sm print:text-xs font-semibold text-slate-900">Marks Obtained</th>
                    <th className="border border-slate-300 print:border-slate-400 px-3 print:px-1 py-2 print:py-0.5 text-center text-sm print:text-xs font-semibold text-slate-900">Percentage</th>
                    <th className="border border-slate-300 print:border-slate-400 px-3 print:px-1 py-2 print:py-0.5 text-center text-sm print:text-xs font-semibold text-slate-900">Grade</th>
                    <th className="border border-slate-300 print:border-slate-400 px-3 print:px-1 py-2 print:py-0.5 text-center text-sm print:text-xs font-semibold text-slate-900">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {displayData.subjects.map((subject: ResultApproval, index: number) => {
                    const grade = getGrade(subject.marks, subject.maxMarks)
                    const percentage = Math.round((subject.marks / subject.maxMarks) * 100)
                    return (
                      <tr key={index}>
                        <td className="border border-slate-300 print:border-slate-400 px-3 print:px-1 py-2 print:py-0.5 text-sm print:text-xs font-medium text-slate-900">{subject.subject}</td>
                        <td className="border border-slate-300 print:border-slate-400 px-3 print:px-1 py-2 print:py-0.5 text-center text-sm print:text-xs font-semibold text-slate-900">{subject.maxMarks}</td>
                        <td className="border border-slate-300 print:border-slate-400 px-3 print:px-1 py-2 print:py-0.5 text-center text-sm print:text-xs font-semibold text-slate-900">{subject.marks}</td>
                        <td className="border border-slate-300 print:border-slate-400 px-3 print:px-1 py-2 print:py-0.5 text-center text-sm print:text-xs font-semibold text-slate-900">{percentage}%</td>
                        <td className="border border-slate-300 print:border-slate-400 px-3 print:px-1 py-2 print:py-0.5 text-center text-sm print:text-xs font-semibold text-slate-900">{grade}</td>
                        <td className="border border-slate-300 print:border-slate-400 px-3 print:px-1 py-2 print:py-0.5 text-center text-sm print:text-xs font-semibold text-slate-900">{getRemarks(subject.marks, subject.maxMarks)}</td>
                      </tr>
                    )
                  })}
                  {/* Total Row */}
                  <tr className="bg-slate-50 print:bg-slate-100">
                    <td className="border border-slate-300 print:border-slate-400 px-3 print:px-1 py-2 print:py-0.5 text-sm print:text-xs font-bold text-slate-900">Total</td>
                    <td className="border border-slate-300 print:border-slate-400 px-3 print:px-1 py-2 print:py-0.5 text-center text-sm print:text-xs font-bold text-slate-900">{totalMax}</td>
                    <td className="border border-slate-300 print:border-slate-400 px-3 print:px-1 py-2 print:py-0.5 text-center text-sm print:text-xs font-bold text-slate-900">{totalMarks}</td>
                    <td className="border border-slate-300 print:border-slate-400 px-3 print:px-1 py-2 print:py-0.5 text-center text-sm print:text-xs font-bold text-slate-900">{percentage}%</td>
                    <td className="border border-slate-300 print:border-slate-400 px-3 print:px-1 py-2 print:py-0.5 text-center text-sm print:text-xs font-bold text-slate-900">{getGrade(totalMarks, totalMax)}</td>
                    <td className="border border-slate-300 print:border-slate-400 px-3 print:px-1 py-2 print:py-0.5 text-center text-sm print:text-xs font-bold text-slate-900">{getRemarks(totalMarks, totalMax)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Verification Details - Compact */}
          <div className="bg-white px-6 print:px-1 pb-4 print:pb-1 print-no-borders print-ultra-compact">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:gap-1 print:grid-cols-3">
              <div>
                <label className="block text-sm print:text-xs font-medium text-slate-700 print:text-slate-600 mb-1 print:mb-0.5">Verified by</label>
                <p className="text-sm print:text-xs font-semibold text-slate-900">School Administration</p>
              </div>
              <div>
                <label className="block text-sm print:text-xs font-medium text-slate-700 print:text-slate-600 mb-1 print:mb-0.5">Date</label>
                <p className="text-sm print:text-xs font-semibold text-slate-900">{new Date().toLocaleDateString()}</p>
              </div>
              <div>
                <label className="block text-sm print:text-xs font-medium text-slate-700 print:text-slate-600 mb-1 print:mb-0.5">Result ID</label>
                <p className="text-sm print:text-xs font-semibold text-slate-900">{displayData.studentId}</p>
              </div>
            </div>
          </div>

          {/* Performance Summary - Compact */}
          <div className="bg-white px-6 print:px-1 pb-4 print:pb-1 print-no-borders print-ultra-compact">
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 print:from-slate-200 print:to-slate-300 rounded-lg p-4 print:p-1 print-no-borders">
              <h3 className="text-lg print:text-xs font-bold text-slate-900 mb-3 print:mb-1">Performance Summary</h3>
              <div className="grid grid-cols-3 gap-4 print:gap-1">
                <div className="text-center">
                  <div className="text-2xl print:text-sm font-bold text-slate-900">{getGrade(totalMarks, totalMax)}</div>
                  <div className="text-sm print:text-xs text-slate-600">Overall Grade</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl print:text-sm font-bold text-slate-900">{percentage}%</div>
                  <div className="text-sm print:text-xs text-slate-600">Percentage</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl print:text-sm font-bold ${(totalMarks / totalMax) >= 0.4 ? 'text-green-600' : 'text-red-600'}`}>
                    {(totalMarks / totalMax) >= 0.4 ? 'PASS' : 'FAIL'}
                  </div>
                  <div className="text-sm print:text-xs text-slate-600">Status</div>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code and Footer - Compact */}
          <div className="bg-white px-6 print:px-1 pb-6 print:pb-1 print-footer print-no-borders print-ultra-compact">
            <div className="flex items-center justify-between print:flex-col print:gap-1">
              <div className="flex items-center gap-4 print:gap-1">
                <div className="bg-white p-2 print:p-0.5 rounded-lg border border-slate-300 print:border-slate-400 print-no-borders">
                  <QRCodeSVG value={`Result-${displayData.studentId}-${displayData.studentName}-${examName}`} size={80} className="print:w-8 print:h-8" />
                </div>
                <div>
                  <p className="text-sm print:text-xs font-medium text-slate-900">Scan to verify authenticity</p>
                  <p className="text-xs print:text-xs text-slate-600">Digital verification enabled</p>
                </div>
              </div>
              <div className="text-right print:text-center">
                <div className="border-t-2 print:border-t border-slate-300 print:border-slate-400 pt-2 print:pt-0.5 mt-4 print:mt-1">
                  <p className="text-sm print:text-xs font-semibold text-slate-900">Principal / Teacher Signature</p>
                  <p className="text-xs print:text-xs text-slate-600 mt-1 print:mt-0.5">Generated on: {new Date().toLocaleDateString()}</p>
                  <p className="text-xs print:text-xs text-slate-500 mt-1 print:mt-0.5">This is a computer-generated document. No signature required.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 