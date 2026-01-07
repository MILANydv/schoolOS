import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

// Get all logs
router.get('/', authMiddleware, async (req, res) => {
    try {
        const logs = await prisma.log.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50
        })
        res.json({ success: true, data: logs })
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch logs' })
    }
})

export default router
