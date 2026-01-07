import { Router } from 'express'
import prisma from '../utils/prisma'
import { authMiddleware } from '../middleware/auth'
import { checkPermission } from '../middleware/rbac'

const router = Router()

router.get('/', authMiddleware, async (req, res) => {
  try {
    const timetables = await prisma.timetable.findMany({
      where: { schoolId: req.user.schoolId },
      include: {
        class: true,
        subject: true,
        teacher: { include: { user: true } }
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' }
      ]
    })
    
    res.json({ success: true, data: timetables })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch timetables' })
  }
})

router.get('/class/:classId', authMiddleware, async (req, res) => {
  try {
    const timetables = await prisma.timetable.findMany({
      where: {
        classId: req.params.classId,
        schoolId: req.user.schoolId
      },
      include: {
        subject: true,
        teacher: { include: { user: true } }
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' }
      ]
    })
    
    res.json({ success: true, data: timetables })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch class timetable' })
  }
})

router.get('/teacher/:teacherId', authMiddleware, async (req, res) => {
  try {
    const teacher = await prisma.teacher.findFirst({
      where: { userId: req.params.teacherId }
    })

    if (!teacher) {
      return res.json({ success: true, data: [] })
    }

    const timetables = await prisma.timetable.findMany({
      where: { teacherId: teacher.id },
      include: {
        class: true,
        subject: true
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' }
      ]
    })
    
    res.json({ success: true, data: timetables })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch teacher timetable' })
  }
})

router.get('/student/:studentId', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.studentId } })
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' })
    }

    const student = await prisma.student.findFirst({
      where: { userId: user.id }
    })

    if (!student) {
      return res.json({ success: true, data: [] })
    }

    const timetables = await prisma.timetable.findMany({
      where: { classId: student.classId },
      include: {
        subject: true,
        teacher: { include: { user: true } }
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' }
      ]
    })
    
    res.json({ success: true, data: timetables })
  } catch (error) {
    console.error('Fetch student timetable error:', error)
    res.status(500).json({ success: false, error: 'Failed to fetch student timetable' })
  }
})

router.post('/', authMiddleware, checkPermission('manage_timetable'), async (req, res) => {
  try {
    const { classId, subjectId, teacherId, dayOfWeek, startTime, endTime, roomNumber } = req.body
    
    const existingSlot = await prisma.timetable.findFirst({
      where: {
        schoolId: req.user.schoolId,
        classId,
        dayOfWeek,
        OR: [
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gt: startTime } }
            ]
          },
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gte: endTime } }
            ]
          }
        ]
      }
    })
    
    if (existingSlot) {
      return res.status(400).json({
        success: false,
        error: 'Time slot conflict detected for this class'
      })
    }
    
    const timetable = await prisma.timetable.create({
      data: {
        schoolId: req.user.schoolId,
        classId,
        subjectId,
        teacherId,
        dayOfWeek,
        startTime,
        endTime,
        roomNumber
      },
      include: {
        class: true,
        subject: true,
        teacher: { include: { user: true } }
      }
    })
    
    res.json({ success: true, data: timetable })
  } catch (error) {
    console.error('Create timetable error:', error)
    res.status(500).json({ success: false, error: 'Failed to create timetable' })
  }
})

router.put('/:id', authMiddleware, checkPermission('manage_timetable'), async (req, res) => {
  try {
    const { teacherId, dayOfWeek, startTime, endTime, roomNumber } = req.body
    
    const timetable = await prisma.timetable.update({
      where: { id: req.params.id },
      data: {
        teacherId,
        dayOfWeek,
        startTime,
        endTime,
        roomNumber
      }
    })
    
    res.json({ success: true, data: timetable })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update timetable' })
  }
})

router.delete('/:id', authMiddleware, checkPermission('manage_timetable'), async (req, res) => {
  try {
    await prisma.timetable.delete({
      where: { id: req.params.id }
    })
    
    res.json({ success: true, message: 'Timetable deleted' })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete timetable' })
  }
})

export default router
