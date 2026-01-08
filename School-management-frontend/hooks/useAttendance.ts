// ============================================
// React Query Hooks for Attendance
// ============================================

"use client";

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { attendanceApi } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { toast } from "sonner";

// Types
interface AttendanceRecord {
  id: string;
  studentId: string;
  student?: {
    id: string;
    name: string;
    class?: string;
    rollNumber?: string;
  };
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
  remarks?: string;
}

interface StaffAttendanceRecord {
  id: string;
  staffId: string;
  staff?: {
    id: string;
    name: string;
    department: string;
    role: string;
  };
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
  reason?: string;
  checkInTime?: string;
  checkOutTime?: string;
}

interface AttendanceFilters {
  date?: string;
  classId?: string;
  status?: string;
  studentId?: string;
  page?: number;
  pageSize?: number;
}

interface AttendanceSummary {
  total: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  attendanceRate: number;
}

interface PaginatedAttendance {
  data: AttendanceRecord[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Query Hooks
export function useAttendance(filters?: AttendanceFilters, options?: Omit<UseQueryOptions<PaginatedAttendance>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: queryKeys.attendance.list(filters),
    queryFn: () => attendanceApi.getAll(filters),
    staleTime: 1 * 60 * 1000, // 1 minute - attendance changes frequently during marking
    gcTime: 3 * 60 * 1000,
    ...options,
  });
}

export function useAttendanceByDate(date: string, options?: Omit<UseQueryOptions<PaginatedAttendance>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: queryKeys.attendance.byDate(date),
    queryFn: () => attendanceApi.getAll({ date }),
    staleTime: 1 * 60 * 1000,
    gcTime: 3 * 60 * 1000,
    enabled: !!date,
    ...options,
  });
}

export function useAttendanceByClass(classId: string, date?: string, options?: Omit<UseQueryOptions<PaginatedAttendance>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: queryKeys.attendance.byClass(classId, date),
    queryFn: () => attendanceApi.getAll({ classId, date }),
    staleTime: 1 * 60 * 1000,
    gcTime: 3 * 60 * 1000,
    enabled: !!classId,
    ...options,
  });
}

export function useStudentAttendance(studentId: string, options?: Omit<UseQueryOptions<AttendanceRecord[]>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: queryKeys.attendance.byStudent(studentId),
    queryFn: () => attendanceApi.getByStudent(studentId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!studentId,
    ...options,
  });
}

export function useAttendanceSummary(filters?: AttendanceFilters, options?: Omit<UseQueryOptions<AttendanceSummary>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: queryKeys.attendance.summary(filters),
    queryFn: () => attendanceApi.getAll({ ...filters, summary: true }),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    ...options,
  });
}

// Staff Attendance Hooks
export function useStaffAttendance(filters?: AttendanceFilters, options?: Omit<UseQueryOptions<PaginatedAttendance>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: queryKeys.attendance.staff,
    queryFn: () => attendanceApi.getAll({ ...filters, type: 'staff' }),
    staleTime: 1 * 60 * 1000,
    gcTime: 3 * 60 * 1000,
    ...options,
  });
}

export function useStaffAttendanceByDate(date: string, options?: Omit<UseQueryOptions<StaffAttendanceRecord[]>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: queryKeys.attendance.staffByDate(date),
    queryFn: () => attendanceApi.getAll({ date, type: 'staff' }),
    staleTime: 1 * 60 * 1000,
    gcTime: 3 * 60 * 1000,
    enabled: !!date,
    ...options,
  });
}

// Mutation Hooks
export function useMarkAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<AttendanceRecord>) => attendanceApi.mark(data),
    onMutate: async (newRecord) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.attendance.all });
      await queryClient.cancelQueries({ queryKey: queryKeys.attendance.summary() });

      const previousAttendance = queryClient.getQueryData<PaginatedAttendance>(queryKeys.attendance.list());
      const date = newRecord.date || new Date().toISOString().split('T')[0];

      queryClient.setQueryData<PaginatedAttendance>(queryKeys.attendance.list(), (old) => {
        if (!old) return old;
        return {
          ...old,
          data: [
            { ...newRecord, id: `temp-${Date.now()}` } as AttendanceRecord,
            ...old.data,
          ],
          total: old.total + 1,
        };
      });

      return { previousAttendance };
    },
    onError: (err, _, context) => {
      if (context?.previousAttendance) {
        queryClient.setQueryData(queryKeys.attendance.list(), context.previousAttendance);
      }
      toast.error("Failed to mark attendance", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.attendance.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.attendance.summary() });

      toast.success("Attendance marked successfully");
    },
  });
}

export function useBulkMarkAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<AttendanceRecord>[]) => Promise.all(data.map(record => attendanceApi.mark(record))),
    onMutate: async (records) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.attendance.all });
      await queryClient.cancelQueries({ queryKey: queryKeys.attendance.summary() });

      const previousAttendance = queryClient.getQueryData<PaginatedAttendance>(queryKeys.attendance.list());
      const date = records[0]?.date || new Date().toISOString().split('T')[0];

      queryClient.setQueryData<PaginatedAttendance>(queryKeys.attendance.list(), (old) => {
        if (!old) return old;
        return {
          ...old,
          data: [
            ...records.map(record => ({ ...record, id: `temp-${Date.now()}-${Math.random()}` } as AttendanceRecord)),
            ...old.data,
          ],
          total: old.total + records.length,
        };
      });

      return { previousAttendance };
    },
    onError: (err, _, context) => {
      if (context?.previousAttendance) {
        queryClient.setQueryData(queryKeys.attendance.list(), context.previousAttendance);
      }
      toast.error("Failed to mark attendance", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.attendance.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.attendance.summary() });

      toast.success("Attendance marked successfully");
    },
  });
}

// Prefetch Helpers
export function prefetchAttendance(queryClient: ReturnType<typeof useQueryClient>, filters?: AttendanceFilters) {
  return queryClient.prefetchQuery({
    queryKey: queryKeys.attendance.list(filters),
    queryFn: () => attendanceApi.getAll(filters),
    staleTime: 1 * 60 * 1000,
  });
}

export function prefetchAttendanceSummary(queryClient: ReturnType<typeof useQueryClient>, filters?: AttendanceFilters) {
  return queryClient.prefetchQuery({
    queryKey: queryKeys.attendance.summary(filters),
    queryFn: () => attendanceApi.getAll({ ...filters, summary: true }),
    staleTime: 2 * 60 * 1000,
  });
}
