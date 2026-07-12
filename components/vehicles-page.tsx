'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { useGlassMorphism } from '@/lib/glass-morphism-context';
import { Search, Plus, AlertCircle, CheckCircle2, Clock, Trash2, Edit2 } from 'lucide-react';

type Vehicle = {
  id: string;
  registrationNumber: string;
  make: string;
  model: string;
  year: number;
  chassisNumber: string;
  capacity: number;
  maxCargoWeight: number | string;
  fuelType: string;
  status: 'available' | 'in_use' | 'maintenance' | 'inactive';
  totalKilometers?: number | string;
  lastMaintenanceDate?: string;
  createdAt?: string;
  updatedAt?: string;
};

export function VehiclesPage() {
  const { mode } = useGlassMorphism();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    registrationNumber: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    capacity: 4,
    maxCargoWeight: 1000,
    fuelType: 'diesel',
    status: 'available' as const,
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      // Check localStorage first
      const stored = localStorage.getItem('transitops_vehicles');
      if (stored) {
        const data: Vehicle[] = JSON.parse(stored);
        setVehicles(data);
        setFilteredVehicles(data);
      } else {
        const res = await fetch('/api/vehicles');
        const data: Vehicle[] = await res.json();
        setVehicles(data);
        setFilteredVehicles(data);
        // Save to localStorage
        localStorage.setItem('transitops_vehicles', JSON.stringify(data));
      }
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = vehicles;

    if (searchTerm) {
      filtered = filtered.filter(
        (v) =>
          v.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.model.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((v) => v.status === statusFilter);
    }

    setFilteredVehicles(filtered);
  }, [searchTerm, statusFilter, vehicles]);

  const getStatusColor = (status: Vehicle['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'in_use':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'maintenance':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Vehicle['status']) => {
    switch (status) {
      case 'available':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'in_use':
        return <Clock className="w-4 h-4" />;
      case 'maintenance':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const handleAddVehicle = async () => {
    if (!formData.registrationNumber.trim() || !formData.make.trim() || !formData.model.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    let updatedVehicles: Vehicle[];
    if (editingId) {
      // Edit existing vehicle
      updatedVehicles = vehicles.map((v) =>
        v.id === editingId
          ? {
              ...v,
              registrationNumber: formData.registrationNumber,
              make: formData.make,
              model: formData.model,
              year: formData.year,
              capacity: formData.capacity,
              maxCargoWeight: formData.maxCargoWeight,
              fuelType: formData.fuelType,
              status: formData.status as "available" | "in_use" | "maintenance" | "inactive",
            }
          : v
      );
      setEditingId(null);
    } else {
      // Add new vehicle
      const newVehicle: Vehicle = {
        id: `V${Date.now()}`,
        registrationNumber: formData.registrationNumber,
        make: formData.make,
        model: formData.model,
        year: formData.year,
        capacity: formData.capacity,
        maxCargoWeight: formData.maxCargoWeight,
        fuelType: formData.fuelType,
        status: formData.status as "available" | "in_use" | "maintenance" | "inactive",
        totalKilometers: 0,
        createdAt: new Date().toISOString(),
      };
      updatedVehicles = [...vehicles, newVehicle];
    }

    setVehicles(updatedVehicles);
    // Save to localStorage
    localStorage.setItem('transitops_vehicles', JSON.stringify(updatedVehicles));
    resetFormData();
    setShowModal(false);
  };

  const resetFormData = () => {
    setFormData({
      registrationNumber: '',
      make: '',
      model: '',
      year: new Date().getFullYear(),
      capacity: 4,
      maxCargoWeight: 1000,
      fuelType: 'diesel',
      status: 'available',
    });
    setEditingId(null);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setFormData({
      registrationNumber: vehicle.registrationNumber,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      capacity: vehicle.capacity,
      maxCargoWeight: vehicle.maxCargoWeight,
      fuelType: vehicle.fuelType,
      status: vehicle.status,
    });
    setEditingId(vehicle.id);
    setShowModal(true);
  };

  const handleDeleteVehicle = (id: string) => {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      const updated = vehicles.filter((v) => v.id !== id);
      setVehicles(updated);
      localStorage.setItem('transitops_vehicles', JSON.stringify(updated));
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading vehicles...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Vehicles</h1>
          <p className="text-muted-foreground mt-1">Manage your fleet</p>
        </div>
        <Button 
          onClick={() => setShowModal(true)}
          className="bg-primary hover:bg-primary/90 text-white gap-2 w-fit shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Add Vehicle
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20 dark:border-white/10">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-input"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'available', 'in_use', 'maintenance', 'inactive'].map((status) => (
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

      {/* Vehicles Grid */}
      {Array.isArray(filteredVehicles) && filteredVehicles.length > 0 && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <Card key={vehicle.id} className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20 dark:border-white/10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-accent/5">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg font-bold text-primary">{vehicle.registrationNumber}</CardTitle>
                  <CardDescription>
                    {vehicle.make} {vehicle.model} ({vehicle.year})
                  </CardDescription>
                </div>
                <div
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-bold ${getStatusColor(
                    vehicle.status
                  )}`}
                >
                  {getStatusIcon(vehicle.status)}
                  {vehicle.status.replace('_', ' ')}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground font-semibold">Capacity</p>
                  <p className="text-lg font-bold text-primary mt-1">{vehicle.capacity}</p>
                  <p className="text-xs text-muted-foreground">seats</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground font-semibold">Cargo Weight</p>
                  <p className="text-lg font-bold text-primary mt-1">{vehicle.maxCargoWeight}</p>
                  <p className="text-xs text-muted-foreground">kg</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground font-semibold">Fuel Type</p>
                  <p className="text-lg font-bold text-primary mt-1">{vehicle.fuelType}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground font-semibold">Odometer</p>
                  <p className="text-lg font-bold text-primary mt-1">{Math.round(vehicle.totalKilometers)}</p>
                  <p className="text-xs text-muted-foreground">km</p>
                </div>
              </div>
              <div className="pt-3 border-t border-border flex gap-2">
                <Button 
                  onClick={() => handleEditVehicle(vehicle)}
                  variant="outline" 
                  size="sm" 
                  className="flex-1 hover:bg-primary/10"
                >
                  <Edit2 className="w-3.5 h-3.5 mr-1" />
                  Edit
                </Button>
                <Button 
                  onClick={() => handleDeleteVehicle(vehicle.id)}
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

      {Array.isArray(filteredVehicles) && filteredVehicles.length === 0 && (
        <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20 dark:border-white/10">
          <CardContent className="pt-12 pb-12 text-center">
            <p className="text-muted-foreground">No vehicles found</p>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Vehicle Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetFormData();
        }}
        title={editingId ? 'Edit Vehicle' : 'Add New Vehicle'}
        description={editingId ? 'Update vehicle details' : 'Enter vehicle details to add it to your fleet'}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Registration Number *
            </label>
            <Input
              placeholder="e.g., DL-01-AB-1234"
              value={formData.registrationNumber}
              onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
              className="bg-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Make *
              </label>
              <Input
                placeholder="e.g., Tata"
                value={formData.make}
                onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                className="bg-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Model *
              </label>
              <Input
                placeholder="e.g., 407"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="bg-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Year
              </label>
              <Input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                className="bg-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Vehicle Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground"
              >
                <option value="available">Available</option>
                <option value="in_use">In Use</option>
                <option value="maintenance">Maintenance</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Fuel Type
              </label>
              <select
                value={formData.fuelType}
                onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground"
              >
                <option value="diesel">Diesel</option>
                <option value="petrol">Petrol</option>
                <option value="cng">CNG</option>
                <option value="lpg">LPG</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Capacity (Seats)
              </label>
              <Input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                className="bg-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Max Cargo Weight (kg)
              </label>
              <Input
                type="number"
                value={formData.maxCargoWeight}
                onChange={(e) => setFormData({ ...formData, maxCargoWeight: parseInt(e.target.value) })}
                className="bg-input"
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
              onClick={handleAddVehicle}
              className="flex-1 bg-primary hover:bg-primary/90 text-white"
            >
              {editingId ? 'Update Vehicle' : 'Add Vehicle'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
