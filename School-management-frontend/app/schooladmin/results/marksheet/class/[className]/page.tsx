"use client"

import * as React from "react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import { MOCK_RESULTS_APPROVAL } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Printer, Download } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import MarkSheetView from "@/components/marksheet/marksheet-view"
import { Document, Page, View, Text, Image as PDFImage } from '@react-pdf/renderer'
import { pdf } from '@react-pdf/renderer'
import { Badge } from "@/components/ui/badge"

type ResultApproval = (typeof MOCK_RESULTS_APPROVAL)[number]

export default function ClassMarkSheetsPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  const className = params?.className as string
  const examName = searchParams.get('exam') || ''
  const year = searchParams.get('year') || ''
  const term = searchParams.get('term') || ''
  
  // Debug logging to see what parameters we're getting
  console.log('URL Parameters:', { className, examName, year, term })
  console.log('Available classes:', Array.from(new Set(MOCK_RESULTS_APPROVAL.map(r => r.class))))
  console.log('Available exams:', Array.from(new Set(MOCK_RESULTS_APPROVAL.map(r => r.examName))))
  console.log('Available years:', Array.from(new Set(MOCK_RESULTS_APPROVAL.map(r => r.year))))
  console.log('Available terms:', Array.from(new Set(MOCK_RESULTS_APPROVAL.map(r => r.term))))
  
  // More flexible filtering - try exact match first, then fallback to class-only
  let classResults = MOCK_RESULTS_APPROVAL.filter(r => 
    r.class === className && 
    r.examName === examName && 
    r.year === year && 
    r.term === term
  )
  
  // If no results found with exact match, try class + exam only
  if (classResults.length === 0) {
    classResults = MOCK_RESULTS_APPROVAL.filter(r => 
      r.class === className && 
      r.examName === examName
    )
  }
  
  // If still no results, try class only
  if (classResults.length === 0) {
    classResults = MOCK_RESULTS_APPROVAL.filter(r => r.class === className)
  }
  
  console.log('Found results:', classResults.length)
  if (classResults.length > 0) {
    console.log('Sample result:', classResults[0])
  }

  // Group by student and remove duplicate subjects
  const students: {
    studentId: string
    studentName: string
    rollNumber: string
    subjects: ResultApproval[]
  }[] = Array.from(
    classResults.reduce((map, r: ResultApproval) => {
      if (!map.has(r.studentId)) {
        map.set(r.studentId, {
          studentId: r.studentId,
          studentName: r.studentName,
          rollNumber: r.rollNumber,
          subjects: [] as ResultApproval[],
        })
      }
      
      // Check if this subject is already added for this student
      const existingSubject = map.get(r.studentId)!.subjects.find((s: ResultApproval) => s.subject === r.subject)
      if (!existingSubject) {
        map.get(r.studentId)!.subjects.push(r)
      }
      
      return map
    }, new Map())
    .values()
  )

  const handleBulkPrint = () => {
    window.print()
  }

  const handleBulkPDF = async () => {
    try {
      // Create one single PDF with all students using MarkSheetView component
      const MyDocument = () => (
        <Document>
          {students.map((student, index) => (
            <Page key={student.studentId} size="A4" style={{ padding: 30 }}>
              {/* Header */}
              <View style={{ 
                backgroundColor: '#1e40af', 
                color: 'white', 
                padding: 15, 
                marginBottom: 15,
                borderRadius: 6
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <PDFImage 
                    src="/placeholder-logo.png" 
                    style={{ width: 50, height: 50, marginRight: 15 }}
                  />
                  <View>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 6 }}>
                      Springfield International School
                    </Text>
                    <Text style={{ fontSize: 10, opacity: 0.9 }}>
                      123 Main Street, Anytown, ST 12345
                    </Text>
                    <Text style={{ fontSize: 10, opacity: 0.9 }}>
                      info@springfield.edu | +1 (555) 123-4567
                    </Text>
                  </View>
                </View>
              </View>

              {/* Student & Exam Info */}
              <View style={{ 
                backgroundColor: '#f8fafc', 
                padding: 15, 
                marginBottom: 15,
                borderRadius: 6
              }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>Student Information</Text>
                    <Text style={{ fontSize: 10, marginBottom: 4 }}>Name: {student.studentName}</Text>
                    <Text style={{ fontSize: 10, marginBottom: 4 }}>Roll: {student.rollNumber}</Text>
                    <Text style={{ fontSize: 10 }}>Class: {student.subjects[0]?.class}</Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>Exam Information</Text>
                    <Text style={{ fontSize: 10, marginBottom: 4 }}>Exam: {student.subjects[0]?.examName}</Text>
                    <Text style={{ fontSize: 10, marginBottom: 4 }}>Year: 2024-25</Text>
                    <Text style={{ fontSize: 10 }}>Date: {new Date().toLocaleDateString()}</Text>
                  </View>
                </View>
              </View>

              {/* Subject Table */}
              <View style={{ marginBottom: 15 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>Subject Performance</Text>
                <View style={{ width: '100%', border: '1px solid #e2e8f0' }}>
                  <View style={{ backgroundColor: '#f1f5f9' }}>
                    <View style={{ flexDirection: 'row', padding: 6, fontSize: 10, fontWeight: 'bold' }}>
                      <Text style={{ padding: 6, fontSize: 10, flex: 2 }}>Subject</Text>
                      <Text style={{ padding: 6, fontSize: 10, textAlign: 'center', fontWeight: 'bold', flex: 1 }}>Max</Text>
                      <Text style={{ padding: 6, fontSize: 10, textAlign: 'center', fontWeight: 'bold', flex: 1 }}>Marks</Text>
                      <Text style={{ padding: 6, fontSize: 10, textAlign: 'center', fontWeight: 'bold', flex: 1 }}>%</Text>
                      <Text style={{ padding: 6, fontSize: 10, textAlign: 'center', fontWeight: 'bold', flex: 1 }}>Grade</Text>
                      <Text style={{ padding: 6, fontSize: 10, textAlign: 'center', fontWeight: 'bold', flex: 1 }}>Status</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'column' }}>
                    {student.subjects.map((subject: ResultApproval, subIndex: number) => {
                      const grade = getGrade(subject.marks, subject.maxMarks)
                      const percentage = Math.round((subject.marks / subject.maxMarks) * 100)
                      return (
                        <View key={subIndex} style={{ flexDirection: 'row', backgroundColor: subIndex % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                          <View style={{ flexDirection: 'column', padding: 6, fontSize: 10, flex: 2 }}>
                            <Text>{subject.subject}</Text>
                          </View>
                          <View style={{ flexDirection: 'column', padding: 6, fontSize: 10, textAlign: 'center', flex: 1 }}>
                            <Text>{subject.maxMarks}</Text>
                          </View>
                          <View style={{ flexDirection: 'column', padding: 6, fontSize: 10, textAlign: 'center', fontWeight: 'bold', flex: 1 }}>
                            <Text>{subject.marks}</Text>
                          </View>
                          <View style={{ flexDirection: 'column', padding: 6, fontSize: 10, textAlign: 'center', flex: 1 }}>
                            <Text>{percentage}%</Text>
                          </View>
                          <View style={{ flexDirection: 'column', padding: 6, fontSize: 10, textAlign: 'center', fontWeight: 'bold', flex: 1 }}>
                            <Text>{grade}</Text>
                          </View>
                          <View style={{ flexDirection: 'column', padding: 6, fontSize: 10, textAlign: 'center', flex: 1 }}>
                            <Text>{percentage >= 40 ? 'PASS' : 'FAIL'}</Text>
                          </View>
                        </View>
                      )
                    })}
                  </View>
                  <View style={{ backgroundColor: '#dbeafe' }}>
                    <View style={{ flexDirection: 'row', padding: 6, fontSize: 10, fontWeight: 'bold' }}>
                      <Text style={{ padding: 6, fontSize: 10, flex: 2 }}>Total</Text>
                      <Text style={{ padding: 6, fontSize: 10, textAlign: 'center', fontWeight: 'bold', flex: 1 }}>{student.subjects.reduce((sum: number, r: ResultApproval) => sum + r.maxMarks, 0)}</Text>
                      <Text style={{ padding: 6, fontSize: 10, textAlign: 'center', fontWeight: 'bold', flex: 1 }}>{student.subjects.reduce((sum: number, r: ResultApproval) => sum + r.marks, 0)}</Text>
                      <Text style={{ padding: 6, fontSize: 10, textAlign: 'center', fontWeight: 'bold', flex: 1 }}>{Math.round((student.subjects.reduce((sum: number, r: ResultApproval) => sum + r.marks, 0) / student.subjects.reduce((sum: number, r: ResultApproval) => sum + r.maxMarks, 0)) * 100)}%</Text>
                      <Text style={{ padding: 6, fontSize: 10, textAlign: 'center', fontWeight: 'bold', flex: 1 }}>{getGrade(student.subjects.reduce((sum: number, r: ResultApproval) => sum + r.marks, 0), student.subjects.reduce((sum: number, r: ResultApproval) => sum + r.maxMarks, 0))}</Text>
                      <Text style={{ padding: 6, fontSize: 10, textAlign: 'center', fontWeight: 'bold', flex: 1 }}>{Math.round((student.subjects.reduce((sum: number, r: ResultApproval) => sum + r.marks, 0) / student.subjects.reduce((sum: number, r: ResultApproval) => sum + r.maxMarks, 0)) * 100) >= 40 ? 'PASS' : 'FAIL'}</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Footer */}
              <View style={{ 
                borderTop: '1px solid #e2e8f0', 
                paddingTop: 15,
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}>
                <View>
                  <Text style={{ fontSize: 8, color: '#64748b' }}>Generated on: {new Date().toLocaleDateString()}</Text>
                  <Text style={{ fontSize: 8, color: '#64748b', fontStyle: 'italic' }}>Computer-generated document</Text>
                </View>
                <View>
                  <Text style={{ fontSize: 8, color: '#64748b' }}>Result ID: {student.studentId}</Text>
                </View>
              </View>
            </Page>
          ))}
        </Document>
      )

      const pdfDoc = <MyDocument />
      const blob = await pdf(pdfDoc).toBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Class-${className}-Marksheets-${examName}-${year}-${term}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast({
        title: "Class Marksheets Downloaded",
        description: `All marksheets for ${className} have been downloaded as a single PDF.`,
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

  if (!students.length) {
    // Show available data for this class and provide navigation options
    const availableExams = Array.from(new Set(MOCK_RESULTS_APPROVAL.filter(r => r.class === className).map(r => r.examName)))
    const availableYears = Array.from(new Set(MOCK_RESULTS_APPROVAL.filter(r => r.class === className).map(r => r.year)))
    const availableTerms = Array.from(new Set(MOCK_RESULTS_APPROVAL.filter(r => r.class === className).map(r => r.term)))
    
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">No Mark Sheets Found</h1>
            <p className="text-slate-600">No results found for the specified criteria.</p>
          </div>
          
          <div className="space-y-6">
            {/* Current Parameters */}
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-3">Requested Parameters:</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="font-medium">Class:</span> {className}</div>
                <div><span className="font-medium">Exam:</span> {examName || 'Not specified'}</div>
                <div><span className="font-medium">Year:</span> {year || 'Not specified'}</div>
                <div><span className="font-medium">Term:</span> {term || 'Not specified'}</div>
              </div>
            </div>
            
            {/* Available Data */}
            {availableExams.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-3">Available Data for Class {className}:</h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-blue-900">Exams:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {availableExams.map(exam => (
                        <Button
                          key={exam}
                          size="sm"
                          variant="outline"
                          className="text-xs"
                          onClick={() => {
                            const firstResult = MOCK_RESULTS_APPROVAL.find(r => r.class === className && r.examName === exam)
                            if (firstResult) {
                              router.push(`/schooladmin/results/marksheet/class/${className}?exam=${encodeURIComponent(exam)}&year=${encodeURIComponent(firstResult.year)}&term=${encodeURIComponent(firstResult.term)}`)
                            }
                          }}
                        >
                          {exam}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-blue-900">Years:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {availableYears.map(year => (
                        <Badge key={year} variant="secondary" className="text-xs">{year}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-blue-900">Terms:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {availableTerms.map(term => (
                        <Badge key={term} variant="secondary" className="text-xs">{term}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={() => router.back()} 
                variant="outline"
                className="flex-1"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
              {availableExams.length > 0 && (
                <Button 
                  onClick={() => {
                    const firstResult = MOCK_RESULTS_APPROVAL.find(r => r.class === className)
                    if (firstResult) {
                      router.push(`/schooladmin/results/marksheet/class/${className}?exam=${encodeURIComponent(firstResult.examName)}&year=${encodeURIComponent(firstResult.year)}&term=${encodeURIComponent(firstResult.term)}`)
                    }
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  View First Available Exam
                </Button>
              )}
              <Button 
                onClick={() => router.push('/schooladmin/results/approval')} 
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Go to Results Approval
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen print:bg-white print:p-0 print:m-0">
      {/* Print-specific styles */}
      <style jsx>{`
        @media print {
          @page {
            margin: 0.1in;
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
            flex: 0;
            page-break-inside: avoid;
          }
          .print-footer {
            page-break-inside: avoid;
          }
          .print-compact {
            padding: 0.125rem !important;
            margin: 0 !important;
          }
          .print-small-text {
            font-size: 0.625rem !important;
            line-height: 1.1 !important;
          }
          .print-tiny-text {
            font-size: 0.5rem !important;
            line-height: 1 !important;
          }
          .print-no-padding {
            padding: 0 !important;
          }
          .print-no-margin {
            margin: 0 !important;
          }
          .print-reduced-gap {
            gap: 0.0rem !important;
          }
          .print-compact-table {
            font-size: 0.5rem !important;
          }
          .print-compact-table th,
          .print-compact-table td {
            padding: 0.0625rem 0.125rem !important;
            border: none !important;
          }
          .print-minimal-spacing {
            margin: 0 !important;
            padding: 0.125rem !important;
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
        }
      `}</style>
      
      {/* Print header (only visible in print) */}
      <div className="hidden print:block text-center mb-4 print:mb-2 print:pt-4">
        <h1 className="text-2xl font-bold print:text-xl print:font-bold">Springfield International School</h1>
        <div className="text-base print:text-sm">Bulk Mark Sheets for Class {className}</div>
        <div className="text-sm print:text-xs">Academic Year: 2024-25</div>
      </div>
      <div className="max-w-6xl mx-auto p-4 print:p-0 print:m-0">
        {/* Hide filter/actions in print */}
        <div className="flex justify-between items-center mb-6 print:hidden">
          <div>
            <h1 className="text-2xl font-bold">Bulk Mark Sheets for Class {className}</h1>
            <div className="text-sm text-muted-foreground">Academic Year: 2024-25</div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleBulkPrint}>Print All</Button>
            <Button onClick={handleBulkPDF}>Download All as PDF</Button>
          </div>
        </div>
        <div className="print:block">
          <div className="relative h-[calc(100vh-120px)] overflow-y-auto print:overflow-visible print:h-auto">
            <div className="flex flex-col gap-8 print:gap-0">
              {students.map((student, i) => (
                <div
                  key={student.studentId}
                  className="bg-white/90 rounded-xl shadow-lg border p-6 mb-0 print:shadow-none print:bg-white print:border-none print:p-0 print:m-0 print:min-h-[100vh] print:mb-0 print:break-after-page print-page print-minimal-spacing print-no-borders"
                  style={{ 
                    pageBreakAfter: 'always', 
                    breakAfter: 'page',
                    pageBreakBefore: i === 0 ? 'auto' : 'always',
                    minHeight: '100vh'
                  }}
                >
                  <MarkSheetView 
                    student={student}
                    showActions={false}
                    className="print:p-0 print:m-0"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <Button onClick={() => router.back()} variant="outline" className="mt-4 print:hidden hover:bg-muted focus:bg-muted outline-none">&larr; Back</Button>
      </div>
    </div>
  )
} 