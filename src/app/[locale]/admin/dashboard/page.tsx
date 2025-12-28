"use client";

import { useState, useMemo } from "react";
import {
  useKPISummary,
  useRequestMetrics,
  useVolunteerMetrics,
  useDonorMetrics,
} from "@/hook/admin/useAnalytics";
import { DateRange } from "@/queries/analytics";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import {
  Package,
  Users,
  Truck,
  Heart,
  RefreshCw,
  Clock,
  CheckCircle2,
} from "lucide-react";

const DATE_RANGES: { label: string; value: DateRange }[] = [
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
  { label: "All Time", value: "all" },
];

const STATUS_COLORS: Record<string, string> = {
  requested: "#f59e0b",
  assigned: "#3b82f6",
  picked_up: "#8b5cf6",
  en_route: "#06b6d4",
  delivered: "#22c55e",
  cancelled: "#ef4444",
};

// Helper to transform data for Recharts compatibility
interface ChartData {
  [key: string]: string | number;
}

const CHART_COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState<DateRange>("month");

  const { data: kpi, isLoading: kpiLoading, refetch: refetchKPI } = useKPISummary();
  const {
    data: requestMetrics,
    isLoading: requestsLoading,
    refetch: refetchRequests,
  } = useRequestMetrics(dateRange);
  const {
    data: volunteerMetrics,
    isLoading: volunteersLoading,
    refetch: refetchVolunteers,
  } = useVolunteerMetrics();
  const {
    data: donorMetrics,
    isLoading: donorsLoading,
    refetch: refetchDonors,
  } = useDonorMetrics(dateRange);

  // Transform data for Recharts compatibility
  const statusChartData: ChartData[] = useMemo(() => 
    requestMetrics?.byStatus.map(item => ({ 
      status: item.status, 
      count: item.count 
    })) || [], 
    [requestMetrics?.byStatus]
  );

  const categoryChartData: ChartData[] = useMemo(() => 
    requestMetrics?.byCategory.map(item => ({ 
      need_type: item.need_type, 
      count: item.count 
    })) || [], 
    [requestMetrics?.byCategory]
  );

  const donorChartData: ChartData[] = useMemo(() => 
    donorMetrics?.byCategory.map(item => ({ 
      donation_type: item.donation_type, 
      count: item.count 
    })) || [], 
    [donorMetrics?.byCategory]
  );

  const handleRefresh = () => {
    refetchKPI();
    refetchRequests();
    refetchVolunteers();
    refetchDonors();
  };

  const isLoading = kpiLoading || requestsLoading || volunteersLoading || donorsLoading;

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Monitor requests, volunteers, and donor activity</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {DATE_RANGES.map((range) => (
          <Button
            key={range.value}
            variant={dateRange === range.value ? "default" : "outline"}
            size="sm"
            onClick={() => setDateRange(range.value)}
            className={dateRange === range.value ? "bg-cgreen hover:bg-cgreen/90" : ""}
          >
            {range.label}
          </Button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard
          title="Total Requests"
          value={kpi?.totalRequests}
          icon={<Package className="h-5 w-5 text-blue-600" />}
          loading={kpiLoading}
          color="blue"
        />
        <KPICard
          title="Pending Delivery"
          value={kpi?.pendingRequests}
          icon={<Clock className="h-5 w-5 text-amber-600" />}
          loading={kpiLoading}
          color="amber"
        />
        <KPICard
          title="Delivered"
          value={kpi?.deliveredRequests}
          icon={<CheckCircle2 className="h-5 w-5 text-green-600" />}
          loading={kpiLoading}
          color="green"
        />
        <KPICard
          title="Active Volunteers"
          value={kpi?.activeVolunteers}
          icon={<Truck className="h-5 w-5 text-purple-600" />}
          loading={kpiLoading}
          color="purple"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Request Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Request Trends</CardTitle>
            <CardDescription>Daily requests over time</CardDescription>
          </CardHeader>
          <CardContent>
            {requestsLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={requestMetrics?.trend || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getMonth() + 1}/${date.getDate()}`;
                    }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={{ fill: "#22c55e", strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Status Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Request Status Distribution</CardTitle>
            <CardDescription>Breakdown by current status</CardDescription>
          </CardHeader>
          <CardContent>
            {requestsLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusChartData}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={STATUS_COLORS[entry.status as string] || CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Second Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Requests by Category</CardTitle>
            <CardDescription>Need type breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            {requestsLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis
                    dataKey="need_type"
                    type="category"
                    tick={{ fontSize: 12 }}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Donor Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Donor Contributions</CardTitle>
            <CardDescription>By donation type</CardDescription>
          </CardHeader>
          <CardContent>
            {donorsLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : donorChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={donorChartData}
                    dataKey="count"
                    nameKey="donation_type"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    {donorChartData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Heart className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No donor data available</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Volunteers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Volunteers</CardTitle>
            <CardDescription>By completed deliveries</CardDescription>
          </CardHeader>
          <CardContent>
            {volunteersLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : volunteerMetrics?.topPerformers && volunteerMetrics.topPerformers.length > 0 ? (
              <div className="space-y-3">
                {volunteerMetrics.topPerformers.map((volunteer, index) => (
                  <div
                    key={volunteer.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          index === 0
                            ? "bg-amber-500"
                            : index === 1
                            ? "bg-gray-400"
                            : index === 2
                            ? "bg-amber-700"
                            : "bg-gray-300"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <span className="font-medium">{volunteer.full_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="font-semibold">{volunteer.completedCount}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No volunteer data available</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Donors */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Donors</CardTitle>
            <CardDescription>Latest contributions</CardDescription>
          </CardHeader>
          <CardContent>
            {donorsLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : donorMetrics?.recentDonors && donorMetrics.recentDonors.length > 0 ? (
              <div className="space-y-3">
                {donorMetrics.recentDonors.map((donor) => (
                  <div
                    key={donor.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <Heart className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <span className="font-medium block">{donor.full_name}</span>
                        <span className="text-sm text-gray-500">{donor.donation_type}</span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(donor.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Heart className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No recent donors</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// KPI Card Component
interface KPICardProps {
  title: string;
  value?: number;
  icon: React.ReactNode;
  loading: boolean;
  color: "blue" | "amber" | "green" | "purple";
}

function KPICard({ title, value, icon, loading, color }: KPICardProps) {
  const bgColors = {
    blue: "bg-blue-50",
    amber: "bg-amber-50",
    green: "bg-green-50",
    purple: "bg-purple-50",
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            {loading ? (
              <Skeleton className="h-8 w-16 mt-1" />
            ) : (
              <p className="text-3xl font-bold text-gray-900">{value ?? 0}</p>
            )}
          </div>
          <div className={`p-3 rounded-full ${bgColors[color]}`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}
