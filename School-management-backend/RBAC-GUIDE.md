# Role-Based Access Control (RBAC) Guide

## User Roles

The system supports 5 distinct user roles with different permission levels:

### 1. 🔴 SUPER_ADMIN
**Highest Level Access**
- Can access and manage ALL schools in the system
- Full CRUD permissions on all resources
- Can create/delete schools
- System-wide administration

**Use Case:** System administrators, platform owners

### 2. 🔵 SCHOOL_ADMIN
**School-Level Management**
- Full access to their assigned school only
- Manage students, teachers, classes, fees
- View all reports and analytics
- Cannot access other schools

**Use Case:** School principals, administrators

### 3. 🟢 TEACHER
**Academic Management**
- Manage their assigned classes
- Mark attendance for their students
- Create and grade assignments
- View student performance
- Cannot manage fees or other teachers

**Use Case:** Teaching staff

### 4. 🟡 ACCOUNTANT
**Financial Management**
- Manage fee structures and payments
- Generate financial reports
- Record fee payments
- Cannot manage students or academic data

**Use Case:** Finance department staff

### 5. 🟣 STUDENT_PARENT
**View-Only Access**
- View their child's attendance
- View grades and assignments
- View fee status
- Cannot modify any data

**Use Case:** Parents and students

---

## Test Accounts

All passwords: **password123**

| Role | Email | School | Access Level |
|------|-------|--------|--------------|
| SUPER_ADMIN | superadmin@system.com | All Schools | Full System |
| SCHOOL_ADMIN | admin@demohighschool.com | Demo High School | School Only |
| TEACHER | teacher@demohighschool.com | Demo High School | Classes Only |
| ACCOUNTANT | accountant@demohighschool.com | Demo High School | Fees Only |
| STUDENT_PARENT | parent@student.com | Demo High School | View Only |
| SCHOOL_ADMIN | admin@springfieldacademy.com | Springfield Academy | School Only |

---

## Permission Matrix

| Resource | Super Admin | School Admin | Teacher | Accountant | Student/Parent |
|----------|-------------|--------------|---------|------------|----------------|
| **Students** |
| View All | ✅ | ✅ | ✅ (Own Classes) | ❌ | ❌ (Own Only) |
| Create | ✅ | ✅ | ❌ | ❌ | ❌ |
| Update | ✅ | ✅ | ❌ | ❌ | ❌ |
| Delete | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Classes** |
| View All | ✅ | ✅ | ✅ (Own Only) | ❌ | ❌ |
| Create | ✅ | ✅ | ❌ | ❌ | ❌ |
| Update | ✅ | ✅ | ❌ | ❌ | ❌ |
| Delete | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Attendance** |
| View | ✅ | ✅ | ✅ (Own Classes) | ❌ | ✅ (Own Only) |
| Mark | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Fees** |
| View | ✅ | ✅ | ❌ | ✅ | ✅ (Own Only) |
| Create | ✅ | ✅ | ❌ | ✅ | ❌ |
| Record Payment | ✅ | ✅ | ❌ | ✅ | ❌ |
| **Teachers** |
| View All | ✅ | ✅ | ✅ | ❌ | ❌ |
| Create | ✅ | ✅ | ❌ | ❌ | ❌ |
| Update | ✅ | ✅ | ❌ | ❌ | ❌ |
| Delete | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Dashboard** |
| View Stats | ✅ | ✅ | ✅ (Limited) | ✅ (Limited) | ❌ |

---

## How RBAC Works

### 1. Authentication
When a user logs in, they receive a JWT token containing:
```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "role": "SCHOOL_ADMIN",
  "schoolId": "school-uuid"
}
```

### 2. Authorization
Every protected route checks:
1. **Is the user authenticated?** (Has valid token)
2. **Does the user have the required role?** (Role check)
3. **Does the user belong to the correct school?** (School isolation)

### 3. School Isolation
- Users can ONLY access data from their assigned school
- Exception: SUPER_ADMIN can access all schools
- Enforced at the database query level

---

## Testing RBAC

### Test 1: Login as Different Roles
```bash
# Login as School Admin
POST /api/auth/login
{
  "email": "admin@demohighschool.com",
  "password": "password123"
}

# Login as Teacher
POST /api/auth/login
{
  "email": "teacher@demohighschool.com",
  "password": "password123"
}
```

### Test 2: Access Control
```bash
# School Admin can create students
POST /api/students
Authorization: Bearer <school-admin-token>
✅ Success

# Teacher tries to create students
POST /api/students
Authorization: Bearer <teacher-token>
❌ 403 Forbidden
```

### Test 3: School Isolation
```bash
# Demo High School admin tries to access Springfield data
GET /api/students
Authorization: Bearer <demo-admin-token>
✅ Returns only Demo High School students

# Super Admin can access all schools
GET /api/students
Authorization: Bearer <super-admin-token>
✅ Returns students from all schools
```

---

## Frontend Integration

### 1. Store User Role
After login, store the user's role in your frontend state:
```typescript
const { token, user } = response.data
localStorage.setItem('token', token)
localStorage.setItem('userRole', user.role)
```

### 2. Conditional UI Rendering
```typescript
// Show "Add Student" button only to admins
{(userRole === 'SUPER_ADMIN' || userRole === 'SCHOOL_ADMIN') && (
  <Button onClick={addStudent}>Add Student</Button>
)}
```

### 3. Route Protection
```typescript
// Redirect based on role after login
if (user.role === 'TEACHER') {
  router.push('/teacher/dashboard')
} else if (user.role === 'SCHOOL_ADMIN') {
  router.push('/schooladmin/dashboard')
}
```

---

## Security Best Practices

✅ **DO:**
- Always validate user role on the backend
- Check school ownership for all resources
- Use HTTPS in production
- Rotate JWT secrets regularly
- Implement rate limiting on login

❌ **DON'T:**
- Trust frontend role checks alone
- Expose sensitive data in JWT
- Use weak passwords
- Share tokens between users
- Store passwords in plain text

---

## Next Steps

1. ✅ RBAC middleware created
2. ✅ Database seeded with all roles
3. ✅ Authentication returns role info
4. 🔄 Apply RBAC to all routes (in progress)
5. 🔄 Frontend role-based routing
6. 🔄 Frontend conditional UI rendering
