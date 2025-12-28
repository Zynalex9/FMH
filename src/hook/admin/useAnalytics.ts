import { useQuery } from "@tanstack/react-query";
import { queryKeys, queryOptions } from "@/lib/queryConfig";
import {
  getKPISummary,
  getRequestMetrics,
  getVolunteerMetrics,
  getDonorMetrics,
  getUserMetrics,
  type DateRange,
  type KPISummary,
  type RequestMetrics,
  type VolunteerMetrics,
  type DonorMetrics,
  type UserMetrics,
} from "@/queries/analytics";

// KPI Summary Hook
export function useKPISummary() {
  return useQuery<KPISummary, Error>({
    queryKey: queryKeys.analytics.kpi(),
    queryFn: getKPISummary,
    ...queryOptions.analytics,
    placeholderData: (previousData) => previousData,
  });
}

// Request Metrics Hook
export function useRequestMetrics(range: DateRange = "all") {
  return useQuery<RequestMetrics, Error>({
    queryKey: queryKeys.analytics.requests(range),
    queryFn: () => getRequestMetrics(range),
    ...queryOptions.analytics,
    placeholderData: (previousData) => previousData,
  });
}

// Volunteer Metrics Hook
export function useVolunteerMetrics() {
  return useQuery<VolunteerMetrics, Error>({
    queryKey: queryKeys.analytics.volunteers(),
    queryFn: getVolunteerMetrics,
    ...queryOptions.analytics,
    placeholderData: (previousData) => previousData,
  });
}

// Donor Metrics Hook
export function useDonorMetrics(range: DateRange = "all") {
  return useQuery<DonorMetrics, Error>({
    queryKey: queryKeys.analytics.donors(range),
    queryFn: () => getDonorMetrics(range),
    ...queryOptions.analytics,
    placeholderData: (previousData) => previousData,
  });
}

// User Metrics Hook
export function useUserMetrics(range: DateRange = "all") {
  return useQuery<UserMetrics, Error>({
    queryKey: queryKeys.analytics.users(range),
    queryFn: () => getUserMetrics(range),
    ...queryOptions.analytics,
    placeholderData: (previousData) => previousData,
  });
}
