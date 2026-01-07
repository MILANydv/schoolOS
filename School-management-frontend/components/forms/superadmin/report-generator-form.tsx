"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { FileText, BarChart3, Users, DollarSign, TrendingUp, Download, Loader2, Building } from "lucide-react"

interface ReportGeneratorFormProps {
  onSubmit: (reportType: string) => void
  onCancel: () => void
  isLoading?: boolean
}

const reportTypes = [
  {
    id: "overview",
    name: "School Overview Report",
    description: "Comprehensive overview of all schools with key metrics",
    icon: Building,
    estimatedTime: "2-3 minutes",
  },
  {
    id: "financial",
    name: "Financial Summary Report",
    description: "Revenue, collection rates, and subscription analytics",
    icon: DollarSign,
    estimatedTime: "3-4 minutes",
  },
  {
    id: "performance",
    name: "Performance Analytics Report",
    description: "Academic performance and growth metrics",
    icon: TrendingUp,
    estimatedTime: "4-5 minutes",
  },
  {
    id: "enrollment",
    name: "Enrollment Statistics Report",
    description: "Student enrollment trends and demographics",
    icon: Users,
    estimatedTime: "2-3 minutes",
  },
  {
    id: "detailed",
    name: "Detailed Analytics Report",
    description: "Complete analysis with all metrics and comparisons",
    icon: BarChart3,
    estimatedTime: "5-7 minutes",
  },
]

export function ReportGeneratorForm({ onSubmit, onCancel, isLoading = false }: ReportGeneratorFormProps) {
  const [selectedReport, setSelectedReport] = React.useState("")
  const [format, setFormat] = React.useState("pdf")
  const [includeCharts, setIncludeCharts] = React.useState(true)
  const [includeComparisons, setIncludeComparisons] = React.useState(false)
  const [timeRange, setTimeRange] = React.useState("current")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedReport) return

    const reportConfig = {
      type: selectedReport,
      format,
      includeCharts,
      includeComparisons,
      timeRange,
    }

    const selectedReportData = reportTypes.find((r) => r.id === selectedReport)
    onSubmit(selectedReportData?.name || selectedReport)
  }

  const selectedReportData = reportTypes.find((r) => r.id === selectedReport)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Report Type Selection */}
      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium">Select Report Type</Label>
          <p className="text-sm text-muted-foreground">Choose the type of report you want to generate</p>
        </div>

        <RadioGroup value={selectedReport} onValueChange={setSelectedReport}>
          <div className="space-y-3">
            {reportTypes.map((report) => {
              const Icon = report.icon
              return (
                <div key={report.id} className="flex items-start space-x-3">
                  <RadioGroupItem value={report.id} id={report.id} className="mt-1" disabled={isLoading} />
                  <div className="flex-1">
                    <Label htmlFor={report.id} className="flex items-center gap-2 font-medium cursor-pointer">
                      <Icon className="h-4 w-4" />
                      {report.name}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Estimated generation time: {report.estimatedTime}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </RadioGroup>
      </div>

      {selectedReport && (
        <>
          <Separator />

          {/* Report Configuration */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Report Configuration</Label>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="format">Output Format</Label>
                <Select value={format} onValueChange={setFormat} disabled={isLoading}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF Document</SelectItem>
                    <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                    <SelectItem value="csv">CSV Data</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeRange">Time Range</Label>
                <Select value={timeRange} onValueChange={setTimeRange} disabled={isLoading}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">Current Month</SelectItem>
                    <SelectItem value="quarter">Current Quarter</SelectItem>
                    <SelectItem value="year">Current Year</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeCharts"
                  checked={includeCharts}
                  onCheckedChange={setIncludeCharts}
                  disabled={isLoading}
                />
                <Label htmlFor="includeCharts" className="text-sm">
                  Include charts and visualizations
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeComparisons"
                  checked={includeComparisons}
                  onCheckedChange={setIncludeComparisons}
                  disabled={isLoading}
                />
                <Label htmlFor="includeComparisons" className="text-sm">
                  Include year-over-year comparisons
                </Label>
              </div>
            </div>
          </div>

          <Separator />

          {/* Report Preview */}
          <Card className="bg-muted/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Report Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Report Type:</span>
                <span className="font-medium">{selectedReportData?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Format:</span>
                <span className="font-medium">{format.toUpperCase()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Time Range:</span>
                <span className="font-medium">
                  {timeRange === "current" && "Current Month"}
                  {timeRange === "quarter" && "Current Quarter"}
                  {timeRange === "year" && "Current Year"}
                  {timeRange === "all" && "All Time"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Estimated Time:</span>
                <span className="font-medium">{selectedReportData?.estimatedTime}</span>
              </div>
              {(includeCharts || includeComparisons) && (
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">Additional Options:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {includeCharts && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        Charts & Visualizations
                      </span>
                    )}
                    {includeComparisons && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">YoY Comparisons</span>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      <Separator />

      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={!selectedReport || isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Generate Report
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
