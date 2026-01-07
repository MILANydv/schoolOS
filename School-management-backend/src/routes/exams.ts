import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

// Get all exams
router.get('/', authMiddleware, async (req, res) => {
    try {
        const exams = await prisma.exam.findMany({
            include: { class: true },
            orderBy: { date: 'asc' }
        })
        res.json({ success: true, data: exams })
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch exams' })
    }
})

// Get exams by class
router.get('/class/:classId', authMiddleware, async (req, res) => {
    try {
        const exams = await prisma.exam.findMany({
            where: { classId: req.params.classId },
            include: { class: true },
            orderBy: { date: 'asc' }
        })
        res.json({ success: true, data: exams })
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch exams' })
    }
})

// Create exam
router.post('/', authMiddleware, async (req, res) => {
    try {
        const exam = await prisma.exam.create({
            data: req.body
        })
        res.json({ success: true, data: exam })
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to create exam' })
    }
})

export default router
