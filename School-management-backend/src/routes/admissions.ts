import { Router } from 'express'
import bcrypt from 'bcryptjs'
import prisma from '../utils/prisma'
import { authMiddleware } from '../middleware/auth'
import { checkPermission } from '../middleware/rbac'

const router = Router()

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status } = req.query

    const where: any = { schoolId: req.user.schoolId }
    if (status) where.status = status

    const admissions = await prisma.admission.findMany({
      where,
      include: { assignedClass: true },
      orderBy: { createdAt: 'desc' }
    })

    res.json({ success: true, data: admissions })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch admissions' })
  }
})

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const admission = await prisma.admission.findUnique({
      where: { id: req.params.id },
      include: { assignedClass: true }
    })

    if (!admission || admission.schoolId !== req.user.schoolId) {
      return res.status(404).json({ success: false, error: 'Admission not found' })
    }

    res.json({ success: true, data: admission })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch admission' })
  }
})

router.post('/', authMiddleware, checkPermission('manage_admissions'), async (req, res) => {
  try {
    const {
      applicantName,
      gradeApplyingFor,
      applicationDate,
      status,
      parentPhone,
      dateOfBirth,
      gender,
      parentName,
      parentEmail,
      address,
      previousSchool,
      documents,
      interviewDate,
      interviewNotes,
      admissionFee,
      notes,
      statusHistory
    } = req.body

    const admission = await prisma.admission.create({
      data: {
        schoolId: req.user.schoolId,
        applicantName,
        gradeApplyingFor,
        applicationDate: new Date(applicationDate),
        status: status || 'Pending',
        parentPhone,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        gender,
        parentName,
        parentEmail,
        address,
        previousSchool,
        documents: documents || {},
        interviewDate: interviewDate ? new Date(interviewDate) : undefined,
        interviewNotes,
        admissionFee,
        admissionFeePaid: false,
        notes,
        statusHistory: statusHistory || []
      }
    })

    res.json({ success: true, data: admission })
  } catch (error) {
    console.error('Create admission error:', error)
    res.status(500).json({ success: false, error: 'Failed to create admission' })
  }
})

router.put('/:id', authMiddleware, checkPermission('manage_admissions'), async (req, res) => {
  try {
    const existing = await prisma.admission.findUnique({
      where: { id: req.params.id }
    })

    if (!existing || existing.schoolId !== req.user.schoolId) {
      return res.status(404).json({ success: false, error: 'Admission not found' })
    }

    const admission = await prisma.admission.update({
      where: { id: req.params.id },
      data: req.body
    })

    res.json({ success: true, data: admission })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update admission' })
  }
})

router.post('/:id/schedule-interview', authMiddleware, checkPermission('schedule_interviews'), async (req, res) => {
  try {
    const { interviewDate, interviewNotes } = req.body

    const existing = await prisma.admission.findUnique({ where: { id: req.params.id } })
    if (!existing || existing.schoolId !== req.user.schoolId) {
      return res.status(404).json({ success: false, error: 'Admission not found' })
    }

    const admission = await prisma.admission.update({
      where: { id: req.params.id },
      data: {
        interviewDate: new Date(interviewDate),
        interviewNotes,
        status: 'Interview Scheduled'
      }
    })

    res.json({ success: true, data: admission })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to schedule interview' })
  }
})

router.post('/:id/mark-fee-paid', authMiddleware, checkPermission('manage_admissions'), async (req, res) => {
  try {
    const existing = await prisma.admission.findUnique({ where: { id: req.params.id } })
    if (!existing || existing.schoolId !== req.user.schoolId) {
      return res.status(404).json({ success: false, error: 'Admission not found' })
    }

    const admission = await prisma.admission.update({
      where: { id: req.params.id },
      data: { admissionFeePaid: true }
    })

    res.json({ success: true, data: admission })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to mark fee as paid' })
  }
})

router.post('/:id/approve', authMiddleware, checkPermission('approve_admissions'), async (req, res) => {
  try {
    const { classId, rollNumber, section } = req.body

    const admission = await prisma.admission.findUnique({
      where: { id: req.params.id }
    })

    if (!admission || admission.schoolId !== req.user.schoolId) {
      return res.status(404).json({ success: false, error: 'Admission not found' })
    }

    if (!admission.dateOfBirth || !admission.gender) {
      return res.status(400).json({
        success: false,
        error: 'Complete applicant information required for approval'
      })
    }

    const admissionNumber = `ADM${new Date().getFullYear()}${Math.floor(1000 + Math.random() * 9000)}`
    const studentEmail = admission.parentEmail || `${admissionNumber.toLowerCase()}@student.local`

    const hashedPassword = await bcrypt.hash(admission.dateOfBirth.toISOString().split('T')[0], 10)

    const result = await prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          email: studentEmail,
          password: hashedPassword,
          role: 'STUDENT',
          firstName: admission.applicantName.split(' ')[0],
          lastName: admission.applicantName.split(' ').slice(1).join(' ') || '',
          phone: admission.parentPhone,
          schoolId: req.user.schoolId,
          status: 'ACTIVE'
        }
      })

      const student = await prisma.student.create({
        data: {
          userId: user.id,
          schoolId: req.user.schoolId,
          firstName: admission.applicantName.split(' ')[0],
          lastName: admission.applicantName.split(' ').slice(1).join(' ') || '',
          email: studentEmail,
          phone: admission.parentPhone,
          dateOfBirth: admission.dateOfBirth as Date,
          gender: admission.gender as string,
          classId,
          section: section || 'A',
          rollNumber,
          admissionNumber,
          admissionDate: new Date(),
          parentName: admission.parentName || '',
          parentPhone: admission.parentPhone,
          parentEmail: admission.parentEmail || '',
          addressStreet: admission.address || '',
          addressCity: '',
          addressState: '',
          addressZip: '',
          emergencyName: admission.parentName || '',
          emergencyPhone: admission.parentPhone,
          status: 'ACTIVE'
        }
      })

      const updatedAdmission = await prisma.admission.update({
        where: { id: req.params.id },
        data: {
          status: 'Approved',
          assignedClassId: classId,
          approvedAt: new Date()
        }
      })

      return { user, student, admission: updatedAdmission }
    })

    res.json({ success: true, data: result })
  } catch (error) {
    console.error('Approve admission error:', error)
    res.status(500).json({ success: false, error: 'Failed to approve admission' })
  }
})

router.post('/:id/reject', authMiddleware, checkPermission('approve_admissions'), async (req, res) => {
  try {
    const { reason } = req.body

    const existing = await prisma.admission.findUnique({ where: { id: req.params.id } })
    if (!existing || existing.schoolId !== req.user.schoolId) {
      return res.status(404).json({ success: false, error: 'Admission not found' })
    }

    const admission = await prisma.admission.update({
      where: { id: req.params.id },
      data: {
        status: 'Rejected',
        notes: reason
      }
    })

    res.json({ success: true, data: admission })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to reject admission' })
  }
})

router.delete('/:id', authMiddleware, checkPermission('manage_admissions'), async (req, res) => {
  try {
    const existing = await prisma.admission.findUnique({ where: { id: req.params.id } })
    if (!existing || existing.schoolId !== req.user.schoolId) {
      return res.status(404).json({ success: false, error: 'Admission not found' })
    }

    await prisma.admission.delete({ where: { id: req.params.id } })

    res.json({ success: true, message: 'Admission deleted' })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete admission' })
  }
})

export default router
