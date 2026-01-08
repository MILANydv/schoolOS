// ============================================
// React Query Hooks for Notifications
// ============================================

"use client";

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { notificationsApi } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { toast } from "sonner";

// Types
interface Notification {
  id: string;
  title: string;
  content: string;
  type: "info" | "success" | "warning" | "error";
  priority: "low" | "medium" | "high" | "urgent";
  audience: Array<"School Admin" | "Teacher" | "Parent" | "Student" | "All">;
  scheduledDate: string;
  status: "draft" | "scheduled" | "sent" | "failed";
  isRead: boolean;
  readCount: number;
  totalRecipients: number;
  sentBy?: string;
  createdAt: string;
  updatedAt: string;
  actionLink?: string;
  actionText?: string;
}

interface NotificationFilters {
  search?: string;
  status?: string;
  priority?: string;
  type?: string;
  page?: number;
  pageSize?: number;
}

interface NotificationStats {
  total: number;
  sent: number;
  unread: number;
  drafts: number;
  byPriority: Record<string, number>;
  byType: Record<string, number>;
}

interface PaginatedNotifications {
  data: Notification[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Query Hooks
export function useNotifications(filters?: NotificationFilters, options?: Omit<UseQueryOptions<PaginatedNotifications>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: queryKeys.notifications.list(filters),
    queryFn: () => notificationsApi.getAll(filters),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    ...options,
  });
}

export function useNotification(id: string, options?: Omit<UseQueryOptions<Notification>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: queryKeys.notifications.detail(id),
    queryFn: () => notificationsApi.getAll().then((res: any) => res.data.find((n: Notification) => n.id === id)),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!id,
    ...options,
  });
}

export function useUnreadNotifications(options?: Omit<UseQueryOptions<Notification[]>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: queryKeys.notifications.unread,
    queryFn: () => notificationsApi.getAll({ isRead: false }),
    staleTime: 1 * 60 * 1000, // Check more frequently for unread
    gcTime: 2 * 60 * 1000,
    refetchInterval: 2 * 60 * 1000, // Auto-refresh every 2 minutes
    ...options,
  });
}

export function useNotificationStats(options?: Omit<UseQueryOptions<NotificationStats>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: queryKeys.notifications.stats,
    queryFn: () => notificationsApi.getAll({ stats: true }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
}

// Mutation Hooks
export function useCreateNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Notification>) => notificationsApi.create(data),
    onMutate: async (newNotification) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.notifications.all });
      await queryClient.cancelQueries({ queryKey: queryKeys.notifications.stats });

      const previousNotifications = queryClient.getQueryData<PaginatedNotifications>(queryKeys.notifications.list());

      queryClient.setQueryData<PaginatedNotifications>(queryKeys.notifications.list(), (old) => {
        if (!old) return old;
        return {
          ...old,
          data: [
            { ...newNotification, id: `temp-${Date.now()}`, createdAt: new Date().toISOString() } as Notification,
            ...old.data,
          ],
          total: old.total + 1,
        };
      });

      return { previousNotifications };
    },
    onError: (err, _, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(queryKeys.notifications.list(), context.previousNotifications);
      }
      toast.error("Failed to create notification", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.stats });

      toast.success("Notification created successfully");
    },
  });
}

export function useUpdateNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Notification> }) =>
      notificationsApi.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.notifications.detail(id) });
      await queryClient.cancelQueries({ queryKey: queryKeys.notifications.list() });

      const previousNotification = queryClient.getQueryData<Notification>(queryKeys.notifications.detail(id));
      const previousNotifications = queryClient.getQueryData<PaginatedNotifications>(queryKeys.notifications.list());

      if (previousNotification) {
        queryClient.setQueryData<Notification>(queryKeys.notifications.detail(id), (old) => {
          if (!old) return old;
          return { ...old, ...data, updatedAt: new Date().toISOString() };
        });
      }

      return { previousNotification, previousNotifications };
    },
    onError: (err, { id }, context) => {
      if (context?.previousNotification) {
        queryClient.setQueryData(queryKeys.notifications.detail(id), context.previousNotification);
      }
      toast.error("Failed to update notification", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    },
    onSettled: (data, error, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.stats });

      if (!error) {
        toast.success("Notification updated successfully");
      }
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationsApi.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.notifications.list() });
      await queryClient.cancelQueries({ queryKey: queryKeys.notifications.stats });

      const previousNotifications = queryClient.getQueryData<PaginatedNotifications>(queryKeys.notifications.list());

      if (previousNotifications) {
        queryClient.setQueryData<PaginatedNotifications>(queryKeys.notifications.list(), (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((notification) => notification.id !== id),
            total: old.total - 1,
          };
        });
      }

      return { previousNotifications };
    },
    onError: (err, id, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(queryKeys.notifications.list(), context.previousNotifications);
      }
      toast.error("Failed to delete notification", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    },
    onSettled: (data, error) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.stats });

      if (!error) {
        toast.success("Notification deleted successfully");
      }
    },
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationsApi.update(id, { isRead: true }),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.notifications.detail(id) });
      await queryClient.cancelQueries({ queryKey: queryKeys.notifications.unread });
      await queryClient.cancelQueries({ queryKey: queryKeys.notifications.stats });

      const previousNotification = queryClient.getQueryData<Notification>(queryKeys.notifications.detail(id));
      const previousUnread = queryClient.getQueryData<Notification[]>(queryKeys.notifications.unread);

      if (previousNotification) {
        queryClient.setQueryData<Notification>(queryKeys.notifications.detail(id), (old) => {
          if (!old) return old;
          return { ...old, isRead: true };
        });
      }

      return { previousNotification, previousUnread };
    },
    onError: (err, id, context) => {
      if (context?.previousNotification) {
        queryClient.setQueryData(queryKeys.notifications.detail(id), context.previousNotification);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
}

export function useBulkMarkNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => Promise.all(ids.map(id => notificationsApi.update(id, { isRead: true }))),
    onMutate: async (ids) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.notifications.unread });
      await queryClient.cancelQueries({ queryKey: queryKeys.notifications.stats });

      const previousUnread = queryClient.getQueryData<Notification[]>(queryKeys.notifications.unread);

      queryClient.setQueryData<Notification[]>(queryKeys.notifications.unread, (old) => {
        if (!old) return [];
        return old.filter(notification => !ids.includes(notification.id));
      });

      return { previousUnread };
    },
    onError: (err, _, context) => {
      if (context?.previousUnread) {
        queryClient.setQueryData(queryKeys.notifications.unread, context.previousUnread);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
}

// Prefetch Helpers
export function prefetchNotifications(queryClient: ReturnType<typeof useQueryClient>, filters?: NotificationFilters) {
  return queryClient.prefetchQuery({
    queryKey: queryKeys.notifications.list(filters),
    queryFn: () => notificationsApi.getAll(filters),
    staleTime: 2 * 60 * 1000,
  });
}
