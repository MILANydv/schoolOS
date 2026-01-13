// ============================================
// React Query Hooks for Admissions
// ============================================

"use client";

import { useMutation, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { admissionsApi } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { toast } from "sonner";

export interface Admission {
  id: string;
  applicantName: string;
  gradeApplyingFor: string;
  applicationDate: string;
  status: string;
  parentPhone?: string | null;
  parentName?: string | null;
  parentEmail?: string | null;
  address?: string | null;
  previousSchool?: string | null;
  interviewDate?: string | null;
  interviewNotes?: string | null;
  admissionFee?: number | null;
  admissionFeePaid?: boolean;
  notes?: string | null;
  admissionNumber?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdmissionFilters {
  status?: string;
}

export function useAdmissions(filters?: AdmissionFilters, options?: Omit<UseQueryOptions<any>, "queryKey" | "queryFn">) {
  return useQuery({
    queryKey: queryKeys.admissions.list(filters),
    queryFn: () => admissionsApi.getAll(filters),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    ...options,
  });
}

export function useAdmission(id: string, options?: Omit<UseQueryOptions<any>, "queryKey" | "queryFn">) {
  return useQuery({
    queryKey: queryKeys.admissions.detail(id),
    queryFn: () => admissionsApi.getById(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    ...options,
  });
}

export function useCreateAdmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Admission>) => admissionsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admissions.all });
      toast.success("Admission created");
    },
    onError: (err) => {
      toast.error("Failed to create admission", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    },
  });
}

export function useUpdateAdmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Admission> }) => admissionsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admissions.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.admissions.all });
      toast.success("Admission updated");
    },
    onError: (err) => {
      toast.error("Failed to update admission", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    },
  });
}

export function useDeleteAdmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => admissionsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admissions.all });
      toast.success("Admission deleted");
    },
    onError: (err) => {
      toast.error("Failed to delete admission", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    },
  });
}

export function useApproveAdmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, classId, rollNumber, section }: { id: string; classId: string; rollNumber: string; section?: string }) =>
      admissionsApi.approve(id, { classId, rollNumber, section }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admissions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.students.all });
      toast.success("Admission approved");
    },
    onError: (err) => {
      toast.error("Failed to approve admission", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    },
  });
}

export function useRejectAdmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => admissionsApi.reject(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admissions.all });
      toast.success("Admission rejected");
    },
    onError: (err) => {
      toast.error("Failed to reject admission", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    },
  });
}
