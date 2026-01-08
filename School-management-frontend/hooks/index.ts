// ============================================
// React Query Hooks Index
// ============================================

// Students
export {
  useStudents,
  useStudent,
  useStudentStats,
  useStudentAttendance,
  useStudentFees,
  useCreateStudent,
  useUpdateStudent,
  useDeleteStudent,
  prefetchStudent,
  prefetchStudents,
} from './useStudents';

// Teachers
export {
  useTeachers,
  useTeacher,
  useTeacherStats,
  useTeacherAttendance,
  useTeacherTimetable,
  useCreateTeacher,
  useUpdateTeacher,
  useDeleteTeacher,
  prefetchTeacher,
  prefetchTeachers,
} from './useTeachers';

// Staff
export {
  useStaff,
  useStaffMember,
  useStaffSalary,
  useCreateStaff,
  useUpdateStaff,
  useDeleteStaff,
  prefetchStaff,
} from './useStaff';

// Classes
export {
  useClasses,
  useClass,
  useClassStudents,
  useClassTimetable,
  useCreateClass,
  useUpdateClass,
  useDeleteClass,
  prefetchClasses,
} from './useClasses';

// Fees
export {
  useFees,
  useFeeByStudent,
  useFeeByClass,
  useFeeStats,
  useFeeAnalytics,
  useCreateFee,
  useRecordPayment,
  useDeleteFee,
  prefetchFees,
  prefetchFeeStats,
} from './useFees';

// Attendance
export {
  useAttendance,
  useAttendanceByDate,
  useAttendanceByClass,
  useStudentAttendance,
  useAttendanceSummary,
  useStaffAttendance,
  useStaffAttendanceByDate,
  useMarkAttendance,
  useBulkMarkAttendance,
  prefetchAttendance,
  prefetchAttendanceSummary,
} from './useAttendance';

// Notifications
export {
  useNotifications,
  useNotification,
  useUnreadNotifications,
  useNotificationStats,
  useCreateNotification,
  useUpdateNotification,
  useDeleteNotification,
  useMarkNotificationAsRead,
  useBulkMarkNotificationsAsRead,
  prefetchNotifications,
} from './useNotifications';

// Events
export {
  useEvents,
  useEvent,
  useUpcomingEvents,
  useEventsCalendar,
  useEventStats,
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
  prefetchEvents,
} from './useEvents';

// Dashboard
export {
  useDashboardStats,
  useDashboardMetrics,
  useRecentActivities,
  useDashboardAlerts,
  useDashboardOverview,
  prefetchDashboardStats,
  useRefreshDashboard,
} from './useDashboard';

// Schools (Super Admin)
export {
  useSchools,
  useSchool,
  useSchoolStats,
  useCreateSchool,
  useUpdateSchool,
  useDeleteSchool,
} from './useSchools';

// Subscriptions (Super Admin)
export {
  useSubscriptions,
  useSubscription,
  useSchoolSubscription,
  useCreateSubscription,
  useUpdateSubscription,
  useDeleteSubscription,
} from './useSubscriptions';
