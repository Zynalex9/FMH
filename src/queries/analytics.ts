import { supabase } from "@/lib/supabaseClient";
import { Database } from "@/types/database";

export type DateRange = "today" | "week" | "month" | "all";

// Database row types
type RequestRow = Database["public"]["Tables"]["requests"]["Row"];
type UserRow = Database["public"]["Tables"]["users"]["Row"];
type VolunteerRow = Database["public"]["Tables"]["volunteers"]["Row"];
type DonorRow = Database["public"]["Tables"]["donors"]["Row"];

// Helper to get date filter
const getDateFilter = (range: DateRange): string | null => {
  const now = new Date();
  switch (range) {
    case "today":
      return new Date(now.setHours(0, 0, 0, 0)).toISOString();
    case "week":
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return weekAgo.toISOString();
    case "month":
      const monthAgo = new Date(now);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return monthAgo.toISOString();
    case "all":
    default:
      return null;
  }
};

// ==================== REQUEST METRICS ====================

export interface RequestStatusCount {
  status: string;
  count: number;
}

export interface RequestCategoryCount {
  need_type: string;
  count: number;
}

export interface RequestPriorityCount {
  priority: string;
  count: number;
}

export interface RequestTrendData {
  date: string;
  count: number;
}

export interface RequestMetrics {
  total: number;
  byStatus: RequestStatusCount[];
  byCategory: RequestCategoryCount[];
  byPriority: RequestPriorityCount[];
  trend: RequestTrendData[];
}

export const getRequestMetrics = async (range: DateRange = "all"): Promise<RequestMetrics> => {
  const dateFilter = getDateFilter(range);
  
  // Optimized: Select only needed columns for aggregation
  let query = supabase.from("requests").select("status, need_type, priority, created_at");
  if (dateFilter) {
    query = query.gte("created_at", dateFilter);
  }

  const { data: requests, error } = await query;

  if (error) {
    console.error("Error fetching request metrics:", error.message);
    throw new Error(error.message);
  }

  const allRequests: RequestRow[] = requests ?? [];

  // Calculate status breakdown
  const statusMap = new Map<string, number>();
  const categoryMap = new Map<string, number>();
  const priorityMap = new Map<string, number>();
  const trendMap = new Map<string, number>();

  allRequests.forEach((req: RequestRow) => {
    // Status count
    const status = req.status || "unknown";
    statusMap.set(status, (statusMap.get(status) || 0) + 1);

    // Category count
    const category = req.need_type || "other";
    categoryMap.set(category, (categoryMap.get(category) || 0) + 1);

    // Priority count
    const priority = req.priority || "normal";
    priorityMap.set(priority, (priorityMap.get(priority) || 0) + 1);

    // Trend by date (group by day)
    const date = new Date(req.created_at || "").toISOString().split("T")[0];
    trendMap.set(date, (trendMap.get(date) || 0) + 1);
  });

  // Convert maps to arrays
  const byStatus: RequestStatusCount[] = Array.from(statusMap.entries()).map(([status, count]) => ({
    status,
    count,
  }));

  const byCategory: RequestCategoryCount[] = Array.from(categoryMap.entries()).map(([need_type, count]) => ({
    need_type,
    count,
  }));

  const byPriority: RequestPriorityCount[] = Array.from(priorityMap.entries()).map(([priority, count]) => ({
    priority,
    count,
  }));

  // Sort trend by date ascending
  const trend: RequestTrendData[] = Array.from(trendMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-30); // Last 30 days

  return {
    total: allRequests.length,
    byStatus,
    byCategory,
    byPriority,
    trend,
  };
};

// ==================== VOLUNTEER METRICS ====================

export interface VolunteerMetrics {
  total: number;
  active: number;
  byAvailability: { availability: string; count: number }[];
  byVehicleType: { vehicle_type: string; count: number }[];
  topPerformers: { id: string; full_name: string; completedCount: number }[];
}

export const getVolunteerMetrics = async (): Promise<VolunteerMetrics> => {
  // Optimized: Select only needed columns and run queries in parallel
  const [volunteersRes, driverUsersRes, completedRequestsRes] = await Promise.all([
    supabase.from("volunteers").select("id, availability, vehicle_type"),
    supabase.from("users").select("id, full_name, is_active").eq("role", "driver"),
    supabase.from("requests").select("assigned_to").eq("status", "delivered").not("assigned_to", "is", null),
  ]);

  const { data: volunteers, error: volError } = volunteersRes;

  if (volError) {
    console.error("Error fetching volunteers:", volError.message);
    throw new Error(volError.message);
  }

  const { data: driverUsers, error: userError } = driverUsersRes;
  if (userError) {
    console.error("Error fetching driver users:", userError.message);
    throw new Error(userError.message);
  }

  const { data: completedRequests, error: reqError } = completedRequestsRes;
  if (reqError) {
    console.error("Error fetching completed requests:", reqError.message);
    throw new Error(reqError.message);
  }

  const allVolunteers: VolunteerRow[] = volunteers ?? [];
  const allDrivers: { id: string; full_name: string | null; is_active: boolean | null }[] = driverUsers ?? [];
  const completed: { assigned_to: string | null }[] = completedRequests ?? [];

  // Count completed per volunteer
  const completionMap = new Map<string, number>();
  completed.forEach((req: { assigned_to: string | null }) => {
    if (req.assigned_to) {
      completionMap.set(req.assigned_to, (completionMap.get(req.assigned_to) || 0) + 1);
    }
  });

  // Availability breakdown
  const availabilityMap = new Map<string, number>();
  allVolunteers.forEach((vol: VolunteerRow) => {
    const availability = vol.availability || "not_specified";
    availabilityMap.set(availability, (availabilityMap.get(availability) || 0) + 1);
  });

  // Vehicle type breakdown
  const vehicleMap = new Map<string, number>();
  allVolunteers.forEach((vol: VolunteerRow) => {
    const vehicle = vol.vehicle_type || "none";
    vehicleMap.set(vehicle, (vehicleMap.get(vehicle) || 0) + 1);
  });

  // Top performers
  type DriverType = { id: string; full_name: string | null; is_active: boolean | null };
  type PerformerType = { id: string; full_name: string; completedCount: number };
  const topPerformers: PerformerType[] = allDrivers
    .map((driver: DriverType) => ({
      id: driver.id,
      full_name: driver.full_name || "Unknown",
      completedCount: completionMap.get(driver.id) || 0,
    }))
    .sort((a: PerformerType, b: PerformerType) => b.completedCount - a.completedCount)
    .slice(0, 5);

  return {
    total: allVolunteers.length,
    active: allDrivers.filter((d: DriverType) => d.is_active).length,
    byAvailability: Array.from(availabilityMap.entries()).map(([availability, count]) => ({
      availability,
      count,
    })),
    byVehicleType: Array.from(vehicleMap.entries()).map(([vehicle_type, count]) => ({
      vehicle_type,
      count,
    })),
    topPerformers,
  };
};

// ==================== DONOR METRICS ====================

export interface DonorMetrics {
  total: number;
  byCategory: { donation_type: string; count: number }[];
  recentDonors: { id: string; full_name: string; donation_type: string; created_at: string }[];
}

export const getDonorMetrics = async (range: DateRange = "all"): Promise<DonorMetrics> => {
  const dateFilter = getDateFilter(range);

  // Optimized: Select only needed columns
  let query = supabase.from("donors").select("id, full_name, donation_type, created_at");
  if (dateFilter) {
    query = query.gte("created_at", dateFilter);
  }

  const { data: donors, error } = await query.order("created_at", { ascending: false }).limit(100);

  if (error) {
    console.error("Error fetching donor metrics:", error.message);
    throw new Error(error.message);
  }

  const allDonors: DonorRow[] = donors ?? [];

  // Category breakdown
  const categoryMap = new Map<string, number>();
  allDonors.forEach((donor: DonorRow) => {
    const category = donor.donation_type || "general";
    categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
  });

  return {
    total: allDonors.length,
    byCategory: Array.from(categoryMap.entries()).map(([donation_type, count]) => ({
      donation_type,
      count,
    })),
    recentDonors: allDonors.slice(0, 5).map((d: DonorRow) => ({
      id: d.id,
      full_name: d.full_name || "Anonymous",
      donation_type: d.donation_type || "general",
      created_at: d.created_at || "",
    })),
  };
};

// ==================== USER METRICS ====================

export interface UserMetrics {
  total: number;
  byRole: { role: string; count: number }[];
  activeUsers: number;
  recentSignups: { id: string; full_name: string; role: string; created_at: string }[];
}

export const getUserMetrics = async (range: DateRange = "all"): Promise<UserMetrics> => {
  const dateFilter = getDateFilter(range);

  // Optimized: Select only needed columns
  let query = supabase.from("users").select("id, full_name, role, is_active, created_at");
  if (dateFilter) {
    query = query.gte("created_at", dateFilter);
  }

  const { data: users, error } = await query.order("created_at", { ascending: false }).limit(500);

  if (error) {
    console.error("Error fetching user metrics:", error.message);
    throw new Error(error.message);
  }

  const allUsers: UserRow[] = users ?? [];

  // Role breakdown
  const roleMap = new Map<string, number>();
  allUsers.forEach((user: UserRow) => {
    const role = user.role || "unknown";
    roleMap.set(role, (roleMap.get(role) || 0) + 1);
  });

  return {
    total: allUsers.length,
    byRole: Array.from(roleMap.entries()).map(([role, count]) => ({ role, count })),
    activeUsers: allUsers.filter((u: UserRow) => u.is_active).length,
    recentSignups: allUsers.slice(0, 5).map((u: UserRow) => ({
      id: u.id,
      full_name: u.full_name || "Unknown",
      role: u.role || "unknown",
      created_at: u.created_at || "",
    })),
  };
};

// ==================== KPI SUMMARY ====================

export interface KPISummary {
  totalRequests: number;
  pendingRequests: number;
  deliveredRequests: number;
  activeVolunteers: number;
  totalDonors: number;
  totalUsers: number;
}

export const getKPISummary = async (): Promise<KPISummary> => {
  // Parallel fetch for performance
  const [requestsRes, volunteersRes, donorsRes, usersRes] = await Promise.all([
    supabase.from("requests").select("status"),
    supabase.from("users").select("id, is_active").eq("role", "driver"),
    supabase.from("donors").select("id"),
    supabase.from("users").select("id"),
  ]);

  const requests: { status: string | null }[] = requestsRes.data ?? [];
  const volunteers: { id: string; is_active: boolean | null }[] = volunteersRes.data ?? [];
  const donors: { id: string }[] = donorsRes.data ?? [];
  const users: { id: string }[] = usersRes.data ?? [];

  const pendingStatuses = ["requested", "assigned", "picked_up", "en_route"];
  
  return {
    totalRequests: requests.length,
    pendingRequests: requests.filter((r: { status: string | null }) => r.status && pendingStatuses.includes(r.status)).length,
    deliveredRequests: requests.filter((r: { status: string | null }) => r.status === "delivered").length,
    activeVolunteers: volunteers.filter((v: { id: string; is_active: boolean | null }) => v.is_active).length,
    totalDonors: donors.length,
    totalUsers: users.length,
  };
};
