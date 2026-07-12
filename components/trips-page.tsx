'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { useGlassMorphism } from '@/lib/glass-morphism-context';
import { Search, Plus, CheckCircle2, Clock, AlertCircle, MapPin, User, Trash2, Edit2 } from 'lucide-react';

// Simple select component for forms
function Select({ value, onChange, options, placeholder }: { value: string; onChange: (v: string) => void; options: Array<{ value: string; label: string }>; placeholder: string }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
    >
      <option value="">{placeholder}</option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}

type Vehicle = {
  id: string;
  registrationNumber: string;
  make: string;
  model: string;
  year: number;
  status: string;
};

type Driver = {
  id: string;
  userId: string;
  licenseNumber: string;
  user?: { name: string; email: string };
};

type Trip = {
  id: string;
  vehicleId: string;
  driverId?: string;
  routeName: string;
  sourceLocation: string;
  destinationLocation: string;
  startTime: string;
  endTime?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  cargoWeight?: number;
  cargoDescription?: string;
  distanceTraveled?: number;
  fuelConsumed?: number;
  createdAt?: string;
  updatedAt?: string;
};

interface TripWithDetails extends Trip {
  vehicle?: Vehicle;
  driver?: Driver;
  driverUser?: { name: string; email: string };
}

export function TripsPage() {
  const { mode } = useGlassMorphism();
  const [trips, setTrips] = useState<TripWithDetails[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<TripWithDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [formData, setFormData] = useState({
    routeName: '',
    sourceLocation: '',
    destinationLocation: '',
    distance: 0,
    cargoWeight: 0,
    vehicleId: '',
    driverId: '',
    startTime: new Date().toISOString().slice(0, 16),
    endTime: new Date().toISOString().slice(0, 16),
  });

  useEffect(() => {
    fetchTrips();
    fetchVehicles();
    fetchDrivers();
  }, []);

  const fetchTrips = async () => {
    try {
      // Check localStorage first
      const stored = localStorage.getItem('transitops_trips');
      if (stored) {
        const data: TripWithDetails[] = JSON.parse(stored);
        setTrips(data);
        setFilteredTrips(data);
      } else {
        const res = await fetch('/api/trips');
        const data: TripWithDetails[] = await res.json();
        setTrips(data);
        setFilteredTrips(data);
        localStorage.setItem('transitops_trips', JSON.stringify(data));
      }
    } catch (error) {
      console.error('Failed to fetch trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicles = async () => {
    try {
      // Check localStorage first (from vehicles-page)
      const stored = localStorage.getItem('transitops_vehicles');
      if (stored) {
        const data: Vehicle[] = JSON.parse(stored);
        setVehicles(data);
      } else {
        const res = await fetch('/api/vehicles');
        const data: Vehicle[] = await res.json();
        setVehicles(data);
      }
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
    }
  };

  const fetchDrivers = async () => {
    try {
      // Check localStorage first (from drivers-page)
      const stored = localStorage.getItem('transitops_drivers');
      if (stored) {
        const data: Driver[] = JSON.parse(stored);
        setDrivers(data);
      } else {
        const res = await fetch('/api/drivers');
        const data: Driver[] = await res.json();
        setDrivers(data);
      }
    } catch (error) {
      console.error('Failed to fetch drivers:', error);
    }
  };

  useEffect(() => {
    let filtered = trips;

    if (searchTerm) {
      filtered = filtered.filter(
        (t) =>
          t.routeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.sourceLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.destinationLocation.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((t) => t.status === statusFilter);
    }

    setFilteredTrips(filtered);
  }, [searchTerm, statusFilter, trips]);

  const getStatusColor = (status: Trip['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Trip['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'in_progress':
        return <AlertCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleCreateTrip = async () => {
    if (!formData.routeName.trim() || !formData.sourceLocation.trim() || !formData.destinationLocation.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    let updatedTrips: TripWithDetails[];
    if (editingId) {
      updatedTrips = trips.map((t) =>
        t.id === editingId
          ? {
              ...t,
              routeName: formData.routeName,
              sourceLocation: formData.sourceLocation,
              destinationLocation: formData.destinationLocation,
              distanceTraveled: formData.distance,
              cargoWeight: formData.cargoWeight,
              vehicleId: formData.vehicleId,
              driverId: formData.driverId,
            }
          : t
      );
      setEditingId(null);
    } else {
      if (!formData.vehicleId || !formData.driverId) {
        alert('Please select both a vehicle and driver');
        return;
      }
      const newTrip: TripWithDetails = {
        id: `T${Date.now()}`,
        vehicleId: formData.vehicleId,
        driverId: formData.driverId,
        routeName: formData.routeName,
        sourceLocation: formData.sourceLocation,
        destinationLocation: formData.destinationLocation,
        distanceTraveled: formData.distance,
        cargoWeight: formData.cargoWeight,
        status: 'pending',
        startTime: formData.startTime,
        endTime: formData.endTime || undefined,
        createdAt: new Date().toISOString(),
      };
      updatedTrips = [...trips, newTrip];
    }

    setTrips(updatedTrips);
    // Save to localStorage
    localStorage.setItem('transitops_trips', JSON.stringify(updatedTrips));
    resetFormData();
    setShowModal(false);
  };

  const resetFormData = () => {
    setFormData({
      routeName: '',
      sourceLocation: '',
      destinationLocation: '',
      distance: 0,
      cargoWeight: 0,
      vehicleId: '',
      driverId: '',
      startTime: new Date().toISOString().slice(0, 16),
      endTime: '',
    });
    setEditingId(null);
  };

  const handleEditTrip = (trip: TripWithDetails) => {
    setFormData({
      routeName: trip.routeName,
      sourceLocation: trip.sourceLocation,
      destinationLocation: trip.destinationLocation,
      distance: trip.distanceTraveled || 0,
      cargoWeight: trip.cargoWeight || 0,
      vehicleId: trip.vehicleId,
      driverId: trip.driverId || '',
      startTime: trip.startTime,
      endTime: trip.endTime || new Date().toISOString().slice(0, 16),
    });
    setEditingId(trip.id);
    setShowModal(true);
  };

  const handleDeleteTrip = (id: string) => {
    if (confirm('Are you sure you want to delete this trip?')) {
      const updated = trips.filter((t) => t.id !== id);
      setTrips(updated);
      localStorage.setItem('transitops_trips', JSON.stringify(updated));
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading trips...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Trips</h1>
          <p className="text-muted-foreground mt-1">Manage and monitor shipments</p>
        </div>
        <Button 
          onClick={() => setShowModal(true)}
          className="bg-primary hover:bg-primary/90 text-white gap-2 w-fit shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Create Trip
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20 dark:border-white/10">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search trips..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-input"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {['all', 'pending', 'in_progress', 'completed', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === status
                      ? 'bg-primary text-white'
                      : 'bg-muted text-foreground hover:bg-muted/70'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trips List */}
      {Array.isArray(filteredTrips) && filteredTrips.length > 0 && (
      <div className="space-y-4">
        {filteredTrips.map((trip) => (
          <Card key={trip.id} className="hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 border-2 border-border/50 bg-gradient-to-r from-card to-card/95">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Route Info */}
                <div className="md:col-span-2">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-lg text-primary">{trip.routeName}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {trip.sourceLocation} <span className="text-primary font-bold">→</span> {trip.destinationLocation}
                      </p>
                      <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="bg-muted rounded px-2 py-1"><span className="font-semibold">Distance:</span> {trip.distance || 'N/A'} km</span>
                        <span className="bg-muted rounded px-2 py-1"><span className="font-semibold">Cargo:</span> {trip.cargoWeight} kg</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vehicle & Driver */}
                <div className="bg-muted/30 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground font-bold mb-2">VEHICLE</p>
                  <p className="text-sm font-bold text-primary">{trip.vehicle?.registrationNumber || 'N/A'}</p>
                  <p className="text-xs text-muted-foreground font-bold mb-2 mt-3">DRIVER</p>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-sm font-bold text-primary truncate">{trip.driver?.user?.name || 'N/A'}</p>
                  </div>
                </div>

                {/* Status */}
                <div className="flex flex-col justify-between">
                  <div>
                    <div
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-bold ${getStatusColor(
                        trip.status
                      )} mb-3 shadow-sm`}
                    >
                      {getStatusIcon(trip.status)}
                      {trip.status.replace('_', ' ')}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <p className="font-semibold">Start: <span className="text-foreground">{formatDate(trip.startTime)}</span></p>
                    {trip.endTime && <p className="mt-1 font-semibold">End: <span className="text-foreground">{formatDate(trip.endTime)}</span></p>}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 justify-center">
                  <Button 
                    onClick={() => handleEditTrip(trip)}
                    variant="outline" 
                    size="sm" 
                    className="hover:bg-primary/10"
                  >
                    <Edit2 className="w-3.5 h-3.5 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    onClick={() => handleDeleteTrip(trip.id)}
                    variant="outline" 
                    size="sm" 
                    className="hover:bg-destructive/10 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      )}

      {Array.isArray(filteredTrips) && filteredTrips.length === 0 && (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <p className="text-muted-foreground">No trips found</p>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Trip Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetFormData();
        }}
        title={editingId ? 'Edit Trip' : 'Create New Trip'}
        description={editingId ? 'Update trip details' : 'Enter trip details to create and track a new shipment'}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Route Name *
            </label>
            <Input
              placeholder="e.g., Delhi to Mumbai Express"
              value={formData.routeName}
              onChange={(e) => setFormData({ ...formData, routeName: e.target.value })}
              className="bg-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Source Location *
              </label>
              <Input
                placeholder="e.g., Delhi"
                value={formData.sourceLocation}
                onChange={(e) => setFormData({ ...formData, sourceLocation: e.target.value })}
                className="bg-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Destination Location *
              </label>
              <Input
                placeholder="e.g., Mumbai"
                value={formData.destinationLocation}
                onChange={(e) => setFormData({ ...formData, destinationLocation: e.target.value })}
                className="bg-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Distance (km)
              </label>
              <Input
                type="number"
                placeholder="0"
                value={formData.distance}
                onChange={(e) => setFormData({ ...formData, distance: parseInt(e.target.value) || 0 })}
                className="bg-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Cargo Weight (kg)
              </label>
              <Input
                type="number"
                placeholder="0"
                value={formData.cargoWeight}
                onChange={(e) => setFormData({ ...formData, cargoWeight: parseInt(e.target.value) || 0 })}
                className="bg-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Select Vehicle *
              </label>
              <Select
                value={formData.vehicleId}
                onChange={(value) => setFormData({ ...formData, vehicleId: value })}
                options={vehicles.map(v => ({ value: v.id, label: `${v.registrationNumber} (${v.make} ${v.model})` }))}
                placeholder="Choose a vehicle"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Select Driver
              </label>
              <Select
                value={formData.driverId}
                onChange={(value) => setFormData({ ...formData, driverId: value })}
                options={drivers.map(d => ({ value: d.id, label: d.user?.name || 'Unknown Driver' }))}
                placeholder="Choose a driver"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Start Time *
              </label>
              <input
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-lg bg-input text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                End Time
              </label>
              <input
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-lg bg-input text-foreground"
              />
            </div>
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
              onClick={handleCreateTrip}
              className="flex-1 bg-primary hover:bg-primary/90 text-white"
            >
              {editingId ? 'Update Trip' : 'Create Trip'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
