"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Mail, Users, Send, Loader2 } from "lucide-react"

type SchoolType = {
  id: string
  name: string
  principal: string
  email: string
  status: string
  subscription: string
}

interface BulkMessageFormProps {
  schools: SchoolType[]
  onSubmit: (messageData: { subject: string; message: string; recipients: string[] }) => void
  onCancel: () => void
  isLoading?: boolean
}

export function BulkMessageForm({ schools, onSubmit, onCancel, isLoading = false }: BulkMessageFormProps) {
  const [subject, setSubject] = React.useState("")
  const [message, setMessage] = React.useState("")
  const [selectedSchools, setSelectedSchools] = React.useState<string[]>([])
  const [selectAll, setSelectAll] = React.useState(false)
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  // Filter only active schools for messaging
  const activeSchools = schools.filter((school) => school.status === "Active")

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked)
    if (checked) {
      setSelectedSchools(activeSchools.map((school) => school.id))
    } else {
      setSelectedSchools([])
    }
  }

  const handleSchoolSelect = (schoolId: string, checked: boolean) => {
    if (checked) {
      setSelectedSchools((prev) => [...prev, schoolId])
    } else {
      setSelectedSchools((prev) => prev.filter((id) => id !== schoolId))
      setSelectAll(false)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!subject.trim()) newErrors.subject = "Subject is required"
    if (!message.trim()) newErrors.message = "Message is required"
    if (selectedSchools.length === 0) newErrors.recipients = "Please select at least one school"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    onSubmit({
      subject,
      message,
      recipients: selectedSchools,
    })
  }

  const selectedSchoolsData = activeSchools.filter((school) => selectedSchools.includes(school.id))

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Message Content */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="subject">Subject *</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="subject"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value)
                if (errors.subject) setErrors((prev) => ({ ...prev, subject: "" }))
              }}
              placeholder="Enter message subject"
              className={`pl-10 ${errors.subject ? "border-destructive" : ""}`}
              disabled={isLoading}
            />
          </div>
          {errors.subject && <p className="text-sm text-destructive">{errors.subject}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Message *</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value)
              if (errors.message) setErrors((prev) => ({ ...prev, message: "" }))
            }}
            placeholder="Enter your message here..."
            className={`min-h-[120px] ${errors.message ? "border-destructive" : ""}`}
            disabled={isLoading}
          />
          {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
          <p className="text-xs text-muted-foreground">{message.length}/1000 characters</p>
        </div>
      </div>

      <Separator />

      {/* Recipients Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base font-medium">Select Recipients</Label>
            <p className="text-sm text-muted-foreground">Choose which schools to send the message to</p>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="select-all" checked={selectAll} onCheckedChange={handleSelectAll} disabled={isLoading} />
            <Label htmlFor="select-all" className="text-sm">
              Select All ({activeSchools.length})
            </Label>
          </div>
        </div>

        {errors.recipients && <p className="text-sm text-destructive">{errors.recipients}</p>}

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4" />
              Active Schools ({activeSchools.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              <div className="space-y-3">
                {activeSchools.map((school) => (
                  <div key={school.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50">
                    <Checkbox
                      id={school.id}
                      checked={selectedSchools.includes(school.id)}
                      onCheckedChange={(checked) => handleSchoolSelect(school.id, !!checked)}
                      disabled={isLoading}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium truncate">{school.name}</p>
                          <p className="text-xs text-muted-foreground">{school.principal}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {school.subscription}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {selectedSchools.length > 0 && (
          <Card className="bg-muted/50">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Ready to send to {selectedSchools.length} school(s)</span>
                </div>
                <Badge variant="default">{selectedSchools.length} recipients</Badge>
              </div>
              {selectedSchools.length <= 5 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {selectedSchoolsData.map((school) => (
                    <Badge key={school.id} variant="secondary" className="text-xs">
                      {school.name}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <Separator />

      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading || selectedSchools.length === 0}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
