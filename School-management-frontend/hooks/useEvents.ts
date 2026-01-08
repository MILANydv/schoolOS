// ============================================
// React Query Hooks for Events
// ============================================

"use client";

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { eventsApi } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { toast } from "sonner";

// Types
interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
  audience: 'Students' | 'Teachers' | 'Parents' | 'All';
  createdBy?: string;
  createdAt?: string;
  type: 'Academic' | 'Sports' | 'Cultural' | 'Meeting' | 'Holiday' | 'Other';
  priority: 'Low' | 'Medium' | 'High';
  capacity?: number;
  registeredCount?: number;
}

interface EventFilters {
  search?: string;
  status?: string;
  type?: string;
  audience?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

interface EventStats {
  total: number;
  upcoming: number;
  ongoing: number;
  completed: number;
  cancelled: number;
  byType: Record<string, number>;
  byAudience: Record<string, number>;
}

interface PaginatedEvents {
  data: Event[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Query Hooks
export function useEvents(filters?: EventFilters, options?: Omit<UseQueryOptions<PaginatedEvents>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: queryKeys.events.list(filters),
    queryFn: () => eventsApi.getAll(filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
}

export function useEvent(id: string, options?: Omit<UseQueryOptions<Event>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: queryKeys.events.detail(id),
    queryFn: () => eventsApi.getAll().then((res: any) => res.data.find((e: Event) => e.id === id)),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!id,
    ...options,
  });
}

export function useUpcomingEvents(options?: Omit<UseQueryOptions<Event[]>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: queryKeys.events.upcoming,
    queryFn: () => eventsApi.getAll({ status: 'Upcoming' }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000, // Auto-refresh every 10 minutes
    ...options,
  });
}

export function useEventsCalendar(month: string, options?: Omit<UseQueryOptions<Event[]>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: queryKeys.events.calendar(month),
    queryFn: () => eventsApi.getAll({ month }),
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    enabled: !!month,
    ...options,
  });
}

export function useEventStats(options?: Omit<UseQueryOptions<EventStats>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: queryKeys.events.stats,
    queryFn: () => eventsApi.getAll({ stats: true }),
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    ...options,
  });
}

// Mutation Hooks
export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Event>) => eventsApi.create(data),
    onMutate: async (newEvent) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.events.all });
      await queryClient.cancelQueries({ queryKey: queryKeys.events.stats });
      await queryClient.cancelQueries({ queryKey: queryKeys.events.upcoming });

      const previousEvents = queryClient.getQueryData<PaginatedEvents>(queryKeys.events.list());

      queryClient.setQueryData<PaginatedEvents>(queryKeys.events.list(), (old) => {
        if (!old) return old;
        return {
          ...old,
          data: [
            { ...newEvent, id: `temp-${Date.now()}`, createdAt: new Date().toISOString() } as Event,
            ...old.data,
          ],
          total: old.total + 1,
        };
      });

      return { previousEvents };
    },
    onError: (err, _, context) => {
      if (context?.previousEvents) {
        queryClient.setQueryData(queryKeys.events.list(), context.previousEvents);
      }
      toast.error("Failed to create event", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.events.stats });
      queryClient.invalidateQueries({ queryKey: queryKeys.events.upcoming });

      toast.success("Event created successfully");
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Event> }) =>
      eventsApi.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.events.detail(id) });
      await queryClient.cancelQueries({ queryKey: queryKeys.events.list() });

      const previousEvent = queryClient.getQueryData<Event>(queryKeys.events.detail(id));
      const previousEvents = queryClient.getQueryData<PaginatedEvents>(queryKeys.events.list());

      if (previousEvent) {
        queryClient.setQueryData<Event>(queryKeys.events.detail(id), (old) => {
          if (!old) return old;
          return { ...old, ...data };
        });
      }

      return { previousEvent, previousEvents };
    },
    onError: (err, { id }, context) => {
      if (context?.previousEvent) {
        queryClient.setQueryData(queryKeys.events.detail(id), context.previousEvent);
      }
      toast.error("Failed to update event", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    },
    onSettled: (data, error, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.events.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.events.stats });
      queryClient.invalidateQueries({ queryKey: queryKeys.events.upcoming });

      if (!error) {
        toast.success("Event updated successfully");
      }
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => eventsApi.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.events.list() });
      await queryClient.cancelQueries({ queryKey: queryKeys.events.detail(id) });
      await queryClient.cancelQueries({ queryKey: queryKeys.events.stats });

      const previousEvents = queryClient.getQueryData<PaginatedEvents>(queryKeys.events.list());

      if (previousEvents) {
        queryClient.setQueryData<PaginatedEvents>(queryKeys.events.list(), (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((event) => event.id !== id),
            total: old.total - 1,
          };
        });
      }

      return { previousEvents };
    },
    onError: (err, id, context) => {
      if (context?.previousEvents) {
        queryClient.setQueryData(queryKeys.events.list(), context.previousEvents);
      }
      toast.error("Failed to delete event", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    },
    onSettled: (data, error) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.events.stats });
      queryClient.invalidateQueries({ queryKey: queryKeys.events.upcoming });

      if (!error) {
        toast.success("Event deleted successfully");
      }
    },
  });
}

// Prefetch Helpers
export function prefetchEvents(queryClient: ReturnType<typeof useQueryClient>, filters?: EventFilters) {
  return queryClient.prefetchQuery({
    queryKey: queryKeys.events.list(filters),
    queryFn: () => eventsApi.getAll(filters),
    staleTime: 5 * 60 * 1000,
  });
}
