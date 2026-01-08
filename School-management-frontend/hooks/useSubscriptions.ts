import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { subscriptionsApi } from '@/lib/api'
import { queryKeys } from '@/lib/query-keys'
import { toast } from './use-toast'

// Hook to get all subscriptions
export function useSubscriptions(params?: Record<string, any>) {
  return useQuery({
    queryKey: queryKeys.subscriptions.list(params),
    queryFn: () => subscriptionsApi.getAll(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 3,
  })
}

// Hook to get a single subscription by ID
export function useSubscription(id: string) {
  return useQuery({
    queryKey: queryKeys.subscriptions.detail(id),
    queryFn: () => subscriptionsApi.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  })
}

// Hook to get subscription by school ID
export function useSchoolSubscription(schoolId: string) {
  return useQuery({
    queryKey: queryKeys.subscriptions.bySchool(schoolId),
    queryFn: () => subscriptionsApi.getBySchool(schoolId),
    enabled: !!schoolId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  })
}

// Hook to create a subscription
export function useCreateSubscription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: subscriptionsApi.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.schools.all })
      if (data?.data?.schoolId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.subscriptions.bySchool(data.data.schoolId),
        })
      }
      toast({
        title: 'Success',
        description: 'Subscription created successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to create subscription',
        variant: 'destructive',
      })
    },
  })
}

// Hook to update a subscription
export function useUpdateSubscription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      subscriptionsApi.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions.all })
      queryClient.invalidateQueries({
        queryKey: queryKeys.subscriptions.detail(variables.id),
      })
      if (data?.data?.schoolId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.subscriptions.bySchool(data.data.schoolId),
        })
      }
      toast({
        title: 'Success',
        description: 'Subscription updated successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to update subscription',
        variant: 'destructive',
      })
    },
  })
}

// Hook to delete a subscription
export function useDeleteSubscription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: subscriptionsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions.all })
      toast({
        title: 'Success',
        description: 'Subscription deleted successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to delete subscription',
        variant: 'destructive',
      })
    },
  })
}
