'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Zap, Shield, BarChart3, Navigation, Users, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImprovedRoadAnimation } from '@/components/improved-road-animation';
import { Logo } from '@/components/logo';

export function EnhancedLanding() {
  const [scrollY, setScrollY] = useState(0);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: Navigation,
      title: 'Real-Time Tracking',
      description: 'Track your fleet location with precise GPS positioning and live updates every few seconds.',
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Get detailed insights into fuel consumption, routes, driver behavior, and operational efficiency.',
    },
    {
      icon: Shield,
      title: 'Enhanced Security',
      description: 'Secure your fleet data with enterprise-grade encryption and role-based access controls.',
    },
    {
      icon: Zap,
      title: 'Route Optimization',
      description: 'Reduce fuel costs and delivery times with AI-powered route planning and optimization.',
    },
    {
      icon: Users,
      title: 'Driver Management',
      description: 'Manage driver documents, schedules, performance ratings, and safety records in one place.',
    },
    {
      icon: BarChart3,
      title: 'Performance Insights',
      description: 'Monitor vehicle health, schedule maintenance, and prevent breakdowns before they happen.',
    },
  ];

  const services = [
    {
      name: 'Fleet Tracking',
      items: ['GPS Tracking', 'Speed Monitoring', 'Geofencing', 'Trip History', 'Real-time Alerts'],
    },
    {
      name: 'Analytics & Reporting',
      items: ['Daily Reports', 'Performance Metrics', 'Cost Analysis', 'Fuel Tracking', 'Driver Scorecards'],
    },
    {
      name: 'Route Management',
      items: ['Auto Route Planning', 'Traffic Integration', 'Delivery Optimization', 'Stop Planning', 'ETA Calculation'],
    },
    {
      name: 'Maintenance',
      items: ['Preventive Maintenance', 'Service Scheduling', 'Cost Tracking', 'Parts Management', 'History Logs'],
    },
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 text-foreground min-h-screen relative">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 dark:bg-black/20 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-slate-700 dark:text-slate-300 hover:text-primary transition-colors font-medium">Sign In</Link>
            {mounted && (
              <button
                onClick={() => {
                  const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
                  localStorage.setItem('theme', newTheme);
                  document.documentElement.setAttribute('data-theme', newTheme);
                  window.location.reload();
                }}
                className="p-2 hover:bg-white/20 dark:hover:bg-black/30 rounded-lg transition-colors"
                aria-label="Toggle theme"
              >
                {document.documentElement.getAttribute('data-theme') === 'dark' ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-600" />
                )}
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        ref={(el) => (sectionsRef.current[0] = el)}
        className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left content */}
          <div
            className="text-center lg:text-left transform transition-all duration-1000"
            style={{
              opacity: Math.max(0, 1 - scrollY / 300),
              transform: `translateY(${scrollY * 0.5}px)`,
            }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Smart Fleet Operations
            </h1>
            <p className="text-xl text-slate-700 dark:text-slate-300 mb-8 max-w-2xl leading-relaxed">
              TransitOps helps transportation companies optimize their fleet operations with real-time tracking, advanced analytics, and intelligent route planning. Reduce costs, improve efficiency, and enhance driver safety—all from one unified platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/signup">
                <Button size="lg" className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                  Create Account <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>

          {/* Right side - Road Animation Box */}
          <div className="hidden lg:block h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-white/40 to-white/20 dark:from-black/40 dark:to-black/30 backdrop-blur-xl border-2 border-white/50 dark:border-white/30 shadow-2xl">
            <ImprovedRoadAnimation />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section
        ref={(el) => (sectionsRef.current[1] = el)}
        className="py-20 px-4 sm:px-6 lg:px-8 relative z-10"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-slate-800 dark:text-white">Why Choose TransitOps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: 'Proven Reliability', desc: 'Used by thousands of fleet operators worldwide to manage their operations' },
              { title: 'Affordable Pricing', desc: 'Transparent pricing with no hidden fees. Start free and scale as you grow' },
              { title: 'Easy Integration', desc: 'Connect with your existing systems. Works with hardware trackers and OBD devices' },
              { title: 'Expert Support', desc: 'Our team is ready to help you at every step of your journey' },
            ].map((benefit, idx) => (
              <div
                key={idx}
                className="group bg-white/20 dark:bg-black/30 backdrop-blur-lg border border-white/40 dark:border-white/20 rounded-xl p-8 transition-all duration-300 transform hover:scale-105 cursor-pointer hover:bg-white/30 dark:hover:bg-black/40"
                onMouseEnter={() => setHoveredFeature(idx)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <CheckCircle className={`w-8 h-8 mb-4 transition-colors ${hoveredFeature === idx ? 'text-blue-500' : 'text-cyan-500'}`} />
                <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-white">{benefit.title}</h3>
                <p className="text-slate-700 dark:text-slate-300">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        ref={(el) => (sectionsRef.current[2] = el)}
        className="py-20 px-4 sm:px-6 lg:px-8 relative z-10"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-slate-800 dark:text-white">Key Features</h2>
          <p className="text-center text-slate-700 dark:text-slate-300 mb-16 max-w-2xl mx-auto">
            Everything you need to manage your fleet efficiently and effectively
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="group bg-white/20 dark:bg-black/30 backdrop-blur-lg border border-white/40 dark:border-white/20 rounded-xl p-8 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer hover:bg-white/30 dark:hover:bg-black/40"
                  onMouseEnter={() => setHoveredFeature(idx + 4)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  <div className={`inline-block p-3 rounded-lg mb-4 transition-colors ${hoveredFeature === idx + 4 ? 'bg-blue-500/20' : 'bg-cyan-500/20'}`}>
                    <Icon className={`w-6 h-6 transition-colors ${hoveredFeature === idx + 4 ? 'text-blue-500' : 'text-cyan-500'}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-slate-800 dark:text-white">{feature.title}</h3>
                  <p className="text-slate-700 dark:text-slate-300">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        ref={(el) => (sectionsRef.current[3] = el)}
        className="py-20 px-4 sm:px-6 lg:px-8 relative z-10"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-slate-800 dark:text-white">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, idx) => (
              <div
                key={idx}
                className="bg-white/20 dark:bg-black/30 backdrop-blur-lg border border-white/40 dark:border-white/20 rounded-xl p-8 transition-all duration-300 transform hover:bg-white/30 dark:hover:bg-black/40 hover:shadow-lg"
                onMouseEnter={() => setHoveredFeature(idx + 10)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <h3 className="text-xl font-semibold mb-6 text-slate-800 dark:text-white">{service.name}</h3>
                <ul className="space-y-3">
                  {service.items.map((item, itemIdx) => (
                    <li
                      key={itemIdx}
                      className="flex items-center gap-3 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto bg-white/20 dark:bg-black/30 backdrop-blur-lg border border-white/40 dark:border-white/20 rounded-2xl p-12 text-center hover:bg-white/30 dark:hover:bg-black/40 transition-all">
          <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-white">Ready to Optimize Your Fleet?</h2>
          <p className="text-lg text-slate-700 dark:text-slate-300 mb-8">
            Join thousands of fleet operators who are already using TransitOps to save time and money.
          </p>
          <Link href="/signup">
            <Button size="lg" className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/10 dark:bg-black/20 backdrop-blur-lg border-t border-white/20 py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <Logo />
            <p className="text-slate-700 dark:text-slate-400 mt-4 text-sm">Smart fleet operations for modern transportation.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-slate-800 dark:text-white">Product</h4>
            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-400">
              <li><Link href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Features</Link></li>
              <li><Link href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">API</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-slate-800 dark:text-white">Company</h4>
            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-400">
              <li><Link href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">About</Link></li>
              <li><Link href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-slate-800 dark:text-white">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-400">
              <li><Link href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy</Link></li>
              <li><Link href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms</Link></li>
              <li><Link href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/20 pt-8 text-center text-sm text-slate-700 dark:text-slate-400">
          <p>&copy; 2024 TransitOps. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
