// ============================================
// React Query Hooks for Teachers
// ============================================

"use client";

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { teachersApi } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { toast } from "sonner";

// Types
interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department: string;
  subject?: string;
  status: string;
  joinDate: string;
  qualification?: string;
  experience?: number;
  role?: string;
}

interface TeacherFilters {
  search?: string;
  status?: string;
  department?: string;
  page?: number;
  pageSize?: number;
}

interface PaginatedTeachers {
  data: Teacher[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Query Hooks
export function useTeachers(filters?: TeacherFilters, options?: Omit<UseQueryOptions<PaginatedTeachers>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: queryKeys.teachers.list(filters),
    queryFn: () => teachersApi.getAll(filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
}

export function useTeacher(id: string, options?: Omit<UseQueryOptions<Teacher>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: queryKeys.teachers.detail(id),
    queryFn: () => teachersApi.getById ? teachersApi.getById(id) : teachersApi.getAll().then((res: any) => res.data.find((t: Teacher) => t.id === id)),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!id,
    ...options,
  });
}

export function useTeacherStats(options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: queryKeys.teachers.stats,
    queryFn: () => teachersApi.getAll({ stats: true }),
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    ...options,
  });
}

export function useTeacherAttendance(teacherId: string, options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: queryKeys.teachers.attendance(teacherId),
    queryFn: () => teachersApi.getAll().then((res: any) => res.data.find((t: Teacher) => t.id === teacherId)?.attendance || 0),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    enabled: !!teacherId,
    ...options,
  });
}

export function useTeacherTimetable(teacherId: string, options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: queryKeys.teachers.timetable(teacherId),
    queryFn: () => teachersApi.getAll().then((res: any) => res.data.find((t: Teacher) => t.id === teacherId)?.timetable || []),
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    enabled: !!teacherId,
    ...options,
  });
}

// Mutation Hooks with Cache Invalidation
export function useCreateTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Teacher>) => teachersApi.create(data),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKeys.teachers.all });
      const previousTeachers = queryClient.getQueryData<PaginatedTeachers>(queryKeys.teachers.list());

      queryClient.setQueryData<PaginatedTeachers>(queryKeys.teachers.list(), (old) => {
        if (!old) return old;
        return {
          ...old,
          total: old.total + 1,
        };
      });

      return { previousTeachers };
    },
    onError: (err, _, context) => {
      if (context?.previousTeachers) {
        queryClient.setQueryData(queryKeys.teachers.list(), context.previousTeachers);
      }
      toast.error("Failed to create teacher", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.teachers.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });

      toast.success("Teacher created successfully");
    },
  });
}

export function useUpdateTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Teacher> }) =>
      teachersApi.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.teachers.detail(id) });
      await queryClient.cancelQueries({ queryKey: queryKeys.teachers.list() });

      const previousTeacher = queryClient.getQueryData<Teacher>(queryKeys.teachers.detail(id));
      const previousTeachers = queryClient.getQueryData<PaginatedTeachers>(queryKeys.teachers.list());

      if (previousTeacher) {
        queryClient.setQueryData<Teacher>(queryKeys.teachers.detail(id), (old) => {
          if (!old) return old;
          return { ...old, ...data };
        });
      }

      return { previousTeacher, previousTeachers };
    },
    onError: (err, { id }, context) => {
      if (context?.previousTeacher) {
        queryClient.setQueryData(queryKeys.teachers.detail(id), context.previousTeacher);
      }
      toast.error("Failed to update teacher", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    },
    onSettled: (data, error, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.teachers.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.teachers.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });

      if (!error) {
        toast.success("Teacher updated successfully");
      }
    },
  });
}

export function useDeleteTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => teachersApi.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.teachers.list() });
      await queryClient.cancelQueries({ queryKey: queryKeys.teachers.detail(id) });

      const previousTeachers = queryClient.getQueryData<PaginatedTeachers>(queryKeys.teachers.list());

      if (previousTeachers) {
        queryClient.setQueryData<PaginatedTeachers>(queryKeys.teachers.list(), (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((teacher) => teacher.id !== id),
            total: old.total - 1,
          };
        });
      }

      return { previousTeachers };
    },
    onError: (err, id, context) => {
      if (context?.previousTeachers) {
        queryClient.setQueryData(queryKeys.teachers.list(), context.previousTeachers);
      }
      toast.error("Failed to delete teacher", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    },
    onSettled: (data, error) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.teachers.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });

      if (!error) {
        toast.success("Teacher deleted successfully");
      }
    },
  });
}

// Prefetch Helpers
export function prefetchTeacher(queryClient: ReturnType<typeof useQueryClient>, id: string) {
  return queryClient.prefetchQuery({
    queryKey: queryKeys.teachers.detail(id),
    queryFn: () => teachersApi.getAll().then((res: any) => res.data.find((t: Teacher) => t.id === id)),
    staleTime: 5 * 60 * 1000,
  });
}

export function prefetchTeachers(queryClient: ReturnType<typeof useQueryClient>, filters?: TeacherFilters) {
  return queryClient.prefetchQuery({
    queryKey: queryKeys.teachers.list(filters),
    queryFn: () => teachersApi.getAll(filters),
    staleTime: 5 * 60 * 1000,
  });
}
