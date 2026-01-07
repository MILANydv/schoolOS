import { Request, Response, NextFunction } from 'express'

export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  SCHOOL_ADMIN: 'SCHOOL_ADMIN',
  TEACHER: 'TEACHER',
  STUDENT: 'STUDENT',
  PARENT: 'PARENT',
  FINANCE_OFFICER: 'FINANCE_OFFICER',
  ADMISSION_OFFICER: 'ADMISSION_OFFICER',
  NON_TEACHING_STAFF: 'NON_TEACHING_STAFF'
}

export const PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: '*',
  [ROLES.SCHOOL_ADMIN]: [
    'manage_users',
    'manage_students',
    'manage_teachers',
    'manage_classes',
    'manage_fees',
    'manage_admissions',
    'manage_exams',
    'manage_attendance',
    'manage_timetable',
    'manage_library',
    'manage_events',
    'manage_notifications',
    'view_reports',
    'manage_certificates',
    'manage_subjects'
  ],
  [ROLES.TEACHER]: [
    'view_students',
    'view_classes',
    'mark_attendance',
    'create_homework',
    'grade_homework',
    'enter_marks',
    'view_timetable',
    'view_events',
    'send_messages',
    'apply_leave'
  ],
  [ROLES.STUDENT]: [
    'view_profile',
    'view_attendance',
    'view_homework',
    'submit_homework',
    'view_timetable',
    'view_results',
    'view_fees',
    'view_events',
    'view_library',
    'send_messages'
  ],
  [ROLES.PARENT]: [
    'view_child_profile',
    'view_child_attendance',
    'view_child_homework',
    'view_child_results',
    'view_child_fees',
    'pay_fees',
    'view_events',
    'send_messages'
  ],
  [ROLES.FINANCE_OFFICER]: [
    'manage_fees',
    'view_fee_reports',
    'process_payments',
    'generate_receipts',
    'manage_fee_structures'
  ],
  [ROLES.ADMISSION_OFFICER]: [
    'manage_admissions',
    'schedule_interviews',
    'view_applications',
    'approve_admissions'
  ],
  [ROLES.NON_TEACHING_STAFF]: [
    'view_students',
    'view_teachers',
    'view_timetable',
    'view_events'
  ]
}

export const checkPermission = (requiredPermissions: string | string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role

    if (!userRole) {
      return res.status(401).json({ success: false, error: 'Unauthorized' })
    }

    if (userRole === ROLES.SUPER_ADMIN) {
      return next()
    }

    const userPermissions = PERMISSIONS[userRole] || []
    
    if (userPermissions === '*') {
      return next()
    }

    const permissions = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions]
    
    const hasPermission = permissions.some(permission => userPermissions.includes(permission))
    
    if (!hasPermission) {
      return res.status(403).json({ 
        success: false, 
        error: 'Forbidden: You do not have permission to perform this action' 
      })
    }

    next()
  }
}

export const checkRole = (allowedRoles: string | string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role

    if (!userRole) {
      return res.status(401).json({ success: false, error: 'Unauthorized' })
    }

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]
    
    if (!roles.includes(userRole) && userRole !== ROLES.SUPER_ADMIN) {
      return res.status(403).json({ 
        success: false, 
        error: 'Forbidden: Insufficient privileges' 
      })
    }

    next()
  }
}
