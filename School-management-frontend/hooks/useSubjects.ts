// ============================================
// React Query Hooks for Subjects
// ============================================

"use client";

import { useMutation, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { subjectsApi } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { toast } from "sonner";

export interface Subject {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
  classSubjects?: Array<{
    id: string;
    class?: { id: string; name: string; grade: string; section: string };
    teacher?: { id: string; user?: { firstName: string; lastName: string } } | null;
  }>;
}

export interface ClassSubject {
  id: string;
  classId: string;
  subjectId: string;
  teacherId?: string | null;
  class?: { id: string; name: string; grade: string; section: string };
  subject?: Subject;
  teacher?: { id: string; user?: { firstName: string; lastName: string } } | null;
}

export interface SubjectFilters {
  search?: string;
}

export function useSubjects(filters?: SubjectFilters, options?: Omit<UseQueryOptions<any>, "queryKey" | "queryFn">) {
  return useQuery({
    queryKey: queryKeys.subjects.list(filters),
    queryFn: () => subjectsApi.getAll(filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
}

export function useSubject(id: string, options?: Omit<UseQueryOptions<any>, "queryKey" | "queryFn">) {
  return useQuery({
    queryKey: queryKeys.subjects.detail(id),
    queryFn: () => subjectsApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
}

export function useCreateSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Pick<Subject, "name" | "code" | "description">) => subjectsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subjects.all });
      toast.success("Subject created");
    },
    onError: (err) => {
      toast.error("Failed to create subject", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    },
  });
}

export function useUpdateSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Subject> }) => subjectsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subjects.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.subjects.all });
      toast.success("Subject updated");
    },
    onError: (err) => {
      toast.error("Failed to update subject", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    },
  });
}

export function useDeleteSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => subjectsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subjects.all });
      toast.success("Subject deleted");
    },
    onError: (err) => {
      toast.error("Failed to delete subject", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    },
  });
}

export function useAssignSubjectToClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { classId: string; subjectId: string; teacherId?: string | null }) =>
      subjectsApi.assignToClass(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subjects.all });
      toast.success("Subject assigned to class");
    },
    onError: (err) => {
      toast.error("Failed to assign subject", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    },
  });
}

export function useRemoveSubjectFromClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (classSubjectId: string) => subjectsApi.removeFromClass(classSubjectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subjects.all });
      toast.success("Subject removed from class");
    },
    onError: (err) => {
      toast.error("Failed to remove subject", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    },
  });
}
