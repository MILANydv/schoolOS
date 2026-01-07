"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Download, FileText, Table } from "lucide-react"

interface ExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: any[]
  title: string
}

export default function ExportDialog({ open, onOpenChange, data, title }: ExportDialogProps) {
  const [exportFormat, setExportFormat] = useState("csv")
  const [selectedFields, setSelectedFields] = useState({
    name: true,
    users: true,
    plan: true,
    revenue: true,
    growth: true,
    status: false,
  })
  const [isExporting, setIsExporting] = useState(false)

  const handleFieldChange = (field: string, checked: boolean) => {
    setSelectedFields((prev) => ({ ...prev, [field]: checked }))
  }

  const handleExport = async () => {
    setIsExporting(true)

    // Simulate export process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const selectedData = data.map((item) => {
      const filtered: any = {}
      Object.keys(selectedFields).forEach((key) => {
        if (selectedFields[key as keyof typeof selectedFields]) {
          filtered[key] = item[key] || "N/A"
        }
      })
      return filtered
    })

    if (exportFormat === "csv") {
      const headers = Object.keys(selectedData[0]).join(",")
      const rows = selectedData.map((item) => Object.values(item).join(","))
      const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows.join("\n")

      const encodedUri = encodeURI(csvContent)
      const link = document.createElement("a")
      link.setAttribute("href", encodedUri)
      link.setAttribute("download", `${title.toLowerCase().replace(/\s+/g, "_")}_export.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else if (exportFormat === "json") {
      const jsonContent = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(selectedData, null, 2))
      const link = document.createElement("a")
      link.setAttribute("href", jsonContent)
      link.setAttribute("download", `${title.toLowerCase().replace(/\s+/g, "_")}_export.json`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    setIsExporting(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-6 w-6" />
            Export {title}
          </DialogTitle>
          <DialogDescription>Choose the format and fields to export</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Format */}
          <div className="space-y-2">
            <Label>Export Format</Label>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">
                  <div className="flex items-center gap-2">
                    <Table className="h-4 w-4" />
                    CSV File
                  </div>
                </SelectItem>
                <SelectItem value="json">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    JSON File
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Field Selection */}
          <div className="space-y-3">
            <Label>Select Fields to Export</Label>
            <div className="space-y-2">
              {Object.entries(selectedFields).map(([field, checked]) => (
                <div key={field} className="flex items-center space-x-2">
                  <Checkbox
                    id={field}
                    checked={checked}
                    onCheckedChange={(checked) => handleFieldChange(field, !!checked)}
                  />
                  <Label htmlFor={field} className="capitalize">
                    {field === "users" ? "User Count" : field}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Export Button */}
          <div className="flex gap-2">
            <Button
              onClick={handleExport}
              disabled={isExporting || !Object.values(selectedFields).some(Boolean)}
              className="flex-1"
            >
              <Download className="mr-2 h-4 w-4" />
              {isExporting ? "Exporting..." : "Export Data"}
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
