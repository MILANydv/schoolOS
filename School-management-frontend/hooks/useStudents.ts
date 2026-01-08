// ============================================
// React Query Hooks for Students
// ============================================

"use client";

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { studentsApi } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { toast } from "sonner";

// Types
interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  class?: {
    id: string;
    name: string;
  };
  rollNumber: string;
  gender: string;
  dateOfBirth: string;
  admissionDate: string;
  status: string;
  parentName?: string;
  parentContact?: string;
  parentEmail?: string;
  address?: string;
  attendance?: number;
  performance?: number;
  fees?: {
    total: number;
    paid: number;
    due: number;
    dueDate: string;
  };
}

interface StudentFilters {
  search?: string;
  status?: string;
  classId?: string;
  gender?: string;
  page?: number;
  pageSize?: number;
}

interface PaginatedStudents {
  data: Student[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Query Hooks
export function useStudents(filters?: StudentFilters, options?: Omit<UseQueryOptions<PaginatedStudents>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: queryKeys.students.list(filters),
    queryFn: () => studentsApi.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    ...options,
  });
}

export function useStudent(id: string, options?: Omit<UseQueryOptions<Student>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: queryKeys.students.detail(id),
    queryFn: () => studentsApi.getById(id),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!id,
    ...options,
  });
}

export function useStudentStats(options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: queryKeys.students.stats,
    queryFn: () => studentsApi.getAll({ stats: true }),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    ...options,
  });
}


export function useStudentFees(studentId: string, options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: queryKeys.students.fees(studentId),
    queryFn: () => studentsApi.getById(studentId).then((res: any) => res.fees),
    staleTime: 2 * 60 * 1000, // 2 minutes - fees change frequently
    gcTime: 5 * 60 * 1000,
    enabled: !!studentId,
    ...options,
  });
}

// Mutation Hooks with Cache Invalidation and Optimistic Updates
export function useCreateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Student>) => studentsApi.create(data),
    onMutate: async (newStudent) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: queryKeys.students.all });

      // Snapshot previous value
      const previousStudents = queryClient.getQueryData<PaginatedStudents>(queryKeys.students.list());

      // Optimistically update
      queryClient.setQueryData<PaginatedStudents>(queryKeys.students.list(), (old) => {
        if (!old) return old;
        return {
          ...old,
          data: [
            {
              ...newStudent,
              id: `temp-${Date.now()}`,
            } as Student,
            ...old.data,
          ],
          total: old.total + 1,
        };
      });

      // Also invalidate list to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.students.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.students.stats });

      return { previousStudents };
    },
    onError: (err, newStudent, context) => {
      // Rollback
      if (context?.previousStudents) {
        queryClient.setQueryData(queryKeys.students.list(), context.previousStudents);
      }
      toast.error("Failed to create student", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    },
    onSettled: (data, error) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.students.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });

      if (!error) {
        toast.success("Student created successfully");
      }
    },
  });
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Student> }) =>
      studentsApi.update(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: queryKeys.students.detail(id) });
      await queryClient.cancelQueries({ queryKey: queryKeys.students.list() });

      // Snapshot previous values
      const previousStudent = queryClient.getQueryData<Student>(queryKeys.students.detail(id));
      const previousStudents = queryClient.getQueryData<PaginatedStudents>(queryKeys.students.list());

      // Optimistically update detail
      if (previousStudent) {
        queryClient.setQueryData<Student>(queryKeys.students.detail(id), (old) => {
          if (!old) return old;
          return { ...old, ...data };
        });
      }

      // Optimistically update list
      if (previousStudents) {
        queryClient.setQueryData<PaginatedStudents>(queryKeys.students.list(), (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((student) =>
              student.id === id ? { ...student, ...data } : student
            ),
          };
        });
      }

      return { previousStudent, previousStudents };
    },
    onError: (err, { id }, context) => {
      if (context?.previousStudent) {
        queryClient.setQueryData(queryKeys.students.detail(id), context.previousStudent);
      }
      if (context?.previousStudents) {
        queryClient.setQueryData(queryKeys.students.list(), context.previousStudents);
      }
      toast.error("Failed to update student", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    },
    onSettled: (data, error, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.students.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.students.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.students.stats });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });

      if (!error) {
        toast.success("Student updated successfully");
      }
    },
  });
}

export function useDeleteStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => studentsApi.delete(id),
    onMutate: async (id) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: queryKeys.students.list() });
      await queryClient.cancelQueries({ queryKey: queryKeys.students.detail(id) });
      await queryClient.cancelQueries({ queryKey: queryKeys.students.stats });

      // Snapshot previous value
      const previousStudents = queryClient.getQueryData<PaginatedStudents>(queryKeys.students.list());

      // Optimistically update
      if (previousStudents) {
        queryClient.setQueryData<PaginatedStudents>(queryKeys.students.list(), (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((student) => student.id !== id),
            total: old.total - 1,
          };
        });
      }

      return { previousStudents };
    },
    onError: (err, id, context) => {
      if (context?.previousStudents) {
        queryClient.setQueryData(queryKeys.students.list(), context.previousStudents);
      }
      toast.error("Failed to delete student", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    },
    onSettled: (data, error, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.students.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });

      if (!error) {
        toast.success("Student deleted successfully");
      }
    },
  });
}

// Prefetch Helpers
export function prefetchStudent(queryClient: ReturnType<typeof useQueryClient>, id: string) {
  return queryClient.prefetchQuery({
    queryKey: queryKeys.students.detail(id),
    queryFn: () => studentsApi.getById(id),
    staleTime: 5 * 60 * 1000,
  });
}

export function prefetchStudents(queryClient: ReturnType<typeof useQueryClient>, filters?: StudentFilters) {
  return queryClient.prefetchQuery({
    queryKey: queryKeys.students.list(filters),
    queryFn: () => studentsApi.getAll(filters),
    staleTime: 5 * 60 * 1000,
  });
}
