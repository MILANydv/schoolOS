# Backend Requirements: School Management System

## Executive Summary

This document outlines the backend requirements to support the School Management Frontend. The implementation is divided into **3 phases**, with **Phase 1 being the MVP** that enables schools to start using the system immediately. Each phase builds upon the previous, allowing for iterative development and early value delivery.

**Timeline**: Phase 1 (MVP) - 8-10 weeks | Phase 2 - 6-8 weeks | Phase 3 - 8-10 weeks

---

## Technology Stack Recommendations

### Core Backend
- **Framework**: Node.js with Express.js OR NestJS (recommended for scalability)
- **Language**: TypeScript (matches frontend)
- **Database**: PostgreSQL (relational data) + Redis (caching)
- **ORM**: Prisma (type-safe, excellent DX)
- **API Style**: RESTful with OpenAPI/Swagger documentation

### Authentication & Security
- **Auth**: JWT tokens with refresh token rotation
- **Password**: bcrypt hashing
- **Authorization**: Role-Based Access Control (RBAC)
- **Rate Limiting**: Express-rate-limit or Redis-based
- **CORS**: Configured for frontend domain

### File Storage
- **Phase 1**: Local file system
- **Phase 2+**: AWS S3 or Cloudinary (for assignments, documents, photos)

### Real-time (Phase 3)
- **WebSockets**: Socket.io for live notifications
- **Pub/Sub**: Redis for event broadcasting

### DevOps
- **Containerization**: Docker
- **Deployment**: AWS EC2/ECS, DigitalOcean, or Vercel (for serverless)
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry (errors), DataDog/New Relic (performance)

---

## Phase 1: MVP for School Launch (8-10 weeks)

**Goal**: Enable schools to start using the system for core operations: student management, attendance, fees, and basic communication.

### 1.1 Authentication & User Management

#### API Endpoints

**Authentication**
```
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh-token
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
GET    /api/auth/me
```

**User Management**
```
GET    /api/users
GET    /api/users/:id
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id
PATCH  /api/users/:id/change-password
PATCH  /api/users/:id/toggle-status
```

#### Data Models

**User**
```typescript
{
  id: string (UUID)
  email: string (unique)
  password: string (hashed)
  role: enum (SUPER_ADMIN, SCHOOL_ADMIN, TEACHER, ACCOUNTANT, STUDENT_PARENT)
  firstName: string
  lastName: string
  phone: string?
  avatar: string? (URL)
  schoolId: string (FK to School)
  status: enum (ACTIVE, INACTIVE, SUSPENDED)
  lastLogin: timestamp?
  createdAt: timestamp
  updatedAt: timestamp
}
```

**School** (for multi-tenancy support)
```typescript
{
  id: string (UUID)
  name: string
  address: string
  phone: string
  email: string
  logo: string? (URL)
  establishedYear: number
  boardAffiliation: string?
  principalName: string
  status: enum (ACTIVE, INACTIVE)
  subscriptionTier: enum (FREE, BASIC, PREMIUM)
  subscriptionExpiry: date?
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### Business Logic
- Password must be 8+ characters with uppercase, lowercase, number
- Email verification on signup (Phase 2)
- JWT expires in 1 hour, refresh token in 7 days
- Role-based middleware for route protection
- Audit log for all user actions

### 1.2 Student Management

#### API Endpoints

```
GET    /api/students
GET    /api/students/:id
POST   /api/students
PUT    /api/students/:id
DELETE /api/students/:id
GET    /api/students/:id/attendance
GET    /api/students/:id/fees
GET    /api/students/:id/results
POST   /api/students/bulk-import (CSV upload)
GET    /api/students/export (CSV download)
```

#### Data Models

**Student**
```typescript
{
  id: string (UUID)
  schoolId: string (FK)
  rollNumber: string (unique per school)
  firstName: string
  lastName: string
  dateOfBirth: date
  gender: enum (MALE, FEMALE, OTHER)
  bloodGroup: string?
  email: string?
  phone: string?
  
  // Address
  addressStreet: string
  addressCity: string
  addressState: string
  addressZip: string
  
  // Academic
  classId: string (FK to Class)
  section: string
  admissionDate: date
  admissionNumber: string (unique)
  status: enum (ACTIVE, INACTIVE, GRADUATED, SUSPENDED, TRANSFERRED)
  
  // Parent/Guardian
  parentName: string
  parentPhone: string
  parentEmail: string
  parentRelation: enum (FATHER, MOTHER, GUARDIAN)
  
  // Emergency Contact
  emergencyContactName: string
  emergencyContactPhone: string
  emergencyContactRelation: string
  
  // System
  userId: string? (FK to User - for student login)
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### Business Logic
- Roll number auto-generated or manual
- Admission number must be unique
- Cannot delete student with existing fee records (soft delete instead)
- Bulk import validates all fields before inserting
- Export includes all student data in CSV format

### 1.3 Class & Section Management

#### API Endpoints

```
GET    /api/classes
GET    /api/classes/:id
POST   /api/classes
PUT    /api/classes/:id
DELETE /api/classes/:id
GET    /api/classes/:id/students
GET    /api/classes/:id/subjects
POST   /api/classes/:id/assign-teacher
```

#### Data Models

**Class**
```typescript
{
  id: string (UUID)
  schoolId: string (FK)
  name: string (e.g., "Class 10")
  section: string (e.g., "A", "B")
  grade: string (e.g., "10", "9")
  academicYear: string (e.g., "2024-2025")
  capacity: number
  roomNumber: string?
  classTeacherId: string? (FK to User/Teacher)
  status: enum (ACTIVE, INACTIVE)
  createdAt: timestamp
  updatedAt: timestamp
}
```

**Subject**
```typescript
{
  id: string (UUID)
  schoolId: string (FK)
  name: string (e.g., "Mathematics")
  code: string? (e.g., "MATH101")
  description: string?
  createdAt: timestamp
  updatedAt: timestamp
}
```

**ClassSubject** (Many-to-Many)
```typescript
{
  id: string (UUID)
  classId: string (FK)
  subjectId: string (FK)
  teacherId: string (FK to User/Teacher)
  weeklyHours: number?
}
```

### 1.4 Attendance Management

#### API Endpoints

```
GET    /api/attendance
GET    /api/attendance/class/:classId/date/:date
POST   /api/attendance/mark
PUT    /api/attendance/:id
GET    /api/attendance/student/:studentId
GET    /api/attendance/student/:studentId/summary
GET    /api/attendance/class/:classId/summary
GET    /api/attendance/report (with filters)
```

#### Data Models

**Attendance**
```typescript
{
  id: string (UUID)
  schoolId: string (FK)
  studentId: string (FK)
  classId: string (FK)
  date: date
  status: enum (PRESENT, ABSENT, LATE, HALF_DAY, EXCUSED)
  markedBy: string (FK to User/Teacher)
  remarks: string?
  createdAt: timestamp
  updatedAt: timestamp
}
```

**Unique Constraint**: (studentId, date) - one record per student per day

#### Business Logic
- Attendance can be marked for current or past dates (within 7 days)
- Cannot mark attendance for future dates
- Attendance percentage calculated as: (Present + Late + HalfDay*0.5) / Total Days
- Summary API returns: total days, present, absent, late, percentage
- Report API supports filters: date range, class, section, status

### 1.5 Fee Management

#### API Endpoints

```
GET    /api/fees
GET    /api/fees/:id
POST   /api/fees
PUT    /api/fees/:id
DELETE /api/fees/:id
GET    /api/fees/student/:studentId
POST   /api/fees/:id/record-payment
GET    /api/fees/overdue
GET    /api/fees/summary
GET    /api/fees/report (with filters)
```

#### Data Models

**FeeStructure**
```typescript
{
  id: string (UUID)
  schoolId: string (FK)
  name: string (e.g., "Tuition Fee", "Transport Fee")
  amount: decimal
  frequency: enum (MONTHLY, QUARTERLY, ANNUALLY, ONE_TIME)
  applicableTo: enum (ALL, CLASS_SPECIFIC)
  classIds: string[]? (array of class IDs)
  academicYear: string
  status: enum (ACTIVE, INACTIVE)
  createdAt: timestamp
  updatedAt: timestamp
}
```

**StudentFee**
```typescript
{
  id: string (UUID)
  schoolId: string (FK)
  studentId: string (FK)
  feeStructureId: string (FK)
  academicYear: string
  totalAmount: decimal
  paidAmount: decimal
  discountAmount: decimal?
  scholarshipAmount: decimal?
  dueDate: date
  status: enum (PAID, PARTIAL, DUE, OVERDUE)
  createdAt: timestamp
  updatedAt: timestamp
}
```

**FeePayment**
```typescript
{
  id: string (UUID)
  studentFeeId: string (FK)
  amount: decimal
  paymentMethod: enum (CASH, CARD, ONLINE, CHEQUE, BANK_TRANSFER)
  paymentDate: date
  transactionId: string?
  receiptNumber: string (unique)
  receivedBy: string (FK to User/Accountant)
  remarks: string?
  createdAt: timestamp
}
```

#### Business Logic
- Fee status auto-updates based on paid amount vs total amount
- Overdue if due date passed and status != PAID
- Receipt number auto-generated (format: RCP-YYYY-NNNN)
- Payment recording updates StudentFee.paidAmount and status
- Summary API returns: total fees, total paid, total due, collection rate
- Report supports filters: date range, class, status, payment method

### 1.6 Teacher Management

#### API Endpoints

```
GET    /api/teachers
GET    /api/teachers/:id
POST   /api/teachers
PUT    /api/teachers/:id
DELETE /api/teachers/:id
GET    /api/teachers/:id/classes
GET    /api/teachers/:id/subjects
GET    /api/teachers/:id/schedule
```

#### Data Models

**Teacher** (extends User model)
```typescript
{
  id: string (UUID)
  userId: string (FK to User)
  schoolId: string (FK)
  employeeId: string (unique)
  department: string?
  qualification: string
  experience: number (years)
  specialization: string?
  joinDate: date
  salary: decimal?
  status: enum (ACTIVE, INACTIVE, ON_LEAVE)
  createdAt: timestamp
  updatedAt: timestamp
}
```

### 1.7 Notifications

#### API Endpoints

```
GET    /api/notifications
GET    /api/notifications/:id
POST   /api/notifications
PUT    /api/notifications/:id
DELETE /api/notifications/:id
POST   /api/notifications/:id/send
PATCH  /api/notifications/:id/mark-read
GET    /api/notifications/user/:userId
```

#### Data Models

**Notification**
```typescript
{
  id: string (UUID)
  schoolId: string (FK)
  title: string
  content: text
  type: enum (INFO, SUCCESS, WARNING, ERROR, ANNOUNCEMENT)
  priority: enum (LOW, MEDIUM, HIGH, URGENT)
  audience: enum[] (SCHOOL_ADMIN, TEACHER, PARENT, STUDENT, ALL)
  targetClassIds: string[]? (specific classes)
  targetUserIds: string[]? (specific users)
  scheduledDate: timestamp?
  sentDate: timestamp?
  status: enum (DRAFT, SCHEDULED, SENT, FAILED)
  createdBy: string (FK to User)
  createdAt: timestamp
  updatedAt: timestamp
}
```

**NotificationReceipt**
```typescript
{
  id: string (UUID)
  notificationId: string (FK)
  userId: string (FK)
  readAt: timestamp?
  createdAt: timestamp
}
```

#### Business Logic
- Notifications sent to all users matching audience criteria
- Scheduled notifications sent by background job
- Read receipts track who has seen the notification
- Cannot edit notification after sending

### 1.8 Dashboard & Analytics

#### API Endpoints

```
GET    /api/dashboard/school-admin
GET    /api/dashboard/teacher
GET    /api/dashboard/accountant
GET    /api/dashboard/student
GET    /api/analytics/students
GET    /api/analytics/attendance
GET    /api/analytics/fees
GET    /api/analytics/performance
```

#### Response Examples

**School Admin Dashboard**
```json
{
  "totalStudents": 1247,
  "totalTeachers": 78,
  "totalClasses": 42,
  "totalRevenue": 89500,
  "pendingAdmissions": 42,
  "attendanceRate": 94.2,
  "feeCollectionRate": 87.5,
  "upcomingEvents": 12,
  "recentActivities": [...],
  "alerts": [...]
}
```

### 1.9 System Logs & Audit Trail

#### API Endpoints

```
GET    /api/logs
GET    /api/logs/:id
POST   /api/logs (auto-created by middleware)
GET    /api/logs/user/:userId
GET    /api/logs/export
```

#### Data Models

**AuditLog**
```typescript
{
  id: string (UUID)
  schoolId: string (FK)
  userId: string (FK)
  action: string (e.g., "CREATE_STUDENT", "UPDATE_FEE")
  module: string (e.g., "STUDENTS", "FEES")
  entityType: string (e.g., "Student", "Fee")
  entityId: string
  changes: json? (before/after values)
  ipAddress: string
  userAgent: string
  status: enum (SUCCESS, FAILED)
  errorMessage: string?
  timestamp: timestamp
}
```

#### Business Logic
- All CREATE, UPDATE, DELETE operations logged automatically
- Logs retained for 1 year (configurable)
- Export for compliance and auditing

---

## Phase 2: Enhanced Features (6-8 weeks)

**Goal**: Add advanced academic features, improve communication, and enhance reporting.

### 2.1 Exam & Results Management

#### API Endpoints

```
GET    /api/exams
POST   /api/exams
PUT    /api/exams/:id
DELETE /api/exams/:id
GET    /api/exams/:id/results
POST   /api/results/enter
PUT    /api/results/:id
GET    /api/results/student/:studentId
GET    /api/results/class/:classId
POST   /api/results/approve
GET    /api/marksheets/:studentId/:examId
POST   /api/marksheets/generate
```

#### Data Models

**Exam**
```typescript
{
  id: string (UUID)
  schoolId: string (FK)
  name: string (e.g., "Mid-Term Exam")
  type: enum (UNIT_TEST, MID_TERM, FINAL, PRACTICAL)
  academicYear: string
  term: string
  startDate: date
  endDate: date
  status: enum (SCHEDULED, ONGOING, COMPLETED, CANCELLED)
  createdAt: timestamp
  updatedAt: timestamp
}
```

**ExamSubject**
```typescript
{
  id: string (UUID)
  examId: string (FK)
  classId: string (FK)
  subjectId: string (FK)
  maxMarks: number
  passingMarks: number
  examDate: date
  duration: number (minutes)
}
```

**Result**
```typescript
{
  id: string (UUID)
  examSubjectId: string (FK)
  studentId: string (FK)
  marksObtained: decimal
  grade: string? (auto-calculated)
  remarks: string?
  enteredBy: string (FK to User/Teacher)
  approvedBy: string? (FK to User/Admin)
  status: enum (DRAFT, SUBMITTED, APPROVED, REJECTED)
  createdAt: timestamp
  updatedAt: timestamp
}
```

**Marksheet**
```typescript
{
  id: string (UUID)
  studentId: string (FK)
  examId: string (FK)
  totalMarks: number
  marksObtained: number
  percentage: decimal
  grade: string
  rank: number?
  remarks: string?
  generatedAt: timestamp
}
```

#### Business Logic
- Marks cannot exceed max marks
- Grade auto-calculated based on percentage (A+, A, B+, B, C, D, F)
- Results require approval before publishing
- Marksheet generated only after all subjects approved
- Rank calculated within class

### 2.2 Assignment Management

#### API Endpoints

```
GET    /api/assignments
POST   /api/assignments
PUT    /api/assignments/:id
DELETE /api/assignments/:id
GET    /api/assignments/class/:classId
GET    /api/assignments/student/:studentId
POST   /api/assignments/:id/submit
GET    /api/submissions/:assignmentId
PUT    /api/submissions/:id/grade
```

#### Data Models

**Assignment**
```typescript
{
  id: string (UUID)
  schoolId: string (FK)
  title: string
  description: text
  classIds: string[] (multiple classes)
  subjectId: string (FK)
  teacherId: string (FK)
  dueDate: timestamp
  maxMarks: number?
  attachments: string[]? (file URLs)
  rubric: json? (grading criteria)
  status: enum (ACTIVE, COMPLETED, CANCELLED)
  createdAt: timestamp
  updatedAt: timestamp
}
```

**AssignmentSubmission**
```typescript
{
  id: string (UUID)
  assignmentId: string (FK)
  studentId: string (FK)
  submittedAt: timestamp
  attachments: string[] (file URLs)
  content: text?
  marksObtained: decimal?
  feedback: text?
  gradedBy: string? (FK to User/Teacher)
  gradedAt: timestamp?
  status: enum (SUBMITTED, GRADED, LATE, MISSING)
}
```

#### Business Logic
- Submission marked LATE if submitted after due date
- Missing submissions auto-created for tracking
- File upload size limit: 10MB per file
- Supported formats: PDF, DOCX, JPG, PNG

### 2.3 Timetable Management

#### API Endpoints

```
GET    /api/timetable/class/:classId
GET    /api/timetable/teacher/:teacherId
POST   /api/timetable
PUT    /api/timetable/:id
DELETE /api/timetable/:id
GET    /api/timetable/conflicts
```

#### Data Models

**Timetable**
```typescript
{
  id: string (UUID)
  schoolId: string (FK)
  classId: string (FK)
  subjectId: string (FK)
  teacherId: string (FK)
  dayOfWeek: enum (MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY)
  startTime: time
  endTime: time
  roomNumber: string?
  academicYear: string
  term: string
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### Business Logic
- Conflict detection: same teacher/room at same time
- Validation: end time must be after start time
- Cannot schedule outside school hours (configurable)

### 2.4 Event Management

#### API Endpoints

```
GET    /api/events
POST   /api/events
PUT    /api/events/:id
DELETE /api/events/:id
GET    /api/events/upcoming
POST   /api/events/:id/register
GET    /api/events/:id/participants
```

#### Data Models

**Event**
```typescript
{
  id: string (UUID)
  schoolId: string (FK)
  title: string
  description: text
  type: enum (ACADEMIC, SPORTS, CULTURAL, MEETING, HOLIDAY, OTHER)
  date: date
  startTime: time?
  endTime: time?
  location: string?
  audience: enum (STUDENTS, TEACHERS, PARENTS, ALL)
  capacity: number?
  registrationRequired: boolean
  status: enum (UPCOMING, ONGOING, COMPLETED, CANCELLED)
  createdBy: string (FK)
  createdAt: timestamp
  updatedAt: timestamp
}
```

**EventParticipant**
```typescript
{
  id: string (UUID)
  eventId: string (FK)
  userId: string (FK)
  registeredAt: timestamp
  attended: boolean?
}
```

### 2.5 Salary Management

#### API Endpoints

```
GET    /api/salaries
POST   /api/salaries
PUT    /api/salaries/:id
DELETE /api/salaries/:id
GET    /api/salaries/teacher/:teacherId
POST   /api/salaries/:id/mark-paid
GET    /api/salaries/pending
GET    /api/salaries/report
```

#### Data Models

**Salary**
```typescript
{
  id: string (UUID)
  schoolId: string (FK)
  teacherId: string (FK)
  month: string (YYYY-MM)
  basicSalary: decimal
  allowances: decimal?
  deductions: decimal?
  netSalary: decimal
  paymentDate: date?
  paymentMethod: enum (CASH, BANK_TRANSFER, CHEQUE)?
  transactionId: string?
  status: enum (PENDING, PAID, OVERDUE)
  remarks: string?
  processedBy: string? (FK to User)
  createdAt: timestamp
  updatedAt: timestamp
}
```

### 2.6 File Upload & Management

#### API Endpoints

```
POST   /api/upload (multipart/form-data)
DELETE /api/upload/:fileId
GET    /api/files/:fileId
```

#### Implementation
- Store files in AWS S3 or local storage
- Generate signed URLs for secure access
- Virus scanning on upload
- File size limits enforced
- Automatic cleanup of orphaned files

### 2.7 Email & SMS Integration

#### API Endpoints

```
POST   /api/communications/email
POST   /api/communications/sms
GET    /api/communications/history
```

#### Implementation
- Email: SendGrid, AWS SES, or Mailgun
- SMS: Twilio, AWS SNS, or local provider
- Template system for common messages
- Delivery status tracking
- Unsubscribe management

---

## Phase 3: Advanced Features (8-10 weeks)

**Goal**: Add real-time features, advanced analytics, and integrations.

### 3.1 Real-time Notifications

#### Implementation
- WebSocket server using Socket.io
- Rooms per user for targeted messages
- Event types: new notification, fee payment, result published
- Fallback to polling for older browsers

### 3.2 Advanced Analytics

#### API Endpoints

```
GET    /api/analytics/student-performance
GET    /api/analytics/teacher-effectiveness
GET    /api/analytics/financial-trends
GET    /api/analytics/attendance-patterns
GET    /api/analytics/predictive/dropout-risk
```

#### Features
- Student performance trends over time
- Class-wise comparison
- Teacher performance metrics
- Financial forecasting
- Dropout risk prediction (ML model)

### 3.3 Parent Portal Enhancements

#### Features
- Online fee payment integration (Stripe, Razorpay)
- Leave application submission
- Teacher appointment booking
- Progress report downloads
- Real-time chat with teachers

### 3.4 Library Management

#### Data Models
- Book, BookIssue, BookReturn
- Fine calculation for late returns
- Inventory management

### 3.5 Transport Management

#### Data Models
- Route, Vehicle, Driver, StudentTransport
- GPS tracking integration (Phase 4)
- Fee management for transport

### 3.6 Hostel Management

#### Data Models
- Hostel, Room, StudentHostel
- Attendance tracking
- Fee management for hostel

### 3.7 HR & Payroll

#### Features
- Leave management
- Attendance tracking for staff
- Payroll processing
- Tax calculations

### 3.8 Inventory Management

#### Data Models
- Item, Stock, Purchase, Issue
- Low stock alerts
- Vendor management

---

## Database Schema Overview (Phase 1 MVP)

### Core Tables (13 tables)

1. **schools** - Multi-tenancy support
2. **users** - Authentication & authorization
3. **students** - Student master data
4. **teachers** - Teacher master data
5. **classes** - Class/section management
6. **subjects** - Subject master
7. **class_subjects** - Class-subject-teacher mapping
8. **attendance** - Daily attendance records
9. **fee_structures** - Fee definitions
10. **student_fees** - Student-wise fee records
11. **fee_payments** - Payment transactions
12. **notifications** - Notification master
13. **notification_receipts** - Read tracking
14. **audit_logs** - System audit trail

### Indexes (for performance)

```sql
-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_school ON users(school_id);
CREATE INDEX idx_users_role ON users(role);

-- Students
CREATE INDEX idx_students_school ON students(school_id);
CREATE INDEX idx_students_class ON students(class_id);
CREATE INDEX idx_students_roll ON students(roll_number);
CREATE INDEX idx_students_status ON students(status);

-- Attendance
CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_attendance_class_date ON attendance(class_id, date);

-- Fees
CREATE INDEX idx_student_fees_student ON student_fees(student_id);
CREATE INDEX idx_student_fees_status ON student_fees(status);
CREATE INDEX idx_student_fees_due_date ON student_fees(due_date);
CREATE INDEX idx_fee_payments_student_fee ON fee_payments(student_fee_id);

-- Notifications
CREATE INDEX idx_notifications_school ON notifications(school_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notification_receipts_user ON notification_receipts(user_id);
```

---

## API Design Standards

### Request/Response Format

**Success Response**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error Response**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  }
}
```

**Pagination**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalPages": 5,
    "totalRecords": 100
  }
}
```

### Error Codes

- `VALIDATION_ERROR` - Input validation failed
- `UNAUTHORIZED` - Not authenticated
- `FORBIDDEN` - Not authorized for this action
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Resource already exists
- `INTERNAL_ERROR` - Server error

### Rate Limiting

- **Authentication**: 5 requests/minute
- **Read APIs**: 100 requests/minute
- **Write APIs**: 30 requests/minute
- **File Upload**: 10 requests/minute

---

## Security Requirements

### Authentication
- JWT tokens with 1-hour expiry
- Refresh tokens with 7-day expiry
- Secure HTTP-only cookies for tokens
- CSRF protection

### Authorization
- Role-based access control (RBAC)
- Resource-level permissions
- School-level data isolation (multi-tenancy)

### Data Protection
- All passwords hashed with bcrypt (cost factor 12)
- Sensitive data encrypted at rest
- HTTPS/TLS for all communications
- SQL injection prevention (parameterized queries)
- XSS protection (input sanitization)

### Audit & Compliance
- All actions logged with user, timestamp, IP
- Data retention policies
- GDPR compliance (data export, deletion)
- Regular security audits

---

## Performance Requirements

### Response Times
- **Read APIs**: < 200ms (95th percentile)
- **Write APIs**: < 500ms (95th percentile)
- **Dashboard**: < 1s (95th percentile)
- **Reports**: < 3s (95th percentile)

### Scalability
- Support 10,000 students per school
- Support 100 concurrent users
- Handle 1,000 requests/minute
- Database query optimization (N+1 prevention)

### Caching Strategy
- Redis for session storage
- Cache dashboard metrics (5-minute TTL)
- Cache student lists (1-hour TTL)
- Cache-Control headers for static data

---

## Testing Requirements

### Unit Tests
- All business logic functions
- 80%+ code coverage
- Test framework: Jest

### Integration Tests
- All API endpoints
- Database operations
- External service integrations

### Load Testing
- Simulate 100 concurrent users
- Test database performance under load
- Identify bottlenecks

### Security Testing
- Penetration testing
- Vulnerability scanning
- Dependency audits (npm audit)

---

## Deployment Architecture

### Development Environment
- Local PostgreSQL database
- Local Redis instance
- Environment variables in `.env` file

### Staging Environment
- AWS RDS PostgreSQL (or equivalent)
- AWS ElastiCache Redis
- AWS S3 for file storage
- CI/CD pipeline for auto-deployment

### Production Environment
- AWS RDS PostgreSQL with read replicas
- AWS ElastiCache Redis cluster
- AWS S3 with CloudFront CDN
- Load balancer (AWS ALB)
- Auto-scaling (2-10 instances)
- Monitoring: CloudWatch, Sentry
- Backups: Daily automated backups

---

## Migration Strategy

### Data Migration from Existing Systems

**Phase 1: Assessment**
- Audit existing data (Excel, paper records, old software)
- Identify data quality issues
- Map old schema to new schema

**Phase 2: Cleanup**
- Remove duplicates
- Standardize formats (dates, phone numbers)
- Fill missing required fields

**Phase 3: Migration**
- Create migration scripts
- Migrate in order: Schools → Users → Classes → Students → Fees
- Validate data after each step
- Run in staging first

**Phase 4: Verification**
- Compare record counts
- Spot-check critical data
- User acceptance testing

**Phase 5: Cutover**
- Final migration on weekend
- Parallel run for 1 week
- Monitor for issues

---

## Phase 1 MVP Delivery Checklist

### Week 1-2: Setup & Foundation
- [ ] Project setup (NestJS, Prisma, PostgreSQL)
- [ ] Database schema design
- [ ] Authentication & authorization
- [ ] User management APIs
- [ ] School management APIs

### Week 3-4: Student & Class Management
- [ ] Student CRUD APIs
- [ ] Class CRUD APIs
- [ ] Subject management APIs
- [ ] Bulk import/export
- [ ] Data validation

### Week 5-6: Attendance & Fees
- [ ] Attendance marking APIs
- [ ] Attendance reports
- [ ] Fee structure APIs
- [ ] Fee payment recording
- [ ] Fee reports

### Week 7-8: Communication & Dashboard
- [ ] Notification APIs
- [ ] Dashboard analytics
- [ ] Audit logs
- [ ] File upload
- [ ] Testing & bug fixes

### Week 9-10: Integration & Deployment
- [ ] Frontend-backend integration
- [ ] End-to-end testing
- [ ] Performance optimization
- [ ] Deployment to staging
- [ ] User acceptance testing
- [ ] Production deployment
- [ ] Training & documentation

---

## API Documentation

### Tools
- **Swagger/OpenAPI**: Auto-generated API docs
- **Postman Collection**: For testing and sharing
- **README**: Setup and deployment instructions

### Documentation Requirements
- All endpoints documented
- Request/response examples
- Error codes explained
- Authentication flow documented
- Rate limits specified

---

## Monitoring & Maintenance

### Monitoring
- **Uptime**: Pingdom or UptimeRobot
- **Errors**: Sentry for error tracking
- **Performance**: New Relic or DataDog
- **Logs**: CloudWatch or ELK stack

### Maintenance
- **Database Backups**: Daily automated backups, 30-day retention
- **Security Patches**: Monthly dependency updates
- **Performance Tuning**: Quarterly database optimization
- **Feature Updates**: Bi-weekly releases

---

## Cost Estimation (Phase 1 MVP)

### Development Costs
- **Backend Developer** (8-10 weeks): $8,000 - $15,000
- **DevOps Setup**: $1,000 - $2,000
- **Testing & QA**: $1,000 - $2,000
- **Total Development**: $10,000 - $19,000

### Infrastructure Costs (Monthly)
- **AWS RDS PostgreSQL** (db.t3.medium): $70
- **AWS ElastiCache Redis** (cache.t3.micro): $15
- **AWS S3 Storage** (100GB): $2
- **AWS EC2** (t3.medium): $35
- **Domain & SSL**: $5
- **Monitoring Tools**: $20
- **Total Monthly**: ~$150

### Annual Infrastructure: ~$1,800

---

## Success Metrics

### Technical Metrics
- **Uptime**: 99.9%
- **API Response Time**: < 200ms (p95)
- **Error Rate**: < 0.1%
- **Test Coverage**: > 80%

### Business Metrics
- **User Adoption**: > 90% of teachers using daily
- **Data Accuracy**: < 1% error rate
- **Time Savings**: 60% reduction in admin time
- **User Satisfaction**: > 4.2/5

---

## Conclusion

This backend implementation plan provides a **clear, phased approach** to building a production-ready school management system:

**Phase 1 MVP (8-10 weeks)** delivers:
- Complete authentication & user management
- Student, teacher, class management
- Attendance tracking
- Fee management
- Basic notifications
- Dashboard analytics
- **Result**: Schools can start using the system immediately

**Phase 2 (6-8 weeks)** adds:
- Exam & results management
- Assignment management
- Timetable management
- Event management
- Enhanced communication
- **Result**: Full academic cycle management

**Phase 3 (8-10 weeks)** brings:
- Real-time features
- Advanced analytics
- Parent portal enhancements
- Additional modules (library, transport, hostel)
- **Result**: Comprehensive school ERP system

**Total Timeline**: 22-28 weeks (5.5-7 months) for complete system

**Recommended Approach**: Launch Phase 1 MVP with 2-3 pilot schools, gather feedback, iterate, then scale to more schools while developing Phase 2 and 3.
