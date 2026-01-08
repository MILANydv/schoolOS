// ============================================
// React Query Hooks for Fees
// ============================================

"use client";

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { feesApi } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { toast } from "sonner";

// Types
interface Fee {
  id: string;
  studentId: string;
  student?: {
    id: string;
    name: string;
    class?: string;
  };
  feeType: string;
  amount: number;
  paid: number;
  due: number;
  status: 'Paid' | 'Partial' | 'Due' | 'Overdue';
  dueDate: string;
  lastPayment?: string;
  paymentMethod?: string;
  installments?: number;
  currentInstallment?: number;
  lateFee?: number;
  discount?: number;
  scholarshipAmount?: number;
  notes?: string;
}

interface FeeFilters {
  search?: string;
  status?: string;
  classId?: string;
  feeType?: string;
  page?: number;
  pageSize?: number;
}

interface FeeStats {
  totalExpected: number;
  totalCollected: number;
  totalDue: number;
  paidCount: number;
  dueCount: number;
  overdueCount: number;
  collectionRate: number;
}

interface PaginatedFees {
  data: Fee[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Query Hooks
export function useFees(filters?: FeeFilters, options?: Omit<UseQueryOptions<PaginatedFees>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: queryKeys.fees.list(filters),
    queryFn: () => feesApi.getAll(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes - fees change frequently
    gcTime: 5 * 60 * 1000,
    ...options,
  });
}

export function useFeeByStudent(studentId: string, options?: Omit<UseQueryOptions<Fee[]>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: queryKeys.fees.byStudent(studentId),
    queryFn: () => feesApi.getAll({ studentId }),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    enabled: !!studentId,
    ...options,
  });
}

export function useFeeByClass(classId: string, options?: Omit<UseQueryOptions<Fee[]>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: queryKeys.fees.byClass(classId),
    queryFn: () => feesApi.getAll({ classId }),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    enabled: !!classId,
    ...options,
  });
}

export function useFeeStats(options?: Omit<UseQueryOptions<FeeStats>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: queryKeys.fees.stats,
    queryFn: () => feesApi.getAll({ stats: true }),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
    ...options,
  });
}

export function useFeeAnalytics(options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: queryKeys.fees.analytics,
    queryFn: () => feesApi.getAll({ analytics: true }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
}

// Mutation Hooks
export function useCreateFee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Fee>) => feesApi.create(data),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKeys.fees.all });
      await queryClient.cancelQueries({ queryKey: queryKeys.fees.stats });

      const previousFees = queryClient.getQueryData<PaginatedFees>(queryKeys.fees.list());

      queryClient.setQueryData<PaginatedFees>(queryKeys.fees.list(), (old) => {
        if (!old) return old;
        return {
          ...old,
          total: old.total + 1,
        };
      });

      return { previousFees };
    },
    onError: (err, _, context) => {
      if (context?.previousFees) {
        queryClient.setQueryData(queryKeys.fees.list(), context.previousFees);
      }
      toast.error("Failed to create fee", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.fees.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.fees.stats });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });

      toast.success("Fee created successfully");
    },
  });
}

export function useRecordPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ feeId, data }: { feeId: string; data: { amount: number; method: string; reference?: string } }) =>
      feesApi.recordPayment(feeId, data),
    onMutate: async ({ feeId }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.fees.list() });
      await queryClient.cancelQueries({ queryKey: queryKeys.fees.stats });
      await queryClient.cancelQueries({ queryKey: queryKeys.fees.byStudent(feeId) });

      const previousFees = queryClient.getQueryData<PaginatedFees>(queryKeys.fees.list());
      const previousStats = queryClient.getQueryData<FeeStats>(queryKeys.fees.stats);

      // Optimistically update the fee status
      queryClient.setQueryData<PaginatedFees>(queryKeys.fees.list(), (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((fee) =>
            fee.id === feeId
              ? { ...fee, paid: (fee.paid || 0) + 1, status: 'Paid' as const }
              : fee
          ),
        };
      });

      return { previousFees, previousStats };
    },
    onError: (err, _, context) => {
      if (context?.previousFees) {
        queryClient.setQueryData(queryKeys.fees.list(), context.previousFees);
      }
      if (context?.previousStats) {
        queryClient.setQueryData(queryKeys.fees.stats(), context.previousStats);
      }
      toast.error("Failed to record payment", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.fees.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.fees.stats });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });

      toast.success("Payment recorded successfully");
    },
  });
}

export function useDeleteFee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => feesApi.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.fees.list() });
      await queryClient.cancelQueries({ queryKey: queryKeys.fees.stats });

      const previousFees = queryClient.getQueryData<PaginatedFees>(queryKeys.fees.list());

      if (previousFees) {
        queryClient.setQueryData<PaginatedFees>(queryKeys.fees.list(), (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((fee) => fee.id !== id),
            total: old.total - 1,
          };
        });
      }

      return { previousFees };
    },
    onError: (err, id, context) => {
      if (context?.previousFees) {
        queryClient.setQueryData(queryKeys.fees.list(), context.previousFees);
      }
      toast.error("Failed to delete fee", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    },
    onSettled: (data, error) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.fees.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.fees.stats });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });

      if (!error) {
        toast.success("Fee deleted successfully");
      }
    },
  });
}

// Prefetch Helpers
export function prefetchFees(queryClient: ReturnType<typeof useQueryClient>, filters?: FeeFilters) {
  return queryClient.prefetchQuery({
    queryKey: queryKeys.fees.list(filters),
    queryFn: () => feesApi.getAll(filters),
    staleTime: 2 * 60 * 1000,
  });
}

export function prefetchFeeStats(queryClient: ReturnType<typeof useQueryClient>) {
  return queryClient.prefetchQuery({
    queryKey: queryKeys.fees.stats,
    queryFn: () => feesApi.getAll({ stats: true }),
    staleTime: 2 * 60 * 1000,
  });
}
