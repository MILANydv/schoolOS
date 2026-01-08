import { Router } from 'express'
import prisma from '../utils/prisma'
import { authMiddleware } from '../middleware/auth'
import { checkPermission } from '../middleware/rbac'

const router = Router()

router.get('/', authMiddleware, async (req, res) => {
  try {
    const certificates = await prisma.certificate.findMany({
      where: { schoolId: req.user.schoolId },
      include: {
        student: {
          include: { class: true }
        }
      },
      orderBy: { issuedDate: 'desc' }
    })
    
    res.json({ success: true, data: certificates })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch certificates' })
  }
})

router.get('/student/:studentId', authMiddleware, async (req, res) => {
  try {
    const certificates = await prisma.certificate.findMany({
      where: { studentId: req.params.studentId },
      orderBy: { issuedDate: 'desc' }
    })
    
    res.json({ success: true, data: certificates })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch student certificates' })
  }
})

router.post('/', authMiddleware, checkPermission('manage_certificates'), async (req, res) => {
  try {
    const { studentId, type, content, issuedDate } = req.body
    
    const certificateNumber = `CERT-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    
    const certificate = await prisma.certificate.create({
      data: {
        schoolId: req.user.schoolId,
        studentId,
        type,
        content,
        issuedDate: issuedDate ? new Date(issuedDate) : new Date(),
        certificateNumber
      },
      include: {
        student: {
          include: { class: true }
        }
      }
    })
    
    res.json({ success: true, data: certificate })
  } catch (error) {
    console.error('Create certificate error:', error)
    res.status(500).json({ success: false, error: 'Failed to create certificate' })
  }
})

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const certificate = await prisma.certificate.findUnique({
      where: { id: req.params.id },
      include: {
        student: {
          include: { class: true }
        },
        school: true
      }
    })
    
    if (!certificate) {
      return res.status(404).json({ success: false, error: 'Certificate not found' })
    }
    
    res.json({ success: true, data: certificate })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch certificate' })
  }
})

router.delete('/:id', authMiddleware, checkPermission('manage_certificates'), async (req, res) => {
  try {
    await prisma.certificate.delete({
      where: { id: req.params.id }
    })
    
    res.json({ success: true, message: 'Certificate deleted' })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete certificate' })
  }
})

router.get('/id-cards', authMiddleware, async (req, res) => {
  try {
    const idCards = await prisma.iDCard.findMany({
      where: { schoolId: req.user.schoolId },
      include: {
        student: {
          include: { class: true }
        }
      },
      orderBy: { issuedDate: 'desc' }
    })
    
    res.json({ success: true, data: idCards })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch ID cards' })
  }
})

router.get('/id-cards/student/:studentId', authMiddleware, async (req, res) => {
  try {
    const idCard = await prisma.iDCard.findUnique({
      where: { studentId: req.params.studentId },
      include: {
        student: {
          include: { class: true }
        }
      }
    })
    
    res.json({ success: true, data: idCard })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch ID card' })
  }
})

router.post('/id-cards', authMiddleware, checkPermission('manage_certificates'), async (req, res) => {
  try {
    const { studentId, issuedDate, expiryDate } = req.body
    
    const existingCard = await prisma.iDCard.findUnique({
      where: { studentId }
    })
    
    if (existingCard) {
      return res.status(400).json({ success: false, error: 'ID card already exists for this student' })
    }
    
    const cardNumber = `ID-${Date.now()}-${Math.floor(Math.random() * 10000)}`
    
    const idCard = await prisma.iDCard.create({
      data: {
        schoolId: req.user.schoolId,
        studentId,
        cardNumber,
        issuedDate: issuedDate ? new Date(issuedDate) : new Date(),
        expiryDate: expiryDate ? new Date(expiryDate) : new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        status: 'ACTIVE'
      },
      include: {
        student: {
          include: { class: true }
        }
      }
    })
    
    res.json({ success: true, data: idCard })
  } catch (error) {
    console.error('Create ID card error:', error)
    res.status(500).json({ success: false, error: 'Failed to create ID card' })
  }
})

router.put('/id-cards/:id', authMiddleware, checkPermission('manage_certificates'), async (req, res) => {
  try {
    const { status } = req.body
    
    const idCard = await prisma.iDCard.update({
      where: { id: req.params.id },
      data: { status }
    })
    
    res.json({ success: true, data: idCard })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update ID card' })
  }
})

export default router
