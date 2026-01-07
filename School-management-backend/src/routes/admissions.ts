import { Router } from 'express'
import prisma from '../utils/prisma'
import { authMiddleware } from '../middleware/auth'

const router = Router()

/**
 * @swagger
 * /api/admissions:
 *   get:
 *     summary: Get all admissions
 *     tags: [Admissions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all admissions
 */
router.get('/', authMiddleware, async (req, res) => {
    try {
        const admissions = await prisma.admission.findMany({
            where: { schoolId: req.user.schoolId },
            orderBy: { createdAt: 'desc' }
        })
        res.json({ success: true, data: admissions })
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch admissions' })
    }
})

/**
 * @swagger
 * /api/admissions:
 *   post:
 *     summary: Create a new admission
 *     tags: [Admissions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - applicantName
 *               - gradeApplyingFor
 *               - applicationDate
 *               - status
 *               - contact
 *     responses:
 *       200:
 *         description: Admission created successfully
 */
router.post('/', authMiddleware, async (req, res) => {
    try {
        const {
            applicantName,
            gradeApplyingFor,
            applicationDate,
            status,
            contact,
            notes,
            statusHistory
        } = req.body

        const admission = await prisma.admission.create({
            data: {
                schoolId: req.user.schoolId,
                applicantName,
                gradeApplyingFor,
                applicationDate: new Date(applicationDate),
                status,
                contact,
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

/**
 * @swagger
 * /api/admissions/{id}:
 *   put:
 *     summary: Update an admission
 *     tags: [Admissions]
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
 *         description: Admission updated successfully
 */
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const {
            applicantName,
            gradeApplyingFor,
            applicationDate,
            status,
            contact,
            notes,
            statusHistory
        } = req.body

        const admission = await prisma.admission.update({
            where: {
                id: req.params.id,
                schoolId: req.user.schoolId
            },
            data: {
                applicantName,
                gradeApplyingFor,
                applicationDate: applicationDate ? new Date(applicationDate) : undefined,
                status,
                contact,
                notes,
                statusHistory
            }
        })

        res.json({ success: true, data: admission })
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to update admission' })
    }
})

/**
 * @swagger
 * /api/admissions/{id}:
 *   delete:
 *     summary: Delete an admission
 *     tags: [Admissions]
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
 *         description: Admission deleted successfully
 */
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await prisma.admission.delete({
            where: {
                id: req.params.id,
                schoolId: req.user.schoolId
            }
        })
        res.json({ success: true, message: 'Admission deleted' })
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to delete admission' })
    }
})

export default router
