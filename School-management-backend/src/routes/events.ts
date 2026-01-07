import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

// Get all events
router.get('/', authMiddleware, async (req, res) => {
    try {
        const events = await prisma.event.findMany({
            orderBy: { date: 'asc' }
        })
        res.json({ success: true, data: events })
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch events' })
    }
})

// Create event
router.post('/', authMiddleware, async (req, res) => {
    try {
        const event = await prisma.event.create({
            data: req.body
        })
        res.json({ success: true, data: event })
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to create event' })
    }
})

// Update event
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const event = await prisma.event.update({
            where: { id: req.params.id },
            data: req.body
        })
        res.json({ success: true, data: event })
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to update event' })
    }
})

// Delete event
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await prisma.event.delete({
            where: { id: req.params.id }
        })
        res.json({ success: true, message: 'Event deleted' })
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to delete event' })
    }
})

export default router
