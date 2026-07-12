'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SmoothRoadScene } from '@/components/smooth-road-scene';
import { GlassMorphismToggle } from '@/components/glass-morphism-toggle';
import {
  LayoutDashboard,
  Truck,
  Users,
  MapPin,
  Wrench,
  Zap,
  DollarSign,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Moon,
  Sun,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
}

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/vehicles', label: 'Vehicles', icon: Truck },
  { href: '/dashboard/drivers', label: 'Drivers', icon: Users },
  { href: '/dashboard/trips', label: 'Trips', icon: MapPin },
  { href: '/dashboard/maintenance', label: 'Maintenance', icon: Wrench },
  { href: '/dashboard/fuel', label: 'Fuel Logs', icon: Zap },
  { href: '/dashboard/expenses', label: 'Expenses', icon: DollarSign },
];

export function DashboardLayout({ children, activeTab }: DashboardLayoutProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (stored) {
      setTheme(stored);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    const html = document.documentElement;
    if (newTheme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    html.setAttribute('data-theme', newTheme);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
    router.push('/');
  };

  if (!mounted) return null;

  return (
    <div className="h-screen bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-slate-900 dark:to-slate-800 relative overflow-hidden flex">
      {/* Fixed full-screen background road animation */}
      <div className="fixed inset-0 w-full h-full z-0">
        <SmoothRoadScene />
      </div>
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-40 bg-white/10 dark:bg-black/20 backdrop-blur-md border-b border-white/20 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
            <Truck className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-primary">TransitOps</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-foreground">
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <div className="flex relative z-20 w-full h-full overflow-hidden">
        {/* Sidebar */}
        <div
          className={`fixed lg:static inset-y-0 left-0 w-64 bg-white/10 dark:bg-black/20 backdrop-blur-lg border-r border-white/20 transform lg:transform-none transition-transform duration-300 z-30 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          } pt-6`}
        >
          <div className="hidden lg:flex items-center gap-2 px-6 mb-8">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-primary">TransitOps</h1>
              <p className="text-xs text-muted-foreground">Fleet Management</p>
            </div>
          </div>

          <nav className="space-y-1 px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-white shadow-md'
                        : 'text-foreground hover:bg-secondary/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Top Bar */}
          <div className="hidden lg:flex items-center justify-between bg-white/10 dark:bg-black/20 backdrop-blur-lg border-b border-white/20 px-8 py-4">
            <h2 className="text-xl font-bold text-foreground">
              {navItems.find((item) => item.href === activeTab)?.label || 'Dashboard'}
            </h2>
            <div className="flex items-center gap-3">
              {/* Glass Morphism Toggle */}
              <GlassMorphismToggle />
              
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-white/20 dark:hover:bg-white/10 transition-colors"
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-600" />
                )}
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/20 dark:hover:bg-white/10 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                    A
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white/20 dark:bg-black/40 backdrop-blur-lg border border-white/30 rounded-lg shadow-lg z-10">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-destructive hover:bg-destructive/20 dark:hover:bg-destructive/30 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="flex-1 overflow-auto p-4 lg:p-8 relative z-20">
            {children}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
