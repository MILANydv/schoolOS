import { Router } from 'express'
import prisma from '../utils/prisma'
import { authMiddleware } from '../middleware/auth'
import { checkPermission } from '../middleware/rbac'

const router = Router()

router.get('/', authMiddleware, async (req, res) => {
  try {
    const exams = await prisma.exam.findMany({
      where: { schoolId: req.user.schoolId },
      include: {
        class: true,
        subject: true,
        results: true
      },
      orderBy: { date: 'asc' }
    })
    res.json({ success: true, data: exams })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch exams' })
  }
})

router.get('/class/:classId', authMiddleware, async (req, res) => {
  try {
    const exams = await prisma.exam.findMany({
      where: {
        classId: req.params.classId,
        schoolId: req.user.schoolId
      },
      include: {
        class: true,
        subject: true,
        results: true
      },
      orderBy: { date: 'asc' }
    })
    res.json({ success: true, data: exams })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch exams' })
  }
})

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const exam = await prisma.exam.findUnique({
      where: { id: req.params.id },
      include: {
        class: true,
        subject: true,
        results: {
          include: {
            student: true
          }
        }
      }
    })
    
    if (!exam) {
      return res.status(404).json({ success: false, error: 'Exam not found' })
    }
    
    res.json({ success: true, data: exam })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch exam' })
  }
})

router.post('/', authMiddleware, checkPermission('manage_exams'), async (req, res) => {
  try {
    const { classId, subjectId, name, date, startTime, endTime, duration, totalMarks, passingMarks, type } = req.body
    
    const exam = await prisma.exam.create({
      data: {
        schoolId: req.user.schoolId,
        classId,
        subjectId,
        name,
        date: new Date(date),
        startTime,
        endTime,
        duration,
        totalMarks,
        passingMarks,
        type
      },
      include: {
        class: true,
        subject: true
      }
    })
    
    res.json({ success: true, data: exam })
  } catch (error) {
    console.error('Create exam error:', error)
    res.status(500).json({ success: false, error: 'Failed to create exam' })
  }
})

router.put('/:id', authMiddleware, checkPermission('manage_exams'), async (req, res) => {
  try {
    const { name, date, startTime, endTime, duration, totalMarks, passingMarks, type } = req.body
    
    const exam = await prisma.exam.update({
      where: { id: req.params.id },
      data: {
        name,
        date: date ? new Date(date) : undefined,
        startTime,
        endTime,
        duration,
        totalMarks,
        passingMarks,
        type
      }
    })
    
    res.json({ success: true, data: exam })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update exam' })
  }
})

router.delete('/:id', authMiddleware, checkPermission('manage_exams'), async (req, res) => {
  try {
    await prisma.exam.delete({
      where: { id: req.params.id }
    })
    
    res.json({ success: true, message: 'Exam deleted' })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete exam' })
  }
})

router.post('/:id/results', authMiddleware, checkPermission('enter_marks'), async (req, res) => {
  try {
    const { studentId, marksObtained, remarks } = req.body
    
    const exam = await prisma.exam.findUnique({
      where: { id: req.params.id }
    })
    
    if (!exam) {
      return res.status(404).json({ success: false, error: 'Exam not found' })
    }
    
    const percentage = (marksObtained / exam.totalMarks) * 100
    
    let grade = 'F'
    if (percentage >= 90) grade = 'A+'
    else if (percentage >= 80) grade = 'A'
    else if (percentage >= 70) grade = 'B+'
    else if (percentage >= 60) grade = 'B'
    else if (percentage >= 50) grade = 'C+'
    else if (percentage >= 40) grade = 'C'
    else if (percentage >= 33) grade = 'D'
    
    const result = await prisma.result.create({
      data: {
        examId: req.params.id,
        studentId,
        marksObtained,
        grade,
        percentage,
        remarks,
        isPublished: false
      },
      include: {
        student: true,
        exam: true
      }
    })
    
    res.json({ success: true, data: result })
  } catch (error) {
    console.error('Create result error:', error)
    res.status(500).json({ success: false, error: 'Failed to create result' })
  }
})

router.put('/results/:resultId', authMiddleware, checkPermission('enter_marks'), async (req, res) => {
  try {
    const { marksObtained, remarks } = req.body
    
    const existingResult = await prisma.result.findUnique({
      where: { id: req.params.resultId },
      include: { exam: true }
    })
    
    if (!existingResult) {
      return res.status(404).json({ success: false, error: 'Result not found' })
    }
    
    const percentage = (marksObtained / existingResult.exam.totalMarks) * 100
    
    let grade = 'F'
    if (percentage >= 90) grade = 'A+'
    else if (percentage >= 80) grade = 'A'
    else if (percentage >= 70) grade = 'B+'
    else if (percentage >= 60) grade = 'B'
    else if (percentage >= 50) grade = 'C+'
    else if (percentage >= 40) grade = 'C'
    else if (percentage >= 33) grade = 'D'
    
    const result = await prisma.result.update({
      where: { id: req.params.resultId },
      data: {
        marksObtained,
        grade,
        percentage,
        remarks
      }
    })
    
    res.json({ success: true, data: result })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update result' })
  }
})

router.post('/:id/publish', authMiddleware, checkPermission('manage_exams'), async (req, res) => {
  try {
    await prisma.result.updateMany({
      where: { examId: req.params.id },
      data: { isPublished: true }
    })
    
    res.json({ success: true, message: 'Results published' })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to publish results' })
  }
})

router.get('/student/:studentId/results', authMiddleware, async (req, res) => {
  try {
    const results = await prisma.result.findMany({
      where: {
        studentId: req.params.studentId,
        isPublished: true
      },
      include: {
        exam: {
          include: {
            class: true,
            subject: true
          }
        }
      },
      orderBy: { exam: { date: 'desc' } }
    })

    res.json({ success: true, data: results })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch student results' })
  }
})

router.get('/student/:studentId/report-card', authMiddleware, async (req, res) => {
  try {
    const { academicYear, term } = req.query

    const student = await prisma.student.findUnique({
      where: { id: req.params.studentId },
      include: {
        class: true,
        parent: {
          include: { user: true }
        }
      }
    })

    if (!student || student.schoolId !== req.user.schoolId) {
      return res.status(404).json({ success: false, error: 'Student not found' })
    }

    const results = await prisma.result.findMany({
      where: {
        studentId: req.params.studentId,
        isPublished: true
      },
      include: {
        exam: {
          include: {
            subject: true
          }
        }
      },
      orderBy: { exam: { date: 'asc' } }
    })

    let filteredResults = results
    if (term !== undefined) {
      filteredResults = results.filter((r: any) => r.exam.type === term)
    }

    if (filteredResults.length === 0) {
      return res.status(404).json({ success: false, error: 'No published results found for this student' })
    }

    const groupedResults: any = {}
    let totalMarksObtained = 0
    let totalMaxMarks = 0
    let subjectCount = 0

    filteredResults.forEach(result => {
      const subjectId = result.exam.subject.id
      const subjectName = result.exam.subject.name

      if (!groupedResults[subjectId]) {
        groupedResults[subjectId] = {
          subject: subjectName,
          code: result.exam.subject.code,
          exams: []
        }
      }

      groupedResults[subjectId].exams.push({
        examName: result.exam.name,
        examType: result.exam.type,
        maxMarks: result.exam.totalMarks,
        marksObtained: result.marksObtained,
        grade: result.grade,
        percentage: result.percentage,
        remarks: result.remarks
      })

      totalMarksObtained += result.marksObtained
      totalMaxMarks += result.exam.totalMarks
      subjectCount++
    })

    const overallPercentage = totalMaxMarks > 0 ? (totalMarksObtained / totalMaxMarks) * 100 : 0

    let overallGrade = 'F'
    if (overallPercentage >= 90) overallGrade = 'A+'
    else if (overallPercentage >= 80) overallGrade = 'A'
    else if (overallPercentage >= 70) overallGrade = 'B+'
    else if (overallPercentage >= 60) overallGrade = 'B'
    else if (overallPercentage >= 50) overallGrade = 'C+'
    else if (overallPercentage >= 40) overallGrade = 'C'
    else if (overallPercentage >= 33) overallGrade = 'D'

    const school = await prisma.school.findUnique({
      where: { id: req.user.schoolId }
    })

    const reportCard = {
      student: {
        id: student.id,
        name: `${student.firstName} ${student.lastName}`,
        rollNumber: student.rollNumber,
        class: student.class.name,
        section: student.section,
        admissionNumber: student.admissionNumber,
        dateOfBirth: student.dateOfBirth
      },
      parent: {
        name: student.parentName,
        phone: student.parentPhone
      },
      school: {
        name: school?.name,
        address: school?.address,
        phone: school?.phone
      },
      academicYear,
      term,
      generatedDate: new Date().toISOString(),
      results: Object.values(groupedResults),
      summary: {
        totalSubjects: subjectCount,
        totalMarksObtained,
        totalMaxMarks,
        overallPercentage: parseFloat(overallPercentage.toFixed(2)),
        overallGrade,
        position: null
      },
      attendance: {
        totalDays: 0,
        presentDays: 0,
        percentage: 0
      },
      remarks: 'Good performance. Keep up the hard work!'
    }

    res.json({ success: true, data: reportCard })
  } catch (error) {
    console.error('Generate report card error:', error)
    res.status(500).json({ success: false, error: 'Failed to generate report card' })
  }
})

router.get('/class/:classId/report-cards', authMiddleware, checkPermission('view_reports'), async (req, res) => {
  try {
    const { academicYear } = req.query

    const students = await prisma.student.findMany({
      where: {
        classId: req.params.classId,
        schoolId: req.user.schoolId
      },
      include: {
        class: true,
        results: {
          where: {
            isPublished: true
          },
          include: {
            exam: {
              include: {
                subject: true
              }
            }
          }
        }
      }
    })

    const reportCards = students.map(student => {
      const studentResults = student.results.filter(
        r => !academicYear || r.exam.type === academicYear
      )

      const totalMarksObtained = studentResults.reduce((sum, r) => sum + r.marksObtained, 0)
      const totalMaxMarks = studentResults.reduce((sum, r) => sum + r.exam.totalMarks, 0)
      const overallPercentage = totalMaxMarks > 0 ? (totalMarksObtained / totalMaxMarks) * 100 : 0

      return {
        studentId: student.id,
        studentName: `${student.firstName} ${student.lastName}`,
        rollNumber: student.rollNumber,
        totalMarksObtained,
        totalMaxMarks,
        overallPercentage: parseFloat(overallPercentage.toFixed(2)),
        grade: studentResults[0]?.grade || 'N/A'
      }
    }).sort((a, b) => b.overallPercentage - a.overallPercentage)

    res.json({ success: true, data: reportCards })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate class report cards' })
  }
})

export default router
