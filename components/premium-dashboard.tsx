'use client';

import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Truck, Users, MapPin, AlertTriangle, TrendingUp, CheckCircle, Clock, Zap } from 'lucide-react';
import { Vehicle, Driver, Trip } from '@/lib/mock-data';

interface DashboardStats {
  totalVehicles: number;
  availableVehicles: number;
  activeTrips: number;
  totalDrivers: number;
  vehiclesByStatus: { status: string; count: number }[];
  tripData: { date: string; completed: number; pending: number }[];
  revenueData: { month: string; revenue: number }[];
}

// Animated counter component
function AnimatedCounter({ value, duration = 2000 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  const countRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    let currentValue = 0;
    const increment = value / (duration / 16);

    countRef.current = setInterval(() => {
      currentValue += increment;
      if (currentValue >= value) {
        setDisplayValue(value);
        clearInterval(countRef.current);
      } else {
        setDisplayValue(Math.floor(currentValue));
      }
    }, 16);

    return () => clearInterval(countRef.current);
  }, [value, duration]);

  return <span>{displayValue}</span>;
}

// Activity item with animation
function ActivityItem({ icon: Icon, label, value, color }: any) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-lg bg-white/5 dark:bg-black/10 hover:bg-white/15 dark:hover:bg-black/20 border border-white/10 transition-all duration-300 transform hover:translate-x-1 animate-fade-in">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-semibold text-foreground">{value}</p>
      </div>
      <TrendingUp className="w-4 h-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}

// KPI Card with animation
function KPICard({ title, value, icon: Icon, trend, color }: any) {
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-white/10 dark:bg-black/20 backdrop-blur-lg border border-white/20 hover:bg-white/20 dark:hover:bg-black/30">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-2">{title}</p>
            <div className="text-4xl font-bold text-foreground">
              <AnimatedCounter value={value} />
            </div>
            {trend && (
              <p className={`text-xs mt-2 flex items-center gap-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                <TrendingUp className="w-3 h-3" />
                {Math.abs(trend)}% from last month
              </p>
            )}
          </div>
          <div className={`p-4 rounded-lg ${color} group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-7 h-7" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Live status badge
function LiveBadge() {
  return (
    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/10 border border-red-500/30">
      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
      <span className="text-xs font-medium text-red-600">Live</span>
    </div>
  );
}

export function PremiumDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activityItems, setActivityItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehiclesRes, driversRes, tripsRes] = await Promise.all([
          fetch('/api/vehicles'),
          fetch('/api/drivers'),
          fetch('/api/trips'),
        ]);

        const vehicles: Vehicle[] = await vehiclesRes.json();
        const drivers: Driver[] = await driversRes.json();
        const trips: Trip[] = await tripsRes.json();

        const vehiclesByStatus = [
          { status: 'Available', count: vehicles.filter(v => v.status === 'available').length },
          { status: 'In Use', count: vehicles.filter(v => v.status === 'in_use').length },
          { status: 'Maintenance', count: vehicles.filter(v => v.status === 'maintenance').length },
        ];

        const tripData = [
          { date: 'Mon', completed: 12, pending: 3 },
          { date: 'Tue', completed: 15, pending: 4 },
          { date: 'Wed', completed: 10, pending: 5 },
          { date: 'Thu', completed: 18, pending: 2 },
          { date: 'Fri', completed: 14, pending: 6 },
          { date: 'Sat', completed: 8, pending: 3 },
          { date: 'Sun', completed: 5, pending: 2 },
        ];

        const revenueData = [
          { month: 'Jan', revenue: 45000 },
          { month: 'Feb', revenue: 52000 },
          { month: 'Mar', revenue: 48000 },
          { month: 'Apr', revenue: 61000 },
          { month: 'May', revenue: 55000 },
          { month: 'Jun', revenue: 67000 },
        ];

        setStats({
          totalVehicles: vehicles.length,
          availableVehicles: vehicles.filter(v => v.status === 'available').length,
          activeTrips: trips.filter(t => t.status === 'in_progress').length,
          totalDrivers: drivers.length,
          vehiclesByStatus,
          tripData,
          revenueData,
        });

        // Simulate live activity
        setActivityItems([
          { icon: CheckCircle, label: 'Trips Completed Today', value: '42', color: 'bg-green-100 text-green-700' },
          { icon: Clock, label: 'Avg Delivery Time', value: '2.5h', color: 'bg-blue-100 text-blue-700' },
          { icon: Truck, label: 'Fleet Utilization', value: '87%', color: 'bg-purple-100 text-purple-700' },
          { icon: Zap, label: 'Fuel Efficiency', value: '94%', color: 'bg-amber-100 text-amber-700' },
        ]);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!stats) {
    return <div className="text-center py-12">Failed to load dashboard</div>;
  }

  const COLORS = ['#0066cc', '#00d4ff', '#ffc107'];

  return (
    <div className="space-y-8">
      {/* Header with Live Badge */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-1">Operations Dashboard</h2>
          <p className="text-sm text-muted-foreground">Real-time fleet management and analytics</p>
        </div>
        <LiveBadge />
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-stagger">
        <KPICard
          title="Total Vehicles"
          value={stats.totalVehicles}
          icon={Truck}
          trend={12}
          color="bg-blue-100 text-blue-700"
        />
        <KPICard
          title="Available"
          value={stats.availableVehicles}
          icon={TrendingUp}
          trend={8}
          color="bg-green-100 text-green-700"
        />
        <KPICard
          title="Active Trips"
          value={stats.activeTrips}
          icon={MapPin}
          trend={15}
          color="bg-purple-100 text-purple-700"
        />
        <KPICard
          title="Total Drivers"
          value={stats.totalDrivers}
          icon={Users}
          trend={5}
          color="bg-amber-100 text-amber-700"
        />
      </div>

      {/* Live Activity Feed */}
      <Card className="bg-white/10 dark:bg-black/20 backdrop-blur-lg border border-white/20">
        <CardHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Live Operations</CardTitle>
              <CardDescription>Real-time fleet metrics</CardDescription>
            </div>
            <LiveBadge />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {activityItems.map((item, idx) => (
              <ActivityItem key={idx} {...item} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vehicle Status Chart */}
        <Card className="bg-white/10 dark:bg-black/20 backdrop-blur-lg border border-white/20 hover:bg-white/15 dark:hover:bg-black/30 hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle>Vehicle Status</CardTitle>
            <CardDescription>Fleet composition</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={stats.vehiclesByStatus}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                  animationDuration={800}
                >
                  {stats.vehiclesByStatus.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Trips Chart */}
        <Card className="lg:col-span-2 bg-white/10 dark:bg-black/20 backdrop-blur-lg border border-white/20 hover:bg-white/15 dark:hover:bg-black/30 hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle>Weekly Trips</CardTitle>
            <CardDescription>Completed vs Pending trips</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.tripData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#28a745" animationDuration={800} />
                <Bar dataKey="pending" fill="#ffc107" animationDuration={800} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card className="bg-white/10 dark:bg-black/20 backdrop-blur-lg border border-white/20 hover:bg-white/15 dark:hover:bg-black/30 hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
          <CardDescription>Monthly revenue overview</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#0066cc"
                strokeWidth={2}
                dot={{ fill: '#0066cc' }}
                animationDuration={800}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Alerts */}
      <Card className="bg-white/10 dark:bg-black/20 backdrop-blur-lg border border-white/20">
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
          <CardDescription>Important notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex gap-4 p-3 bg-amber-50 border border-amber-200 rounded-lg hover:shadow-md transition-shadow duration-300 animate-slide-in">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-amber-900">License Expiry Alert</p>
                <p className="text-sm text-amber-700">Driver Rajesh Kumar&apos;s license expiring in 120 days</p>
              </div>
            </div>
            <div className="flex gap-4 p-3 bg-red-50 border border-red-200 rounded-lg hover:shadow-md transition-shadow duration-300 animate-slide-in">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-900">Maintenance Due</p>
                <p className="text-sm text-red-700">Vehicle DL-01-AB-9012 requires scheduled maintenance</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
