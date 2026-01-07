"use client"

import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CRUDTable } from "@/components/table/crud-table"
import { FormDialog } from "@/components/feedback/form-dialog"
import { FileText, Plus, Eye, Edit, Trash2, Search, ClipboardList, Clock, CalendarCheck } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer"
import { ChartContainer } from "@/components/ui/chart"
import { toast } from "sonner"
import * as RechartsPrimitive from "recharts"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Download, Send } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useState, useEffect } from "react"
import { TeacherHeader } from "@/app/components/ui/teacher-header"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------
interface Assignment {
  id: string
  title: string
  subject: string
  class: string
  description?: string
  dueDate: string
  maxMarks?: number
  submissions: number
  totalStudents: number
  status: "Active" | "Completed"
}

// -----------------------------------------------------------------------------
// Mock data (replace with API later)
// -----------------------------------------------------------------------------
const mockAssignments: Assignment[] = [
  {
    id: "1",
    title: "Quadratic Equations Practice",
    subject: "Mathematics",
    class: "Class 10-A",
    dueDate: "2025-08-15",
    submissions: 28,
    totalStudents: 35,
    status: "Active",
  },
  {
    id: "2",
    title: "Newton's Laws Lab Report",
    subject: "Physics",
    class: "Class 9-B",
    dueDate: "2025-08-20",
    submissions: 15,
    totalStudents: 32,
    status: "Active",
  },
  {
    id: "3",
    title: "Chemical Bonding Essay",
    subject: "Chemistry",
    class: "Class 11-C",
    dueDate: "2025-08-10",
    submissions: 28,
    totalStudents: 28,
    status: "Completed",
  },
  {
    id: "4",
    title: "English Literature Review",
    subject: "English",
    class: "Class 10-A",
    dueDate: "2025-08-18",
    submissions: 20,
    totalStudents: 35,
    status: "Active",
  },
  {
    id: "5",
    title: "Algebra Homework",
    subject: "Mathematics",
    class: "Class 9-B",
    dueDate: "2025-08-22",
    submissions: 10,
    totalStudents: 32,
    status: "Active",
  },
  {
    id: "6",
    title: "Physics Quiz",
    subject: "Physics",
    class: "Class 11-C",
    dueDate: "2025-08-25",
    submissions: 18,
    totalStudents: 28,
    status: "Active",
  },
  {
    id: "7",
    title: "Essay on Climate Change",
    subject: "English",
    class: "Class 10-A",
    dueDate: "2025-08-12",
    submissions: 30,
    totalStudents: 35,
    status: "Completed",
  },
  {
    id: "8",
    title: "Trigonometry Worksheet",
    subject: "Mathematics",
    class: "Class 9-B",
    dueDate: "2025-08-28",
    submissions: 12,
    totalStudents: 32,
    status: "Active",
  },
  {
    id: "9",
    title: "Lab Safety Assignment",
    subject: "Chemistry",
    class: "Class 11-C",
    dueDate: "2025-08-30",
    submissions: 25,
    totalStudents: 28,
    status: "Active",
  },
  {
    id: "10",
    title: "Reading Comprehension",
    subject: "English",
    class: "Class 10-A",
    dueDate: "2025-08-17",
    submissions: 27,
    totalStudents: 35,
    status: "Active",
  },
  {
    id: "11",
    title: "Probability Project",
    subject: "Mathematics",
    class: "Class 9-B",
    dueDate: "2025-08-19",
    submissions: 16,
    totalStudents: 32,
    status: "Active",
  },
  {
    id: "12",
    title: "Physics Practical Report",
    subject: "Physics",
    class: "Class 11-C",
    dueDate: "2025-08-21",
    submissions: 22,
    totalStudents: 28,
    status: "Active",
  },
  {
    id: "13",
    title: "Poetry Analysis",
    subject: "English",
    class: "Class 10-A",
    dueDate: "2025-08-23",
    submissions: 19,
    totalStudents: 35,
    status: "Active",
  },
  {
    id: "14",
    title: "Geometry Assignment",
    subject: "Mathematics",
    class: "Class 9-B",
    dueDate: "2025-08-27",
    submissions: 14,
    totalStudents: 32,
    status: "Active",
  },
  {
    id: "15",
    title: "Organic Chemistry Quiz",
    subject: "Chemistry",
    class: "Class 11-C",
    dueDate: "2025-08-29",
    submissions: 26,
    totalStudents: 28,
    status: "Active",
  },
  {
    id: "16",
    title: "Short Story Writing",
    subject: "English",
    class: "Class 10-A",
    dueDate: "2025-08-24",
    submissions: 21,
    totalStudents: 35,
    status: "Active",
  },
  {
    id: "17",
    title: "Statistics Homework",
    subject: "Mathematics",
    class: "Class 9-B",
    dueDate: "2025-08-26",
    submissions: 13,
    totalStudents: 32,
    status: "Active",
  },
  {
    id: "18",
    title: "Physics MCQ Test",
    subject: "Physics",
    class: "Class 11-C",
    dueDate: "2025-08-31",
    submissions: 20,
    totalStudents: 28,
    status: "Active",
  },
  {
    id: "19",
    title: "Drama Review",
    subject: "English",
    class: "Class 10-A",
    dueDate: "2025-08-16",
    submissions: 29,
    totalStudents: 35,
    status: "Completed",
  },
  {
    id: "20",
    title: "Algebra II Practice",
    subject: "Mathematics",
    class: "Class 9-B",
    dueDate: "2025-08-14",
    submissions: 17,
    totalStudents: 32,
    status: "Active",
  },
]

// Add mock data for dashboard summary and engagement
const assignmentStats = [
  { label: "Total", value: 3, color: "bg-blue-100 text-blue-700" },
  { label: "Active", value: 2, color: "bg-green-100 text-green-700" },
  { label: "Completed", value: 1, color: "bg-gray-100 text-gray-700" },
  { label: "Pending", value: 1, color: "bg-orange-100 text-orange-700" },
  { label: "Late", value: 0, color: "bg-red-100 text-red-700" },
]
const engagementData = [
  { name: "On Time", value: 80 },
  { name: "Late", value: 20 },
]

// Mock students for submissions
const mockStudents = [
  { id: "s1", name: "Alice Johnson", avatar: "A", submitted: true, grade: 92, submittedAt: "2025-08-10 10:00" },
  { id: "s2", name: "Bob Smith", avatar: "B", submitted: false, grade: null, submittedAt: null },
  { id: "s3", name: "Charlie Brown", avatar: "C", submitted: true, grade: 85, submittedAt: "2025-08-10 09:30" },
  { id: "s4", name: "Diana Prince", avatar: "D", submitted: false, grade: null, submittedAt: null },
]
const assignmentFormat = {
  allowedTypes: ["PDF", "DOCX"],
  maxSize: "10MB",
  template: "Download Template",
  rubric: [
    { criteria: "Clarity", max: 10 },
    { criteria: "Accuracy", max: 10 },
    { criteria: "Presentation", max: 5 },
  ],
}

// Mock classes, subjects, and students (replace with API calls)
const mockClasses = [
  { id: "c1", name: "Class 10-A" },
  { id: "c2", name: "Class 9-B" },
  { id: "c3", name: "Class 11-C" },
]
const mockSubjects = ["Mathematics", "Physics", "Chemistry", "English"]
const mockAllStudents = [
  { id: "s1", name: "Alice Johnson" },
  { id: "s2", name: "Bob Smith" },
  { id: "s3", name: "Charlie Brown" },
  { id: "s4", name: "Diana Prince" },
]

// Add 'All Classes' option to mockClasses
const allClassesOption = { id: "all", name: "All Classes" }
const classOptions = [allClassesOption, ...mockClasses]

const mockTerms = [
  { id: "t1", name: "Term 1" },
  { id: "t2", name: "Term 2" },
]
const mockYears = [
  { id: "y1", name: "2024-2025" },
  { id: "y2", name: "2025-2026" },
]

// 1. Templates: Add save/load template logic (mocked)
const mockTemplates = [
  { id: "tpl1", name: "Math Homework Template", title: "Algebra Practice", subject: "Mathematics", description: "Solve all questions.", rubric: [{ criteria: "Accuracy", max: 10 }] },
  { id: "tpl2", name: "Science Lab Template", title: "Lab Report", subject: "Physics", description: "Submit lab observations.", rubric: [{ criteria: "Clarity", max: 10 }] },
]

// -----------------------------------------------------------------------------
// Re-usable form definition (stubbed for now)
// -----------------------------------------------------------------------------
const assignmentFields = [
  { name: "title", label: "Assignment Title", type: "text", required: true },
  {
    name: "subject",
    label: "Subject",
    type: "select",
    options: ["Mathematics", "Physics", "Chemistry", "English"],
    required: true,
  },
  {
    name: "class",
    label: "Class",
    type: "select",
    options: ["Class 10-A", "Class 9-B", "Class 11-C"],
    required: true,
  },
  { name: "description", label: "Description", type: "textarea", required: true },
  { name: "dueDate", label: "Due Date", type: "date", required: true },
  { name: "maxMarks", label: "Maximum Marks", type: "number", required: true },
]

// Add a simple multi-select component for classes and students
const MultiSelect = ({ options, value, onChange, placeholder }: { options: { id: string, name: string }[], value: string[], onChange: (v: string[]) => void, placeholder?: string }) => {
  return (
    <div className="border rounded p-2 bg-white">
      <div className="text-xs text-gray-400 mb-1">{placeholder}</div>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <label key={opt.id} className="flex items-center gap-1 cursor-pointer">
            <input type="checkbox" checked={value.includes(opt.id)} onChange={e => {
              if (e.target.checked) onChange([...value, opt.id])
              else onChange(value.filter(v => v !== opt.id))
            }} />
            <span className="text-sm">{opt.name}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

// Add sorting state and logic
const sortOptions: { key: keyof Assignment | 'class' | 'term', label: string }[] = [
  { key: "title", label: "Title" },
  { key: "dueDate", label: "Due Date" },
  { key: "status", label: "Status" },
  { key: "class", label: "Class" },
  // { key: "term", label: "Term" }, // Uncomment if term is in Assignment type
]

// Assignment creation/update wizard (edit or create)
const AssignmentWizard = ({ open, onClose, onCreate, onUpdate, editingAssignment }: { open: boolean, onClose: () => void, onCreate: (data: any) => void, onUpdate: (data: any) => void, editingAssignment: Assignment | null }) => {
  const isEdit = !!editingAssignment
  // Wizard state
  const [step, setStep] = useState(0)
  const [selectedClasses, setSelectedClasses] = useState<string[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string>("")
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [maxMarks, setMaxMarks] = useState(100)
  const [fileType, setFileType] = useState("PDF")
  const [rubric, setRubric] = useState([{ criteria: "", max: 10 }])
  const [attachFile, setAttachFile] = useState<File | null>(null)
  const [saveTemplate, setSaveTemplate] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showTemplateModal, setShowTemplateModal] = useState(false)

  // Load template handler
  const handleLoadTemplate = (tpl: any) => {
    setTitle(tpl.title)
    setDescription(tpl.description)
    setSelectedSubject(tpl.subject)
    setRubric(tpl.rubric)
    setShowTemplateModal(false)
    toast.success("Template loaded!")
  }

  // Sync wizard state with editingAssignment
  useEffect(() => {
    if (isEdit && editingAssignment) {
      setSelectedClasses(mockClasses.filter(c => c.name === editingAssignment.class).map(c => c.id))
      setSelectedSubject(editingAssignment.subject || "")
      setTitle(editingAssignment.title || "")
      setDescription(editingAssignment.description || "")
      setDueDate(editingAssignment.dueDate || "")
      setMaxMarks(editingAssignment.maxMarks || 100)
      setRubric(editingAssignment.maxMarks ? [{ criteria: "Accuracy", max: editingAssignment.maxMarks }] : [{ criteria: "", max: 10 }])
    } else if (!open) {
      // Reset on close
      setStep(0)
      setSelectedClasses([])
      setSelectedSubject("")
      setSelectedStudents([])
      setTitle("")
      setDescription("")
      setDueDate("")
      setMaxMarks(100)
      setFileType("PDF")
      setRubric([{ criteria: "", max: 10 }])
      setAttachFile(null)
      setSaveTemplate(false)
      setError("")
    }
  }, [open, isEdit, editingAssignment])

  // AI Suggestion placeholders
  const handleAISuggest = (field: string) => {
    if (field === "title") setTitle("[AI] Practice Worksheet for " + selectedSubject)
    if (field === "description") setDescription("[AI] Please solve all questions and submit by the due date.")
    if (field === "rubric") setRubric([{ criteria: "Accuracy", max: 10 }, { criteria: "Neatness", max: 5 }])
    toast.success("AI suggestion applied!")
  }

  // File upload mock
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setAttachFile(e.target.files[0])
  }

  // Step content
  const steps = [
    // Step 1: Select classes/subject/students
    <div key="step1" className="space-y-4">
      <div>
        <label className="font-semibold">Class(es)</label>
        <MultiSelect options={mockClasses} value={selectedClasses} onChange={setSelectedClasses} placeholder="Select class(es)" />
        <div className="text-xs text-gray-500 mt-1">You can select multiple classes.</div>
      </div>
      <div>
        <label className="font-semibold">Subject</label>
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
          <SelectContent>
            {mockSubjects.map(sub => <SelectItem key={sub} value={sub}>{sub}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="font-semibold">Target Students (optional)</label>
        <MultiSelect options={mockAllStudents} value={selectedStudents} onChange={setSelectedStudents} placeholder="All students in selected classes" />
        <div className="text-xs text-gray-500 mt-1">Leave blank to assign to all students in selected classes.</div>
      </div>
    </div>,
    // Step 2: Assignment details
    <div key="step2" className="space-y-4">
      <div className="flex items-center gap-2">
        <label className="font-semibold">Title</label>
        <TooltipProvider><Tooltip><TooltipTrigger asChild><Button size="icon" variant="ghost" onClick={()=>handleAISuggest("title")}>✨</Button></TooltipTrigger><TooltipContent>AI Suggest Title</TooltipContent></Tooltip></TooltipProvider>
      </div>
      <Input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Assignment Title" />
      <div className="flex items-center gap-2">
        <label className="font-semibold">Description</label>
        <TooltipProvider><Tooltip><TooltipTrigger asChild><Button size="icon" variant="ghost" onClick={()=>handleAISuggest("description")}>✨</Button></TooltipTrigger><TooltipContent>AI Suggest Description</TooltipContent></Tooltip></TooltipProvider>
      </div>
      <Textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Assignment Description" />
      <div className="flex items-center gap-2">
        <label className="font-semibold">Due Date</label>
      </div>
      <Input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} />
      <div className="flex items-center gap-2">
        <label className="font-semibold">Maximum Marks</label>
      </div>
      <Input type="number" value={maxMarks} onChange={e=>setMaxMarks(Number(e.target.value))} min={1} max={500} />
      <div className="flex items-center gap-2">
        <label className="font-semibold">File Type</label>
      </div>
      <Select value={fileType} onValueChange={setFileType}>
        <SelectTrigger><SelectValue placeholder="Select file type" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="PDF">PDF</SelectItem>
          <SelectItem value="DOCX">DOCX</SelectItem>
          <SelectItem value="Image">Image</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex items-center gap-2">
        <label className="font-semibold">Rubric</label>
        <TooltipProvider><Tooltip><TooltipTrigger asChild><Button size="icon" variant="ghost" onClick={()=>handleAISuggest("rubric")}>✨</Button></TooltipTrigger><TooltipContent>AI Suggest Rubric</TooltipContent></Tooltip></TooltipProvider>
      </div>
      {rubric.map((r, i) => (
        <div key={i} className="flex gap-2 mb-1">
          <Input value={r.criteria} onChange={e=>{
            const newRubric = [...rubric]; newRubric[i].criteria = e.target.value; setRubric(newRubric)
          }} placeholder="Criteria" className="w-1/2" />
          <Input type="number" value={r.max} onChange={e=>{
            const newRubric = [...rubric]; newRubric[i].max = Number(e.target.value); setRubric(newRubric)
          }} min={1} max={100} className="w-1/4" />
          <Button size="icon" variant="ghost" onClick={()=>setRubric(rubric.filter((_,j)=>j!==i))}>✕</Button>
        </div>
      ))}
      <Button size="sm" variant="outline" onClick={()=>setRubric([...rubric, { criteria: "", max: 10 }])}>Add Criteria</Button>
    </div>,
    // Step 3: Live preview
    <div key="step3" className="space-y-4">
      <div className="font-semibold">Preview</div>
      <div className="bg-gray-50 rounded p-4">
        <div><b>Classes:</b> {selectedClasses.map(cid=>mockClasses.find(c=>c.id===cid)?.name).join(", ")}</div>
        <div><b>Subject:</b> {selectedSubject}</div>
        <div><b>Students:</b> {selectedStudents.length ? selectedStudents.map(sid=>mockAllStudents.find(s=>s.id===sid)?.name).join(", ") : "All in class(es)"}</div>
        <div><b>Title:</b> {title}</div>
        <div><b>Description:</b> {description}</div>
        <div><b>Due Date:</b> {dueDate}</div>
        <div><b>Max Marks:</b> {maxMarks}</div>
        <div><b>File Type:</b> {fileType}</div>
        <div><b>Rubric:</b> {rubric.map(r=>`${r.criteria} (${r.max})`).join(", ")}</div>
      </div>
    </div>,
    // Step 4: File attachment and template
    <div key="step4" className="space-y-4">
      <div className="font-semibold">Attach File (optional)</div>
      <Input type="file" accept=".pdf,.docx,.jpg,.png" onChange={handleFileChange} />
      {attachFile && <div className="text-xs text-green-700 mt-1">Selected: {attachFile.name}</div>}
      <div className="flex items-center gap-2 mt-2">
        <Switch checked={saveTemplate} onCheckedChange={setSaveTemplate} />
        <span className="text-xs">Save as Template</span>
      </div>
    </div>
  ]

  // Step navigation
  const canNext = () => {
    if (step === 0) return selectedClasses.length && selectedSubject
    if (step === 1) return title && description && dueDate && maxMarks && fileType
    return true
  }
  const handleSubmit = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      if (isEdit) {
        onUpdate({
          title, description, dueDate, maxMarks, fileType, rubric, selectedClasses, selectedSubject, selectedStudents, attachFile, saveTemplate,
          class: mockClasses.find(c => c.id === selectedClasses[0])?.name || editingAssignment?.class,
          subject: selectedSubject,
        })
        toast.success("Assignment updated!")
      } else {
        onCreate({
          title, description, dueDate, maxMarks, fileType, rubric, selectedClasses, selectedSubject, selectedStudents, attachFile, saveTemplate,
          class: mockClasses.find(c => c.id === selectedClasses[0])?.name,
          subject: selectedSubject,
        })
        toast.success("Assignment created!")
      }
      onClose()
      setStep(0)
    }, 1200)
  }

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="max-w-lg mx-auto animate-fade-in">
        <DrawerHeader>
          <DrawerTitle>{isEdit ? "Edit Assignment" : "Create New Assignment"}</DrawerTitle>
          <DrawerDescription>Multi-step wizard with AI suggestions and real data ready.</DrawerDescription>
        </DrawerHeader>
        <div className="p-4 min-h-[320px]">
          {error && <div className="text-red-600 text-xs mb-2">{error}</div>}
          {loading ? <div className="text-center text-blue-600">Creating assignment...</div> : steps[step]}
        </div>
        <DrawerFooter>
          <Button onClick={()=>setStep(s=>Math.max(0,s-1))} disabled={step===0 || loading}>Back</Button>
          {step<steps.length-1 ? (
            <Button onClick={()=>setStep(s=>s+1)} disabled={!canNext() || loading}>Next</Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading || !canNext()}>{isEdit ? "Update Assignment" : "Create Assignment"}</Button>
          )}
          <DrawerClose asChild>
            <Button variant="outline" disabled={loading}>Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

// -----------------------------------------------------------------------------
// Page Component
// -----------------------------------------------------------------------------
export default function AssignmentsPage() {
  const [assignments, setAssignments] = React.useState<Assignment[]>(mockAssignments)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingAssignment, setEditingAssignment] = React.useState<Assignment | null>(null)
  const [drawerAssignment, setDrawerAssignment] = React.useState<Assignment | null>(null)
  const [showDrawer, setShowDrawer] = React.useState(false)
  const [wizardStep, setWizardStep] = React.useState(0)
  const [drawerTab, setDrawerTab] = React.useState("overview")
  const [loading, setLoading] = useState(true) // Added loading state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const [selectedClass, setSelectedClass] = useState<string>("all")
  const [selectedTerm, setSelectedTerm] = useState<string>(mockTerms[0].id)
  const [selectedYear, setSelectedYear] = useState<string>(mockYears[0].id)
  const [search, setSearch] = useState("")
  const [sortKey, setSortKey] = useState<string>("dueDate")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")

  useEffect(() => {
    // Simulate API/data fetch
    const timer = setTimeout(() => setLoading(false), 800); // 0.8s delay for realism
    return () => clearTimeout(timer);
  }, []);

  // Filter assignments by class, term, year, and search
  const filteredAssignments = assignments.filter(a => {
    const classMatch = selectedClass === "all" || a.class === mockClasses.find(c => c.id === selectedClass)?.name
    // For now, mock term/year always match (extend with real data later)
    const termMatch = true
    const yearMatch = true
    const searchMatch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.subject.toLowerCase().includes(search.toLowerCase()) ||
      a.class.toLowerCase().includes(search.toLowerCase())
    return classMatch && termMatch && yearMatch && searchMatch
  })

  // Sorting logic (add class and term support)
  const sortedAssignments = [...filteredAssignments].sort((a, b) => {
    let valA: any = a[sortKey as keyof Assignment]
    let valB: any = b[sortKey as keyof Assignment]
    if (sortKey === "dueDate") {
      valA = new Date(valA as string).getTime()
      valB = new Date(valB as string).getTime()
    }
    if (sortKey === "class") {
      valA = a.class
      valB = b.class
    }
    // Uncomment if term is in Assignment type
    // if (sortKey === "term") {
    //   valA = a.term
    //   valB = b.term
    // }
    if (valA === undefined || valB === undefined) return 0
    if (valA < valB) return sortDir === "asc" ? -1 : 1
    if (valA > valB) return sortDir === "asc" ? 1 : -1
    return 0
  })

  // Update stats based on filtered assignments
  const summaryStats = [
    { label: "Total", value: filteredAssignments.length, color: "bg-blue-100 text-blue-700", icon: <FileText className="h-5 w-5" /> },
    { label: "Active", value: filteredAssignments.filter(a => a.status === "Active").length, color: "bg-green-100 text-green-700", icon: <Edit className="h-5 w-5" /> },
    { label: "Completed", value: filteredAssignments.filter(a => a.status === "Completed").length, color: "bg-gray-100 text-gray-700", icon: <ClipboardList className="h-5 w-5" /> },
    { label: "Pending", value: filteredAssignments.filter(a => a.status === "Active" && a.submissions < a.totalStudents).length, color: "bg-orange-100 text-orange-700", icon: <Clock className="h-5 w-5" /> },
    { label: "Late", value: filteredAssignments.filter(a => new Date(a.dueDate) < new Date() && a.status === "Active").length, color: "bg-red-100 text-red-700", icon: <CalendarCheck className="h-5 w-5" /> },
  ]

  // CRUD handlers (move above AssignmentWizard)
  const handleCreate = (data: any) => {
    const newAssignment: Assignment = {
      id: Date.now().toString(),
      ...data,
      submissions: 0,
      totalStudents: 35,
      status: "Active",
    }
    setAssignments((prev) => [...prev, newAssignment])
    setIsDialogOpen(false)
    toast.success("Assignment created!")
  }

  const handleUpdate = (data: any) => {
    setAssignments((prev) => prev.map((a) => (a.id === editingAssignment?.id ? { ...a, ...data } : a)))
    setEditingAssignment(null)
    setIsDialogOpen(false)
    toast.success("Assignment updated!")
  }

  const handleDelete = (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id))
    setShowDeleteDialog(false)
    toast.success("Assignment deleted!")
  }

  const handleBulkDelete = (ids: string[]) => {
    setAssignments((prev) => prev.filter((a) => !ids.includes(a.id)))
    toast.success("Assignments deleted!")
  }

  const handleViewSubmissions = (assignment: Assignment) => {
    alert(`Viewing submissions for: ${assignment.title}`)
  }

  const handleEdit = (assignment: Assignment) => {
    setEditingAssignment(assignment)
    setIsDialogOpen(true)
  }

  // Assignment details drawer open
  const openDrawer = (assignment: Assignment) => {
    setDrawerAssignment(assignment)
    setShowDrawer(true)
  }
  const closeDrawer = () => setShowDrawer(false)

  // ---------------------------------------------------------------------------
  // Column definitions for tanstack table
  // ---------------------------------------------------------------------------
  const columns = React.useMemo<ColumnDef<Assignment>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Assignment",
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.original.title}</div>
            <div className="text-sm text-muted-foreground">{row.original.subject}</div>
          </div>
        ),
      },
      { accessorKey: "class", header: "Class" },
      {
        accessorKey: "dueDate",
        header: "Due",
        cell: ({ cell }) => new Date(cell.getValue<string>()).toLocaleDateString(),
      },
      {
        id: "submissions",
        header: "Submissions",
        enableSorting: false,
        cell: ({ row }) => {
          const { submissions, totalStudents } = row.original
          const pct = Math.round((submissions / totalStudents) * 100)
          return (
            <div className="text-center">
              <div className="font-medium">
                {submissions}/{totalStudents}
              </div>
              <div className="text-xs text-muted-foreground">{pct}%</div>
            </div>
          )
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ cell }) => {
          const value = cell.getValue<Assignment["status"]>()
          return <Badge variant={value === "Active" ? "default" : "secondary"}>{value}</Badge>
        },
      },
      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => {
          const assignment = row.original
          return (
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => handleViewSubmissions(assignment)}>
                <Eye className="h-4 w-4" />
                <span className="sr-only">View</span>
              </Button>
              <Button variant="outline" size="icon" onClick={() => handleEdit(assignment)}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button variant="destructive" size="icon" onClick={() => handleDelete(assignment.id)}>
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          )
        },
      },
    ],
    [], // Removed handleDelete from dependencies
  )

  // Filter/search bar
  const renderFilterBar = () => (
    <div className="sticky top-0 z-30 bg-[#f7fafd] shadow-md flex flex-wrap gap-2 items-center px-1 py-3 mb-2 rounded-b-xl">
      <Select value={selectedClass} onValueChange={setSelectedClass}>
        <SelectTrigger className="w-36"><SelectValue placeholder="All Classes" /></SelectTrigger>
        <SelectContent>
          {classOptions.map(cls => (
            <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={selectedTerm} onValueChange={setSelectedTerm}>
        <SelectTrigger className="w-28"><SelectValue placeholder="Term" /></SelectTrigger>
        <SelectContent>
          {mockTerms.map(term => (
            <SelectItem key={term.id} value={term.id}>{term.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={selectedYear} onValueChange={setSelectedYear}>
        <SelectTrigger className="w-32"><SelectValue placeholder="Year" /></SelectTrigger>
        <SelectContent>
          {mockYears.map(year => (
            <SelectItem key={year.id} value={year.id}>{year.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="relative flex-1 min-w-[180px] max-w-xs">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search assignments..."
          className="pl-8 pr-2 py-2 rounded-lg border border-gray-200 bg-white w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>
      <Button onClick={() => setIsDialogOpen(true)} className="flex items-center gap-2 ml-auto">
        <Plus className="h-4 w-4" />
        Create Assignment
      </Button>
    </div>
  )

  // Example motivational badge (could be dynamic)
  const motivationalBadge = summaryStats[1].value === 0 ? "No active assignments!" : `${summaryStats[1].value} active, ${summaryStats[2].value} completed, ${summaryStats[3].value} pending, ${summaryStats[4].value} late.`
  const teacherName = "Ms. Lee" // Replace with real user context if available

  // Enhanced summary cards with gradients and icons
  const renderSummary = () => (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      <div className="rounded-xl p-4 bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow hover:scale-105 transition flex flex-col items-center">
        <FileText className="h-6 w-6 mb-1" />
        <span className="text-2xl font-bold">{summaryStats[0].value}</span>
        <span className="text-xs font-medium">Total</span>
        </div>
      <div className="rounded-xl p-4 bg-gradient-to-br from-green-400 to-green-600 text-white shadow hover:scale-105 transition flex flex-col items-center">
        <Edit className="h-6 w-6 mb-1" />
        <span className="text-2xl font-bold">{summaryStats[1].value}</span>
        <span className="text-xs font-medium">Active</span>
      </div>
      <div className="rounded-xl p-4 bg-gradient-to-br from-gray-400 to-gray-600 text-white shadow hover:scale-105 transition flex flex-col items-center">
        <ClipboardList className="h-6 w-6 mb-1" />
        <span className="text-2xl font-bold">{summaryStats[2].value}</span>
        <span className="text-xs font-medium">Completed</span>
      </div>
      <div className="rounded-xl p-4 bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow hover:scale-105 transition flex flex-col items-center">
        <Clock className="h-6 w-6 mb-1" />
        <span className="text-2xl font-bold">{summaryStats[3].value}</span>
        <span className="text-xs font-medium">Pending</span>
      </div>
      <div className="rounded-xl p-4 bg-gradient-to-br from-red-400 to-red-600 text-white shadow hover:scale-105 transition flex flex-col items-center">
        <CalendarCheck className="h-6 w-6 mb-1" />
        <span className="text-2xl font-bold">{summaryStats[4].value}</span>
        <span className="text-xs font-medium">Late</span>
      </div>
    </div>
  )

  // Sorting controls
  const renderSortBar = () => (
    <div className="flex gap-2 items-center mb-2">
      <span className="text-xs text-gray-500">Sort by:</span>
      {sortOptions.map((opt: { key: keyof Assignment | 'class' | 'term', label: string }) => (
        <Button
          key={opt.key}
          size="sm"
          variant={sortKey === opt.key ? "default" : "outline"}
          onClick={() => {
            if (sortKey === opt.key) setSortDir(d => (d === "asc" ? "desc" : "asc"))
            else { setSortKey(opt.key); setSortDir("asc") }
          }}
        >
          {opt.label} {sortKey === opt.key ? (sortDir === "asc" ? "↑" : "↓") : ""}
        </Button>
      ))}
    </div>
  )

  // Enhanced assignment list (filtered, sorted)
  const renderAssignmentList = () => (
    <div className="relative">
      {renderSortBar()}
      <div className="max-h-[calc(100vh-300px)] overflow-y-auto pr-1">
        {sortedAssignments.length === 0 ? (
          <div className="text-center text-gray-400 py-12">No assignments for this class.</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedAssignments.map(a => {
              const pct = Math.round((a.submissions / a.totalStudents) * 100)
              const due = new Date(a.dueDate)
              const now = new Date()
              let dueColor = "bg-green-100 text-green-700"
              if (due < now) dueColor = "bg-red-100 text-red-700"
              else if ((due.getTime() - now.getTime())/(1000*60*60*24) < 2) dueColor = "bg-orange-100 text-orange-700"
              return (
                <div key={a.id} className="rounded-2xl bg-white shadow-md hover:shadow-xl transition-shadow p-5 flex flex-col gap-3 border border-transparent hover:border-blue-200 cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{a.subject[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-bold text-lg">{a.title}</div>
                      <div className="text-xs text-gray-500">{a.subject} • {a.class}</div>
                    </div>
                    <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-semibold ${dueColor}`}>{due.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={a.status === "Active" ? "default" : "secondary"}>{a.status}</Badge>
                    <span className="text-xs text-gray-400">{a.submissions}/{a.totalStudents} submitted</span>
                    <Progress value={pct} className="w-24 h-2 bg-gray-100" />
                    <span className="text-xs text-gray-500">{pct}%</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <TooltipProvider>
                      <Tooltip><TooltipTrigger asChild>
                        <Button size="sm" variant="outline" onClick={e => {e.stopPropagation(); openDrawer(a)}}><Eye className="h-4 w-4" /></Button>
                      </TooltipTrigger><TooltipContent>View</TooltipContent></Tooltip>
                      <Tooltip><TooltipTrigger asChild>
                        <Button size="sm" variant="outline" onClick={e => {e.stopPropagation(); handleEdit(a)}}><Edit className="h-4 w-4" /></Button>
                      </TooltipTrigger><TooltipContent>Edit</TooltipContent></Tooltip>
                      <Tooltip><TooltipTrigger asChild>
                        <Button size="sm" variant="destructive" onClick={e => {e.stopPropagation(); setShowDeleteDialog(true); setDeleteId(a.id)}}><Trash2 className="h-4 w-4" /></Button>
                      </TooltipTrigger><TooltipContent>Delete</TooltipContent></Tooltip>
                      <Tooltip><TooltipTrigger asChild>
                        <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700 ml-auto" onClick={e => {e.stopPropagation(); toast.success('Reminder sent!')}}>Remind</Button>
                      </TooltipTrigger><TooltipContent>Remind</TooltipContent></Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )

  // Delete confirmation dialog
  const renderDeleteDialog = () => (
    <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Assignment?</DialogTitle>
        </DialogHeader>
        <div>Are you sure you want to delete this assignment? This action cannot be undone.</div>
        <DialogFooter>
          <Button variant="outline" onClick={()=>setShowDeleteDialog(false)}>Cancel</Button>
          <Button variant="destructive" onClick={()=>{
            if (deleteId) handleDelete(deleteId)
            setShowDeleteDialog(false)
          }}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  // Assignment details drawer with tabs
  const renderDrawer = () => (
    <Drawer open={showDrawer} onOpenChange={setShowDrawer}>
      <DrawerContent className="max-w-2xl mx-auto">
        <DrawerHeader>
          <DrawerTitle>{drawerAssignment?.title}</DrawerTitle>
          <DrawerDescription>{drawerAssignment?.description || "No description."}</DrawerDescription>
        </DrawerHeader>
        <div className="p-4">
          <Tabs value={drawerTab} onValueChange={setDrawerTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="submissions">Submissions</TabsTrigger>
              <TabsTrigger value="format">Format/Rubric</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <div className="flex items-center gap-2 mb-2">
                <Badge>{drawerAssignment?.subject}</Badge>
                <Badge variant="secondary">{drawerAssignment?.class}</Badge>
                <span className="ml-auto text-xs text-gray-500">Due: {drawerAssignment?.dueDate && new Date(drawerAssignment.dueDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-xs text-gray-500">Submissions</span>
                <Progress value={drawerAssignment ? Math.round((drawerAssignment.submissions/drawerAssignment.totalStudents)*100) : 0} className="w-32 h-2" />
                <span className="text-xs text-gray-500">{drawerAssignment?.submissions}/{drawerAssignment?.totalStudents}</span>
              </div>
              <ChartContainer config={{ OnTime: { color: '#22c55e', label: 'On Time' }, Late: { color: '#f59e42', label: 'Late' } }}>
                <RechartsPrimitive.PieChart>
                  <RechartsPrimitive.Pie data={engagementData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={40} fill="#8884d8" label />
                  <RechartsPrimitive.Tooltip />
                </RechartsPrimitive.PieChart>
              </ChartContainer>
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" className="flex items-center gap-2"><Download className="h-4 w-4" />Export Grades</Button>
                <Button size="sm" variant="outline" className="flex items-center gap-2"><Download className="h-4 w-4" />Export Submissions</Button>
              </div>
            </TabsContent>
            <TabsContent value="submissions">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-semibold text-sm">Student Submissions</span>
                <Button size="sm" variant="outline" className="flex items-center gap-2" onClick={()=>toast.success('Reminders sent!')}><Send className="h-4 w-4" />Remind All</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-2 text-left">Student</th>
                      <th className="p-2">Status</th>
                      <th className="p-2">Grade</th>
                      <th className="p-2">Submitted At</th>
                      <th className="p-2">Download</th>
                      <th className="p-2">Remind</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockStudents.map(s => (
                      <tr key={s.id} className="border-b">
                        <td className="p-2 flex items-center gap-2"><Avatar><AvatarFallback>{s.avatar}</AvatarFallback></Avatar>{s.name}</td>
                        <td className="p-2">{s.submitted ? <Badge variant="default">Submitted</Badge> : <Badge variant="destructive">Pending</Badge>}</td>
                        <td className="p-2">{s.grade !== null ? s.grade : '-'}</td>
                        <td className="p-2">{s.submittedAt || '-'}</td>
                        <td className="p-2">{s.submitted ? <Button size="sm" variant="outline">Download</Button> : '-'}</td>
                        <td className="p-2">{!s.submitted && <Button size="sm" variant="outline" onClick={()=>toast.success('Reminder sent!')}>Remind</Button>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            <TabsContent value="format">
              <div className="mb-2 font-semibold text-sm">Assignment Format</div>
              <div className="mb-2 text-xs text-gray-600">Allowed file types: {assignmentFormat.allowedTypes.join(", ")}</div>
              <div className="mb-2 text-xs text-gray-600">Max file size: {assignmentFormat.maxSize}</div>
              <div className="mb-2 text-xs text-blue-600 underline cursor-pointer">{assignmentFormat.template}</div>
              <div className="mt-4 font-semibold text-sm">Rubric</div>
              <table className="min-w-[200px] text-xs mt-1">
                <thead><tr className="bg-gray-50"><th className="p-2 text-left">Criteria</th><th className="p-2">Max Marks</th></tr></thead>
                <tbody>
                  {assignmentFormat.rubric.map(r => (
                    <tr key={r.criteria}><td className="p-2">{r.criteria}</td><td className="p-2">{r.max}</td></tr>
                  ))}
                </tbody>
              </table>
            </TabsContent>
          </Tabs>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )

  // Main render
  return (
    <div className="space-y-8">
      {renderFilterBar()}
      {renderSummary()}
      <hr className="border-gray-200" />
      {/* Assignment list (scrollable) */}
      {loading ? <div className="text-center text-blue-600">Loading assignments...</div> : renderAssignmentList()}
      {/* Assignment details drawer */}
      {showDrawer && renderDrawer()}
      {/* Assignment creation wizard */}
      <AssignmentWizard open={isDialogOpen} onClose={()=>setIsDialogOpen(false)} onCreate={handleCreate} onUpdate={handleUpdate} editingAssignment={editingAssignment} />
      {/* Delete confirmation dialog */}
      {renderDeleteDialog()}
    </div>
  )
}
