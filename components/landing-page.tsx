'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DynamicVehiclesScene } from '@/components/dynamic-vehicles-scene';
import Link from 'next/link';
import { ArrowRight, Zap, BarChart3, Shield, MapPin, Clock, Users } from 'lucide-react';

export function LandingPage() {
  const features = [
    {
      icon: Zap,
      title: 'Real-Time Tracking',
      description: 'Track your entire fleet in real-time with GPS-enabled vehicles and live location updates.',
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Comprehensive dashboards with actionable insights to optimize routes and reduce costs.',
    },
    {
      icon: Shield,
      title: 'Enhanced Security',
      description: 'Enterprise-grade security with encrypted data and role-based access controls.',
    },
    {
      icon: MapPin,
      title: 'Route Optimization',
      description: 'AI-powered route planning that reduces fuel consumption and delivery times.',
    },
    {
      icon: Clock,
      title: 'Automated Scheduling',
      description: 'Smart scheduling system that automatically assigns and optimizes delivery routes.',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Seamless communication tools for drivers, dispatchers, and management.',
    },
  ];

  const services = [
    {
      title: 'Fleet Management',
      description: 'Complete fleet operations management with vehicle maintenance tracking, fuel management, and compliance reporting.',
      points: ['Vehicle Maintenance', 'Fuel Management', 'Compliance Tracking', 'Depreciation Analysis'],
    },
    {
      title: 'Driver Management',
      description: 'Comprehensive driver management system with performance tracking, safety records, and compliance documentation.',
      points: ['Performance Metrics', 'Safety Records', 'Compliance Docs', 'Training Tracking'],
    },
    {
      title: 'Route Optimization',
      description: 'Intelligent routing engine that optimizes deliveries based on real-time traffic and vehicle capacity.',
      points: ['Traffic Aware', 'Capacity Planning', 'Cost Reduction', 'Time Savings'],
    },
    {
      title: 'Customer Portal',
      description: 'White-label customer portal for tracking shipments and accessing delivery information in real-time.',
      points: ['Live Tracking', 'ETA Updates', 'Proof of Delivery', 'Customer Reports'],
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Dynamic 3D Background */}
      <DynamicVehiclesScene opacity={0.12} />

      {/* Header */}
      <header className="relative z-10 border-b border-border/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">T</span>
            </div>
            <span className="font-bold text-lg hidden sm:inline">TransitOps</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm hover:text-primary transition">Features</a>
            <a href="#services" className="text-sm hover:text-primary transition">Services</a>
            <a href="#about" className="text-sm hover:text-primary transition">About</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/login">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">
              Smart Fleet{' '}
              <span className="text-primary">Operations</span>{' '}
              Reimagined
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 text-balance">
              TransitOps is the intelligent fleet management platform designed to help logistics companies optimize operations, reduce costs, and enhance driver safety through real-time tracking and AI-powered insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/login">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Free Trial <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Watch Demo
              </Button>
            </div>
            <p className="text-sm text-foreground/60">
              No credit card required. Get instant access to all features.
            </p>
          </div>
          <div className="hidden md:block relative h-96 rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-transparent rounded-lg"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl opacity-20">🚚</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 bg-primary/5 border-y border-border/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">500+</div>
              <p className="text-sm text-foreground/60 mt-2">Active Operators</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">50K+</div>
              <p className="text-sm text-foreground/60 mt-2">Vehicles Tracked</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">$2.5B</div>
              <p className="text-sm text-foreground/60 mt-2">Shipments Managed</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">99.9%</div>
              <p className="text-sm text-foreground/60 mt-2">Uptime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Modern Logistics</h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Everything you need to manage your fleet efficiently, from real-time tracking to advanced analytics.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Card key={idx} className="group hover:border-primary/50 transition">
                <CardContent className="pt-6">
                  <div className="mb-4 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-foreground/60">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="relative z-10 bg-primary/5 border-y border-border/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
              Comprehensive solutions tailored for every aspect of your fleet operations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, idx) => (
              <div key={idx} className="bg-background border border-border rounded-lg p-6 hover:border-primary/50 transition">
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-foreground/60 mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.points.map((point, pidx) => (
                    <li key={pidx} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose TransitOps?</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                </div>
                <div>
                  <h4 className="font-bold mb-1">Industry Leading Technology</h4>
                  <p className="text-foreground/60 text-sm">Built with modern architecture and cutting-edge AI algorithms for superior performance.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                </div>
                <div>
                  <h4 className="font-bold mb-1">24/7 Expert Support</h4>
                  <p className="text-foreground/60 text-sm">Dedicated support team available round-the-clock to assist with any questions or issues.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                </div>
                <div>
                  <h4 className="font-bold mb-1">Scalable Infrastructure</h4>
                  <p className="text-foreground/60 text-sm">Grow from 10 vehicles to 10,000 without any limitations or performance degradation.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                </div>
                <div>
                  <h4 className="font-bold mb-1">Proven ROI</h4>
                  <p className="text-foreground/60 text-sm">Customers report 30% reduction in fuel costs and 25% improvement in delivery efficiency.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative h-96 rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-transparent rounded-lg"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">📊</div>
                <p className="font-bold text-lg">Advanced Analytics</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 bg-primary/10 border-y border-border/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Fleet Operations?</h2>
          <p className="text-lg text-foreground/60 mb-8 max-w-2xl mx-auto">
            Join hundreds of logistics companies already using TransitOps to streamline their operations and boost profitability.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="w-full sm:w-auto">
                Start Your Free Trial <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Schedule a Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 bg-background/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="font-bold mb-4">TransitOps</div>
              <p className="text-sm text-foreground/60">Intelligent fleet management for modern logistics.</p>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li><a href="#" className="hover:text-foreground transition">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li><a href="#" className="hover:text-foreground transition">About</a></li>
                <li><a href="#" className="hover:text-foreground transition">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li><a href="#" className="hover:text-foreground transition">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition">Terms</a></li>
                <li><a href="#" className="hover:text-foreground transition">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/50 pt-8">
            <p className="text-center text-sm text-foreground/60">
              &copy; 2024 TransitOps. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
