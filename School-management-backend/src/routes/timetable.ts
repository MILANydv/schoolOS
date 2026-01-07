import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

// Get teacher timetable
router.get('/teacher/:teacherId', authMiddleware, async (req, res) => {
    try {
        // Note: teacherId passed here is the User ID, so we need to find the Teacher record first
        // Or we can adjust the seed/schema. For simplicity, assuming we pass User ID and look up teacher.
        // Actually, the schema links Timetable to Teacher model, not User. 
        // But the frontend passes User ID. Let's handle this lookup.

        const teacher = await prisma.teacher.findFirst({
            where: { userId: req.params.teacherId }
        })

        if (!teacher) {
            // If no teacher record found (e.g. for simple users), return empty
            return res.json({ success: true, data: [] })
        }

        const timetable = await prisma.timetable.findMany({
            where: { teacherId: teacher.id },
            include: { class: true },
            orderBy: { startTime: 'asc' }
        })
        res.json({ success: true, data: timetable })
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch timetable' })
    }
})

// Get student timetable
router.get('/student/:studentId', authMiddleware, async (req, res) => {
    try {
        // Similar lookup for student if needed, but usually student is linked to class
        // We need to find the student's class first
        // Wait, studentId passed is User ID? No, usually Student ID.
        // But frontend `useAuthStore` has User ID.
        // Let's assume we pass User ID and find Student record.

        // However, the frontend call `timetableApi.getStudentTimetable(user?.id)` passes User ID.
        // But Student model doesn't have userId field in the current schema!
        // Wait, checking schema... Student model has `email`. User has `email`.
        // We can link by email or just assume the ID passed is the Student ID if the frontend handles it.
        // BUT the frontend just passes `user.id` which is from `User` table.
        // So we need to find the Student record where email matches User email.

        const user = await prisma.user.findUnique({ where: { id: req.params.studentId } })
        if (!user) return res.status(404).json({ success: false, error: 'User not found' })

        const student = await prisma.student.findFirst({
            where: { email: user.email }
        })

        if (!student) {
            return res.json({ success: true, data: [] })
        }

        const timetable = await prisma.timetable.findMany({
            where: { classId: student.classId },
            include: { teacher: true },
            orderBy: { startTime: 'asc' }
        })
        res.json({ success: true, data: timetable })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, error: 'Failed to fetch timetable' })
    }
})

export default router
