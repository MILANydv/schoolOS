# School Management Backend - Phase 1 MVP

Simple, functional backend API for school management system.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure database:
- Update `.env` file with your PostgreSQL connection string
- Default: `postgresql://user:password@localhost:5432/school_management`

3. Run database migrations:
```bash
npm run prisma:migrate
```

4. Generate Prisma client:
```bash
npm run prisma:generate
```

5. Start development server:
```bash
npm run dev
```

Server will run on http://localhost:5000

## API Endpoints

### Authentication
- POST `/api/auth/login` - Login
- GET `/api/auth/me` - Get current user
- POST `/api/auth/logout` - Logout

### Students
- GET `/api/students` - Get all students
- GET `/api/students/:id` - Get one student
- POST `/api/students` - Create student
- PUT `/api/students/:id` - Update student
- DELETE `/api/students/:id` - Delete student

### Classes
- GET `/api/classes` - Get all classes
- POST `/api/classes` - Create class
- PUT `/api/classes/:id` - Update class
- DELETE `/api/classes/:id` - Delete class

### Attendance
- GET `/api/attendance` - Get all attendance
- POST `/api/attendance` - Mark attendance
- GET `/api/attendance/student/:studentId` - Get student attendance

### Fees
- GET `/api/fees` - Get all fees
- POST `/api/fees` - Create fee
- POST `/api/fees/:id/payment` - Record payment

### Teachers
- GET `/api/teachers` - Get all teachers
- POST `/api/teachers` - Create teacher
- PUT `/api/teachers/:id` - Update teacher
- DELETE `/api/teachers/:id` - Delete teacher

### Notifications
- GET `/api/notifications` - Get all notifications
- POST `/api/notifications` - Create notification
- PUT `/api/notifications/:id` - Update notification
- DELETE `/api/notifications/:id` - Delete notification

### Dashboard
- GET `/api/dashboard` - Get dashboard stats

## Database

Using PostgreSQL with Prisma ORM.

View database:
```bash
npm run prisma:studio
```

## Tech Stack

- Node.js + Express
- TypeScript
- Prisma (ORM)
- PostgreSQL
- JWT Authentication
- bcryptjs (Password hashing)
