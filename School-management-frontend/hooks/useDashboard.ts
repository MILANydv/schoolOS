// ============================================
// React Query Hooks for Dashboard
// ============================================

"use client";

import { useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { dashboardApi, logsApi, eventsApi, notificationsApi } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { toast } from "sonner";

// Types
interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalRevenue: number;
  totalDue: number;
  feeCollectionRate: number;
  pendingAdmissions: number;
  attendanceRate: number;
  performanceAverage: number;
  upcomingEvents: number;
}

interface DashboardMetrics {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  description: string;
  icon: any;
  href: string;
  gradient: string;
  target: number;
  current: number;
  details: string;
}

interface RecentActivity {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  user?: string;
}

interface DashboardAlert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isRead: boolean;
}

// Query Hooks
export function useDashboardStats(options?: Omit<UseQueryOptions<DashboardStats>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: queryKeys.dashboard.stats,
    queryFn: () => dashboardApi.getStats(),
    staleTime: 2 * 60 * 1000, // 2 minutes - dashboard changes frequently
    gcTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
    ...options,
  });
}

export function useDashboardMetrics(options?: Omit<UseQueryOptions<DashboardMetrics[]>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: queryKeys.dashboard.metrics,
    queryFn: () => dashboardApi.getStats().then((res: any) => res.metrics || []),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
}

export function useRecentActivities(options?: Omit<UseQueryOptions<RecentActivity[]>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: queryKeys.dashboard.recentActivities,
    queryFn: () => logsApi.getAll().then((res: any) => res.data || []),
    staleTime: 1 * 60 * 1000,
    gcTime: 3 * 60 * 1000,
    refetchInterval: 2 * 60 * 1000, // Auto-refresh every 2 minutes
    ...options,
  });
}

export function useDashboardAlerts(options?: Omit<UseQueryOptions<DashboardAlert[]>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: queryKeys.dashboard.alerts,
    queryFn: () => notificationsApi.getAll().then((res: any) => {
      return (res.data || [])
        .filter((n: any) => n.priority === 'HIGH' || n.priority === 'urgent')
        .map((n: any) => ({
          id: n.id,
          type: n.priority === 'urgent' ? 'error' : 'warning',
          title: n.title,
          message: n.content,
          priority: n.priority,
          isRead: n.isRead,
        }));
    }),
    staleTime: 1 * 60 * 1000,
    gcTime: 2 * 60 * 1000,
    refetchInterval: 2 * 60 * 1000, // Auto-refresh every 2 minutes
    ...options,
  });
}

export function useDashboardOverview(options?: Omit<UseQueryOptions<{
  stats: DashboardStats;
  activities: RecentActivity[];
  alerts: DashboardAlert[];
  upcomingEvents: any[];
}>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: queryKeys.dashboard.overview,
    queryFn: async () => {
      const [statsRes, logsRes, notificationsRes, eventsRes] = await Promise.all([
        dashboardApi.getStats(),
        logsApi.getAll(),
        notificationsApi.getAll(),
        eventsApi.getAll({ status: 'Upcoming' }),
      ]);

      const stats = statsRes.data || statsRes;
      const activities = logsRes.data || [];
      const alerts = (notificationsRes.data || [])
        .filter((n: any) => n.priority === 'HIGH' || n.priority === 'urgent')
        .map((n: any) => ({
          id: n.id,
          type: n.priority === 'urgent' ? 'error' : 'warning',
          title: n.title,
          message: n.content,
          priority: n.priority,
          isRead: n.isRead,
        }));
      const upcomingEvents = (eventsRes.data || []).slice(0, 5);

      return { stats, activities, alerts, upcomingEvents };
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
    ...options,
  });
}

// Prefetch Helpers
export function prefetchDashboardStats(queryClient: ReturnType<typeof useQueryClient>) {
  return queryClient.prefetchQuery({
    queryKey: queryKeys.dashboard.stats,
    queryFn: () => dashboardApi.getStats(),
    staleTime: 2 * 60 * 1000,
  });
}

// Refresh Dashboard
export function useRefreshDashboard() {
  const queryClient = useQueryClient();

  return async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });
    await queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.metrics });
    await queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.recentActivities });
    await queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.alerts });
    await queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.overview });

    toast.success("Dashboard refreshed", {
      description: "All data has been updated",
    });
  };
}
