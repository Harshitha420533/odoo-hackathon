'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { MaintenanceLog, Vehicle } from '@/lib/mock-data';
import { Search, Plus, AlertTriangle, CheckCircle2, Clock, Wrench, Trash2, Edit2 } from 'lucide-react';

interface MaintenanceWithVehicle extends MaintenanceLog {
  vehicle?: Vehicle;
}

export function MaintenancePage() {
  const [logs, setLogs] = useState<MaintenanceWithVehicle[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<MaintenanceWithVehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    maintenanceType: 'routine',
    description: '',
    cost: 0,
    vehicleId: '',
    completedDate: new Date().toISOString().split('T')[0],
    technician: '',
  });

  useEffect(() => {
    fetchMaintenance();
  }, []);

  const fetchMaintenance = async () => {
    try {
      const res = await fetch('/api/maintenance');
      const data: MaintenanceWithVehicle[] = await res.json();
      setLogs(data);
      setFilteredLogs(data);
    } catch (error) {
      console.error('Failed to fetch maintenance logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = logs;

    if (searchTerm) {
      filtered = filtered.filter((log) =>
        log.vehicle?.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter((log) => log.maintenanceType === typeFilter);
    }

    setFilteredLogs(filtered);
  }, [searchTerm, typeFilter, logs]);

  const getTypeColor = (type: MaintenanceLog['maintenanceType']) => {
    switch (type) {
      case 'routine':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'repair':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'inspection':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: MaintenanceLog['maintenanceType']) => {
    switch (type) {
      case 'routine':
        return <Clock className="w-4 h-4" />;
      case 'repair':
        return <Wrench className="w-4 h-4" />;
      case 'inspection':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'urgent':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: '2-digit',
    });
  };

  const handleAddLog = async () => {
    if (!formData.description.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingId) {
      setLogs(logs.map((l) =>
        l.id === editingId
          ? {
              ...l,
              maintenanceType: formData.maintenanceType as any,
              description: formData.description,
              cost: formData.cost,
            }
          : l
      ));
      setEditingId(null);
    } else {
      const newLog: MaintenanceWithVehicle = {
        id: `M${Date.now()}`,
        vehicleId: 'V1',
        maintenanceType: formData.maintenanceType as any,
        description: formData.description,
        cost: formData.cost,
        date: new Date(),
        nextDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      };
      setLogs([...logs, newLog]);
    }

    resetFormData();
    setShowModal(false);
  };

  const resetFormData = () => {
    setFormData({
      maintenanceType: 'routine',
      description: '',
      cost: 0,
      vehicleId: '',
      completedDate: new Date().toISOString().split('T')[0],
      technician: '',
    });
    setEditingId(null);
  };

  const handleEditLog = (log: MaintenanceWithVehicle) => {
    setFormData({
      maintenanceType: log.maintenanceType,
      description: log.description,
      cost: log.cost,
      vehicleId: log.vehicleId || '',
      completedDate: log.date ? new Date(log.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      technician: '',
    });
    setEditingId(log.id);
    setShowModal(true);
  };

  const handleDeleteLog = (id: string) => {
    if (confirm('Are you sure?')) {
      setLogs(logs.filter((l) => l.id !== id));
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading maintenance logs...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Maintenance</h1>
          <p className="text-muted-foreground mt-1">Track vehicle maintenance records</p>
        </div>
        <Button 
          onClick={() => setShowModal(true)}
          className="bg-primary hover:bg-primary/90 text-white gap-2 w-fit shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Add Log
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-white/20 dark:bg-black/30 backdrop-blur-lg border-white/30 dark:border-white/20">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search maintenance..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-input"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {['all', 'routine', 'repair', 'inspection', 'urgent'].map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    typeFilter === type
                      ? 'bg-primary text-white'
                      : 'bg-muted text-foreground hover:bg-muted/70'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Logs */}
      <div className="space-y-3">
        {filteredLogs.map((log) => (
          <Card key={log.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Vehicle & Description */}
                <div className="md:col-span-2">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Wrench className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{log.vehicle?.registrationNumber}</p>
                      <p className="text-sm text-muted-foreground">{log.description}</p>
                    </div>
                  </div>
                </div>

                {/* Type & Cost */}
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Type</p>
                  <div
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded border text-xs font-medium ${getTypeColor(
                      log.maintenanceType
                    )}`}
                  >
                    {getTypeIcon(log.maintenanceType)}
                    {log.maintenanceType}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">Cost</p>
                  <p className="text-sm font-medium">₹{log.cost.toLocaleString('en-IN')}</p>
                </div>

                {/* Dates & Technician */}
                <div>
                  <p className="text-xs text-muted-foreground">Completed</p>
                  <p className="text-sm font-medium">{formatDate(log.completedDate)}</p>
                  <p className="text-xs text-muted-foreground mt-3">Technician</p>
                  <p className="text-sm font-medium">{log.technician || 'N/A'}</p>
                </div>

                {/* Action */}
                <div className="flex flex-col gap-2 justify-end">
                  <Button 
                    onClick={() => handleEditLog(log)}
                    variant="outline" 
                    size="sm" 
                    className="w-full hover:bg-primary/10"
                  >
                    <Edit2 className="w-3.5 h-3.5 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    onClick={() => handleDeleteLog(log.id)}
                    variant="outline" 
                    size="sm" 
                    className="w-full hover:bg-destructive/10 text-destructive hover:text-destructive"
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

      {filteredLogs.length === 0 && (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <p className="text-muted-foreground">No maintenance logs found</p>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Maintenance Log Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetFormData();
        }}
        title={editingId ? 'Edit Maintenance Log' : 'Add Maintenance Log'}
        description={editingId ? 'Update maintenance details' : 'Record a new maintenance activity for a vehicle'}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Maintenance Type *
            </label>
            <select
              value={formData.maintenanceType}
              onChange={(e) => setFormData({ ...formData, maintenanceType: e.target.value })}
              className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground"
            >
              <option value="routine">Routine</option>
              <option value="repair">Repair</option>
              <option value="inspection">Inspection</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description *
            </label>
            <Input
              placeholder="e.g., Engine oil change"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Cost (₹)
            </label>
            <Input
              type="number"
              placeholder="0"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: parseInt(e.target.value) || 0 })}
              className="bg-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Completed Date *
            </label>
            <Input
              type="date"
              value={formData.completedDate}
              onChange={(e) => setFormData({ ...formData, completedDate: e.target.value })}
              className="bg-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Technician Name
            </label>
            <Input
              placeholder="e.g., Ramesh Sharma"
              value={formData.technician}
              onChange={(e) => setFormData({ ...formData, technician: e.target.value })}
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
              onClick={handleAddLog}
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
