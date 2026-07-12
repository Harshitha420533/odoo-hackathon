'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Truck, Mail, Lock, ArrowRight } from 'lucide-react';
import { DynamicVehiclesScene } from '@/components/dynamic-vehicles-scene';

const DEMO_EMAIL = 'admin@transitops.com';
const DEMO_PASSWORD = 'demo123';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const autoFillCredentials = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        setError('Invalid credentials');
        return;
      }

      const data = await res.json();
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('auth_token', data.token);
      router.push('/dashboard');
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic vehicles background */}
      <DynamicVehiclesScene opacity={0.08} />
      
      {/* Decorative elements */}
      <div className="absolute top-10 right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-60 h-60 bg-accent/5 rounded-full blur-3xl"></div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo Section */}
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
              <Truck className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">TransitOps</h1>
              <p className="text-xs text-muted-foreground">Fleet Management</p>
            </div>
          </div>
          <p className="text-muted-foreground text-lg font-medium">Smart Transport Operations</p>
        </div>

        {/* Login Card */}
        <Card className="border-2 border-border/50 shadow-2xl bg-gradient-to-br from-card via-card to-card/95 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Enter your credentials to access your dashboard</CardDescription>
            {/* Demo Credentials Display */}
            <div className="mt-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3 space-y-2">
              <p className="text-xs font-semibold text-blue-900 dark:text-blue-100">Demo Credentials:</p>
              <div className="space-y-1 text-xs">
                <p className="text-blue-800 dark:text-blue-200"><span className="font-semibold">Email:</span> {DEMO_EMAIL}</p>
                <p className="text-blue-800 dark:text-blue-200"><span className="font-semibold">Password:</span> {DEMO_PASSWORD}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-destructive/15 border-l-4 border-destructive text-destructive px-4 py-3 rounded-lg flex gap-3 animate-pulse">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@company.com"
                  required
                  className="bg-input border-2 border-border/50 rounded-lg h-11 focus:border-primary transition-colors"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" />
                  Password
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="bg-input border-2 border-border/50 rounded-lg h-11 focus:border-primary transition-colors"
                />
              </div>

              {/* Auto-fill Button */}
              <Button
                type="button"
                onClick={autoFillCredentials}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white h-10 font-semibold rounded-lg flex items-center justify-center gap-2 transition-all text-sm"
              >
                Auto-fill Demo Credentials
              </Button>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading || !email || !password}
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white h-11 font-semibold rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>

              {/* Info message */}
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-center">
                <p className="text-xs text-muted-foreground">
                  For demo access, contact your administrator or use your assigned credentials.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          © 2024 TransitOps. All rights reserved.
        </p>
      </div>
    </div>
  );
}
