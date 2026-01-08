// ============================================
// React Query Hooks for Staff Management
// ============================================

"use client";

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { staffApi } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { toast } from "sonner";

// Types
interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department: string;
  role: string;
  status: string;
  joinDate: string;
  salary?: {
    basic: number;
    allowances: number;
    deductions: number;
    net: number;
  };
}

interface StaffFilters {
  search?: string;
  status?: string;
  department?: string;
  role?: string;
  page?: number;
  pageSize?: number;
}

interface PaginatedStaff {
  data: Staff[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface SalaryRecord {
  id: string;
  staffId: string;
  period: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  paidDate?: string;
  remarks?: string;
}

// Query Hooks
export function useStaff(filters?: StaffFilters, options?: Omit<UseQueryOptions<PaginatedStaff>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: queryKeys.staff.list(filters),
    queryFn: () => staffApi.getAll(filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
}

export function useStaffMember(id: string, options?: Omit<UseQueryOptions<Staff>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: queryKeys.staff.detail(id),
    queryFn: () => staffApi.getById(id),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!id,
    ...options,
  });
}

export function useStaffSalary(staffId: string, options?: Omit<UseQueryOptions<SalaryRecord[]>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: queryKeys.staff.salary(staffId),
    queryFn: () => staffApi.getSalary(staffId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!staffId,
    ...options,
  });
}

// Mutation Hooks
export function useCreateStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Staff>) => staffApi.create(data),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKeys.staff.all });

      const previousStaff = queryClient.getQueryData<PaginatedStaff>(queryKeys.staff.list());

      queryClient.setQueryData<PaginatedStaff>(queryKeys.staff.list(), (old) => {
        if (!old) return old;
        return {
          ...old,
          total: old.total + 1,
        };
      });

      return { previousStaff };
    },
    onError: (err, _, context) => {
      if (context?.previousStaff) {
        queryClient.setQueryData(queryKeys.staff.list(), context.previousStaff);
      }
      toast.error("Failed to create staff member", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.staff.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });

      toast.success("Staff member created successfully");
    },
  });
}

export function useUpdateStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Staff> }) =>
      staffApi.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.staff.detail(id) });
      await queryClient.cancelQueries({ queryKey: queryKeys.staff.list() });

      const previousStaff = queryClient.getQueryData<Staff>(queryKeys.staff.detail(id));

      if (previousStaff) {
        queryClient.setQueryData<Staff>(queryKeys.staff.detail(id), (old) => {
          if (!old) return old;
          return { ...old, ...data };
        });
      }

      return { previousStaff };
    },
    onError: (err, { id }, context) => {
      if (context?.previousStaff) {
        queryClient.setQueryData(queryKeys.staff.detail(id), context.previousStaff);
      }
      toast.error("Failed to update staff member", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    },
    onSettled: (data, error, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.staff.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.staff.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });

      if (!error) {
        toast.success("Staff member updated successfully");
      }
    },
  });
}

export function useDeleteStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => staffApi.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.staff.list() });
      await queryClient.cancelQueries({ queryKey: queryKeys.staff.detail(id) });

      const previousStaff = queryClient.getQueryData<PaginatedStaff>(queryKeys.staff.list());

      if (previousStaff) {
        queryClient.setQueryData<PaginatedStaff>(queryKeys.staff.list(), (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((staff) => staff.id !== id),
            total: old.total - 1,
          };
        });
      }

      return { previousStaff };
    },
    onError: (err, id, context) => {
      if (context?.previousStaff) {
        queryClient.setQueryData(queryKeys.staff.list(), context.previousStaff);
      }
      toast.error("Failed to delete staff member", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    },
    onSettled: (data, error) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.staff.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });

      if (!error) {
        toast.success("Staff member deleted successfully");
      }
    },
  });
}

// Prefetch Helpers
export function prefetchStaff(queryClient: ReturnType<typeof useQueryClient>, filters?: StaffFilters) {
  return queryClient.prefetchQuery({
    queryKey: queryKeys.staff.list(filters),
    queryFn: () => staffApi.getAll(filters),
    staleTime: 5 * 60 * 1000,
  });
}
