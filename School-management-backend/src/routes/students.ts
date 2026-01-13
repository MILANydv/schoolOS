import { Router } from 'express'
import prisma from '../utils/prisma'
import { authMiddleware } from '../middleware/auth'

const router = Router()

/**
 * @swagger
 * /api/students:
 *   get:
 *     summary: Get all students
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all students
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      where: { schoolId: req.user.schoolId },
      include: { class: true }
    })
    res.json({ success: true, data: students })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch students' })
  }
})

/**
 * @swagger
 * /api/students/{id}:
 *   get:
 *     summary: Get a single student by ID
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Student ID
 *     responses:
 *       200:
 *         description: Student details
 *       404:
 *         description: Student not found
 */
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

/**
 * @swagger
 * /api/students:
 *   post:
 *     summary: Create a new student
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rollNumber
 *               - firstName
 *               - lastName
 *               - dateOfBirth
 *               - gender
 *               - classId
 *               - section
 *               - admissionDate
 *               - admissionNumber
 *             properties:
 *               rollNumber:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date-time
 *               gender:
 *                 type: string
 *               classId:
 *                 type: string
 *               section:
 *                 type: string
 *               admissionNumber:
 *                 type: string
 *               admissionDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Student created successfully
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      classId,
      section,
      rollNumber,
      admissionNumber,
      admissionDate,
      parentName,
      parentPhone,
      parentEmail,
      address,
      bloodGroup,
      emergencyName,
      emergencyPhone,
      addressStreet,
      addressCity,
      addressState,
      addressZip
    } = req.body

    // Check if user or student exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User with this email already exists' })
    }

    const existingStudent = await prisma.student.findFirst({
      where: {
        OR: [
          { admissionNumber },
          { schoolId: req.user.schoolId, rollNumber }
        ]
      }
    })

    if (existingStudent) {
      return res.status(400).json({ success: false, error: 'Student with this admission number or roll number already exists' })
    }

    // Default password is date of birth (YYYY-MM-DD) or 'password123'
    const password = dateOfBirth ? new Date(dateOfBirth).toISOString().split('T')[0] : 'password123'
    const hashedPassword = await require('bcryptjs').hash(password, 10)

    const finalAdmissionNumber = admissionNumber || `ADM${new Date().getFullYear()}${Math.floor(1000 + Math.random() * 9000)}`

    const result = await prisma.$transaction(async (prisma) => {
      // Create User
      const user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashedPassword,
          role: 'STUDENT',
          phone,
          schoolId: req.user.schoolId,
          status: 'ACTIVE'
        }
      })

      // Create Student
      const student = await prisma.student.create({
        data: {
          userId: user.id,
          schoolId: req.user.schoolId,
          firstName,
          lastName,
          email,
          phone,
          dateOfBirth: new Date(dateOfBirth),
          gender,
          classId,
          section: section || 'A',
          rollNumber,
          admissionNumber: finalAdmissionNumber,
          admissionDate: new Date(admissionDate),
          parentName,
          parentPhone,
          parentEmail,
          addressStreet: addressStreet || address || '',
          addressCity: addressCity || '',
          addressState: addressState || '',
          addressZip: addressZip || '',
          emergencyName: emergencyName || parentName,
          emergencyPhone: emergencyPhone || parentPhone,
          bloodGroup,
          status: 'ACTIVE'
        }
      })

      return { user, student }
    })

    res.json({ success: true, data: result })
  } catch (error) {
    console.error('Create student error:', error)
    res.status(500).json({ success: false, error: 'Failed to create student' })
  }
})

/**
 * @swagger
 * /api/students/{id}:
 *   put:
 *     summary: Update a student
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Student updated successfully
 */
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

/**
 * @swagger
 * /api/students/{id}:
 *   delete:
 *     summary: Delete a student
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student deleted successfully
 */
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

router.post('/import-from-admission/:admissionId', authMiddleware, async (req, res) => {
  try {
    const { admissionId } = req.params
    const { classId, rollNumber, section } = req.body

    // Find the admission
    const admission = await prisma.admission.findUnique({
      where: { id: admissionId }
    })

    if (!admission) {
      return res.status(404).json({ success: false, error: 'Admission not found' })
    }

    if (admission.schoolId !== req.user.schoolId) {
      return res.status(403).json({ success: false, error: 'Unauthorized' })
    }

    if (admission.status !== 'Approved') {
      return res.status(400).json({ success: false, error: 'Admission must be approved before importing' })
    }

    // Check if student already exists
    const existingStudent = await prisma.student.findFirst({
      where: {
        admissionNumber: admission.admissionNumber
      }
    })

    if (existingStudent) {
      return res.status(400).json({ success: false, error: 'Student already imported from this admission' })
    }

    // Generate email from admission number if not provided
    const studentEmail = admission.parentEmail || `${admission.admissionNumber?.toLowerCase() || 'student'}@student.local`

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email: studentEmail } })
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User with this email already exists' })
    }

    // Default password is date of birth (YYYY-MM-DD) or 'password123'
    const password = admission.dateOfBirth ? new Date(admission.dateOfBirth).toISOString().split('T')[0] : 'password123'
    const hashedPassword = await require('bcryptjs').hash(password, 10)

    const result = await prisma.$transaction(async (prisma) => {
      // Create User
      const user = await prisma.user.create({
        data: {
          firstName: admission.applicantName.split(' ')[0],
          lastName: admission.applicantName.split(' ').slice(1).join(' ') || '',
          email: studentEmail,
          password: hashedPassword,
          role: 'STUDENT',
          phone: admission.parentPhone || undefined,
          schoolId: req.user.schoolId,
          status: 'ACTIVE'
        }
      })

      // Create Student
      const student = await prisma.student.create({
        data: {
          userId: user.id,
          schoolId: req.user.schoolId,
          firstName: admission.applicantName.split(' ')[0],
          lastName: admission.applicantName.split(' ').slice(1).join(' ') || '',
          email: studentEmail,
          phone: admission.parentPhone || undefined,
          dateOfBirth: admission.dateOfBirth as Date,
          gender: admission.gender as string,
          classId,
          section: section || 'A',
          rollNumber,
          admissionNumber: admission.admissionNumber,
          admissionDate: new Date(),
          parentName: admission.parentName || '',
          parentPhone: admission.parentPhone || '',
          parentEmail: admission.parentEmail || '',
          addressStreet: admission.address || '',
          addressCity: '',
          addressState: '',
          addressZip: '',
          emergencyName: admission.parentName || '',
          emergencyPhone: admission.parentPhone || '',
          status: 'ACTIVE'
        }
      })

      return { user, student }
    })

    res.json({ success: true, data: result })
  } catch (error) {
    console.error('Import from admission error:', error)
    res.status(500).json({ success: false, error: 'Failed to import student from admission' })
  }
})

export default router
