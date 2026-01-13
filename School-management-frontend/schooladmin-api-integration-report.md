# School Admin API Integration Report

This report summarizes the current state of **School Admin** frontend pages vs backend REST APIs.

## Completed (Integrated with backend APIs)

### 1) Students
- **Page:** `app/schooladmin/students/page.tsx`
- **Add Student Page:** `app/schooladmin/students/add/page.tsx`
- **Form:** `components/forms/add-student-form.tsx`
- **Modal:** `components/forms/add-student-modal.tsx`
- **Backend APIs:**
  - `GET /api/students`
  - `POST /api/students`
  - `PUT /api/students/:id`
  - `DELETE /api/students/:id`
  - `GET /api/classes` (used to populate the class selector)

Notes:
- Form now returns a typed payload (`CreateStudentPayload`) aligned with backend fields (`classId`, `parentPhone`, `addressStreet`, etc.).
- Student detail modal normalizes both legacy and API-backed shapes.

### 2) Classes
- **Page:** `app/schooladmin/classes/page.tsx`
- **Backend APIs:**
  - `GET /api/classes`
  - `POST /api/classes`
  - `PUT /api/classes/:id`
  - `DELETE /api/classes/:id`

Notes:
- Frontend payload uses backend field names (`roomNumber`, `academicYear`, `status`).

### 3) Subjects
- **Page:** `app/schooladmin/subjects/page.tsx`
- **Hook:** `hooks/useSubjects.ts`
- **Backend APIs:**
  - `GET /api/subjects` (includes `classSubjects` + teacher/user)
  - `POST /api/subjects`
  - `PUT /api/subjects/:id`
  - `DELETE /api/subjects/:id`
  - (Available, not yet wired in UI) `POST /api/subjects/class-subject`, `DELETE /api/subjects/class-subject/:id`

Notes:
- UI displays subject → associated classes and teachers derived from `classSubjects`.

### 4) Admissions
- **Page:** `app/schooladmin/admissions/page.tsx`
- **Hook:** `hooks/useAdmissions.ts`
- **Backend APIs:**
  - `GET /api/admissions`
  - `POST /api/admissions`
  - `PUT /api/admissions/:id` (hook exists; UI create only for now)
  - `DELETE /api/admissions/:id`
  - `POST /api/admissions/:id/approve` (now sends `{ classId, rollNumber, section }`)
  - `POST /api/admissions/:id/reject`

Notes:
- Approving an admission creates the student using the backend transaction.

## Already Integrated Previously (no changes in this ticket)
- **Dashboard:** `app/schooladmin/dashboard/page.tsx` uses React Query hooks (stats, alerts, logs, events).

## Remaining / Not Yet Integrated

### Pages still using mock data or placeholder logic
- `app/schooladmin/attendance/page.tsx`
- `app/schooladmin/fees/page.tsx`
- `app/schooladmin/exams/page.tsx`
- `app/schooladmin/events/page.tsx`
- `app/schooladmin/timetable/page.tsx`

### Pages blocked by missing/partial backend support
- Results approval workflow:
  - `app/schooladmin/results/approval/page.tsx`
  - Marksheet pages under `app/schooladmin/results/marksheet/**`
  - Backend currently supports **publishing results** (`POST /api/exams/:id/publish`) but does **not** implement an approval state machine (Pending/Approved/Published) as used in the UI mocks.

- Identity cards:
  - `app/schooladmin/students/identity-cards/page.tsx`
  - No dedicated backend routes are currently exposed for ID card generation/management.

- Staff management & salary:
  - `app/schooladmin/staff/management/page.tsx`
  - `app/schooladmin/staff/salary/page.tsx`
  - Backend currently has `teachers` and `users` (super-admin only) but no `/api/staff` endpoints and no salary ledger/history model.

## Recommended Next Steps (to finish full School Admin coverage)
1. **Attendance**: implement missing backend query endpoints (by class + date summary) or adjust frontend to use only existing endpoints.
2. **Fees**: wire the Fees page to `/api/fees` and align payment payload shape (`paymentMethod`, `paymentDate`).
3. **Exams/Timetable/Events**: replace mock pages with API-backed tables + CRUD using `/api/exams`, `/api/timetable`, `/api/events`.
4. **Results approval**: decide on desired backend model (e.g. `Result.status = PENDING|APPROVED|PUBLISHED`) and implement endpoints accordingly.
5. **Staff**: decide whether staff should be handled as `User` roles within a school and implement `/api/staff` (school-admin scoped) if needed.
