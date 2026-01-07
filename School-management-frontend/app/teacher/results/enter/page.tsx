"use client"

import type React from "react"
import { useState, useEffect, useMemo, useRef, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Save,
  Send,
  BookOpen,
  Users,
  Info,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Download,
  Printer,
  Edit,
  Eye,
  Undo2,
  Redo2,
  ListPlus,
  Eraser,
  ArrowUp,
  Search,
  XCircle,
  Clock,
  FileText,
  ClipboardList,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  Zap,
  Brain,
  Activity,
  ChevronRight,
  ChevronLeft,
  Filter,
  RefreshCw,
  Settings,
  Bell,
  Plus,
  MoreHorizontal,
  Star,
  Lightbulb,
  GraduationCap,
  Mail,
  Hash,
} from "lucide-react"
import { toast, Toaster } from "sonner"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence, useInView } from "framer-motion"
import EmptyState, { EmptyStateProps } from './components/EmptyState';
import OnboardingModal, { OnboardingModalProps } from './components/OnboardingModal';
import { useSpring, animated } from "@react-spring/web"
import { TeacherHeader } from "@/app/components/ui/teacher-header"

// --- Enhanced Constants for better maintainability ---
const GRADE_THRESHOLDS = [
  { grade: "A+", minPercentage: 90, color: "bg-gradient-to-r from-emerald-500 to-green-600 text-white", bgColor: "bg-emerald-50", textColor: "text-emerald-700" },
  { grade: "A", minPercentage: 80, color: "bg-gradient-to-r from-green-500 to-emerald-600 text-white", bgColor: "bg-green-50", textColor: "text-green-700" },
  { grade: "B", minPercentage: 70, color: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white", bgColor: "bg-blue-50", textColor: "text-blue-700" },
  { grade: "C", minPercentage: 60, color: "bg-gradient-to-r from-yellow-500 to-amber-600 text-white", bgColor: "bg-yellow-50", textColor: "text-yellow-700" },
  { grade: "D", minPercentage: 50, color: "bg-gradient-to-r from-orange-500 to-red-500 text-white", bgColor: "bg-orange-50", textColor: "text-orange-700" },
  { grade: "F", minPercentage: 0, color: "bg-gradient-to-r from-red-500 to-pink-600 text-white", bgColor: "bg-red-50", textColor: "text-red-700" },
]

const EXAM_STATUS = {
  DRAFT: "draft",
  SUBMITTED: "submitted",
} as const

// --- Improved mock data ---
const mockExams = [
  {
    id: "1",
    name: "Mid-Term Exam",
    subject: "Mathematics",
    class: "10-A",
    maxMarks: 100,
    status: EXAM_STATUS.SUBMITTED,
  },
  { id: "2", name: "Unit Test 1", subject: "Physics", class: "10-B", maxMarks: 50, status: EXAM_STATUS.DRAFT },
  { id: "3", name: "Final Exam", subject: "English", class: "9-A", maxMarks: 80, status: EXAM_STATUS.SUBMITTED },
  { id: "4", name: "Quiz", subject: "History", class: "8-C", maxMarks: 20, status: EXAM_STATUS.DRAFT },
  { id: "5", name: "Algebra Test", subject: "Mathematics", class: "10-A", maxMarks: 75, status: EXAM_STATUS.DRAFT },
  {
    id: "6",
    name: "Geometry Quiz",
    subject: "Mathematics",
    class: "10-A",
    maxMarks: 30,
    status: EXAM_STATUS.SUBMITTED,
  },
  { id: "7", name: "Thermodynamics Exam", subject: "Physics", class: "10-B", maxMarks: 60, status: EXAM_STATUS.DRAFT },
  { id: "8", name: "Biology Test", subject: "Biology", class: "9-A", maxMarks: 70, status: EXAM_STATUS.DRAFT },
  { id: "9", name: "Civics Quiz", subject: "Civics", class: "8-C", maxMarks: 25, status: EXAM_STATUS.SUBMITTED },
]

const mockStudents = [
  // 10-A
  { id: "1", name: "Alice Johnson", rollNumber: "2024001", marks: 85, class: "10-A" },
  { id: "2", name: "Bob Smith", rollNumber: "2024002", marks: 92, class: "10-A" },
  { id: "3", name: "Priya Patel", rollNumber: "2024003", marks: 78, class: "10-A" },
  { id: "4", name: "Rahul Mehra", rollNumber: "2024004", marks: 88, class: "10-A" },
  // 10-B
  { id: "5", name: "Charlie Brown", rollNumber: "2024011", marks: 67, class: "10-B" },
  { id: "6", name: "Diana Prince", rollNumber: "2024012", marks: 74, class: "10-B" },
  { id: "7", name: "Edward Norton", rollNumber: "2024013", marks: 81, class: "10-B" },
  { id: "8", name: "Fatima Ali", rollNumber: "2024014", marks: 90, class: "10-B" },
  // 9-A
  { id: "9", name: "George Lee", rollNumber: "2024021", marks: 55, class: "9-A" },
  { id: "10", name: "Hannah Kim", rollNumber: "2024022", marks: 62, class: "9-A" },
  { id: "11", name: "Isabel Garcia", rollNumber: "2024023", marks: 77, class: "9-A" },
  { id: "12", name: "Jin Park", rollNumber: "2024024", marks: 80, class: "9-A" },
  // 8-C
  { id: "13", name: "Kofi Mensah", rollNumber: "2024031", marks: 19, class: "8-C" },
  { id: "14", name: "Lina Müller", rollNumber: "2024032", marks: 21, class: "8-C" },
  { id: "15", name: "Maria Rossi", rollNumber: "2024033", marks: 17, class: "8-C" },
  { id: "16", name: "Nia Williams", rollNumber: "2024034", marks: 23, class: "8-C" },
]

// Each exam has a result list for its class, now with remarks
const mockResultsByExam: Record<string, { student: string; roll: string; marks: number; remark: string }[]> = {
  "1": [ // 10-A, Mathematics
    { student: "Alice Johnson", roll: "2024001", marks: 85, remark: "Excellent" },
    { student: "Bob Smith", roll: "2024002", marks: 92, remark: "Outstanding" },
    { student: "Priya Patel", roll: "2024003", marks: 78, remark: "Good" },
    { student: "Rahul Mehra", roll: "2024004", marks: 88, remark: "Very Good" },
  ],
  "2": [ // 10-B, Physics
    { student: "Charlie Brown", roll: "2024011", marks: 40, remark: "Needs Improvement" },
    { student: "Diana Prince", roll: "2024012", marks: 45, remark: "Average" },
    { student: "Edward Norton", roll: "2024013", marks: 38, remark: "Below Average" },
    { student: "Fatima Ali", roll: "2024014", marks: 48, remark: "Satisfactory" },
  ],
  "3": [ // 9-A, English
    { student: "George Lee", roll: "2024021", marks: 90, remark: "Excellent" },
    { student: "Hannah Kim", roll: "2024022", marks: 85, remark: "Very Good" },
    { student: "Isabel Garcia", roll: "2024023", marks: 80, remark: "Good" },
    { student: "Jin Park", roll: "2024024", marks: 88, remark: "Very Good" },
  ],
  "4": [ // 8-C, History
    { student: "Kofi Mensah", roll: "2024031", marks: 15, remark: "Needs Improvement" },
    { student: "Lina Müller", roll: "2024032", marks: 18, remark: "Below Average" },
    { student: "Maria Rossi", roll: "2024033", marks: 17, remark: "Needs Improvement" },
    { student: "Nia Williams", roll: "2024034", marks: 19, remark: "Satisfactory" },
  ],
  "5": [ // 10-A, Mathematics
    { student: "Alice Johnson", roll: "2024001", marks: 65, remark: "Average" },
    { student: "Bob Smith", roll: "2024002", marks: 70, remark: "Good" },
    { student: "Priya Patel", roll: "2024003", marks: 68, remark: "Average" },
    { student: "Rahul Mehra", roll: "2024004", marks: 72, remark: "Good" },
  ],
  "6": [ // 10-A, Mathematics
    { student: "Alice Johnson", roll: "2024001", marks: 25, remark: "Needs Improvement" },
    { student: "Bob Smith", roll: "2024002", marks: 28, remark: "Needs Improvement" },
    { student: "Priya Patel", roll: "2024003", marks: 27, remark: "Needs Improvement" },
    { student: "Rahul Mehra", roll: "2024004", marks: 29, remark: "Below Average" },
  ],
  "7": [ // 10-B, Physics
    { student: "Charlie Brown", roll: "2024011", marks: 55, remark: "Average" },
    { student: "Diana Prince", roll: "2024012", marks: 52, remark: "Average" },
    { student: "Edward Norton", roll: "2024013", marks: 50, remark: "Average" },
    { student: "Fatima Ali", roll: "2024014", marks: 58, remark: "Good" },
  ],
  "8": [ // 9-A, Biology
    { student: "George Lee", roll: "2024021", marks: 60, remark: "Average" },
    { student: "Hannah Kim", roll: "2024022", marks: 62, remark: "Average" },
    { student: "Isabel Garcia", roll: "2024023", marks: 65, remark: "Good" },
    { student: "Jin Park", roll: "2024024", marks: 67, remark: "Good" },
  ],
  "9": [ // 8-C, Civics
    { student: "Kofi Mensah", roll: "2024031", marks: 19, remark: "Needs Improvement" },
    { student: "Lina Müller", roll: "2024032", marks: 21, remark: "Below Average" },
    { student: "Maria Rossi", roll: "2024033", marks: 17, remark: "Needs Improvement" },
    { student: "Nia Williams", roll: "2024034", marks: 23, remark: "Satisfactory" },
  ],
}

const mockClasses = [
  { id: "all", name: "All Classes" }, // Added 'All' option
  { id: "10-A", name: "Class 10-A" },
  { id: "10-B", name: "Class 10-B" },
  { id: "9-A", name: "Class 9-A" },
  { id: "8-C", name: "Class 8-C" },
]

const mockSubjects = [
  { id: "all", name: "All Subjects" }, // Added 'All' option
  { id: "Mathematics", name: "Mathematics" },
  { id: "Physics", name: "Physics" },
  { id: "English", name: "English" },
  { id: "History", name: "History" },
  { id: "Biology", name: "Biology" },
  { id: "Civics", name: "Civics" },
]

// --- Only show assigned classes/subjects to the teacher ---
// For demo, hardcode teacher's assignments:
const assignedClasses = [
  { id: "10-A", name: "Class 10-A" },
  { id: "9-A", name: "Class 9-A" },
];
const assignedSubjects = [
  { id: "Mathematics", name: "Mathematics" },
  { id: "English", name: "English" },
];

// Helper: map of classId -> assigned subject ids for that class
const assignedSubjectsByClass: Record<string, string[]> = {
  "10-A": ["Mathematics"],
  "9-A": ["English"],
};

// --- Validation helper ---
const validateMark = (mark: number, max: number) => {
  if (isNaN(mark) || mark === null) return "Required"
  if (mark < 0) return "Cannot be negative"
  if (mark > max) return `Max is ${max}`
  return null
}

// --- New constants for scroll thresholds (Hysteresis) ---
const HEADER_COLLAPSE_SCROLL_UP_THRESHOLD = 100
const HEADER_COLLAPSE_SCROLL_DOWN_THRESHOLD = 50 // Uncollapse only when scrolled significantly back up

const DETAILS_STICKY_SCROLL_UP_THRESHOLD = 200
const DETAILS_STICKY_SCROLL_DOWN_THRESHOLD = 150 // Unstick only when scrolled significantly back up

// Define animation variants for table rows
const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }, // For items exiting
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05, // Stagger animation for each child row
    },
  },
}

// New variants for the filter section within the sticky details card
const filterSectionVariants = {
  visible: {
    height: "auto", // Allows content to dictate height
    opacity: 1,
    marginBottom: "1rem", // Equivalent to mb-4
    transition: { duration: 0.3, ease: "easeInOut" },
  },
  hidden: {
    height: 0,
    opacity: 0,
    marginBottom: "0rem", // Collapse margin
    transition: { duration: 0.3, ease: "easeInOut" },
  },
}


const DEBOUNCE_DELAY = 300;

// AnimatedNumber component for stat cards
const AnimatedNumber = ({ value }: { value: number | string }) => {
  const num = typeof value === "number" ? value : Number(value)
  const { number } = useSpring({
    number: isNaN(num) ? 0 : num,
    config: { tension: 170, friction: 26 },
  })
  return (
    <animated.span>
      {typeof value === "string" && value === "—"
        ? "—"
        : number.to((n: number) => n.toFixed(1))}
    </animated.span>
  )
}

export default function EnterResultsPage() {
  const [selectedExam, setSelectedExam] = useState<string>("")
  const [results, setResults] = useState<{ [key: string]: { marks: number; remark: string } }>({})
  const [isDraft, setIsDraft] = useState(true)
  const [displayMode, setDisplayMode] = useState<"edit" | "view">("edit")
  const [savedResults, setSavedResults] = useState<{
    [examId: string]: { student: string; roll: string; marks: number }[]
  }>({})
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lastAction, setLastAction] = useState<{ type: "draft" | "submit"; time: Date } | null>(null)
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const [marksHistory, setMarksHistory] = useState<{ [key: string]: { marks: number; remark: string } }[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null)
  
  // Enhanced UI states
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [sortBy, setSortBy] = useState<"name" | "marks" | "roll">("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set())
  const [bulkAction, setBulkAction] = useState<string>("")
  const [showBulkActions, setShowBulkActions] = useState(false)

  const tableRef = useRef<HTMLDivElement>(null) // For scrolling
  const firstInputRef = useRef<HTMLInputElement>(null) // For focusing

  const stickyCardRef = useRef<HTMLDivElement>(null)
  const isSticky = useInView(stickyCardRef, { margin: "-1px 0px 0px 0px", amount: 0 })

  // Filter states
  const [selectedClass, setSelectedClass] = useState<string>("all") // Default to 'all'
  const [selectedSubject, setSelectedSubject] = useState<string>("all") // Default to 'all'
  const [mounted, setMounted] = useState(false)

  // Show 'Back to Top' button on scroll (mobile only)
  const [showBackToTop, setShowBackToTop] = useState(false)

  // --- Onboarding state (persisted with localStorage for demo) ---
  const [showOnboarding, setShowOnboarding] = useState(() => {
    if (typeof window !== 'undefined') {
      return !localStorage.getItem('resultsOnboardingSeen');
    }
    return false;
  });
  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('resultsOnboardingSeen', '1');
    }
  };

  // --- Empty state logic ---
  const hasExams = mockExams.length > 0;
  const hasStudents = mockStudents.length > 0;

  // --- Mock handlers ---
  const openCreateExamModal = () => toast.info('Open create exam modal (mock)');
  const openAddStudentModal = () => toast.info('Open add student modal (mock)');

  // Debounce search input for better UX
  const handleSearchInput = useCallback((val: string) => {
    setSearchInput(val);
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => setSearch(val), DEBOUNCE_DELAY);
  }, []);

  // Reset filters handler
  const handleResetFilters = () => {
    setSelectedClass("all");
    setSelectedSubject("all");
    setSearchInput("");
    setSearch("");
  };

  useEffect(() => {
    setMounted(true)
  }, [])

  // Observe header and details height changes for dynamic padding
  useEffect(() => {
    const updateHeights = () => {
      // No longer needed as sticky card handles its own height
    }

    const resizeObserver = new ResizeObserver(() => {
      updateHeights()
    })

    if (stickyCardRef.current) {
      resizeObserver.observe(stickyCardRef.current)
    }

    // Initial measurement
    updateHeights()

    // Debounced scroll handler for header collapse and details sticky state
    let scrollTimeout: NodeJS.Timeout | null = null
    const handleScroll = () => {
      if (scrollTimeout) clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        const scrollY = window.scrollY

        // Hysteresis for header collapse
        if (scrollY > HEADER_COLLAPSE_SCROLL_UP_THRESHOLD && !isSticky) {
          // setIsHeaderCollapsed(true) // No longer needed
        } else if (scrollY < HEADER_COLLAPSE_SCROLL_DOWN_THRESHOLD && isSticky) {
          // setIsHeaderCollapsed(false) // No longer needed
        }

        // Hysteresis for details sticky
        if (scrollY > DETAILS_STICKY_SCROLL_UP_THRESHOLD && !isSticky) {
          // setIsDetailsSticky(true) // No longer needed
        } else if (scrollY < DETAILS_STICKY_SCROLL_DOWN_THRESHOLD && isSticky) {
          // setIsDetailsSticky(false) // No longer needed
        }

        setShowBackToTop(scrollY > 300)
      }, 50) // Increased debounce time to 50ms
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      if (stickyCardRef.current) {
        resizeObserver.unobserve(stickyCardRef.current)
      }
      window.removeEventListener("scroll", handleScroll)
    }
  }, [isSticky]) // Added sticky state to dependencies to ensure re-evaluation

  // Use assignedClasses/assignedSubjects for dropdowns and filtering
  const classOptions = [{ id: "all", name: "All My Classes" }, ...assignedClasses];
  // Filter subject options to only those assigned for the selected class
  const subjectOptions = useMemo(() => {
    if (selectedClass === "all") {
      // Show all assigned subjects for all assigned classes
      const allSubjects = assignedClasses.flatMap(cls => assignedSubjectsByClass[cls.id] || []);
      const uniqueSubjects = Array.from(new Set(allSubjects));
      return [{ id: "all", name: "All My Subjects" }, ...assignedSubjects.filter(s => uniqueSubjects.includes(s.id))];
    } else {
      const allowed = assignedSubjectsByClass[selectedClass] || [];
      return [{ id: "all", name: "All My Subjects" }, ...assignedSubjects.filter(s => allowed.includes(s.id))];
    }
  }, [selectedClass]);

  // Filter exams to only those assigned to the teacher for the class/subject
  const filteredExams = useMemo(() => {
    return mockExams.filter((exam) => {
      const classMatch = (selectedClass === "all" || exam.class === selectedClass) && assignedClasses.some(c => c.id === exam.class);
      // Only show exam if subject is assigned for that class
      const allowedSubjects = assignedSubjectsByClass[exam.class] || [];
      const subjectMatch = (selectedSubject === "all" || exam.subject === selectedSubject) && allowedSubjects.includes(exam.subject);
      return classMatch && subjectMatch;
    });
  }, [selectedClass, selectedSubject]);

  // Auto-select first exam on mount or when filters change
  useEffect(() => {
    if (filteredExams.length > 0) {
      // If current selected exam is not in filtered list, or no exam is selected, pick the first one
      if (!selectedExam || !filteredExams.some((exam) => exam.id === selectedExam)) {
        setSelectedExam(filteredExams[0].id)
      }
    } else {
      setSelectedExam("") // No exams match filters
    }
  }, [filteredExams, selectedExam])

  // Load results and set initial display mode when selectedExam changes
  useEffect(() => {
    if (selectedExam) {
      const selectedExamData = mockExams.find((exam) => exam.id === selectedExam)
      if (!selectedExamData) return

      const existingSaved = savedResults[selectedExam]
      const existingMock = mockResultsByExam[selectedExam]

      let initialResults: { [key: string]: { marks: number; remark: string } } = {}
      let initialIsDraft = true
      let initialDisplayMode: "edit" | "view" = "edit"

      if (existingSaved) {
        // If there's a saved draft, load it and keep it as draft/editable
        initialResults = Object.fromEntries(
          existingSaved.map((r) => [mockStudents.find((s) => s.rollNumber === r.roll)?.id || r.roll, { marks: r.marks, remark: "" }]),
        )
        initialIsDraft = true
        initialDisplayMode = "edit"
      } else if (selectedExamData.status === EXAM_STATUS.SUBMITTED && existingMock) {
        // If mock data indicates submitted, load it as submitted/view-only
        initialResults = Object.fromEntries(
          existingMock.map(({student, roll, marks}) => [mockStudents.find((s) => s.rollNumber === roll)?.id || roll, { marks: marks, remark: "" }]),
        )
        initialIsDraft = false
        initialDisplayMode = "view"
      } else {
        // Otherwise, it's a new draft or an existing draft from mockExams
        initialResults = Object.fromEntries(
          mockStudents.map((s) => [s.id, { marks: s.marks !== null && s.marks !== undefined ? s.marks : 0, remark: "" }]),
        )
        initialIsDraft = true
        initialDisplayMode = "edit"
      }

      setResults(initialResults)
      setMarksHistory([initialResults])
      setHistoryIndex(0)
      setIsDraft(initialIsDraft)
      setDisplayMode(initialDisplayMode)
      setLastAction(null) // Reset last action when switching exams
    } else {
      // If no exam is selected (e.g., filters result in no exams)
      setResults({})
      setMarksHistory([])
      setHistoryIndex(-1)
      setIsDraft(true)
      setDisplayMode("edit")
      setLastAction(null)
    }
  }, [selectedExam, savedResults]) // Add savedResults to dependency array

  // useMemo for derived data
  const selectedExamData = useMemo(() => mockExams.find((exam) => exam.id === selectedExam), [selectedExam])

  // Filter students to only those in assigned classes
  const filteredStudents = useMemo(
    () =>
      mockStudents.filter(
        (s) =>
          (selectedClass === "all" ? assignedClasses.some(c => c.id === s.class) : s.class === selectedClass) &&
          (s.name.toLowerCase().includes(search.toLowerCase()) || s.rollNumber.includes(search)),
      ),
    [search, selectedClass],
  )

  const errorList = useMemo(
    () =>
      filteredStudents
        .map((student) => {
          const marks = results[student.id]?.marks
          const error = validateMark(marks, selectedExamData?.maxMarks || 100)
          return error ? { name: student.name, error } : null
        })
        .filter(Boolean),
    [filteredStudents, results, selectedExamData],
  )

  // Stats with fallback
  const enteredMarks = useMemo(() => Object.values(results).map(r => r.marks), [results])
  const avg = enteredMarks.length ? (enteredMarks.reduce((a, b) => a + b, 0) / enteredMarks.length).toFixed(1) : "—"
  const highest = enteredMarks.length ? Math.max(...enteredMarks) : "—"
  const lowest = enteredMarks.length ? Math.min(...enteredMarks) : "—"

  const handleMarksChange = (studentId: string, marks: string) => {
    const numericMarks = Number.parseFloat(marks) || 0
    const newResults = { ...results, [studentId]: { ...results[studentId], marks: numericMarks } }
    setResults(newResults)

    // Save history for undo/redo
    const newHistory = marksHistory.slice(0, historyIndex + 1)
    setMarksHistory([...newHistory, newResults])
    setHistoryIndex(newHistory.length)

    // Auto-save on change (debounced)
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
    autoSaveTimer.current = setTimeout(() => handleSaveDraft(), 30000)
  }

  const handleSaveDraft = async () => {
    setIsSavingDraft(true)
    setIsDraft(true) // Ensure status is draft
    if (selectedExam) {
      setSavedResults((prev) => ({
        ...prev,
        [selectedExam]: mockStudents.map((s) => ({
          student: s.name,
          roll: s.rollNumber,
          marks: results[s.id]?.marks,
        })),
      }))
    }
    setTimeout(() => {
      toast.success("✅ Draft Saved", {
        description: "Results draft saved successfully.",
      })
      setIsSavingDraft(false)
      setLastAction({ type: "draft", time: new Date() })
    }, 800)
  }

  // After submitting results, set isDraft to false and displayMode to 'view'
  const handleSubmitResults = async () => {
    if (errorList.length > 0) {
      toast.error("Please fix all errors before submitting.");
      return;
    }
    if (!window.confirm("Are you sure you want to submit? You won't be able to edit after submission.")) return;

    setIsSubmitting(true);
    setIsDraft(false); // Once submitted, it's no longer a draft
    setDisplayMode("view"); // Switch to view mode after submission

    if (selectedExam) {
      setSavedResults((prev) => ({
        ...prev,
        [selectedExam]: mockStudents.map((s) => ({
          student: s.name,
          roll: s.rollNumber,
          marks: results[s.id]?.marks,
        })),
      }))
    }

    setTimeout(() => {
      const isError = false // Simulate success for now
      if (isError) {
        toast.error("❌ Submission Failed", {
          description: "There was an error submitting the results. Please try again.",
        })
        setIsSubmitting(false)
        return
      }
      toast.success("✅ Results Submitted", {
        description: "The results have been submitted successfully and are pending approval.",
      })
      setIsSubmitting(false)
      setLastAction({ type: "submit", time: new Date() })
    }, 1000)
  }

  const getGrade = (marks: number, maxMarks: number) => {
    const percentage = (marks / maxMarks) * 100
    for (const gradeInfo of GRADE_THRESHOLDS) {
      if (percentage >= gradeInfo.minPercentage) {
        return { grade: gradeInfo.grade, color: gradeInfo.color }
      }
    }
    return { grade: "F", color: "bg-red-100 text-red-800" } // Fallback for F
  }

  const handleUndo = () => {
    if (historyIndex > 0) {
      setResults(marksHistory[historyIndex - 1])
      setHistoryIndex(historyIndex - 1)
    }
  }

  const handleRedo = () => {
    if (historyIndex < marksHistory.length - 1) {
      setResults(marksHistory[historyIndex + 1])
      setHistoryIndex(historyIndex + 1)
    }
  }

  const handleFillAll = (value: number) => {
    const newResults = Object.fromEntries(filteredStudents.map((s) => [s.id, { marks: value, remark: "" }]))
    setResults(newResults)
    setMarksHistory([...marksHistory.slice(0, historyIndex + 1), newResults])
    setHistoryIndex(historyIndex + 1)
  }

  const handleClearAll = () => handleFillAll(0)

  const handleExportCSV = () => {
    if (!selectedExamData) {
      toast.error("No exam selected for export.")
      return
    }
    const rows = ["Student,Roll,Marks,Grade"]
    // Export current results if in edit mode, or saved/mock if in view mode
    const dataToExport =
      displayMode === "edit"
        ? Object.values(results).map((marks, i) => ({
            student: filteredStudents[i]?.name || "",
            roll: filteredStudents[i]?.rollNumber || "",
            marks: marks.marks,
          }))
        : savedResults[selectedExam] || mockResultsByExam[selectedExam] || []

    dataToExport.forEach((r: { student: string; roll: string; marks: number }) => {
      const grade = getGrade(r.marks, selectedExamData?.maxMarks || 100).grade
      rows.push(`${r.student},${r.roll},${r.marks},${grade}`)
    })

    const csv = rows.join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${selectedExamData?.name || "results"}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.info("CSV Exported", { description: `Results for ${selectedExamData.name} exported.` })
  }

  const handlePrint = () => {
    if (!selectedExamData) {
      toast.error("No exam selected to print.")
      return
    }
    window.print()
    toast.info("Print Initiated", { description: `Printing results for ${selectedExamData.name}.` })
  }

  const handleDisplayModeChange = (mode: "edit" | "view") => {
    if (mode === "edit" && !isDraft) {
      // If trying to edit a submitted exam
      if (
        window.confirm(
          "This exam is already submitted. Switching to edit mode will revert it to a draft. Are you sure?",
        )
      ) {
        setIsDraft(true) // Mark as draft
        setDisplayMode("edit")
        toast.info("Switched to Edit Mode", { description: "Exam results are now a draft and can be edited." })
      }
    } else {
      setDisplayMode(mode)
      if (mode === "view") {
        toast.info("Switched to View Mode", { description: "You are now viewing the results. No edits can be made." })
      }
    }
  }

  // Auto-scroll to table and focus first input on exam/filter change
  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
    if (displayMode === "edit" && firstInputRef.current) {
      firstInputRef.current.focus()
    }
  }, [selectedExam, selectedClass, selectedSubject, displayMode])

  // Enhanced loading state with better UX
  if (!mounted || !selectedExamData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <div className="relative">
              <Loader2 className="animate-spin h-12 w-12 text-indigo-600 mx-auto" />
              <div className="absolute inset-0 rounded-full border-4 border-indigo-200 animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">Loading Results Entry</h3>
              <p className="text-sm text-gray-500">Preparing your workspace...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render onboarding modal and empty states before main content
  if (showOnboarding) {
    return <OnboardingModal open={showOnboarding} onClose={handleCloseOnboarding} />;
  }
  if (!hasExams) {
    return (
      <EmptyState
        icon={<BookOpen className="h-16 w-16 text-indigo-400" />}
        title="No Exams Yet"
        description="Create your first exam to start entering results."
        action={<Button onClick={openCreateExamModal} className="bg-indigo-600 text-white hover:bg-indigo-700">Create Exam</Button>}
      />
    );
  }
  if (!hasStudents) {
    return (
      <EmptyState
        icon={<Users className="h-16 w-16 text-emerald-400" />}
        title="No Students"
        description="Add students to your class to begin."
        action={<Button onClick={openAddStudentModal} className="bg-emerald-600 text-white hover:bg-emerald-700">Add Students</Button>}
      />
    );
  }

  // Ensure handleRemarkChange is defined and only ever spreads an object
  const handleRemarkChange = (studentId: string, remark: string) => {
    const prev = typeof results[studentId] === 'object' && results[studentId] !== null ? results[studentId] : { marks: 0, remark: "" };
    const newResults = { ...results, [studentId]: { ...prev, remark } };
    setResults(newResults);
    const newHistory = marksHistory.slice(0, historyIndex + 1);
    setMarksHistory([...newHistory, newResults]);
    setHistoryIndex(newHistory.length);
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        <div className="w-full">
          
          
          <div className="p-6 space-y-6">
            {/* Enhanced Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                    {selectedExamData ? selectedExamData.name : 'Results Entry'}
                    {selectedExamData && (
                      <Badge variant={isDraft ? "secondary" : "default"} className={`ml-2 ${isDraft ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                        {isDraft ? <Clock className="h-3 w-3 mr-1" /> : <CheckCircle2 className="h-3 w-3 mr-1" />}
                        {isDraft ? "Draft" : "Submitted"}
                      </Badge>
                    )}
                  </h1>
                  <p className="text-slate-600 text-lg mt-1">
                    {selectedExamData ? `${selectedExamData.subject} • ${selectedExamData.class} • Max Marks: ${selectedExamData.maxMarks}` : 'Enter, save, and submit marks for your students'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" className="border-2 hover:border-indigo-300 hover:bg-indigo-50">
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="border-2 hover:border-indigo-300 hover:bg-indigo-50">
                  <Settings className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="border-2 hover:border-indigo-300 hover:bg-indigo-50">
                  <Bell className="h-4 w-4" />
                </Button>
              </div>
            </div>

      {/* Print-specific CSS */}
      <style jsx global>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
            background-color: #fff !important;
            color: #000 !important;
          }
          /* Hide all elements not part of the main results table */
          .header-section,
          .overview-section,
          .summary-stats-section,
          .results-card .card-header-controls, /* Specific div for controls */
          .results-card .submission-actions,
          .sonner-toaster,
          .loading-overlay,
          .back-to-top-button {
            display: none !important;
          }
          /* Adjust main container for full page print */
          .main-app-container {
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            min-height: auto !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
          }
          /* Ensure the results card itself is clean */
          .results-card {
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .results-card .card-content {
            padding: 0 !important; /* Remove padding from card content */
          }
          /* Table specific styles for print */
          .results-card table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px; /* Smaller font for print */
          }
          .results-card th,
          .results-card td {
            border: 1px solid #ccc !important; /* Clearer borders */
            padding: 6px 8px !important; /* Adjust padding */
            color: #000 !important;
          }
          .results-card thead {
            background-color: #f0f0f0 !important; /* Light grey header */
          }
          .results-card tbody tr:nth-child(odd) {
            background-color: #fff !important;
          }
          .results-card tbody tr:nth-child(even) {
            background-color: #f9f9f9 !important;
          }
          /* Badges should be simple text for print */
          .badge {
            background-color: transparent !important;
            color: #000 !important;
            border: 1px solid #ccc !important;
            padding: 2px 6px !important;
            font-size: 10px !important;
          }
          /* Hide avatar in print */
          .student-avatar {
            display: none !important;
          }
        }
        /* Mobile specific adjustments */
        @media (max-width: 640px) {
          .results-card .card-header-controls {
            flex-direction: column !important;
            gap: 0.5rem !important;
          }
          .results-card table th,
          .results-card table td {
            padding-left: 0.5rem !important;
            padding-right: 0.5rem !important;
            font-size: 13px !important;
          }
          .results-card .student-avatar {
            width: 1.5rem !important;
            height: 1.5rem !important;
          }
          .results-card .badge {
            font-size: 11px !important;
            padding: 2px 6px !important;
          }
        }
      `}</style>

      {/* Loading overlay */}
      {(isSavingDraft || isSubmitting) && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 loading-overlay">
          <Loader2 className="animate-spin h-10 w-10 text-blue-600" aria-label="Loading spinner" />
        </div>
      )}
      <Toaster position="top-right" className="sonner-toaster" />

      {/* Back to Top button (mobile only) */}
      {showBackToTop && (
        <button
          className="fixed bottom-20 right-4 z-50 bg-blue-600 text-white rounded-full shadow-lg p-3 sm:hidden back-to-top-button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to Top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}

      {/* Main Application Container */}
      <div className="w-full min-h-screen flex flex-col bg-gray-50 main-app-container transition-all duration-300 ease-in-out overflow-x-hidden">
        {/* Enhanced Sticky Filter Section/Header */}
        <Card className="mb-8 p-6 rounded-2xl shadow bg-white">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
            {/* Enhanced Exam Dropdown with details */}
            <Select value={selectedExam} onValueChange={setSelectedExam}>
              <SelectTrigger className="w-full sm:w-64 bg-white border-gray-200">
                {(() => {
                  const exam = filteredExams.find(e => e.id === selectedExam);
                  if (!exam) return <span className="text-gray-400">Choose Exam</span>;
                  return (
                    <div className="flex flex-col items-center py-1 px-2 w-full">
                      <span className="font-semibold text-base sm:text-lg text-gray-900 text-center leading-tight tracking-tight">{exam.name}</span>
                    </div>
                  );
                })()}
              </SelectTrigger>
              <SelectContent>
                {filteredExams.map((exam) => (
                  <SelectItem key={exam.id} value={exam.id}>
                    <div className="flex flex-col py-1.5 px-2 rounded-md transition hover:bg-gray-50">
                      <span className="font-bold text-lg text-gray-900">{exam.name}</span>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm">
                        <span>
                          <span className="text-gray-500">Type:</span>
                          <span className="ml-1 font-semibold text-purple-600">{exam.name.includes('Unit') ? 'Unit Test' : exam.name.includes('Mid') ? 'Mid-Term' : exam.name.includes('Final') ? 'Final' : exam.name.includes('Quiz') ? 'Quiz' : 'Exam'}</span>
                        </span>
                        <span>
                          <span className="text-gray-500">Subject:</span>
                          <span className="ml-1 font-semibold text-blue-600">{exam.subject}</span>
                        </span>
                        <span>
                          <span className="text-gray-500">Class:</span>
                          <span className="ml-1 font-semibold text-green-600">{exam.class}</span>
                        </span>
                        <span>
                          <span className="text-gray-500">Max:</span>
                          <span className="ml-1 font-semibold text-yellow-600">{exam.maxMarks}</span>
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-full sm:w-40 bg-white border-gray-200">
                <SelectValue placeholder="Class" />
              </SelectTrigger>
              <SelectContent>
                {classOptions.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-full sm:w-40 bg-white border-gray-200">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                {subjectOptions.map((sub) => (
                  <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="text"
              placeholder="Search students..."
              value={searchInput}
              onChange={e => handleSearchInput(e.target.value)}
              className="w-full sm:w-64 bg-white border-gray-200"
            />
            <Button variant="outline" onClick={handleResetFilters} className="flex items-center gap-1">
              <Eraser className="h-4 w-4" />Reset
            </Button>
          </div>
          {/* Stat Cards Grid */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
            {/* Details Card */}
            <div className="flex flex-col justify-between p-5 rounded-2xl border-2 border-indigo-200 min-h-[120px] bg-white">
              <div className="flex items-center gap-3 mb-2">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100">
                  <Info className="h-6 w-6 text-indigo-600" />
                </span>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-gray-900">{selectedExamData?.subject}</span>
                  <span className="text-xs text-gray-500">{selectedExamData?.class}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1 mt-2">
                <span className="text-xs text-gray-500">Max Marks</span>
                <span className="text-base font-semibold text-gray-900">{selectedExamData?.maxMarks}</span>
                <span className="text-xs text-gray-500 mt-1">Total Students</span>
                <span className="text-base font-semibold text-gray-900">{mockStudents.length}</span>
              </div>
            </div>
            {/* Status Card */}
            <div className={`flex flex-col justify-between p-5 rounded-2xl border-2 ${isDraft ? 'border-yellow-300' : 'border-green-300'} min-h-[120px] bg-white`}>
              <div className="flex items-center gap-3 mb-2">
                <span className={`flex items-center justify-center w-10 h-10 rounded-full ${isDraft ? 'bg-yellow-100' : 'bg-green-100'}`}> 
                  <Users className={`h-6 w-6 ${isDraft ? 'text-yellow-600' : 'text-green-600'}`} />
                </span>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-gray-900">Status</span>
                  <span className="text-xs text-gray-500">{isDraft ? "Draft" : "Submitted"}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-gray-500">Completed</span>
                <span className="text-base font-semibold text-gray-900">{Object.keys(results).length}/{mockStudents.length}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ml-2 ${isDraft ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{isDraft ? "Draft" : "Submitted"}</span>
              </div>
            </div>
            {/* Avg Card */}
            <div className="flex flex-col justify-between p-5 rounded-2xl border-2 border-blue-200 min-h-[120px] bg-white">
              <div className="flex items-center gap-3 mb-2">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
                  <Users className="h-6 w-6 text-blue-600" />
                </span>
                <span className="text-lg font-bold text-gray-900">Average</span>
              </div>
              <span className="text-2xl font-extrabold text-blue-700 mt-2">{avg}</span>
            </div>
            {/* High Card */}
            <div className="flex flex-col justify-between p-5 rounded-2xl border-2 border-green-200 min-h-[120px] bg-white">
              <div className="flex items-center gap-3 mb-2">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </span>
                <span className="text-lg font-bold text-gray-900">High</span>
              </div>
              <span className="text-2xl font-extrabold text-green-700 mt-2">{highest}</span>
            </div>
            {/* Low Card */}
            <div className="flex flex-col justify-between p-5 rounded-2xl border-2 border-red-200 min-h-[120px] bg-white">
              <div className="flex items-center gap-3 mb-2">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </span>
                <span className="text-lg font-bold text-gray-900">Low</span>
              </div>
              <span className="text-2xl font-extrabold text-red-700 mt-2">{lowest}</span>
            </div>
            {/* Grade Distribution Card */}
            <div className="flex flex-col justify-between p-5 rounded-2xl border-2 border-yellow-200 min-h-[120px] md:col-span-2 lg:col-span-2 bg-white">
              <div className="flex items-center gap-3 mb-2">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100">
                  <BookOpen className="h-6 w-6 text-yellow-600" />
                </span>
                <span className="text-lg font-bold text-gray-900">Grade Distribution</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {GRADE_THRESHOLDS.map((gradeInfo) => {
                  const count = Object.values(results).filter(
                    (marks) => getGrade(marks.marks, selectedExamData?.maxMarks || 100).grade === gradeInfo.grade,
                  ).length
                  return (
                    <span key={gradeInfo.grade} className="px-3 py-1 rounded-full bg-gray-100 border font-semibold text-gray-700 text-xs">
                      {gradeInfo.grade}: {count}
                    </span>
                  )
                })}
              </div>
            </div>
          </div>
        </Card>
        
        {/* Enhanced Table Section with sticky header and scrollable body */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 mt-2">
  <div className="flex items-center gap-2">
    <BookOpen className="h-6 w-6 text-indigo-500" />
    <span className="text-2xl font-bold text-gray-900">Results</span>
    <span className="ml-2 text-sm text-gray-500">({filteredStudents.length})</span>
  </div>
  <div className="flex gap-2 mt-2 sm:mt-0">
    <button
      type="button"
      onClick={() => handleDisplayModeChange(displayMode === "edit" ? "view" : "edit")}
      className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-600 hover:text-indigo-800 font-semibold text-sm transition-colors"
      aria-label={displayMode === "edit" ? "Done Editing" : "Edit Results"}
      title={displayMode === "edit" ? "Done Editing" : "Edit Results"}
    >
      {displayMode === "edit" ? <CheckCircle2 className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
      {displayMode === "edit" ? "Done" : "Edit"}
    </button>
    <Button variant="outline" onClick={handleExportCSV} className="flex items-center gap-1"><Download className="h-4 w-4" />Export CSV</Button>
    <Button variant="outline" onClick={handlePrint} className="flex items-center gap-1"><Printer className="h-4 w-4" />Print</Button>
    <Button onClick={handleSaveDraft} className="flex items-center gap-1 bg-indigo-600 text-white hover:bg-indigo-700"><Save className="h-4 w-4" />Save Results</Button>
  </div>
</div>
        <div className="w-full max-w-full overflow-x-auto">
  <div className="rounded-2xl border bg-white shadow-md max-h-[500px] overflow-y-auto">
    <table className="w-full min-w-[400px] sm:min-w-[500px] table-auto text-sm">
              <thead className="sticky top-0 z-10 bg-white shadow-sm">
                <tr className="bg-gray-100 text-gray-900">
          <th className="px-4 py-3 text-left font-semibold">#</th>
          <th className="px-4 py-3 text-left font-semibold">Student</th>
          <th className="px-4 py-3 text-left font-semibold">Class</th>
          <th className="px-4 py-3 text-left font-semibold">Roll No</th>
          <th className="px-4 py-3 text-left font-semibold">Marks</th>
          <th className="px-4 py-3 text-left font-semibold">Grade</th>
          <th className="px-4 py-3 text-left font-semibold">Remarks</th>
                </tr>
              </thead>
              <AnimatePresence mode="wait">
                {filteredStudents.length > 0 ? (
                  <motion.tbody
            key={selectedExam}
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                  >
                    {filteredStudents.map((student, idx) => {
                      let entry = results[student.id];
              if (typeof entry !== 'object' || entry === null) entry = { marks: 0, remark: "" };
                      const marks = entry.marks;
                      const remark = entry.remark;
                      const gradeInfo = getGrade(marks, selectedExamData?.maxMarks || 100);
                      const error = validateMark(marks, selectedExamData?.maxMarks || 100);
                      return (
                        <motion.tr
                          key={student.id}
                          variants={rowVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          layout
                  className={cn(idx % 2 === 0 ? "bg-white" : "bg-gray-50", "hover:bg-gray-100 border-b border-gray-200 last:border-b-0")}
                        >
                  <td className="px-4 py-3">{idx + 1}</td>
                  <td className="px-4 py-3 flex items-center gap-3">
                    <Avatar className="h-8 w-8"><AvatarFallback className="bg-indigo-100 text-indigo-700 text-base">{student.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback></Avatar>
                    <div>
                      <div className="font-semibold text-gray-900">{student.name}</div>
                      <div className="text-xs text-gray-500">Roll: {student.rollNumber}</div>
                    </div>
                          </td>
                  <td className="px-4 py-3">{student.class}</td>
                  <td className="px-4 py-3 text-gray-800">{student.rollNumber}</td>
                  <td className="px-4 py-3">
                    {displayMode === "edit" ? (
                              <Input
                                ref={idx === 0 ? firstInputRef : undefined}
                                type="number"
                                aria-label={`Marks for ${student.name}`}
                                placeholder="Marks"
                                value={marks !== null && marks !== undefined ? marks : ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleMarksChange(student.id, e.target.value)}
                        className={`w-16 focus:ring-2 focus:ring-indigo-500 transition-all text-sm h-9 ${error ? "border-red-500" : ""}`}
                                max={selectedExamData?.maxMarks}
                                min={0}
                                disabled={isSavingDraft || isSubmitting}
                                tabIndex={0}
                              />
                            ) : (
                              <span className="font-medium text-gray-900">{marks}</span>
                            )}
                            {error && (
                      <span className="ml-2 text-xs text-red-600 animate-fade-in">{error}</span>
                            )}
                          </td>
                  <td className="px-4 py-3"><Badge className={gradeInfo.color}>{gradeInfo.grade}</Badge></td>
                  <td className="px-4 py-3">
                    {displayMode === "edit" ? (
                              <Input
                                type="text"
                                aria-label={`Remark for ${student.name}`}
                                placeholder="Remark"
                                value={remark}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleRemarkChange(student.id, e.target.value)}
                        className="w-32 focus:ring-2 focus:ring-indigo-500 transition-all text-sm h-9"
                                maxLength={50}
                                disabled={isSavingDraft || isSubmitting}
                                tabIndex={0}
                              />
                            ) : (
                              <span className="font-medium text-gray-900">{remark}</span>
                            )}
                          </td>
                        </motion.tr>
              );
                    })}
                  </motion.tbody>
                ) : (
          <motion.tbody key="no-students" initial="hidden" animate="visible" exit="exit" variants={containerVariants}>
                    <motion.tr variants={rowVariants}>
              <td colSpan={7} className="text-center text-muted-foreground py-8">No students found.</td>
                    </motion.tr>
                  </motion.tbody>
                )}
              </AnimatePresence>
            </table>
  </div>
          </div>
          {/* Pagination Controls */}
          <div className="flex justify-end items-center gap-2 mt-2">
            {/* Example: Prev/Next buttons, replace with real logic if paginating data */}
            <button className="px-3 py-1 rounded border border-gray-200 bg-white text-gray-700 hover:bg-gray-50">Prev</button>
            <button className="px-3 py-1 rounded border border-gray-200 bg-white text-gray-700 hover:bg-gray-50">Next</button>
          </div>
              </div>
                {/* Sticky Submission Action Bar */}
              {displayMode === "edit" && (
                  <div
                    className="flex flex-col sm:flex-row justify-end gap-1 sm:gap-2 mt-2 sm:mt-6 sticky bottom-0 bg-gray-50 py-2 z-10 border-t submission-actions w-full"
                    style={{
                      position: "sticky",
                      bottom: 0,
                      background: "rgba(248,250,252,0.95)",
                      boxShadow: "0 -2px 8px rgba(0,0,0,0.03)",
                    }}
                  >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <Button
                          variant="outline"
                          onClick={handleSaveDraft}
                          disabled={isSavingDraft || !isDraft}
                          aria-label="Save Draft"
                    className="flex items-center gap-2 bg-indigo-50 text-indigo-700 font-semibold hover:bg-indigo-100 h-9 sm:h-10 px-2 sm:px-4 text-xs sm:text-base"
                        >
                            {isSavingDraft ? (
                              <Loader2 className="animate-spin h-4 w-4" />
                            ) : (
                              <Save className="h-4 w-4" />
                            )}
                          Save Draft
                        </Button>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>Save as draft (not visible to students)</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <Button
                          onClick={handleSubmitResults}
                    className="flex items-center gap-2 bg-indigo-600 text-white font-semibold hover:bg-indigo-700 h-9 sm:h-10 px-2 sm:px-4 text-xs sm:text-base"
                          disabled={isSubmitting || errorList.length > 0 || !isDraft}
                          aria-label="Submit Results"
                        >
                          {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : <Send className="h-4 w-4" />}
                          Submit Results
                        </Button>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>Submit results for approval</TooltipContent>
                  </Tooltip>
                </div>
              )}
            </div>
          </div>
        </div>
    </TooltipProvider>
  )
}
