import { Router } from 'express'
import prisma from '../utils/prisma'
import { authMiddleware } from '../middleware/auth'
import { checkPermission } from '../middleware/rbac'

const router = Router()

router.get('/books', authMiddleware, async (req, res) => {
  try {
    const books = await prisma.library.findMany({
      where: { schoolId: req.user.schoolId },
      include: { issues: true },
      orderBy: { title: 'asc' }
    })
    
    res.json({ success: true, data: books })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch books' })
  }
})

router.post('/books', authMiddleware, checkPermission('manage_library'), async (req, res) => {
  try {
    const { title, author, isbn, category, totalCopies, location } = req.body
    
    const book = await prisma.library.create({
      data: {
        schoolId: req.user.schoolId,
        title,
        author,
        isbn,
        category,
        totalCopies,
        available: totalCopies,
        location
      }
    })
    
    res.json({ success: true, data: book })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to add book' })
  }
})

router.put('/books/:id', authMiddleware, checkPermission('manage_library'), async (req, res) => {
  try {
    const book = await prisma.library.update({
      where: { id: req.params.id },
      data: req.body
    })
    
    res.json({ success: true, data: book })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update book' })
  }
})

router.delete('/books/:id', authMiddleware, checkPermission('manage_library'), async (req, res) => {
  try {
    await prisma.library.delete({
      where: { id: req.params.id }
    })
    
    res.json({ success: true, message: 'Book deleted' })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete book' })
  }
})

router.post('/issue', authMiddleware, checkPermission('manage_library'), async (req, res) => {
  try {
    const { libraryId, studentId, dueDate } = req.body
    
    const book = await prisma.library.findUnique({
      where: { id: libraryId }
    })
    
    if (!book || book.available <= 0) {
      return res.status(400).json({ success: false, error: 'Book not available' })
    }
    
    const issue = await prisma.libraryIssue.create({
      data: {
        libraryId,
        studentId,
        issueDate: new Date(),
        dueDate: new Date(dueDate),
        status: 'ISSUED'
      },
      include: {
        library: true,
        student: true
      }
    })
    
    await prisma.library.update({
      where: { id: libraryId },
      data: { available: book.available - 1 }
    })
    
    res.json({ success: true, data: issue })
  } catch (error) {
    console.error('Issue book error:', error)
    res.status(500).json({ success: false, error: 'Failed to issue book' })
  }
})

router.post('/return/:issueId', authMiddleware, checkPermission('manage_library'), async (req, res) => {
  try {
    const { fine = 0 } = req.body
    
    const issue = await prisma.libraryIssue.findUnique({
      where: { id: req.params.issueId },
      include: { library: true }
    })
    
    if (!issue) {
      return res.status(404).json({ success: false, error: 'Issue record not found' })
    }
    
    const updatedIssue = await prisma.libraryIssue.update({
      where: { id: req.params.issueId },
      data: {
        returnDate: new Date(),
        fine,
        status: 'RETURNED'
      }
    })
    
    await prisma.library.update({
      where: { id: issue.libraryId },
      data: { available: issue.library.available + 1 }
    })
    
    res.json({ success: true, data: updatedIssue })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to return book' })
  }
})

router.get('/issues', authMiddleware, async (req, res) => {
  try {
    const issues = await prisma.libraryIssue.findMany({
      where: {
        library: { schoolId: req.user.schoolId }
      },
      include: {
        library: true,
        student: true
      },
      orderBy: { issueDate: 'desc' }
    })
    
    res.json({ success: true, data: issues })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch issues' })
  }
})

router.get('/student/:studentId', authMiddleware, async (req, res) => {
  try {
    const issues = await prisma.libraryIssue.findMany({
      where: { studentId: req.params.studentId },
      include: { library: true },
      orderBy: { issueDate: 'desc' }
    })
    
    res.json({ success: true, data: issues })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch student library records' })
  }
})

export default router
