'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { FuelLog, Vehicle } from '@/lib/mock-data';
import { Search, Plus, TrendingDown, Zap, Trash2, Edit2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface FuelWithVehicle extends FuelLog {
  vehicle?: Vehicle;
}

export function FuelPage() {
  const [logs, setLogs] = useState<FuelWithVehicle[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<FuelWithVehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [fuelStats, setFuelStats] = useState({ totalCost: 0, totalLiters: 0, avgEfficiency: 0 });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fuelStation: '',
    quantityInLiters: 0,
    cost: 0,
    currentOdometer: 0,
  });

  useEffect(() => {
    fetchFuelLogs();
  }, []);

  const fetchFuelLogs = async () => {
    try {
      const res = await fetch('/api/fuel');
      const data: FuelWithVehicle[] = await res.json();
      setLogs(data);
      setFilteredLogs(data);

      // Calculate stats
      const totalCost = data.reduce((sum, log) => sum + log.cost, 0);
      const totalLiters = data.reduce((sum, log) => sum + log.quantityInLiters, 0);
      const avgEfficiency = data.length > 0 ? (totalLiters / data.length) * 10 : 0;

      setFuelStats({
        totalCost,
        totalLiters,
        avgEfficiency,
      });
    } catch (error) {
      console.error('Failed to fetch fuel logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = logs;

    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.vehicle?.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.fuelStation?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredLogs(filtered);
  }, [searchTerm, logs]);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: '2-digit',
    });
  };

  const handleAddFuel = async () => {
    if (!formData.fuelStation.trim() || !formData.quantityInLiters || !formData.cost) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingId) {
      setLogs(logs.map((l) =>
        l.id === editingId
          ? {
              ...l,
              fuelStation: formData.fuelStation,
              quantityInLiters: formData.quantityInLiters,
              cost: formData.cost,
              currentOdometer: formData.currentOdometer,
            }
          : l
      ));
      setEditingId(null);
    } else {
      const newLog: FuelWithVehicle = {
        id: `F${Date.now()}`,
        vehicleId: 'V1',
        fuelStation: formData.fuelStation,
        quantityInLiters: formData.quantityInLiters,
        cost: formData.cost,
        currentOdometer: formData.currentOdometer,
        createdAt: new Date(),
      };
      setLogs([...logs, newLog]);
    }

    resetFormData();
    setShowModal(false);
  };

  const resetFormData = () => {
    setFormData({
      fuelStation: '',
      quantityInLiters: 0,
      cost: 0,
      currentOdometer: 0,
    });
    setEditingId(null);
  };

  const handleEditLog = (log: FuelWithVehicle) => {
    setFormData({
      fuelStation: log.fuelStation,
      quantityInLiters: log.quantityInLiters,
      cost: log.cost,
      currentOdometer: log.currentOdometer,
    });
    setEditingId(log.id);
    setShowModal(true);
  };

  const handleDeleteLog = (id: string) => {
    if (confirm('Are you sure?')) {
      setLogs(logs.filter((l) => l.id !== id));
    }
  };

  const chartData = logs
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .slice(-7)
    .map((log) => ({
      date: formatDate(log.createdAt),
      cost: log.cost,
      liters: log.quantityInLiters,
    }));

  if (loading) {
    return <div className="text-center py-12">Loading fuel logs...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Fuel Management</h1>
          <p className="text-muted-foreground mt-1">Track fuel consumption and costs</p>
        </div>
        <Button 
          onClick={() => setShowModal(true)}
          className="bg-primary hover:bg-primary/90 text-white gap-2 w-fit shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Add Fuel Log
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Cost</p>
                <p className="text-3xl font-bold text-foreground">₹{Math.round(fuelStats.totalCost).toLocaleString('en-IN')}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Liters</p>
                <p className="text-3xl font-bold text-foreground">{Math.round(fuelStats.totalLiters)}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Efficiency</p>
                <p className="text-3xl font-bold text-foreground">{fuelStats.avgEfficiency.toFixed(1)} L</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Fuel Consumption Trend</CardTitle>
            <CardDescription>Last 7 fuel logs</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="cost" fill="#0066cc" name="Cost (₹)" />
                <Bar yAxisId="right" dataKey="liters" fill="#00d4ff" name="Liters" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search fuel logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-input"
            />
          </div>
        </CardContent>
      </Card>

      {/* Fuel Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Fuel Logs</CardTitle>
          <CardDescription>All fuel transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left py-2 px-2 font-medium">Vehicle</th>
                  <th className="text-left py-2 px-2 font-medium">Fuel Station</th>
                  <th className="text-left py-2 px-2 font-medium">Quantity</th>
                  <th className="text-left py-2 px-2 font-medium">Cost</th>
                  <th className="text-left py-2 px-2 font-medium">Odometer</th>
                  <th className="text-left py-2 px-2 font-medium">Date</th>
                  <th className="text-left py-2 px-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-2">{log.vehicle?.registrationNumber}</td>
                    <td className="py-3 px-2">{log.fuelStation || 'N/A'}</td>
                    <td className="py-3 px-2">{log.quantityInLiters} L</td>
                    <td className="py-3 px-2 font-medium">₹{Math.round(log.cost).toLocaleString('en-IN')}</td>
                    <td className="py-3 px-2">{Math.round(log.currentOdometer)} km</td>
                    <td className="py-3 px-2 text-muted-foreground">{formatDate(log.createdAt)}</td>
                    <td className="py-3 px-2 flex gap-2">
                      <Button 
                        onClick={() => handleEditLog(log)}
                        variant="outline" 
                        size="sm" 
                        className="hover:bg-primary/10"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button 
                        onClick={() => handleDeleteLog(log.id)}
                        variant="outline" 
                        size="sm" 
                        className="hover:bg-destructive/10 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {filteredLogs.length === 0 && (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <p className="text-muted-foreground">No fuel logs found</p>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Fuel Log Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetFormData();
        }}
        title={editingId ? 'Edit Fuel Log' : 'Add Fuel Log'}
        description={editingId ? 'Update fuel log details' : 'Record a new fuel transaction'}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Fuel Station Name *
            </label>
            <Input
              placeholder="e.g., Shell Station"
              value={formData.fuelStation}
              onChange={(e) => setFormData({ ...formData, fuelStation: e.target.value })}
              className="bg-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Quantity (Liters) *
              </label>
              <Input
                type="number"
                placeholder="0"
                value={formData.quantityInLiters}
                onChange={(e) => setFormData({ ...formData, quantityInLiters: parseFloat(e.target.value) || 0 })}
                className="bg-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Cost (₹) *
              </label>
              <Input
                type="number"
                placeholder="0"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: parseInt(e.target.value) || 0 })}
                className="bg-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Odometer Reading (km)
            </label>
            <Input
              type="number"
              placeholder="0"
              value={formData.currentOdometer}
              onChange={(e) => setFormData({ ...formData, currentOdometer: parseInt(e.target.value) || 0 })}
              className="bg-input"
            />
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
              onClick={handleAddFuel}
              className="flex-1 bg-primary hover:bg-primary/90 text-white"
            >
              {editingId ? 'Update Log' : 'Add Log'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
