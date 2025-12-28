export const queryKeys = {
  // Request queries
  requests: {
    all: ["requests"] as const,
    lists: () => [...queryKeys.requests.all, "list"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.requests.lists(), filters] as const,
    details: () => [...queryKeys.requests.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.requests.details(), id] as const,
    assigned: (userId: string) =>
      [...queryKeys.requests.all, "assigned", userId] as const,
  },

  // Support offers queries
  supportOffers: {
    all: ["supportOffers"] as const,
    lists: () => [...queryKeys.supportOffers.all, "list"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.supportOffers.lists(), filters] as const,
    details: () => [...queryKeys.supportOffers.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.supportOffers.details(), id] as const,
  },

  // User queries
  users: {
    all: ["users"] as const,
    details: () => [...queryKeys.users.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
    current: () => [...queryKeys.users.all, "current"] as const,
  },

  // Analytics queries
  analytics: {
    all: ["analytics"] as const,
    kpi: () => [...queryKeys.analytics.all, "kpi"] as const,
    requests: (range?: string) => [...queryKeys.analytics.all, "requests", range] as const,
    volunteers: () => [...queryKeys.analytics.all, "volunteers"] as const,
    donors: (range?: string) => [...queryKeys.analytics.all, "donors", range] as const,
    users: (range?: string) => [...queryKeys.analytics.all, "users", range] as const,
  },
} as const;

// Cache time configurations (in milliseconds)
export const cacheTime = {
  // Short cache for frequently changing data
  short: {
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  },
  // Medium cache for moderately changing data
  medium: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  },
  // Long cache for rarely changing data
  long: {
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  },
  // Static cache for data that almost never changes
  static: {
    staleTime: Infinity,
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  },
} as const;

// Default query options for different data types
export const queryOptions = {
  // For request lists - medium freshness needed
  requestList: {
    ...cacheTime.medium,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  },
  // For single request details - shorter freshness for accuracy
  requestDetail: {
    ...cacheTime.short,
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Ensure fresh data when viewing details
  },
  // For support offers - medium freshness
  supportOffers: {
    ...cacheTime.medium,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  },
  // For user data - longer cache as it changes less
  userData: {
    ...cacheTime.long,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  },
  // For analytics dashboard - longer cache to reduce DB load
  analytics: {
    staleTime: 10 * 60 * 1000, // 10 minutes - analytics data doesn't need real-time updates
    gcTime: 60 * 60 * 1000, // 1 hour garbage collection
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Use cached data on mount
    refetchOnReconnect: false,
  },
} as const;
