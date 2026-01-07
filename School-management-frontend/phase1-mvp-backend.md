# Phase 1 MVP Backend - Simple & Functional

## Philosophy: Keep It Simple

**Goal**: Build a working backend that saves, gets, updates, and deletes data. No fancy tech, no over-engineering.

**Tech Stack**: 
- **Backend**: Node.js + Express.js (simple, everyone knows it)
- **Database**: PostgreSQL (reliable, straightforward)
- **ORM**: Prisma (makes database work easy)
- **Auth**: JWT tokens (simple auth)
- **Language**: TypeScript (matches frontend)

---

## Quick Setup

```bash
# Create backend folder
mkdir school-management-backend
cd school-management-backend

# Initialize project
npm init -y
npm install express prisma @prisma/client bcryptjs jsonwebtoken cors dotenv
npm install -D typescript @types/node @types/express @types/bcryptjs @types/jsonwebtoken ts-node nodemon

# Initialize Prisma
npx prisma init
```

---

## Database Schema (Prisma)

**File: `prisma/schema.prisma`**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model School {
  id        String   @id @default(uuid())
  name      String
  email     String
  phone     String
  address   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  users     User[]
  students  Student[]
  classes   Class[]
  teachers  Teacher[]
  fees      Fee[]
  attendance Attendance[]
  notifications Notification[]
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  role      String   // SUPER_ADMIN, SCHOOL_ADMIN, TEACHER, ACCOUNTANT, STUDENT_PARENT
  firstName String
  lastName  String
  phone     String?
  schoolId  String
  status    String   @default("ACTIVE")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  school    School   @relation(fields: [schoolId], references: [id])
}

model Student {
  id              String   @id @default(uuid())
  schoolId        String
  rollNumber      String
  firstName       String
  lastName        String
  dateOfBirth     DateTime
  gender          String
  email           String?
  phone           String?
  classId         String
  section         String
  admissionDate   DateTime
  admissionNumber String   @unique
  status          String   @default("ACTIVE")
  
  // Address
  addressStreet   String
  addressCity     String
  addressState    String
  addressZip      String
  
  // Parent Info
  parentName      String
  parentPhone     String
  parentEmail     String
  
  // Emergency
  emergencyName   String
  emergencyPhone  String
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  school          School   @relation(fields: [schoolId], references: [id])
  class           Class    @relation(fields: [classId], references: [id])
  attendance      Attendance[]
  fees            Fee[]
  
  @@unique([schoolId, rollNumber])
}

model Class {
  id            String   @id @default(uuid())
  schoolId      String
  name          String
  section       String
  grade         String
  academicYear  String
  capacity      Int
  roomNumber    String?
  status        String   @default("ACTIVE")
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  school        School   @relation(fields: [schoolId], references: [id])
  students      Student[]
  attendance    Attendance[]
}

model Teacher {
  id            String   @id @default(uuid())
  schoolId      String
  userId        String
  employeeId    String   @unique
  department    String?
  qualification String
  experience    Int
  joinDate      DateTime
  status        String   @default("ACTIVE")
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  school        School   @relation(fields: [schoolId], references: [id])
}

model Attendance {
  id        String   @id @default(uuid())
  schoolId  String
  studentId String
  classId   String
  date      DateTime
  status    String   // PRESENT, ABSENT, LATE
  remarks   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  school    School   @relation(fields: [schoolId], references: [id])
  student   Student  @relation(fields: [studentId], references: [id])
  class     Class    @relation(fields: [classId], references: [id])
  
  @@unique([studentId, date])
}

model Fee {
  id            String   @id @default(uuid())
  schoolId      String
  studentId     String
  feeType       String
  totalAmount   Float
  paidAmount    Float    @default(0)
  dueDate       DateTime
  status        String   @default("DUE")
  academicYear  String
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  school        School   @relation(fields: [schoolId], references: [id])
  student       Student  @relation(fields: [studentId], references: [id])
  payments      FeePayment[]
}

model FeePayment {
  id            String   @id @default(uuid())
  feeId         String
  amount        Float
  paymentMethod String
  paymentDate   DateTime
  receiptNumber String   @unique
  createdAt     DateTime @default(now())
  
  fee           Fee      @relation(fields: [feeId], references: [id])
}

model Notification {
  id            String   @id @default(uuid())
  schoolId      String
  title         String
  content       String
  type          String
  priority      String
  audience      String[]
  status        String   @default("DRAFT")
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  school        School   @relation(fields: [schoolId], references: [id])
}
```

---

## API Routes (Simple CRUD)

### Authentication
```typescript
POST   /api/auth/login          // Login
POST   /api/auth/logout         // Logout
GET    /api/auth/me             // Get current user
```

### Students
```typescript
GET    /api/students            // Get all students
GET    /api/students/:id        // Get one student
POST   /api/students            // Create student
PUT    /api/students/:id        // Update student
DELETE /api/students/:id        // Delete student
```

### Classes
```typescript
GET    /api/classes             // Get all classes
GET    /api/classes/:id         // Get one class
POST   /api/classes             // Create class
PUT    /api/classes/:id         // Update class
DELETE /api/classes/:id         // Delete class
```

### Attendance
```typescript
GET    /api/attendance          // Get all attendance
POST   /api/attendance          // Mark attendance
PUT    /api/attendance/:id      // Update attendance
GET    /api/attendance/student/:studentId  // Get student attendance
```

### Fees
```typescript
GET    /api/fees                // Get all fees
GET    /api/fees/:id            // Get one fee
POST   /api/fees                // Create fee
PUT    /api/fees/:id            // Update fee
POST   /api/fees/:id/payment    // Record payment
```

### Teachers
```typescript
GET    /api/teachers            // Get all teachers
GET    /api/teachers/:id        // Get one teacher
POST   /api/teachers            // Create teacher
PUT    /api/teachers/:id        // Update teacher
DELETE /api/teachers/:id        // Delete teacher
```

### Notifications
```typescript
GET    /api/notifications       // Get all notifications
POST   /api/notifications       // Create notification
PUT    /api/notifications/:id   // Update notification
DELETE /api/notifications/:id   // Delete notification
```

### Dashboard
```typescript
GET    /api/dashboard           // Get dashboard stats
```

---

## Simple Code Structure

```
school-management-backend/
├── src/
│   ├── index.ts              // Main server file
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── students.ts
│   │   ├── classes.ts
│   │   ├── attendance.ts
│   │   ├── fees.ts
│   │   ├── teachers.ts
│   │   ├── notifications.ts
│   │   └── dashboard.ts
│   ├── middleware/
│   │   └── auth.ts           // JWT verification
│   └── utils/
│       └── prisma.ts         // Prisma client
├── prisma/
│   └── schema.prisma
├── .env
├── package.json
└── tsconfig.json
```

---

## Example Code

### Main Server (`src/index.ts`)
```typescript
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import authRoutes from './routes/auth'
import studentRoutes from './routes/students'
import classRoutes from './routes/classes'
import attendanceRoutes from './routes/attendance'
import feeRoutes from './routes/fees'
import teacherRoutes from './routes/teachers'
import notificationRoutes from './routes/notifications'
import dashboardRoutes from './routes/dashboard'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/students', studentRoutes)
app.use('/api/classes', classRoutes)
app.use('/api/attendance', attendanceRoutes)
app.use('/api/fees', feeRoutes)
app.use('/api/teachers', teacherRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/dashboard', dashboardRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

### Students Route (`src/routes/students.ts`)
```typescript
import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

// Get all students
router.get('/', authMiddleware, async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      include: { class: true }
    })
    res.json({ success: true, data: students })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch students' })
  }
})

// Get one student
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: req.params.id },
      include: { class: true, attendance: true, fees: true }
    })
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' })
    }
    res.json({ success: true, data: student })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch student' })
  }
})

// Create student
router.post('/', authMiddleware, async (req, res) => {
  try {
    const student = await prisma.student.create({
      data: req.body
    })
    res.json({ success: true, data: student })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create student' })
  }
})

// Update student
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const student = await prisma.student.update({
      where: { id: req.params.id },
      data: req.body
    })
    res.json({ success: true, data: student })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update student' })
  }
})

// Delete student
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.student.delete({
      where: { id: req.params.id }
    })
    res.json({ success: true, message: 'Student deleted' })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete student' })
  }
})

export default router
```

### Auth Middleware (`src/middleware/auth.ts`)
```typescript
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  
  if (!token) {
    return res.status(401).json({ success: false, error: 'No token provided' })
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ success: false, error: 'Invalid token' })
  }
}
```

---

## Environment Variables (`.env`)

```env
DATABASE_URL="postgresql://user:password@localhost:5432/school_management"
JWT_SECRET="your-secret-key-change-this"
PORT=5000
```

---

## Frontend Integration

### Update Frontend to Use Real API

**Create API Client (`lib/api.ts`)**
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export const api = {
  // Students
  getStudents: async () => {
    const res = await fetch(`${API_URL}/students`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
    return res.json()
  },
  
  createStudent: async (data: any) => {
    const res = await fetch(`${API_URL}/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(data)
    })
    return res.json()
  },
  
  // Add more as needed...
}

function getToken() {
  return localStorage.getItem('token') || ''
}
```

### Update Zustand Store to Use API

```typescript
// In schoolAdminStore.ts
import { api } from '@/lib/api'

export const useSchoolAdminStore = create<SchoolAdminStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        students: [],
        
        // Fetch students from API
        fetchStudents: async () => {
          const response = await api.getStudents()
          if (response.success) {
            set((state) => {
              state.students = response.data
            })
          }
        },
        
        // Add student via API
        addStudent: async (student) => {
          const response = await api.createStudent(student)
          if (response.success) {
            set((state) => {
              state.students.push(response.data)
            })
          }
        },
        
        // Similar for update, delete...
      }))
    )
  )
)
```

---

## Development Workflow

### 1. Start Backend
```bash
cd school-management-backend
npm run dev
```

### 2. Start Frontend
```bash
cd School-management-frontend
npm run dev
```

### 3. Test API
Use Postman or Thunder Client to test endpoints

---

## That's It!

**No fancy stuff:**
- ✅ Simple Express server
- ✅ Prisma for database (easy queries)
- ✅ JWT for auth (basic security)
- ✅ CRUD operations that work
- ✅ Frontend connects and works

**Focus on:**
- Making it work
- Getting schools to use it
- Collecting feedback
- Iterating quickly

**Later (Phase 2):**
- Add validation
- Add better error handling
- Add caching
- Add file uploads
- Add email/SMS
- Optimize performance

---

## Timeline

- **Week 1**: Setup + Auth + Users
- **Week 2**: Students + Classes
- **Week 3**: Attendance + Fees
- **Week 4**: Teachers + Notifications + Dashboard
- **Week 5**: Frontend integration
- **Week 6**: Testing + Bug fixes
- **Week 7-8**: Deploy + School onboarding

**Total: 8 weeks to working MVP**
