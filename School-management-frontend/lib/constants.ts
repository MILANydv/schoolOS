import {
  Book,
  Calendar,
  ClipboardList,
  DollarSign,
  GraduationCap,
  LayoutDashboard,
  ListChecks,
  ScrollText,
  Settings,
  Users,
  Bus,
  BarChart,
  User,
  Building2,
  Bell,
  Briefcase,
  Award,
  Handshake,
  Receipt,
  Hourglass,
  UserPlus,
  ClipboardPenLine,
  CalendarClock,
  UserCheck,
  CreditCard,
} from "lucide-react"

export const USER_ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  SCHOOL_ADMIN: "SCHOOL_ADMIN",
  TEACHER: "TEACHER",
  ACCOUNTANT: "ACCOUNTANT",
  STUDENT_PARENT: "STUDENT_PARENT",
} as const

// Map icon names to Lucide React components for AppSidebar
export const Icons = {
  LayoutDashboard,
  Building2,
  Users,
  DollarSign,
  Bell,
  ClipboardList,
  User,
  Settings,
  GraduationCap,
  UserPlus,
  Book,
  ScrollText,
  Calendar,
  ListChecks,
  ClipboardPenLine,
  CalendarClock,
  BarChart,
  Briefcase,
  Award,
  Handshake,
  Receipt,
  Hourglass,
  Bus,
  UserCheck,
  CreditCard,
} as const

export const NAV_LINKS = {
  [USER_ROLES.SUPER_ADMIN]: [
    {
      title: "Dashboard",
      href: "/superadmin/dashboard",
      icon: "LayoutDashboard",
    },
    {
      title: "Schools",
      href: "/superadmin/schools",
      icon: "Building2",
    },
    {
      title: "User Management",
      href: "/superadmin/users",
      icon: "Users",
    },
    {
      title: "Subscriptions",
      href: "/superadmin/subscriptions",
      icon: "DollarSign",
    },
    {
      title: "Announcements",
      href: "/superadmin/announcements",
      icon: "Bell",
    },
    {
      title: "Logs",
      href: "/superadmin/logs",
      icon: "ClipboardList",
    },
    {
      title: "My Profile",
      href: "/superadmin/profile",
      icon: "User",
    },
  ],
  [USER_ROLES.SCHOOL_ADMIN]: [
    {
      title: "Dashboard",
      href: "/schooladmin/dashboard",
      icon: "LayoutDashboard",
    },
    {
      title: "Students",
      icon: "GraduationCap",
      subLinks: [
        { title: "Manage Students", href: "/schooladmin/students" },
        { title: "Admissions", href: "/schooladmin/admissions", icon: "ClipboardList" },
        { title: "Identity Cards", href: "/schooladmin/students/identity-cards", icon: "CreditCard" },
      ],
    },
    {
      title: "Staff",
      icon: "Users",
      subLinks: [
        {
          title: "Staff Management",
          href: "/schooladmin/staff/management",
          icon: "UserCheck",
        },
        {
          title: "Salary Management",
          href: "/schooladmin/staff/salary",
          icon: "DollarSign",
        },
      ],
    },
    {
      title: "Classes",
      href: "/schooladmin/classes",
      icon: "Book",
    },
    {
      title: "Subjects",
      href: "/schooladmin/subjects",
      icon: "ScrollText",
    },
    {
      title: "Timetable",
      href: "/schooladmin/timetable",
      icon: "Calendar",
    },
    {
      title: "Exams",
      href: "/schooladmin/exams",
      icon: "ClipboardList",
    },
    {
      title: "Results Approval",
      href: "/schooladmin/results/approval",
      icon: "ListChecks",
    },
    {
      title: "Attendance",
      href: "/schooladmin/attendance",
      icon: "ClipboardPenLine",
    },
    {
      title: "Fees",
      href: "/schooladmin/fees",
      icon: "DollarSign",
    },
    {
      title: "Notifications",
      href: "/schooladmin/notifications",
      icon: "Bell",
    },
    {
      title: "Events",
      href: "/schooladmin/events",
      icon: "CalendarClock",
    },
    {
      title: "Profile Settings",
      href: "/schooladmin/profile/settings",
      icon: "Settings",
    },
    {
      title: "My Profile",
      href: "/schooladmin/profile",
      icon: "User",
    },
    {
      title: "Logs",
      href: "/schooladmin/logs",
      icon: "ClipboardList",
    },
  ],
  [USER_ROLES.TEACHER]: [
    {
      title: "Dashboard",
      href: "/teacher/dashboard",
      icon: "LayoutDashboard",
    },
    {
      title: "Mark Attendance",
      href: "/teacher/attendance/mark",
      icon: "ClipboardPenLine",
    },
    {
      title: "Enter Results",
      href: "/teacher/results/enter",
      icon: "ListChecks",
    },
    {
      title: "Timetable",
      href: "/teacher/timetable",
      icon: "Calendar",
    },
    {
      title: "Student Performance",
      href: "/teacher/students/performance",
      icon: "BarChart",
    },
    {
      title: "Assignments",
      href: "/teacher/work/assignments",
      icon: "Briefcase",
    },
    {
      title: "My Classes",
      href: "/teacher/classes",
      icon: "Book",
    },
    {
      title: "My Profile",
      href: "/teacher/profile",
      icon: "User",
    },
  ],
  [USER_ROLES.ACCOUNTANT]: [
    {
      title: "Dashboard",
      href: "/accountant/dashboard",
      icon: "LayoutDashboard",
    },
    {
      title: "Fee Structure",
      href: "/accountant/fees/structure",
      icon: "DollarSign",
    },
    {
      title: "Assign Fees",
      href: "/accountant/fees/assign",
      icon: "Handshake",
    },
    {
      title: "Mark Payments",
      href: "/accountant/payments/mark",
      icon: "Receipt",
    },
    {
      title: "Dues",
      href: "/accountant/dues",
      icon: "Hourglass",
    },
    {
      title: "Reports",
      href: "/accountant/reports",
      icon: "BarChart",
    },
    {
      title: "Transport",
      href: "/accountant/transport",
      icon: "Bus",
    },
    {
      title: "Profile Settings",
      href: "/accountant/profile/settings",
      icon: "Settings",
    },
    {
      title: "My Profile",
      href: "/accountant/profile",
      icon: "User",
    },
  ],
  [USER_ROLES.STUDENT_PARENT]: [
    {
      title: "Dashboard",
      href: "/student-parent/dashboard",
      icon: "LayoutDashboard",
    },
    {
      title: "My Timetable",
      href: "/student-parent/timetable",
      icon: "Calendar",
    },
    {
      title: "My Results",
      href: "/student-parent/results",
      icon: "Award",
    },
    {
      title: "Fee Details",
      href: "/student-parent/fees",
      icon: "DollarSign",
    },
    {
      title: "My Attendance",
      href: "/student-parent/attendance",
      icon: "ClipboardPenLine",
    },
    {
      title: "Assignments",
      href: "/student-parent/work/assignments",
      icon: "Briefcase",
    },
    {
      title: "Notifications",
      href: "/student-parent/notifications",
      icon: "Bell",
    },
    {
      title: "My Profile",
      href: "/student-parent/profile",
      icon: "User",
    },
  ],
}

export const MOCK_BREADCRUMBS: { [key: string]: { label: string; href: string }[] } = {
  "/superadmin/dashboard": [{ label: "Dashboard", href: "/superadmin/dashboard" }],
  "/superadmin/schools": [
    { label: "Dashboard", href: "/superadmin/dashboard" },
    { label: "Schools", href: "/superadmin/schools" },
  ],
  "/superadmin/schools/create": [
    { label: "Dashboard", href: "/superadmin/dashboard" },
    { label: "Schools", href: "/superadmin/schools" },
    { label: "Create", href: "/superadmin/schools/create" },
  ],
  "/superadmin/schools/[id]/stats": [
    { label: "Dashboard", href: "/superadmin/dashboard" },
    { label: "Schools", href: "/superadmin/schools" },
    { label: "School Stats", href: "" },
  ],
  "/superadmin/users": [
    { label: "Dashboard", href: "/superadmin/dashboard" },
    { label: "User Management", href: "/superadmin/users" },
  ],
  "/superadmin/subscriptions": [
    { label: "Dashboard", href: "/superadmin/dashboard" },
    { label: "Subscriptions", href: "/superadmin/subscriptions" },
  ],
  "/superadmin/announcements": [
    { label: "Dashboard", href: "/superadmin/dashboard" },
    { label: "Announcements", href: "/superadmin/announcements" },
  ],
  "/superadmin/logs": [
    { label: "Dashboard", href: "/superadmin/dashboard" },
    { label: "Logs", href: "/superadmin/logs" },
  ],
  "/superadmin/profile": [
    { label: "Dashboard", href: "/superadmin/dashboard" },
    { label: "My Profile", href: "/superadmin/profile" },
  ],
  "/schooladmin/dashboard": [{ label: "Dashboard", href: "/schooladmin/dashboard" }],
  "/schooladmin/students": [
    { label: "Dashboard", href: "/schooladmin/dashboard" },
    { label: "Students", href: "/schooladmin/students" },
  ],
  "/schooladmin/students/identity-cards": [
    { label: "Dashboard", href: "/schooladmin/dashboard" },
    { label: "Students", href: "/schooladmin/students" },
    { label: "Identity Cards", href: "/schooladmin/students/identity-cards" },
  ],
  "/schooladmin/students/add": [
    { label: "Dashboard", href: "/schooladmin/dashboard" },
    { label: "Students", href: "/schooladmin/students" },
    { label: "Add Student", href: "/schooladmin/students/add" },
  ],
  "/schooladmin/admissions": [
    { label: "Dashboard", href: "/schooladmin/dashboard" },
    { label: "Admissions", href: "/schooladmin/admissions" },
  ],
  "/schooladmin/users": [
    { label: "Dashboard", href: "/schooladmin/dashboard" },
    { label: "Users", href: "/schooladmin/users" },
  ],
  "/schooladmin/classes": [
    { label: "Dashboard", href: "/schooladmin/dashboard" },
    { label: "Classes", href: "/schooladmin/classes" },
  ],
  "/schooladmin/subjects": [
    { label: "Dashboard", href: "/schooladmin/dashboard" },
    { label: "Subjects", href: "/schooladmin/subjects" },
  ],
  "/schooladmin/timetable": [
    { label: "Dashboard", href: "/schooladmin/dashboard" },
    { label: "Timetable", href: "/schooladmin/timetable" },
  ],
  "/schooladmin/exams": [
    { label: "Dashboard", href: "/schooladmin/dashboard" },
    { label: "Exams", href: "/schooladmin/exams" },
  ],
  "/schooladmin/results/approval": [
    { label: "Dashboard", href: "/schooladmin/dashboard" },
    { label: "Results Approval", href: "/schooladmin/results/approval" },
  ],
  "/schooladmin/attendance": [
    { label: "Dashboard", href: "/schooladmin/dashboard" },
    { label: "Attendance", href: "/schooladmin/attendance" },
  ],
  "/schooladmin/fees": [
    { label: "Dashboard", href: "/schooladmin/dashboard" },
    { label: "Fees", href: "/schooladmin/fees" },
  ],
  "/schooladmin/notifications": [
    { label: "Dashboard", href: "/schooladmin/dashboard" },
    { label: "Notifications", href: "/schooladmin/notifications" },
  ],
  "/schooladmin/events": [
    { label: "Dashboard", href: "/schooladmin/dashboard" },
    { label: "Events", href: "/schooladmin/events" },
  ],
  "/schooladmin/profile/settings": [
    { label: "Dashboard", href: "/schooladmin/dashboard" },
    { label: "Profile Settings", href: "/schooladmin/profile/settings" },
  ],
  "/schooladmin/logs": [
    { label: "Dashboard", href: "/schooladmin/dashboard" },
    { label: "Logs", href: "/schooladmin/logs" },
  ],
  "/schooladmin/staff/management": [
    { label: "Dashboard", href: "/schooladmin/dashboard" },
    { label: "Staff Management", href: "/schooladmin/staff/management" },
  ],
  "/schooladmin/staff/salary": [
    { label: "Dashboard", href: "/schooladmin/dashboard" },
    { label: "Salary Management", href: "/schooladmin/staff/salary" },
  ],
  "/teacher/dashboard": [{ label: "Dashboard", href: "/teacher/dashboard" }],
  "/teacher/attendance/mark": [
    { label: "Dashboard", href: "/teacher/dashboard" },
    { label: "Mark Attendance", href: "/teacher/attendance/mark" },
  ],
  "/teacher/results/enter": [
    { label: "Dashboard", href: "/teacher/dashboard" },
    { label: "Enter Results", href: "/teacher/results/enter" },
  ],
  "/teacher/timetable": [
    { label: "Dashboard", href: "/teacher/dashboard" },
    { label: "Timetable", href: "/teacher/timetable" },
  ],
  "/teacher/students/performance": [
    { label: "Dashboard", href: "/teacher/dashboard" },
    { label: "Student Performance", href: "/teacher/students/performance" },
  ],
  "/teacher/work/assignments": [
    { label: "Dashboard", href: "/teacher/dashboard" },
    { label: "Assignments", href: "/teacher/work/assignments" },
  ],
  "/teacher/classes": [
    { label: "Dashboard", href: "/teacher/dashboard" },
    { label: "My Classes", href: "/teacher/classes" },
  ],
  "/teacher/profile/settings": [
    { label: "Dashboard", href: "/teacher/dashboard" },
    { label: "Profile Settings", href: "/teacher/profile/settings" },
  ],
  "/accountant/dashboard": [{ label: "Dashboard", href: "/accountant/dashboard" }],
  "/accountant/fees/structure": [
    { label: "Dashboard", href: "/accountant/dashboard" },
    { label: "Fee Structure", href: "/accountant/fees/structure" },
  ],
  "/accountant/fees/assign": [
    { label: "Dashboard", href: "/accountant/dashboard" },
    { label: "Assign Fees", href: "/accountant/fees/assign" },
  ],
  "/accountant/payments/mark": [
    { label: "Dashboard", href: "/accountant/dashboard" },
    { label: "Mark Payments", href: "/accountant/payments/mark" },
  ],
  "/accountant/dues": [
    { label: "Dashboard", href: "/accountant/dashboard" },
    { label: "Dues", href: "/accountant/dues" },
  ],
  "/accountant/reports": [
    { label: "Dashboard", href: "/accountant/dashboard" },
    { label: "Reports", href: "/accountant/reports" },
  ],
  "/accountant/transport": [
    { label: "Dashboard", href: "/accountant/dashboard" },
    { label: "Transport", href: "/accountant/transport" },
  ],
  "/accountant/profile/settings": [
    { label: "Dashboard", href: "/accountant/dashboard" },
    { label: "Profile Settings", href: "/accountant/profile/settings" },
  ],
  "/student-parent/dashboard": [{ label: "Dashboard", href: "/student-parent/dashboard" }],
  "/student-parent/timetable": [
    { label: "Dashboard", href: "/student-parent/dashboard" },
    { label: "My Timetable", href: "/student-parent/timetable" },
  ],
  "/student-parent/results": [
    { label: "Dashboard", href: "/student-parent/dashboard" },
    { label: "My Results", href: "/student-parent/results" },
  ],
  "/student-parent/fees": [
    { label: "Dashboard", href: "/student-parent/dashboard" },
    { label: "Fee Details", href: "/student-parent/fees" },
  ],
  "/student-parent/attendance": [
    { label: "Dashboard", href: "/student-parent/dashboard" },
    { label: "My Attendance", href: "/student-parent/attendance" },
  ],
  "/student-parent/work/assignments": [
    { label: "Dashboard", href: "/student-parent/dashboard" },
    { label: "Assignments", href: "/student-parent/work/assignments" },
  ],
  "/student-parent/notifications": [
    { label: "Dashboard", href: "/student-parent/dashboard" },
    { label: "Notifications", href: "/student-parent/notifications" },
  ],
  "/student-parent/profile": [
    { label: "Dashboard", href: "/student-parent/dashboard" },
    { label: "My Profile", href: "/student-parent/profile" },
  ],
}

export const MOCK_SCHOOLS = [
  {
    id: "sch001",
    name: "Central High School",
    address: "123 Main St, Anytown",
    phone: "555-1234",
    email: "info@centralhigh.edu",
    principal: "Dr. Alice Smith",
    status: "Active",
    subscription: "Premium",
    students: 850,
    teachers: 60,
    established: "2000-09-01",
  },
  {
    id: "sch002",
    name: "Northwood Academy",
    address: "456 Oak Ave, Villagetown",
    phone: "555-5678",
    email: "contact@northwood.org",
    principal: "Mr. Bob Johnson",
    status: "Trial",
    subscription: "Basic",
    students: 400,
    teachers: 30,
    established: "2010-01-15",
  },
  {
    id: "sch003",
    name: "Riverside Public",
    address: "789 River Rd, Cityville",
    phone: "555-9012",
    email: "admin@riverside.net",
    principal: "Ms. Carol White",
    status: "Inactive",
    subscription: "Free",
    students: 150,
    teachers: 15,
    established: "1995-03-20",
  },
  {
    id: "sch004",
    name: "Green Valley School",
    address: "101 Pine Ln, Countryside",
    phone: "555-3456",
    email: "office@greenvalley.edu",
    principal: "Dr. David Green",
    status: "Active",
    subscription: "Premium",
    students: 1100,
    teachers: 75,
    established: "1988-07-01",
  },
  {
    id: "sch005",
    name: "Ocean View College",
    address: "222 Beach Blvd, Coasttown",
    phone: "555-7890",
    email: "info@oceanview.edu",
    principal: "Ms. Emily Brown",
    status: "Active",
    subscription: "Standard",
    students: 700,
    teachers: 50,
    established: "2005-04-10",
  },
]

export const MOCK_USERS = [
  {
    id: "usr001",
    name: "Super Admin User",
    email: "superadmin@example.com",
    role: USER_ROLES.SUPER_ADMIN,
    schoolId: null,
    status: "Active",
    lastLogin: "2024-07-12T10:00:00Z",
  },
  {
    id: "usr002",
    name: "Alice School Admin",
    email: "schooladmin@example.com",
    role: USER_ROLES.SCHOOL_ADMIN,
    schoolId: "sch001",
    status: "Active",
    lastLogin: "2024-07-12T09:30:00Z",
  },
  {
    id: "usr003",
    name: "Bob Teacher",
    email: "teacher@example.com",
    role: USER_ROLES.TEACHER,
    schoolId: "sch001",
    status: "Active",
    lastLogin: "2024-07-11T14:00:00Z",
  },
  {
    id: "usr004",
    name: "Charlie Accountant",
    email: "accountant@example.com",
    role: USER_ROLES.ACCOUNTANT,
    schoolId: "sch001",
    status: "Active",
    lastLogin: "2024-07-12T08:45:00Z",
  },
  {
    id: "usr005",
    name: "Dana Student",
    email: "student@example.com",
    role: USER_ROLES.STUDENT_PARENT,
    schoolId: "sch001",
    status: "Active",
    lastLogin: "2024-07-10T16:00:00Z",
  },
  {
    id: "usr006",
    name: "Eve School Admin",
    email: "schooladmin2@example.com",
    role: USER_ROLES.SCHOOL_ADMIN,
    schoolId: "sch002",
    status: "Inactive",
    lastLogin: "2024-07-09T11:00:00Z",
  },
]

// Generate comprehensive mock staff data
const generateMockStaff = (count: number = 75) => {
  const staff = []
  const departments = {
    TEACHER: ["Mathematics", "Science", "English", "History", "Geography", "Physics", "Chemistry", "Biology", "Computer Science", "Physical Education", "Art", "Music", "Economics", "Business Studies"],
    ACCOUNTANT: ["Finance", "Accounts", "Billing", "Payroll", "Budget Management"],
    SCHOOL_ADMIN: ["Administration", "Human Resources", "Student Affairs", "Academic Affairs", "Operations"]
  }

  const teacherClasses = ["6A", "6B", "7A", "7B", "8A", "8B", "9A", "9B", "10A", "10B", "11A", "11B", "12A", "12B"]
  const firstNames = ["Alice", "Bob", "Carol", "David", "Emily", "Frank", "Grace", "Henry", "Ivy", "Jack", "Kate", "Liam", "Mia", "Noah", "Olivia", "Paul", "Quinn", "Rachel", "Sam", "Tina", "Uma", "Victor", "Wendy", "Xavier", "Yara", "Zoe", "Adam", "Bella", "Chris", "Diana", "Ethan", "Fiona", "George", "Hannah", "Ian", "Julia", "Kevin", "Lisa", "Mike", "Nina", "Oscar", "Penny", "Ryan", "Sarah", "Tom", "Ursula", "Vince", "Willa", "Xander", "Yuki", "Zara"]
  const lastNames = ["Johnson", "Smith", "White", "Lee", "Brown", "Green", "Davis", "Wilson", "Miller", "Taylor", "Anderson", "Thomas", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts", "Gomez", "Phillips", "Evans", "Turner", "Diaz", "Parker", "Cruz", "Edwards", "Collins", "Reyes", "Stewart", "Morris", "Rogers", "Reed", "Cook", "Morgan", "Bell", "Murphy", "Bailey", "Richardson", "Cox", "Howard", "Ward", "Torres", "Peterson", "Gray", "Ramirez", "James", "Watson", "Brooks", "Kelly", "Sanders", "Price", "Bennett", "Wood", "Barnes", "Ross", "Henderson", "Coleman", "Jenkins", "Perry", "Powell", "Long", "Patterson", "Hughes", "Flores", "Washington", "Butler", "Simmons", "Foster", "Gonzales", "Bryant", "Alexander", "Russell", "Griffin", "Diaz", "Hayes"]

  for (let i = 1; i <= count; i++) {
    const role = i % 3 === 0 ? "TEACHER" : i % 3 === 1 ? "ACCOUNTANT" : "SCHOOL_ADMIN"
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const name = `${firstName} ${lastName}`
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@school.edu`
    const phone = `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`
    const department = departments[role][Math.floor(Math.random() * departments[role].length)]
    const status = Math.random() > 0.15 ? "Active" : "Inactive"
    const dateJoined = new Date(2020 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
    const lastLogin = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
    const salaryAmount = role === "TEACHER" ? 45000 + Math.floor(Math.random() * 20000) : role === "ACCOUNTANT" ? 55000 + Math.floor(Math.random() * 15000) : 65000 + Math.floor(Math.random() * 25000)

    staff.push({
      id: `staff${i.toString().padStart(3, '0')}`,
      name,
      email,
      phone,
      role,
      status,
      department,
      classes: role === "TEACHER" ? [teacherClasses[Math.floor(Math.random() * teacherClasses.length)], teacherClasses[Math.floor(Math.random() * teacherClasses.length)]].filter((v, i, a) => a.indexOf(v) === i) : [],
      dateJoined: dateJoined.toISOString().split('T')[0],
      lastLogin: lastLogin.toISOString(),
      avatar: null,
      salaryType: Math.random() > 0.5 ? "monthly" : "period",
      salaryAmount,
      schoolId: "sch002"
    })
  }

  return staff
}

export const MOCK_STAFF = generateMockStaff(75)

// Mock data specifically for Teacher interface
const generateMockTeachers = (count: number = 75) => {
  const teachers = []
  const subjects = ["Mathematics", "Science", "English", "History", "Geography", "Physics", "Chemistry", "Biology", "Computer Science", "Physical Education", "Art", "Music", "Economics", "Business Studies", "Literature", "Social Studies", "Environmental Science", "Psychology", "Sociology", "Philosophy"]
  const departments = ["Academic", "Science", "Arts", "Humanities", "Physical Education", "Technology", "Business", "Languages", "Social Sciences", "Creative Arts"]
  const qualifications = ["Bachelor's Degree", "Master's Degree", "PhD", "M.Ed", "B.Ed", "PGCE", "Diploma in Education", "Advanced Certificate"]
  const roles = ["TEACHER", "ACCOUNTANT", "SCHOOL_ADMIN"]

  const firstNames = ["Alice", "Bob", "Carol", "David", "Emily", "Frank", "Grace", "Henry", "Ivy", "Jack", "Kate", "Liam", "Mia", "Noah", "Olivia", "Paul", "Quinn", "Rachel", "Sam", "Tina", "Uma", "Victor", "Wendy", "Xavier", "Yara", "Zoe", "Adam", "Bella", "Chris", "Diana", "Ethan", "Fiona", "George", "Hannah", "Ian", "Julia", "Kevin", "Lisa", "Mike", "Nina", "Oscar", "Penny", "Ryan", "Sarah", "Tom", "Ursula", "Vince", "Willa", "Xander", "Yuki", "Zara"]
  const lastNames = ["Johnson", "Smith", "White", "Lee", "Brown", "Green", "Davis", "Wilson", "Miller", "Taylor", "Anderson", "Thomas", "Jackson", "Martin", "Perez", "Thompson", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts", "Gomez", "Phillips", "Evans", "Turner", "Diaz", "Parker", "Cruz", "Edwards", "Collins", "Reyes", "Stewart", "Morris", "Rogers", "Reed", "Cook", "Morgan", "Bell", "Murphy", "Bailey", "Richardson", "Cox", "Howard", "Ward", "Peterson", "Gray", "James", "Watson", "Brooks", "Kelly", "Sanders", "Price", "Bennett", "Wood", "Barnes", "Ross", "Henderson", "Coleman", "Jenkins", "Perry", "Powell", "Long", "Patterson", "Hughes", "Washington", "Butler", "Simmons", "Foster", "Gonzales", "Bryant", "Alexander", "Russell", "Griffin"]

  for (let i = 1; i <= count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const name = `${firstName} ${lastName}`
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@school.edu`
    const phone = `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`
    const subject = subjects[Math.floor(Math.random() * subjects.length)]
    const department = departments[Math.floor(Math.random() * departments.length)]
    const role = roles[Math.floor(Math.random() * roles.length)]
    const status = Math.random() > 0.15 ? "Active" : "Inactive"
    const joinDate = new Date(2020 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
    const experience = Math.floor(Math.random() * 20) + 1
    const qualification = qualifications[Math.floor(Math.random() * qualifications.length)]

    teachers.push({
      id: `teacher${i.toString().padStart(3, '0')}`,
      name,
      email,
      subject,
      department,
      role,
      status,
      joinDate: joinDate.toISOString().split('T')[0],
      phone,
      experience,
      qualification
    })
  }

  return teachers
}

export const MOCK_TEACHERS = generateMockTeachers(75)

export const MOCK_SALARIES = [
  // Alice Johnson (Teacher, monthly)
  {
    id: "sal001",
    staffId: "staff001",
    period: "2024-07",
    amount: 50000,
    status: "Paid",
    paidDate: "2024-07-05",
    remarks: "On time",
  },
  {
    id: "sal002",
    staffId: "staff001",
    period: "2024-06",
    amount: 50000,
    status: "Paid",
    paidDate: "2024-06-05",
    remarks: "",
  },
  {
    id: "sal003",
    staffId: "staff001",
    period: "2024-05",
    amount: 50000,
    status: "Pending",
    paidDate: null,
    remarks: "",
  },
  // Bob Smith (Accountant, per quarter)
  {
    id: "sal004",
    staffId: "staff002",
    period: "2024-Q3",
    amount: 60000,
    status: "Pending",
    paidDate: null,
    remarks: "",
  },
  {
    id: "sal005",
    staffId: "staff002",
    period: "2024-Q2",
    amount: 60000,
    status: "Paid",
    paidDate: "2024-04-10",
    remarks: "Quarterly bonus included",
  },
  // Carol White (Admin, per term)
  {
    id: "sal006",
    staffId: "staff003",
    period: "2024-Term2",
    amount: 70000,
    status: "Paid",
    paidDate: "2024-07-10",
    remarks: "",
  },
  {
    id: "sal007",
    staffId: "staff003",
    period: "2024-Term1",
    amount: 70000,
    status: "Paid",
    paidDate: "2024-03-10",
    remarks: "",
  },
  // David Lee (Teacher, monthly)
  {
    id: "sal008",
    staffId: "staff004",
    period: "2024-07",
    amount: 52000,
    status: "Paid",
    paidDate: "2024-07-03",
    remarks: "",
  },
  {
    id: "sal009",
    staffId: "staff004",
    period: "2024-06",
    amount: 52000,
    status: "Paid",
    paidDate: "2024-06-03",
    remarks: "",
  },
  {
    id: "sal010",
    staffId: "staff004",
    period: "2024-05",
    amount: 52000,
    status: "Pending",
    paidDate: null,
    remarks: "",
  },
  // Emily Brown (Accountant, per quarter)
  {
    id: "sal011",
    staffId: "staff005",
    period: "2024-Q3",
    amount: 58000,
    status: "Pending",
    paidDate: null,
    remarks: "",
  },
  {
    id: "sal012",
    staffId: "staff005",
    period: "2024-Q2",
    amount: 58000,
    status: "Paid",
    paidDate: "2024-04-12",
    remarks: "",
  },
  // Frank Green (Teacher, monthly)
  {
    id: "sal013",
    staffId: "staff006",
    period: "2024-07",
    amount: 48000,
    status: "Paid",
    paidDate: "2024-07-04",
    remarks: "",
  },
  {
    id: "sal014",
    staffId: "staff006",
    period: "2024-06",
    amount: 48000,
    status: "Paid",
    paidDate: "2024-06-04",
    remarks: "",
  },
  {
    id: "sal015",
    staffId: "staff006",
    period: "2024-05",
    amount: 48000,
    status: "Pending",
    paidDate: null,
    remarks: "",
  },
]

// Mock Data Generator Functions
const generateMockStudents = (count: number = 50) => {
  const firstNames = [
    "Alice", "Bob", "Carol", "David", "Emma", "Frank", "Grace", "Henry", "Ivy", "Jack",
    "Kate", "Liam", "Mia", "Noah", "Olivia", "Paul", "Quinn", "Ruby", "Sam", "Tara",
    "Uma", "Victor", "Wendy", "Xander", "Yara", "Zoe", "Alex", "Blake", "Casey", "Drew",
    "Eden", "Finley", "Gray", "Harper", "Indigo", "Jordan", "Kai", "Luna", "Morgan", "Nova",
    "Ocean", "Parker", "Quincy", "River", "Sage", "Taylor", "Unity", "Vale", "Winter", "Xen"
  ]

  const lastNames = [
    "Anderson", "Brown", "Clark", "Davis", "Evans", "Fisher", "Garcia", "Harris", "Ivanov", "Johnson",
    "King", "Lee", "Miller", "Nelson", "O'Connor", "Patel", "Quinn", "Roberts", "Smith", "Taylor",
    "Upton", "Vargas", "Wilson", "Xu", "Young", "Zhang", "Adams", "Baker", "Campbell", "Dixon",
    "Edwards", "Foster", "Green", "Hall", "Irwin", "Jones", "Kumar", "Lewis", "Moore", "Nguyen",
    "O'Brien", "Parker", "Quinn", "Ross", "Scott", "Thompson", "Underwood", "Vega", "White", "Yang"
  ]

  const classes = ["8A", "8B", "9A", "9B", "10A", "10B", "11A", "11B", "12A", "12B"]
  const statuses = ["Active", "Active", "Active", "Active", "Active", "Inactive", "Suspended", "Graduated"]
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
  const genders = ["Male", "Female"]

  const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose"]
  const states = ["NY", "CA", "IL", "TX", "AZ", "PA", "FL", "OH", "GA", "NC"]

  const remarks = [
    "Excellent academic performance",
    "Good attendance record",
    "Needs improvement in mathematics",
    "Outstanding in sports",
    "Great leadership qualities",
    "Requires additional support",
    "Consistently performs well",
    "Shows great potential",
    "Active in extracurricular activities",
    "Needs attention in science",
    "Excellent communication skills",
    "Good team player",
    "Requires motivation",
    "Shows creativity in arts",
    "Needs help with homework"
  ]

  const students = []

  for (let i = 1; i <= count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const fullName = `${firstName} ${lastName}`
    const gender = genders[Math.floor(Math.random() * genders.length)]
    const class_ = classes[Math.floor(Math.random() * classes.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const bloodGroup = bloodGroups[Math.floor(Math.random() * bloodGroups.length)]

    // Generate realistic dates
    const currentYear = new Date().getFullYear()
    const birthYear = currentYear - 14 - Math.floor(Math.random() * 6) // 14-19 years old
    const birthMonth = Math.floor(Math.random() * 12) + 1
    const birthDay = Math.floor(Math.random() * 28) + 1
    const dateOfBirth = `${birthYear}-${birthMonth.toString().padStart(2, '0')}-${birthDay.toString().padStart(2, '0')}`

    const admissionYear = currentYear - Math.floor(Math.random() * 4) // Last 4 years
    const admissionMonth = Math.floor(Math.random() * 12) + 1
    const admissionDay = Math.floor(Math.random() * 28) + 1
    const admissionDate = `${admissionYear}-${admissionMonth.toString().padStart(2, '0')}-${admissionDay.toString().padStart(2, '0')}`

    // Generate phone numbers
    const areaCode = Math.floor(Math.random() * 900) + 100
    const phonePrefix = Math.floor(Math.random() * 900) + 100
    const phoneSuffix = Math.floor(Math.random() * 9000) + 1000
    const phone = `+1${areaCode}${phonePrefix}${phoneSuffix}`

    const parentAreaCode = Math.floor(Math.random() * 900) + 100
    const parentPrefix = Math.floor(Math.random() * 900) + 100
    const parentSuffix = Math.floor(Math.random() * 9000) + 1000
    const parentContact = `${parentAreaCode}-${parentPrefix}-${parentSuffix}`

    const emergencyAreaCode = Math.floor(Math.random() * 900) + 100
    const emergencyPrefix = Math.floor(Math.random() * 900) + 100
    const emergencySuffix = Math.floor(Math.random() * 9000) + 1000
    const emergencyContact = `${emergencyAreaCode}-${emergencyPrefix}-${emergencySuffix}`

    // Generate address
    const streetNumber = Math.floor(Math.random() * 9999) + 1
    const streetNames = ["Main St", "Oak Ave", "Pine Rd", "Elm St", "Maple Dr", "Cedar Ln", "Birch Way", "Willow Ct", "Spruce St", "Cherry Ave"]
    const streetName = streetNames[Math.floor(Math.random() * streetNames.length)]
    const city = cities[Math.floor(Math.random() * cities.length)]
    const state = states[Math.floor(Math.random() * states.length)]
    const zipCode = Math.floor(Math.random() * 90000) + 10000
    const address = `${streetNumber} ${streetName}, ${city}, ${state} ${zipCode}`

    // Generate roll number based on class
    const classNumber = class_.replace(/\D/g, '')
    const section = class_.replace(/\d/g, '')
    const rollNumber = `${classNumber}${section}${i.toString().padStart(3, '0')}`

    // Generate fees data
    const totalFees = Math.floor(Math.random() * 5000) + 3000 // $3000-$8000
    const paidFees = Math.floor(Math.random() * totalFees)
    const dueFees = totalFees - paidFees

    // Generate attendance and performance
    const attendance = Math.floor(Math.random() * 20) + 80 // 80-100%
    const performance = Math.floor(Math.random() * 30) + 70 // 70-100%

    const student = {
      id: `std${i.toString().padStart(3, '0')}`,
      name: fullName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      phone: phone,
      class: class_,
      rollNumber: rollNumber,
      gender: gender,
      dateOfBirth: dateOfBirth,
      admissionDate: admissionDate,
      status: status,
      parentName: `${lastName} Family`,
      parentContact: parentContact,
      parentPhone: parentContact,
      parentEmail: `parent.${lastName.toLowerCase()}@example.com`,
      emergencyContact: emergencyContact,
      bloodGroup: bloodGroup,
      address: address,
      remarks: remarks[Math.floor(Math.random() * remarks.length)],
      attendance: attendance,
      performance: performance,
      profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random&color=fff&size=150`,
      fees: {
        total: totalFees,
        paid: paidFees,
        due: dueFees,
        dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Random date in next 30 days
      }
    }

    students.push(student)
  }

  return students
}

export const MOCK_STUDENTS = generateMockStudents(50)

// Identity Card Templates
// School Information for ID Cards
export const SCHOOL_INFO = {
  name: "Excellence Academy",
  motto: "Knowledge • Character • Excellence",
  address: "123 Education Street, Learning City, LC 12345",
  phone: "+1 (555) 123-4567",
  email: "info@excellenceacademy.edu",
  website: "www.excellenceacademy.edu",
  established: "1995",
  logo: "https://ui-avatars.com/api/?name=EA&background=3B82F6&color=fff&size=100&font-size=0.4&bold=true"
}

export const ID_CARD_TEMPLATES = [
  {
    id: "modern-elementary",
    name: "Modern Elementary",
    description: "Bright, colorful design perfect for younger students",
    category: "elementary" as const,
    preview: "🎨",
    config: {
      width: 85.6,
      height: 54,
      orientation: "landscape" as const,
      primaryColor: "#FF6B6B",
      secondaryColor: "#4ECDC4",
      accentColor: "#45B7D1",
      fontFamily: "Comic Sans MS",
      logoPosition: "top-left" as const,
      photoPosition: "left" as const,
      includeQR: true,
      includeBarcode: false,
      includeWatermark: false,
      backgroundPattern: "gradient" as const
    }
  },
  {
    id: "classic-middle",
    name: "Classic Middle School",
    description: "Professional design with balanced layout",
    category: "middle" as const,
    preview: "🎓",
    config: {
      width: 85.6,
      height: 54,
      orientation: "landscape" as const,
      primaryColor: "#3498DB",
      secondaryColor: "#2C3E50",
      accentColor: "#E74C3C",
      fontFamily: "Arial",
      logoPosition: "top-center" as const,
      photoPosition: "center" as const,
      includeQR: true,
      includeBarcode: true,
      includeWatermark: true,
      backgroundPattern: "solid" as const
    }
  },
  {
    id: "premium-high",
    name: "Premium High School",
    description: "Elegant design with advanced security features",
    category: "high" as const,
    preview: "⭐",
    config: {
      width: 85.6,
      height: 54,
      orientation: "landscape" as const,
      primaryColor: "#2C3E50",
      secondaryColor: "#34495E",
      accentColor: "#E67E22",
      fontFamily: "Georgia",
      logoPosition: "top-right" as const,
      photoPosition: "right" as const,
      includeQR: true,
      includeBarcode: true,
      includeWatermark: true,
      backgroundPattern: "geometric" as const
    }
  },
  {
    id: "university-pro",
    name: "University Professional",
    description: "Sophisticated design for higher education",
    category: "university" as const,
    preview: "🎯",
    config: {
      width: 85.6,
      height: 54,
      orientation: "landscape" as const,
      primaryColor: "#1A1A1A",
      secondaryColor: "#333333",
      accentColor: "#FFD700",
      fontFamily: "Times New Roman",
      logoPosition: "top-center" as const,
      photoPosition: "center" as const,
      includeQR: true,
      includeBarcode: true,
      includeWatermark: true,
      backgroundPattern: "minimal" as const
    }
  },
  {
    id: "corporate-exec",
    name: "Corporate Executive",
    description: "Business-focused design for professional environments",
    category: "corporate" as const,
    preview: "💼",
    config: {
      width: 85.6,
      height: 54,
      orientation: "landscape" as const,
      primaryColor: "#2C3E50",
      secondaryColor: "#34495E",
      accentColor: "#E74C3C",
      fontFamily: "Helvetica",
      logoPosition: "top-left" as const,
      photoPosition: "left" as const,
      includeQR: true,
      includeBarcode: true,
      includeWatermark: true,
      backgroundPattern: "solid" as const
    }
  }
]

// Generate mock classes
const generateMockClasses = () => {
  const grades = [8, 9, 10, 11, 12]
  const sections = ["A", "B", "C", "D"]
  const teachers = [
    "Mr. Bob Teacher", "Ms. Emily White", "Dr. Alice Johnson", "Mr. David Lee",
    "Ms. Carol Brown", "Mr. Frank Green", "Ms. Grace Wilson", "Mr. Henry Davis"
  ]

  const departments = ["Science", "Arts", "Commerce", "Technology", "Languages"]
  const rooms = ["101", "102", "103", "201", "202", "203", "301", "302"]
  const schedules = ["08:00-15:00", "09:00-16:00", "08:30-15:30", "07:30-14:30"]
  const statuses = ["Active", "Inactive"]

  const subjectsByGrade = {
    8: ["Mathematics", "English", "Science", "History", "Geography", "Computer Science"],
    9: ["Mathematics", "English", "Biology", "Chemistry", "History", "Geography"],
    10: ["Mathematics", "English", "Physics", "Chemistry", "Biology", "History"],
    11: ["Advanced Mathematics", "English Literature", "Physics", "Chemistry", "Biology", "Economics"],
    12: ["Calculus", "English Literature", "Advanced Physics", "Advanced Chemistry", "Advanced Biology", "Business Studies"]
  }

  const classes = []
  let classId = 1

  for (const grade of grades) {
    for (const section of sections) {
      const capacity = Math.floor(Math.random() * 10) + 30 // 30-40 students
      const enrolled = Math.floor(Math.random() * (capacity - 20)) + 20 // 20 to capacity
      const teacher = teachers[Math.floor(Math.random() * teachers.length)]
      const gradeSubjects = subjectsByGrade[grade as keyof typeof subjectsByGrade]
      const selectedSubjects = gradeSubjects.slice(0, Math.floor(Math.random() * 3) + 4) // 4-6 subjects
      const department = departments[Math.floor(Math.random() * departments.length)]
      const roomNo = rooms[Math.floor(Math.random() * rooms.length)]
      const schedule = schedules[Math.floor(Math.random() * schedules.length)]
      const status = statuses[Math.floor(Math.random() * statuses.length)]
      const averageAttendance = Math.floor(Math.random() * 20) + 75 // 75-95%
      const performance = Math.floor(Math.random() * 25) + 65 // 65-90%
      const academicYear = "2024-25"
      const createdAt = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString()

      classes.push({
        id: `cls${classId.toString().padStart(3, '0')}`,
        name: `${grade}${section}`,
        section: section,
        grade: grade.toString(),
        capacity: capacity,
        enrolled: enrolled,
        classTeacher: teacher,
        subjects: selectedSubjects,
        department: department,
        roomNo: roomNo,
        schedule: schedule,
        status: status,
        averageAttendance: averageAttendance,
        performance: performance,
        academicYear: academicYear,
        createdAt: createdAt,
      })

      classId++
    }
  }

  return classes
}

export const MOCK_CLASSES = generateMockClasses()

// Generate mock subjects
const generateMockSubjects = () => {
  const subjects = [
    { name: "Mathematics", code: "MATH", description: "Advanced algebra and calculus." },
    { name: "Physics", code: "PHY", description: "Mechanics, thermodynamics, and optics." },
    { name: "Chemistry", code: "CHEM", description: "Organic and inorganic chemistry." },
    { name: "Biology", code: "BIO", description: "Introduction to life sciences." },
    { name: "English", code: "ENG", description: "Literature and language arts." },
    { name: "History", code: "HIST", description: "World history and civilizations." },
    { name: "Geography", code: "GEO", description: "Physical and human geography." },
    { name: "Computer Science", code: "CS", description: "Programming and technology." },
    { name: "Economics", code: "ECON", description: "Micro and macro economics." },
    { name: "Business Studies", code: "BUS", description: "Business management and entrepreneurship." },
    { name: "Advanced Mathematics", code: "ADV_MATH", description: "Calculus and advanced mathematical concepts." },
    { name: "English Literature", code: "ENG_LIT", description: "Classic and contemporary literature." },
    { name: "Advanced Physics", code: "ADV_PHY", description: "Quantum mechanics and relativity." },
    { name: "Advanced Chemistry", code: "ADV_CHEM", description: "Advanced chemical concepts and laboratory work." },
    { name: "Advanced Biology", code: "ADV_BIO", description: "Advanced biological concepts and research." },
    { name: "Science", code: "SCI", description: "General science concepts." },
    { name: "Calculus", code: "CALC", description: "Differential and integral calculus." }
  ]

  const teachers = [
    "Mr. Bob Teacher", "Ms. Emily White", "Dr. Alice Johnson", "Mr. David Lee",
    "Ms. Carol Brown", "Mr. Frank Green", "Ms. Grace Wilson", "Mr. Henry Davis"
  ]

  const grades = [8, 9, 10, 11, 12]
  const mockSubjects = []
  let subjectId = 1

  for (const subject of subjects) {
    for (const grade of grades) {
      const teacher = teachers[Math.floor(Math.random() * teachers.length)]
      const credits = grade >= 11 ? Math.floor(Math.random() * 2) + 4 : Math.floor(Math.random() * 2) + 3 // 3-4 credits for lower grades, 4-5 for higher

      mockSubjects.push({
        id: `sub${subjectId.toString().padStart(3, '0')}`,
        name: subject.name,
        code: `${subject.code}${grade}01`,
        grade: grade.toString(),
        teacher: teacher,
        credits: credits,
        description: subject.description,
      })

      subjectId++
    }
  }

  return mockSubjects
}

export const MOCK_SUBJECTS = generateMockSubjects()

// Generate mock timetable data
const generateMockTimetableData = () => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  const timeSlots = [
    "08:00 - 09:00", "09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00",
    "12:00 - 13:00", "13:00 - 14:00", "14:00 - 15:00", "15:00 - 16:00"
  ]
  const rooms = [
    "Room 101", "Room 102", "Room 103", "Room 104", "Room 105",
    "Lab 201", "Lab 202", "Lab 203", "Lab 204", "Lab 205",
    "Auditorium", "Library", "Computer Lab", "Art Room", "Music Room"
  ]

  const teachers = [
    "Mr. Bob Teacher", "Ms. Emily White", "Dr. Alice Johnson", "Mr. David Lee",
    "Ms. Carol Brown", "Mr. Frank Green", "Ms. Grace Wilson", "Mr. Henry Davis"
  ]

  const subjects = [
    "Mathematics", "Physics", "Chemistry", "Biology", "English", "History",
    "Geography", "Computer Science", "Economics", "Business Studies"
  ]

  const classes = MOCK_CLASSES.map(cls => cls.name)
  const timetableData = []
  let timetableId = 1

  for (const class_ of classes) {
    for (const day of days) {
      // Generate 6-8 periods per day for each class
      const periodsPerDay = Math.floor(Math.random() * 3) + 6 // 6-8 periods

      for (let period = 0; period < periodsPerDay; period++) {
        const subject = subjects[Math.floor(Math.random() * subjects.length)]
        const teacher = teachers[Math.floor(Math.random() * teachers.length)]
        const room = rooms[Math.floor(Math.random() * rooms.length)]
        const timeSlot = timeSlots[period] || timeSlots[Math.floor(Math.random() * timeSlots.length)]

        timetableData.push({
          id: `tt${timetableId.toString().padStart(3, '0')}`,
          class: class_,
          day: day,
          time: timeSlot,
          subject: subject,
          teacher: teacher,
          room: room,
        })

        timetableId++
      }
    }
  }

  return timetableData
}

export const MOCK_TIMETABLE_DATA = generateMockTimetableData()

export const MOCK_EXAMS = [
  {
    id: "exam001",
    name: "Mid-Term Math",
    class: "10A",
    subject: "Mathematics",
    date: "2025-07-20",
    maxMarks: 100,
    duration: "2 hours",
    status: "Scheduled",
    examType: "Mid-Term",
    academicYear: "2024-25",
    term: "Term 1",
    startTime: "09:00",
    endTime: "11:00",
    room: "Room 101",
    instructions: "Bring calculator and ruler",
    passingMarks: 40,
    totalQuestions: 25,
    examCode: "MATH101-MT",
    invigilator: "Mr. Smith",
    year: "2024-25",
  },
  {
    id: "exam002",
    name: "Physics Quiz",
    class: "10A",
    subject: "Physics",
    date: "2025-07-25",
    maxMarks: 50,
    duration: "1 hour",
    status: "Planning",
    examType: "Quiz",
    academicYear: "2024-25",
    term: "Term 1",
    startTime: "14:00",
    endTime: "15:00",
    room: "Lab 2",
    instructions: "Multiple choice questions",
    passingMarks: 25,
    totalQuestions: 20,
    examCode: "PHY101-QZ",
    invigilator: "Ms. Clark",
    year: "2024-25",
  },
  {
    id: "exam003",
    name: "English Final",
    class: "10B",
    subject: "English",
    date: "2025-07-30",
    maxMarks: 100,
    duration: "2.5 hours",
    status: "Completed",
    examType: "Final",
    academicYear: "2024-25",
    term: "Term 1",
    startTime: "10:00",
    endTime: "12:30",
    room: "Room 205",
    instructions: "Essay writing and comprehension",
    passingMarks: 40,
    totalQuestions: 15,
    examCode: "ENG101-FN",
    invigilator: "Mr. Johnson",
    year: "2024-25",
  },
  {
    id: "exam004",
    name: "Chemistry Test",
    class: "11A",
    subject: "Chemistry",
    date: "2025-08-05",
    maxMarks: 75,
    duration: "1.5 hours",
    status: "Scheduled",
    examType: "Unit Test",
    academicYear: "2024-25",
    term: "Term 1",
    startTime: "13:00",
    endTime: "14:30",
    room: "Lab 1",
    instructions: "Practical and theory questions",
    passingMarks: 30,
    totalQuestions: 30,
    examCode: "CHEM101-UT",
    invigilator: "Dr. Brown",
    year: "2024-25",
  },
  {
    id: "exam005",
    name: "History Assignment",
    class: "9A",
    subject: "History",
    date: "2025-08-10",
    maxMarks: 50,
    duration: "1 hour",
    status: "Cancelled",
    examType: "Assignment",
    academicYear: "2024-25",
    term: "Term 1",
    startTime: "15:00",
    endTime: "16:00",
    room: "Room 103",
    instructions: "Research-based assignment",
    passingMarks: 25,
    totalQuestions: 10,
    examCode: "HIST101-AS",
    invigilator: "Ms. Davis",
    year: "2024-25",
  },
  {
    id: "exam006",
    name: "Biology Lab Test",
    class: "11B",
    subject: "Biology",
    date: "2025-08-15",
    maxMarks: 60,
    duration: "1.5 hours",
    status: "Scheduled",
    examType: "Lab Test",
    academicYear: "2024-25",
    term: "Term 1",
    startTime: "10:00",
    endTime: "11:30",
    room: "Lab 3",
    instructions: "Microscope and specimen identification",
    passingMarks: 30,
    totalQuestions: 20,
    examCode: "BIO101-LT",
    invigilator: "Dr. Wilson",
    year: "2024-25",
  },
  {
    id: "exam007",
    name: "Computer Science Project",
    class: "12A",
    subject: "Computer Science",
    date: "2025-08-20",
    maxMarks: 100,
    duration: "3 hours",
    status: "Planning",
    examType: "Project",
    academicYear: "2024-25",
    term: "Term 1",
    startTime: "09:00",
    endTime: "12:00",
    room: "Computer Lab 1",
    instructions: "Programming and documentation required",
    passingMarks: 50,
    totalQuestions: 5,
    examCode: "CS101-PJ",
    invigilator: "Mr. Anderson",
    year: "2024-25",
  },
  {
    id: "exam008",
    name: "Economics Mid-Term",
    class: "12B",
    subject: "Economics",
    date: "2025-08-25",
    maxMarks: 80,
    duration: "2 hours",
    status: "Scheduled",
    examType: "Mid-Term",
    academicYear: "2024-25",
    term: "Term 1",
    startTime: "14:00",
    endTime: "16:00",
    room: "Room 301",
    instructions: "Graphs and calculations allowed",
    passingMarks: 32,
    totalQuestions: 18,
    examCode: "ECO101-MT",
    invigilator: "Ms. Taylor",
    year: "2024-25",
  },
  {
    id: "exam009",
    name: "Geography Quiz",
    class: "9B",
    subject: "Geography",
    date: "2025-08-30",
    maxMarks: 40,
    duration: "45 minutes",
    status: "Completed",
    examType: "Quiz",
    academicYear: "2024-25",
    term: "Term 1",
    startTime: "11:00",
    endTime: "11:45",
    room: "Room 102",
    instructions: "Map reading and location identification",
    passingMarks: 20,
    totalQuestions: 15,
    examCode: "GEO101-QZ",
    invigilator: "Mr. Lee",
    year: "2024-25",
  },
  {
    id: "exam010",
    name: "Literature Analysis",
    class: "11A",
    subject: "Literature",
    date: "2025-09-05",
    maxMarks: 90,
    duration: "2.5 hours",
    status: "Scheduled",
    examType: "Essay",
    academicYear: "2024-25",
    term: "Term 1",
    startTime: "13:00",
    endTime: "15:30",
    room: "Room 204",
    instructions: "Critical analysis of provided texts",
    passingMarks: 36,
    totalQuestions: 8,
    examCode: "LIT101-ES",
    invigilator: "Ms. Garcia",
    year: "2024-25",
  },
  {
    id: "exam011",
    name: "Physical Education Test",
    class: "10A",
    subject: "Physical Education",
    date: "2025-09-10",
    maxMarks: 50,
    duration: "1 hour",
    status: "Planning",
    examType: "Practical",
    academicYear: "2024-25",
    term: "Term 1",
    startTime: "15:00",
    endTime: "16:00",
    room: "Sports Ground",
    instructions: "Athletic performance assessment",
    passingMarks: 25,
    totalQuestions: 10,
    examCode: "PE101-PR",
    invigilator: "Mr. Rodriguez",
    year: "2024-25",
  },
  {
    id: "exam012",
    name: "Art Portfolio Review",
    class: "12A",
    subject: "Art",
    date: "2025-09-15",
    maxMarks: 100,
    duration: "2 hours",
    status: "Scheduled",
    examType: "Portfolio",
    academicYear: "2024-25",
    term: "Term 1",
    startTime: "10:00",
    endTime: "12:00",
    room: "Art Studio",
    instructions: "Portfolio presentation and critique",
    passingMarks: 50,
    totalQuestions: 1,
    examCode: "ART101-PF",
    invigilator: "Ms. Martinez",
    year: "2024-25",
  },
  {
    id: "exam013",
    name: "Music Theory Test",
    class: "11B",
    subject: "Music",
    date: "2025-09-20",
    maxMarks: 70,
    duration: "1.5 hours",
    status: "Completed",
    examType: "Theory Test",
    academicYear: "2024-25",
    term: "Term 1",
    startTime: "14:00",
    endTime: "15:30",
    room: "Music Room",
    instructions: "Notation and theory questions",
    passingMarks: 35,
    totalQuestions: 25,
    examCode: "MUS101-TT",
    invigilator: "Mr. Thompson",
    year: "2024-25",
  },
  {
    id: "exam014",
    name: "Social Studies Final",
    class: "9A",
    subject: "Social Studies",
    date: "2025-09-25",
    maxMarks: 85,
    duration: "2 hours",
    status: "Scheduled",
    examType: "Final",
    academicYear: "2024-25",
    term: "Term 1",
    startTime: "09:00",
    endTime: "11:00",
    room: "Room 105",
    instructions: "Comprehensive social studies assessment",
    passingMarks: 34,
    totalQuestions: 20,
    examCode: "SOC101-FN",
    invigilator: "Ms. White",
    year: "2024-25",
  },
  {
    id: "exam015",
    name: "French Language Test",
    class: "10B",
    subject: "French",
    date: "2025-09-30",
    maxMarks: 60,
    duration: "1.5 hours",
    status: "Planning",
    examType: "Language Test",
    academicYear: "2024-25",
    term: "Term 1",
    startTime: "13:00",
    endTime: "14:30",
    room: "Room 201",
    instructions: "Reading, writing, and speaking components",
    passingMarks: 30,
    totalQuestions: 12,
    examCode: "FRE101-LT",
    invigilator: "Mme. Dubois",
    year: "2024-25",
  },
  {
    id: "exam016",
    name: "Mathematics Advanced",
    class: "12A",
    subject: "Mathematics",
    date: "2025-10-05",
    maxMarks: 120,
    duration: "3 hours",
    status: "Scheduled",
    examType: "Advanced Test",
    academicYear: "2024-25",
    term: "Term 1",
    startTime: "09:00",
    endTime: "12:00",
    room: "Room 302",
    instructions: "Advanced calculus and statistics",
    passingMarks: 60,
    totalQuestions: 30,
    examCode: "MATH201-AT",
    invigilator: "Dr. Chen",
    year: "2024-25",
  },
  {
    id: "exam017",
    name: "Physics Lab Final",
    class: "12B",
    subject: "Physics",
    date: "2025-10-10",
    maxMarks: 80,
    duration: "2.5 hours",
    status: "Completed",
    examType: "Lab Final",
    academicYear: "2024-25",
    term: "Term 1",
    startTime: "10:00",
    endTime: "12:30",
    room: "Lab 4",
    instructions: "Experimental procedures and analysis",
    passingMarks: 40,
    totalQuestions: 15,
    examCode: "PHY201-LF",
    invigilator: "Dr. Kumar",
    year: "2024-25",
  },
  {
    id: "exam018",
    name: "Chemistry Advanced",
    class: "12A",
    subject: "Chemistry",
    date: "2025-10-15",
    maxMarks: 100,
    duration: "2.5 hours",
    status: "Scheduled",
    examType: "Advanced Test",
    academicYear: "2024-25",
    term: "Term 1",
    startTime: "14:00",
    endTime: "16:30",
    room: "Lab 2",
    instructions: "Advanced organic and inorganic chemistry",
    passingMarks: 50,
    totalQuestions: 25,
    examCode: "CHEM201-AT",
    invigilator: "Dr. Singh",
    year: "2024-25",
  },
  {
    id: "exam019",
    name: "Biology Research Project",
    class: "12B",
    subject: "Biology",
    date: "2025-10-20",
    maxMarks: 150,
    duration: "4 hours",
    status: "Planning",
    examType: "Research Project",
    academicYear: "2024-25",
    term: "Term 1",
    startTime: "09:00",
    endTime: "13:00",
    room: "Research Lab",
    instructions: "Independent research and presentation",
    passingMarks: 75,
    totalQuestions: 3,
    examCode: "BIO201-RP",
    invigilator: "Dr. Patel",
    year: "2024-25",
  },
  {
    id: "exam020",
    name: "Computer Science Final",
    class: "12A",
    subject: "Computer Science",
    date: "2025-10-25",
    maxMarks: 120,
    duration: "3 hours",
    status: "Scheduled",
    examType: "Final",
    academicYear: "2024-25",
    term: "Term 1",
    startTime: "13:00",
    endTime: "16:00",
    room: "Computer Lab 2",
    instructions: "Programming, algorithms, and theory",
    passingMarks: 60,
    totalQuestions: 20,
    examCode: "CS201-FN",
    invigilator: "Mr. Williams",
    year: "2024-25",
  }
]

// Comprehensive mock data generation for results approval
const generateMockResultsApproval = () => {
  const classes = [
    "6A", "6B", "7A", "7B", "8A", "8B", "9A", "9B", "10A", "10B", "11A", "12A"
  ]

  const subjects = [
    "Mathematics", "English", "Science", "History", "Geography",
    "Computer Science", "Physics", "Chemistry", "Biology", "Economics",
    "Literature", "Art", "Music", "Physical Education", "Social Studies"
  ]

  const exams = ["Mid Term", "Final Term", "Unit Test", "Annual Exam"]
  const years = ["2023-24", "2024-25"]
  const terms = ["Term 1", "Term 2", "Term 3"]
  const resultTypes = ["Mid", "Final", "Unit", "Annual"]
  const statuses = ["Pending", "Approved", "Published", "Rejected"]

  const teachers = [
    "Mr. Smith", "Ms. Clark", "Mr. Lee", "Ms. Patel", "Mr. Brown",
    "Ms. Green", "Mr. Wilson", "Ms. Davis", "Mr. Johnson", "Ms. Taylor",
    "Mr. Anderson", "Ms. White", "Mr. Martin", "Ms. Garcia", "Mr. Rodriguez"
  ]

  const studentNames = [
    "Alice Johnson", "Bob Smith", "Carol Davis", "David Wilson", "Emma Brown",
    "Frank Miller", "Grace Lee", "Henry Taylor", "Ivy Chen", "Jack Anderson",
    "Kate White", "Liam Martin", "Mia Garcia", "Noah Rodriguez", "Olivia Martinez",
    "Paul Thompson", "Quinn Lewis", "Rachel Hall", "Sam Young", "Tina Allen",
    "Uma Patel", "Victor Kumar", "Wendy Singh", "Xavier Sharma", "Yara Khan",
    "Zara Ahmed", "Adam Cooper", "Bella Foster", "Charlie Reed", "Diana Phillips",
    "Ethan Campbell", "Fiona Parker", "George Evans", "Hannah Edwards", "Ian Collins",
    "Julia Stewart", "Kevin Morris", "Laura Rogers", "Mike Cook", "Nina Bell",
    "Oscar Murphy", "Penny Bailey", "Quentin Rivera", "Rose Cooper", "Steve Richardson",
    "Tracy Cox", "Ulysses Ward", "Vera Torres", "Walter Peterson", "Xena Gray",
    "Yves James", "Zoe Watson", "Aaron Brooks", "Betty Kelly", "Carl Sanders",
    "Doris Price", "Earl Bennett", "Flora Wood", "Gary Barnes", "Helen Ross",
    "Ivan Henderson", "Janet Coleman", "Keith Jenkins", "Lois Perry", "Mark Powell",
    "Nancy Long", "Oscar Patterson", "Pamela Hughes", "Quincy Flores", "Rita Butler",
    "Stanley Simmons", "Tanya Foster", "Ulysses Gonzales", "Vera Bryant", "Wade Alexander",
    "Xena Russell", "Yves Griffin", "Zoe Diaz", "Alan Hayes", "Beth Sanders",
    "Carl Price", "Diana Bennett", "Earl Wood", "Flora Barnes", "Gary Ross",
    "Helen Henderson", "Ivan Coleman", "Janet Jenkins", "Keith Perry", "Lois Powell",
    "Mark Long", "Nancy Patterson", "Oscar Hughes", "Pamela Flores", "Quincy Butler",
    "Rita Simmons", "Stanley Foster", "Tanya Gonzales", "Ulysses Bryant", "Vera Alexander",
    "Wade Russell", "Xena Griffin", "Yves Diaz", "Zoe Hayes"
  ]

  const results: Array<{
    id: string;
    studentId: string;
    studentName: string;
    rollNumber: string;
    class: string;
    examName: string;
    year: string;
    term: string;
    resultType: string;
    subject: string;
    marks: number;
    maxMarks: number;
    status: string;
    submittedBy: string;
  }> = []
  let resultId = 1

  classes.forEach((className, classIndex) => {
    // Generate 8-15 students per class
    const studentsInClass = 8 + Math.floor(Math.random() * 8)

    for (let studentIndex = 0; studentIndex < studentsInClass; studentIndex++) {
      const studentName = studentNames[studentIndex + (classIndex * 10)]
      const studentId = `student-${classIndex + 1}-${studentIndex + 1}`
      const rollNumber = `${1000 + (classIndex * 100) + studentIndex + 1}`

      // Generate 5-8 subjects per student
      const studentSubjects = subjects.slice(0, 5 + Math.floor(Math.random() * 4))

      studentSubjects.forEach((subject, subjectIndex) => {
        // Generate results for different exams
        exams.forEach((exam, examIndex) => {
          const year = years[examIndex % years.length]
          const term = terms[examIndex % terms.length]
          const resultType = resultTypes[examIndex % resultTypes.length]

          // Distribute statuses more realistically
          let status
          if (examIndex === 0) status = "Published" // First exam is published
          else if (examIndex === 1) status = "Approved" // Second exam is approved
          else if (examIndex === 2) status = "Pending" // Third exam is pending
          else status = statuses[Math.floor(Math.random() * statuses.length)]

          // Generate realistic marks (60-100 for most students, some lower)
          const baseMarks = 60 + Math.floor(Math.random() * 35)
          const marks = Math.random() < 0.1 ? 30 + Math.floor(Math.random() * 30) : baseMarks
          const maxMarks = 100

          const teacher = teachers[Math.floor(Math.random() * teachers.length)]

          results.push({
            id: `result-${resultId}`,
            studentId,
            studentName,
            rollNumber,
            class: className,
            examName: exam,
            year,
            term,
            resultType,
            subject,
            marks,
            maxMarks,
            status,
            submittedBy: teacher
          })

          resultId++
        })
      })
    }
  })

  return results
}

export const MOCK_RESULTS_APPROVAL = generateMockResultsApproval()

export const MOCK_ATTENDANCE_RECORDS = [
  {
    id: "att001",
    date: "2025-07-12",
    class: "10A",
    studentName: "John Doe",
    status: "Present",
    markedBy: "Mr. Bob Teacher",
  },
  {
    id: "att002",
    date: "2025-07-12",
    class: "10A",
    studentName: "Peter Jones",
    status: "Absent",
    markedBy: "Mr. Bob Teacher",
  },
  {
    id: "att003",
    date: "2025-07-11",
    class: "9B",
    studentName: "Jane Smith",
    status: "Present",
    markedBy: "Ms. Emily White",
  },
]

export const MOCK_FEES_RECORDS = [
  {
    id: "fee001",
    studentName: "John Doe",
    class: "10A",
    feeType: "Tuition Fee",
    amount: 1200,
    dueDate: "2025-08-01",
    status: "Pending",
  },
  {
    id: "fee002",
    studentName: "Jane Smith",
    class: "9B",
    feeType: "Transport Fee",
    amount: 150,
    dueDate: "2025-07-15",
    status: "Overdue",
  },
  {
    id: "fee003",
    studentName: "Peter Jones",
    class: "11C",
    feeType: "Annual Fee",
    amount: 500,
    dueDate: "2025-06-01",
    status: "Paid",
  },
]

export const MOCK_NOTIFICATIONS = [
  {
    id: "notif001",
    title: "School Holiday Announcement",
    message: "School will be closed on July 20th for a public holiday.",
    date: "2025-07-10",
    status: "Sent",
  },
  {
    id: "notif002",
    title: "Parent-Teacher Meeting Reminder",
    message: "Reminder: Parent-Teacher Meeting on July 25th.",
    date: "2025-07-18",
    status: "Draft",
  },
]

export const MOCK_EVENTS = [
  {
    id: "event001",
    title: "Annual Sports Day",
    date: "2025-08-10",
    time: "09:00 AM",
    location: "School Ground",
    description: "Join us for a day of sports and fun activities.",
  },
  {
    id: "event002",
    title: "Science Fair",
    date: "2025-09-05",
    time: "10:00 AM",
    location: "School Auditorium",
    description: "Students showcase their science projects.",
  },
]

export const MOCK_LOGS = [
  {
    id: "log001",
    timestamp: "2025-07-12T10:30:00Z",
    level: "INFO",
    message: "User 'schooladmin@example.com' logged in.",
    user: "schooladmin@example.com",
  },
  {
    id: "log002",
    timestamp: "2025-07-12T10:35:15Z",
    level: "WARN",
    message: "Failed login attempt for 'unknown@example.com'.",
    user: "system",
  },
  {
    id: "log003",
    timestamp: "2025-07-12T10:40:00Z",
    level: "ERROR",
    message: "Database connection error.",
    user: "system",
  },
]

export const MOCK_SUBSCRIPTIONS = [
  {
    id: "sub001",
    schoolName: "Central High School",
    plan: "Premium",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    status: "Active",
    price: 500,
  },
  {
    id: "sub002",
    schoolName: "Northwood Academy",
    plan: "Basic",
    startDate: "2024-03-01",
    endDate: "2025-02-28",
    status: "Active",
    price: 200,
  },
  {
    id: "sub003",
    schoolName: "Riverside Public",
    plan: "Free",
    startDate: "2023-01-01",
    endDate: "2024-12-31",
    status: "Expired",
    price: 0,
  },
]

// Generate comprehensive mock admissions data
const generateMockAdmissions = (count: number = 150) => {
  const firstNames = [
    "Liam", "Olivia", "Noah", "Emma", "Oliver", "Ava", "Elijah", "Charlotte", "James", "Sophia",
    "Benjamin", "Amelia", "Lucas", "Mia", "Mason", "Harper", "Ethan", "Evelyn", "Alexander", "Abigail",
    "Henry", "Emily", "Sebastian", "Elizabeth", "Jack", "Sofia", "Owen", "Avery", "Daniel", "Ella",
    "Jackson", "Madison", "Samuel", "Scarlett", "Aiden", "Victoria", "Dylan", "Luna", "Nathan", "Grace",
    "Isaac", "Chloe", "Kai", "Penelope", "Adrian", "Layla", "Gavin", "Riley", "Jayden", "Zoey"
  ];

  const lastNames = [
    "Johnson", "Davis", "Miller", "Wilson", "Brown", "Jones", "Garcia", "Rodriguez", "Martinez", "Anderson",
    "Taylor", "Thomas", "Hernandez", "Moore", "Martin", "Jackson", "Thompson", "White", "Lopez", "Lee",
    "Gonzalez", "Harris", "Clark", "Lewis", "Robinson", "Walker", "Perez", "Hall", "Young", "Allen",
    "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green", "Adams", "Nelson",
    "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts", "Gomez", "Phillips", "Evans"
  ];

  const grades = ["K", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  const statuses = ["Pending", "Approved", "Rejected", "Waitlisted", "Under Review"];
  const contactTypes = ["email", "phone"];

  const admissions = [];

  for (let i = 1; i <= count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const contactType = contactTypes[Math.floor(Math.random() * contactTypes.length)];

    let contact;
    if (contactType === "email") {
      contact = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
    } else {
      contact = `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
    }

    // Generate random date within last 6 months
    const startDate = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000);
    const endDate = new Date();
    const applicationDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));

    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const statusHistory = [
      {
        status: "Submitted",
        date: applicationDate.toISOString(),
        by: "Applicant",
        note: "Application submitted online"
      }
    ];

    // Add status change if not pending
    if (status !== "Pending") {
      const reviewDate = new Date(applicationDate.getTime() + Math.random() * 14 * 24 * 60 * 60 * 1000);
      statusHistory.push({
        status,
        date: reviewDate.toISOString(),
        by: "Admin",
        note: status === "Approved" ? "Application approved after review" :
          status === "Rejected" ? "Application rejected - incomplete documents" :
            status === "Waitlisted" ? "Application waitlisted - class full" : "Application under review"
      });
    }

    admissions.push({
      id: `adm${i.toString().padStart(3, '0')}`,
      applicantName: `${firstName} ${lastName}`,
      gradeApplyingFor: grades[Math.floor(Math.random() * grades.length)],
      applicationDate: applicationDate.toISOString().split('T')[0],
      status,
      contact,
      notes: Math.random() > 0.7 ? `Additional notes for ${firstName} ${lastName}'s application. ${Math.random() > 0.5 ? 'Special consideration requested.' : 'Documents pending.'}` : undefined,
      statusHistory
    });
  }

  return admissions;
};


export const MOCK_FEE_STRUCTURES = [
  {
    id: "fs001",
    name: "Annual Tuition Fee",
    amount: 12000,
    frequency: "Annually",
    applicableTo: "All Students",
    description: "Standard tuition fee for the academic year.",
  },
  {
    id: "fs002",
    name: "Monthly Transport Fee",
    amount: 1500,
    frequency: "Monthly",
    applicableTo: "Students using transport",
    description: "Fee for school bus service.",
  },
]

export const MOCK_PAYMENTS = [
  {
    id: "pay001",
    studentName: "John Doe",
    feeType: "Tuition Fee",
    amountPaid: 1200,
    paymentDate: "2025-07-01",
    method: "Bank Transfer",
    status: "Completed",
  },
  {
    id: "pay002",
    studentName: "Jane Smith",
    feeType: "Transport Fee",
    amountPaid: 150,
    paymentDate: "2025-07-05",
    method: "Cash",
    status: "Completed",
  },
]

export const MOCK_DUES = [
  {
    id: "due001",
    studentName: "Peter Jones",
    feeType: "Annual Fee",
    amountDue: 500,
    dueDate: "2025-06-01",
    status: "Overdue",
  },
  {
    id: "due002",
    studentName: "John Doe",
    feeType: "Library Fine",
    amountDue: 20,
    dueDate: "2025-07-10",
    status: "Pending",
  },
]

export const MOCK_TRANSPORT_ROUTES = [
  {
    id: "tr001",
    name: "Route A",
    driver: "Mr. David",
    busNumber: "DL12AB1234",
    capacity: 40,
    studentsAssigned: 35,
  },
  {
    id: "tr002",
    name: "Route B",
    driver: "Ms. Laura",
    busNumber: "UP34CD5678",
    capacity: 30,
    studentsAssigned: 28,
  },
]
