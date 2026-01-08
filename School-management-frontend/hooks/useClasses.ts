// ============================================
// React Query Hooks for Classes
// ============================================

"use client";

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { classesApi } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { toast } from "sonner";

// Types
interface Class {
  id: string;
  name: string;
  section: string;
  grade: string;
  capacity: number;
  enrolled: number;
  classTeacher?: string;
  subjects?: string[];
  department?: string;
  roomNo?: string;
  schedule?: string;
  status: string;
  averageAttendance?: number;
  performance?: number;
  academicYear?: string;
  createdAt?: string;
}

interface ClassFilters {
  search?: string;
  status?: string;
  grade?: string;
  department?: string;
  page?: number;
  pageSize?: number;
}

interface PaginatedClasses {
  data: Class[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Query Hooks
export function useClasses(filters?: ClassFilters, options?: Omit<UseQueryOptions<PaginatedClasses>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: queryKeys.classes.list(filters),
    queryFn: () => classesApi.getAll(filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
}

export function useClass(id: string, options?: Omit<UseQueryOptions<Class>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: queryKeys.classes.detail(id),
    queryFn: () => classesApi.getAll().then((res: any) => res.data.find((c: Class) => c.id === id)),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!id,
    ...options,
  });
}

export function useClassStudents(classId: string, options?: Omit<UseQueryOptions<any[]>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: queryKeys.classes.students(classId),
    queryFn: () => classesApi.getAll().then((res: any) => res.data.find((c: Class) => c.id === classId)?.students || []),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!classId,
    ...options,
  });
}

export function useClassTimetable(classId: string, options?: Omit<UseQueryOptions<any[]>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: queryKeys.classes.timetable(classId),
    queryFn: () => classesApi.getAll().then((res: any) => res.data.find((c: Class) => c.id === classId)?.timetable || []),
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    enabled: !!classId,
    ...options,
  });
}

// Mutation Hooks
export function useCreateClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Class>) => classesApi.create(data),
    onMutate: async (newClass) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.classes.all });

      const previousClasses = queryClient.getQueryData<PaginatedClasses>(queryKeys.classes.list());

      queryClient.setQueryData<PaginatedClasses>(queryKeys.classes.list(), (old) => {
        if (!old) return old;
        return {
          ...old,
          data: [
            { ...newClass, id: `temp-${Date.now()}` } as Class,
            ...old.data,
          ],
          total: old.total + 1,
        };
      });

      return { previousClasses };
    },
    onError: (err, _, context) => {
      if (context?.previousClasses) {
        queryClient.setQueryData(queryKeys.classes.list(), context.previousClasses);
      }
      toast.error("Failed to create class", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.classes.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });

      toast.success("Class created successfully");
    },
  });
}

export function useUpdateClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Class> }) =>
      classesApi.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.classes.detail(id) });
      await queryClient.cancelQueries({ queryKey: queryKeys.classes.list() });

      const previousClass = queryClient.getQueryData<Class>(queryKeys.classes.detail(id));
      const previousClasses = queryClient.getQueryData<PaginatedClasses>(queryKeys.classes.list());

      if (previousClass) {
        queryClient.setQueryData<Class>(queryKeys.classes.detail(id), (old) => {
          if (!old) return old;
          return { ...old, ...data };
        });
      }

      return { previousClass, previousClasses };
    },
    onError: (err, { id }, context) => {
      if (context?.previousClass) {
        queryClient.setQueryData(queryKeys.classes.detail(id), context.previousClass);
      }
      toast.error("Failed to update class", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    },
    onSettled: (data, error, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.classes.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.classes.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });

      if (!error) {
        toast.success("Class updated successfully");
      }
    },
  });
}

export function useDeleteClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => classesApi.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.classes.list() });
      await queryClient.cancelQueries({ queryKey: queryKeys.classes.detail(id) });

      const previousClasses = queryClient.getQueryData<PaginatedClasses>(queryKeys.classes.list());

      if (previousClasses) {
        queryClient.setQueryData<PaginatedClasses>(queryKeys.classes.list(), (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((classItem) => classItem.id !== id),
            total: old.total - 1,
          };
        });
      }

      return { previousClasses };
    },
    onError: (err, id, context) => {
      if (context?.previousClasses) {
        queryClient.setQueryData(queryKeys.classes.list(), context.previousClasses);
      }
      toast.error("Failed to delete class", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    },
    onSettled: (data, error) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.classes.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });

      if (!error) {
        toast.success("Class deleted successfully");
      }
    },
  });
}

// Prefetch Helpers
export function prefetchClasses(queryClient: ReturnType<typeof useQueryClient>, filters?: ClassFilters) {
  return queryClient.prefetchQuery({
    queryKey: queryKeys.classes.list(filters),
    queryFn: () => classesApi.getAll(filters),
    staleTime: 5 * 60 * 1000,
  });
}
