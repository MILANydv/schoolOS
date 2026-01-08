import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { schoolsApi } from '@/lib/api'
import { queryKeys } from '@/lib/query-keys'
import { toast } from './use-toast'

// Hook to get all schools
export function useSchools(params?: Record<string, any>) {
  return useQuery({
    queryKey: queryKeys.schools.list(params),
    queryFn: () => schoolsApi.getAll(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 3,
  })
}

// Hook to get a single school by ID
export function useSchool(id: string) {
  return useQuery({
    queryKey: queryKeys.schools.detail(id),
    queryFn: () => schoolsApi.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  })
}

// Hook to get school statistics
export function useSchoolStats(id: string) {
  return useQuery({
    queryKey: queryKeys.schools.stats(id),
    queryFn: () => schoolsApi.getStats(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 5,
  })
}

// Hook to create a school
export function useCreateSchool() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: schoolsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.schools.all })
      toast({
        title: 'Success',
        description: 'School created successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to create school',
        variant: 'destructive',
      })
    },
  })
}

// Hook to update a school
export function useUpdateSchool() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      schoolsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.schools.all })
      queryClient.invalidateQueries({
        queryKey: queryKeys.schools.detail(variables.id),
      })
      toast({
        title: 'Success',
        description: 'School updated successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to update school',
        variant: 'destructive',
      })
    },
  })
}

// Hook to delete a school
export function useDeleteSchool() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: schoolsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.schools.all })
      toast({
        title: 'Success',
        description: 'School deleted successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to delete school',
        variant: 'destructive',
      })
    },
  })
}
