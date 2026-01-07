import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database with all user roles...\n')

  // Create Demo School
  const demoSchool = await prisma.school.upsert({
    where: { id: '550e8400-e29b-41d4-a716-446655440000' },
    update: {},
    create: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Demo High School',
      email: 'info@demohighschool.com',
      phone: '+1-555-0100',
      address: '123 Education Street, Knowledge City, State 12345'
    }
  })
  console.log('✅ Created school:', demoSchool.name)

  // Create Another School for Super Admin testing
  const secondSchool = await prisma.school.upsert({
    where: { id: '550e8400-e29b-41d4-a716-446655440010' },
    update: {},
    create: {
      id: '550e8400-e29b-41d4-a716-446655440010',
      name: 'Springfield Academy',
      email: 'info@springfieldacademy.com',
      phone: '+1-555-0200',
      address: '456 Learning Lane, Education Town, State 54321'
    }
  })
  console.log('✅ Created school:', secondSchool.name)

  // Hash password once for all users (password: password123)
  const hashedPassword = await bcrypt.hash('password123', 12)

  // 1. SUPER ADMIN - Can access all schools
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@system.com' },
    update: {},
    create: {
      email: 'superadmin@system.com',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      firstName: 'Super',
      lastName: 'Admin',
      phone: '+1-555-0001',
      schoolId: demoSchool.id, // Default school, but can access all
      status: 'ACTIVE'
    }
  })
  console.log('✅ Created SUPER_ADMIN:', superAdmin.email)

  // 2. SCHOOL ADMIN - Manages Demo High School
  const schoolAdmin = await prisma.user.upsert({
    where: { email: 'admin@demohighschool.com' },
    update: {},
    create: {
      email: 'admin@demohighschool.com',
      password: hashedPassword,
      role: 'SCHOOL_ADMIN',
      firstName: 'John',
      lastName: 'Administrator',
      phone: '+1-555-0002',
      schoolId: demoSchool.id,
      status: 'ACTIVE'
    }
  })
  console.log('✅ Created SCHOOL_ADMIN:', schoolAdmin.email)

  // 3. TEACHER - Teaches at Demo High School
  const teacher1 = await prisma.user.upsert({
    where: { email: 'teacher@demohighschool.com' },
    update: {},
    create: {
      email: 'teacher@demohighschool.com',
      password: hashedPassword,
      role: 'TEACHER',
      firstName: 'Sarah',
      lastName: 'Johnson',
      phone: '+1-555-0003',
      schoolId: demoSchool.id,
      status: 'ACTIVE'
    }
  })
  console.log('✅ Created TEACHER:', teacher1.email)

  // Create Teacher record
  const teacherRecord = await prisma.teacher.upsert({
    where: { employeeId: 'TCH001' },
    update: {},
    create: {
      userId: teacher1.id,
      employeeId: 'TCH001',
      schoolId: demoSchool.id,
      department: 'Mathematics',
      qualification: 'M.Sc. Mathematics',
      experience: 5,
      joinDate: new Date('2020-08-01'),
      status: 'ACTIVE'
    }
  })

  // 4. ACCOUNTANT - Manages finances at Demo High School
  const accountant = await prisma.user.upsert({
    where: { email: 'accountant@demohighschool.com' },
    update: {},
    create: {
      email: 'accountant@demohighschool.com',
      password: hashedPassword,
      role: 'ACCOUNTANT',
      firstName: 'Michael',
      lastName: 'Roberts',
      phone: '+1-555-0004',
      schoolId: demoSchool.id,
      status: 'ACTIVE'
    }
  })
  console.log('✅ Created ACCOUNTANT:', accountant.email)

  // 5. STUDENT/PARENT - Student account
  const studentParent = await prisma.user.upsert({
    where: { email: 'parent@student.com' },
    update: {},
    create: {
      email: 'parent@student.com',
      password: hashedPassword,
      role: 'STUDENT_PARENT',
      firstName: 'David',
      lastName: 'Wilson',
      phone: '+1-555-0005',
      schoolId: demoSchool.id,
      status: 'ACTIVE'
    }
  })
  console.log('✅ Created STUDENT_PARENT:', studentParent.email)

  // Create sample classes
  const class10A = await prisma.class.upsert({
    where: { id: '550e8400-e29b-41d4-a716-446655440100' },
    update: {},
    create: {
      id: '550e8400-e29b-41d4-a716-446655440100',
      name: 'Class 10',
      section: 'A',
      grade: '10',
      academicYear: '2024-2025',
      capacity: 40,
      roomNumber: '101',
      schoolId: demoSchool.id,
      status: 'ACTIVE'
    }
  })
  console.log('✅ Created class:', class10A.name + '-' + class10A.section)

  const class9B = await prisma.class.upsert({
    where: { id: '550e8400-e29b-41d4-a716-446655440101' },
    update: {},
    create: {
      id: '550e8400-e29b-41d4-a716-446655440101',
      name: 'Class 9',
      section: 'B',
      grade: '9',
      academicYear: '2024-2025',
      capacity: 35,
      roomNumber: '102',
      schoolId: demoSchool.id,
      status: 'ACTIVE'
    }
  })
  console.log('✅ Created class:', class9B.name + '-' + class9B.section)

  // Create sample student
  const student = await prisma.student.upsert({
    where: { admissionNumber: 'ADM2024001' },
    update: {},
    create: {
      rollNumber: '001',
      firstName: 'Emma',
      lastName: 'Wilson',
      dateOfBirth: new Date('2010-05-15'),
      gender: 'FEMALE',
      email: 'emma.wilson@student.com',
      phone: '+1-555-1001',
      classId: class10A.id,
      section: 'A',
      admissionDate: new Date('2024-04-01'),
      admissionNumber: 'ADM2024001',
      status: 'ACTIVE',
      addressStreet: '789 Student Avenue',
      addressCity: 'Knowledge City',
      addressState: 'State',
      addressZip: '12345',
      parentName: 'David Wilson',
      parentPhone: '+1-555-0005',
      parentEmail: 'parent@student.com',
      emergencyName: 'David Wilson',
      emergencyPhone: '+1-555-0005',
      schoolId: demoSchool.id
    }
  })
  console.log('✅ Created student:', student.firstName, student.lastName)

  // Additional users for Springfield Academy
  const springfieldAdmin = await prisma.user.upsert({
    where: { email: 'admin@springfieldacademy.com' },
    update: {},
    create: {
      email: 'admin@springfieldacademy.com',
      password: hashedPassword,
      role: 'SCHOOL_ADMIN',
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '+1-555-0006',
      schoolId: secondSchool.id,
      status: 'ACTIVE'
    }
  })
  console.log('✅ Created SCHOOL_ADMIN for Springfield:', springfieldAdmin.email)

  console.log('✅ Created SCHOOL_ADMIN for Springfield:', springfieldAdmin.email)

  // Seed Events
  await prisma.event.createMany({
    data: [
      {
        schoolId: demoSchool.id,
        title: 'Annual Sports Day',
        description: 'Annual sports meet for all students',
        date: new Date('2025-02-15'),
        startTime: '09:00',
        endTime: '16:00',
        type: 'SPORTS',
        audience: ['STUDENT', 'TEACHER', 'PARENT']
      },
      {
        schoolId: demoSchool.id,
        title: 'Parent-Teacher Meeting',
        description: 'Term 1 progress review',
        date: new Date('2025-02-18'),
        startTime: '14:00',
        endTime: '17:00',
        type: 'MEETING',
        audience: ['PARENT', 'TEACHER']
      },
      {
        schoolId: demoSchool.id,
        title: 'Science Fair',
        description: 'Student science project exhibition',
        date: new Date('2025-02-22'),
        startTime: '10:00',
        endTime: '15:00',
        type: 'ACADEMIC',
        audience: ['ALL']
      }
    ]
  })
  console.log('✅ Created Events')

  // Seed Exams for Class 10-A
  const mathExam = await prisma.exam.create({
    data: {
      schoolId: demoSchool.id,
      classId: class10A.id,
      subject: 'Mathematics',
      name: 'Mid-Term Examination',
      date: new Date('2025-03-10'),
      startTime: '09:00',
      duration: 180,
      totalMarks: 100
    }
  })

  await prisma.exam.create({
    data: {
      schoolId: demoSchool.id,
      classId: class10A.id,
      subject: 'Science',
      name: 'Mid-Term Examination',
      date: new Date('2025-03-12'),
      startTime: '09:00',
      duration: 180,
      totalMarks: 100
    }
  })
  console.log('✅ Created Exams')

  // Seed Timetable for Class 10-A
  await prisma.timetable.createMany({
    data: [
      {
        schoolId: demoSchool.id,
        classId: class10A.id,
        dayOfWeek: 'MONDAY',
        startTime: '09:00',
        endTime: '09:45',
        subject: 'Mathematics',
        teacherId: teacherRecord.id,
        roomNumber: '101'
      },
      {
        schoolId: demoSchool.id,
        classId: class10A.id,
        dayOfWeek: 'MONDAY',
        startTime: '10:00',
        endTime: '10:45',
        subject: 'Science',
        roomNumber: '101'
      },
      {
        schoolId: demoSchool.id,
        classId: class10A.id,
        dayOfWeek: 'TUESDAY',
        startTime: '09:00',
        endTime: '09:45',
        subject: 'English',
        roomNumber: '101'
      }
    ]
  })
  console.log('✅ Created Timetable')

  // Seed Logs
  await prisma.log.createMany({
    data: [
      {
        schoolId: demoSchool.id,
        userId: schoolAdmin.id,
        action: 'LOGIN',
        details: 'User logged in successfully',
        ipAddress: '192.168.1.1'
      },
      {
        schoolId: demoSchool.id,
        userId: schoolAdmin.id,
        action: 'CREATE_STUDENT',
        details: 'Created student Emma Wilson',
        ipAddress: '192.168.1.1'
      },
      {
        schoolId: demoSchool.id,
        userId: teacher1.id,
        action: 'MARK_ATTENDANCE',
        details: 'Marked attendance for Class 10-A',
        ipAddress: '192.168.1.2'
      }
    ]
  })
  console.log('✅ Created Logs')

  console.log('═══════════════════════════════════════════════════════')
  console.log('📝 LOGIN CREDENTIALS (All passwords: password123)')
  console.log('═══════════════════════════════════════════════════════\n')

  console.log('🔴 SUPER ADMIN (Access to all schools):')
  console.log('   Email: superadmin@system.com')
  console.log('   Password: password123\n')

  console.log('🔵 SCHOOL ADMIN (Demo High School):')
  console.log('   Email: admin@demohighschool.com')
  console.log('   Password: password123\n')

  console.log('🟢 TEACHER (Demo High School):')
  console.log('   Email: teacher@demohighschool.com')
  console.log('   Password: password123\n')

  console.log('🟡 ACCOUNTANT (Demo High School):')
  console.log('   Email: accountant@demohighschool.com')
  console.log('   Password: password123\n')

  console.log('🟣 STUDENT/PARENT (Demo High School):')
  console.log('   Email: parent@student.com')
  console.log('   Password: password123\n')

  console.log('🔵 SCHOOL ADMIN (Springfield Academy):')
  console.log('   Email: admin@springfieldacademy.com')
  console.log('   Password: password123\n')

  console.log('═══════════════════════════════════════════════════════')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
