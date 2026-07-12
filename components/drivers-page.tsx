'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { useGlassMorphism } from '@/lib/glass-morphism-context';
import { Search, Plus, AlertCircle, CheckCircle2, Star, User, Trash2, Edit2 } from 'lucide-react';

type Driver = {
  id: string;
  userId: string;
  licenseNumber: string;
  licenseExpiry: string;
  licenseClass: string;
  aadharNumber?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  totalTrips?: number;
  totalKilometers?: number;
  rating?: number;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

interface DriverWithUser extends Driver {
  user?: { id: string; name: string; email: string; phone?: string };
}

export function DriversPage() {
  const { mode } = useGlassMorphism();
  const [drivers, setDrivers] = useState<DriverWithUser[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<DriverWithUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [verificationFilter, setVerificationFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    licenseNumber: '',
    licenseClass: 'LMV',
    licenseExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isVerified: false,
  });

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const res = await fetch('/api/drivers');
      const data: DriverWithUser[] = await res.json();
      setDrivers(data);
      setFilteredDrivers(data);
    } catch (error) {
      console.error('Failed to fetch drivers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = drivers;

    if (searchTerm) {
      filtered = filtered.filter(
        (d) =>
          d.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (verificationFilter !== 'all') {
      const isVerified = verificationFilter === 'verified';
      filtered = filtered.filter((d) => d.isVerified === isVerified);
    }

    setFilteredDrivers(filtered);
  }, [searchTerm, verificationFilter, drivers]);

  const isLicenseExpiringSoon = (expiryDate: Date) => {
    const daysUntilExpiry = Math.ceil(
      (new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry < 90 && daysUntilExpiry > 0;
  };

  const isLicenseExpired = (expiryDate: Date) => {
    return new Date(expiryDate) < new Date();
  };

  const handleAddDriver = async () => {
    if (!formData.name.trim() || !formData.licenseNumber.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingId) {
      setDrivers(drivers.map((d) =>
        d.id === editingId
          ? {
              ...d,
              licenseNumber: formData.licenseNumber,
              licenseClass: formData.licenseClass,
              licenseExpiry: new Date(formData.licenseExpiry),
              isVerified: formData.isVerified,
              user: {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
              },
            }
          : d
      ));
      setEditingId(null);
    } else {
      const newDriver: DriverWithUser = {
        id: `D${Date.now()}`,
        userId: `U${Date.now()}`,
        licenseNumber: formData.licenseNumber,
        licenseClass: formData.licenseClass,
        licenseExpiry: new Date(formData.licenseExpiry),
        isVerified: formData.isVerified,
        totalTrips: 0,
        totalKilometers: 0,
        rating: 0,
        user: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
        createdAt: new Date(),
      };
      setDrivers([...drivers, newDriver]);
    }

    resetFormData();
    setShowModal(false);
  };

  const resetFormData = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      licenseNumber: '',
      licenseClass: 'LMV',
      licenseExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isVerified: false,
    });
    setEditingId(null);
  };

  const handleEditDriver = (driver: DriverWithUser) => {
    setFormData({
      name: driver.user?.name || '',
      email: driver.user?.email || '',
      phone: driver.user?.phone || '',
      licenseNumber: driver.licenseNumber,
      licenseClass: driver.licenseClass,
      licenseExpiry: new Date(driver.licenseExpiry).toISOString().split('T')[0],
      isVerified: driver.isVerified,
    });
    setEditingId(driver.id);
    setShowModal(true);
  };

  const handleDeleteDriver = (id: string) => {
    if (confirm('Are you sure you want to delete this driver?')) {
      setDrivers(drivers.filter((d) => d.id !== id));
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading drivers...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Drivers</h1>
          <p className="text-muted-foreground mt-1">Manage driver information and licenses</p>
        </div>
        <Button 
          onClick={() => setShowModal(true)}
          className="bg-primary hover:bg-primary/90 text-white gap-2 w-fit shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Add Driver
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-white/20 dark:bg-black/30 backdrop-blur-lg border-white/30 dark:border-white/20">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search drivers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-input"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'verified', 'unverified'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setVerificationFilter(filter)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    verificationFilter === filter
                      ? 'bg-primary text-white'
                      : 'bg-muted text-foreground hover:bg-muted/70'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Drivers Grid */}
      {Array.isArray(filteredDrivers) && filteredDrivers.length > 0 && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrivers.map((driver) => (
          <Card key={driver.id} className="bg-white/20 dark:bg-black/30 backdrop-blur-lg border-white/30 dark:border-white/20 hover:bg-white/30 dark:hover:bg-black/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <CardHeader className="pb-4 bg-gradient-to-r from-accent/10 to-primary/10">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                    <User className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-primary">{driver.user?.name}</CardTitle>
                    <CardDescription className="text-xs font-mono">{driver.licenseNumber}</CardDescription>
                  </div>
                </div>
                {driver.isVerified && (
                  <div className="px-3 py-1.5 bg-green-100 text-green-800 rounded-full border border-green-300 flex items-center gap-1 shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold">Verified</span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* License Expiry Status */}
              <div>
                {isLicenseExpired(driver.licenseExpiry) ? (
                  <div className="flex gap-2 items-center p-3 bg-red-100 border border-red-300 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <span className="text-xs text-red-800 font-bold">License Expired</span>
                  </div>
                ) : isLicenseExpiringSoon(driver.licenseExpiry) ? (
                  <div className="flex gap-2 items-center p-3 bg-amber-100 border border-amber-300 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span className="text-xs text-amber-800 font-bold">Expiring Soon</span>
                  </div>
                ) : (
                  <div className="flex gap-2 items-center p-3 bg-green-100 border border-green-300 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-xs text-green-800 font-bold">Valid License</span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground font-semibold">Trips</p>
                  <p className="text-lg font-bold text-primary mt-1">{driver.totalTrips}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground font-semibold">Class</p>
                  <p className="text-lg font-bold text-primary mt-1">{driver.licenseClass}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground font-semibold">Kilometers</p>
                  <p className="text-lg font-bold text-primary mt-1">{Math.round(driver.totalKilometers)}</p>
                  <p className="text-xs text-muted-foreground">km</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 flex flex-col justify-center">
                  <p className="text-xs text-muted-foreground font-semibold">Rating</p>
                  <div className="flex items-center mt-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg font-bold text-primary ml-1">{driver.rating}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-border flex gap-2">
                <Button 
                  onClick={() => handleEditDriver(driver)}
                  variant="outline" 
                  size="sm" 
                  className="flex-1 hover:bg-primary/10"
                >
                  <Edit2 className="w-3.5 h-3.5 mr-1" />
                  Edit
                </Button>
                <Button 
                  onClick={() => handleDeleteDriver(driver.id)}
                  variant="outline" 
                  size="sm" 
                  className="flex-1 hover:bg-destructive/10 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      )}

      {Array.isArray(filteredDrivers) && filteredDrivers.length === 0 && (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <p className="text-muted-foreground">No drivers found</p>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Driver Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetFormData();
        }}
        title={editingId ? 'Edit Driver' : 'Add New Driver'}
        description={editingId ? 'Update driver details' : 'Register a new driver to your fleet'}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Full Name *
            </label>
            <Input
              placeholder="e.g., John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <Input
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Phone
              </label>
              <Input
                placeholder="+91 9876543210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              License Number *
            </label>
            <Input
              placeholder="e.g., DL0120110123456"
              value={formData.licenseNumber}
              onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
              className="bg-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                License Class
              </label>
              <select
                value={formData.licenseClass}
                onChange={(e) => setFormData({ ...formData, licenseClass: e.target.value })}
                className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground"
              >
                <option value="HMV">HMV</option>
                <option value="LMV">LMV</option>
                <option value="HPMV">HPMV</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                License Expiry
              </label>
              <Input
                type="date"
                value={formData.licenseExpiry}
                onChange={(e) => setFormData({ ...formData, licenseExpiry: e.target.value })}
                className="bg-input"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg border border-border">
            <input
              type="checkbox"
              id="verified"
              checked={formData.isVerified}
              onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="verified" className="text-sm font-medium text-foreground cursor-pointer">
              Mark as Verified
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowModal(false);
                resetFormData();
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddDriver}
              className="flex-1 bg-primary hover:bg-primary/90 text-white"
            >
              {editingId ? 'Update Driver' : 'Add Driver'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
