# 🔐 Login Credentials - All Roles

**All passwords:** `password123`

---

## 🔴 SUPER ADMIN
**Full System Access - All Schools**

- **Email:** `superadmin@system.com`
- **Password:** `password123`
- **Access:** All schools, all features
- **Dashboard:** `/superadmin/dashboard`

---

## 🔵 SCHOOL ADMIN (Demo High School)
**School Management**

- **Email:** `admin@demohighschool.com`
- **Password:** `password123`
- **School:** Demo High School
- **Access:** Students, Teachers, Classes, Fees, Reports
- **Dashboard:** `/schooladmin/dashboard`

---

## 🔵 SCHOOL ADMIN (Springfield Academy)
**School Management**

- **Email:** `admin@springfieldacademy.com`
- **Password:** `password123`
- **School:** Springfield Academy
- **Access:** Students, Teachers, Classes, Fees, Reports
- **Dashboard:** `/schooladmin/dashboard`

---

## 🟢 TEACHER
**Academic Management**

- **Email:** `teacher@demohighschool.com`
- **Password:** `password123`
- **School:** Demo High School
- **Department:** Mathematics
- **Access:** Attendance, Assignments, Grades
- **Dashboard:** `/teacher/dashboard`

---

## 🟡 ACCOUNTANT
**Financial Management**

- **Email:** `accountant@demohighschool.com`
- **Password:** `password123`
- **School:** Demo High School
- **Access:** Fees, Payments, Financial Reports
- **Dashboard:** `/accountant/dashboard`

---

## 🟣 STUDENT/PARENT
**View-Only Access**

- **Email:** `parent@student.com`
- **Password:** `password123`
- **School:** Demo High School
- **Student:** Emma Wilson (Class 10-A)
- **Access:** View attendance, grades, fees
- **Dashboard:** `/student-parent/dashboard`

---

## Quick Test Commands

### Login as School Admin
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@demohighschool.com","password":"password123"}'
```

### Login as Teacher
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teacher@demohighschool.com","password":"password123"}'
```

### Login as Super Admin
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@system.com","password":"password123"}'
```

---

## Database Info

**Schools:**
- Demo High School (2 classes, 1 student)
- Springfield Academy (empty, for testing)

**Classes:**
- Class 10-A (Demo High School)
- Class 9-B (Demo High School)

**Students:**
- Emma Wilson (Class 10-A, Demo High School)

---

## Testing RBAC

1. **Login with different roles**
2. **Try accessing restricted endpoints**
3. **Verify school isolation** (Demo admin can't see Springfield data)
4. **Test Super Admin** (can access all schools)
