'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Expense, Vehicle } from '@/lib/mock-data';
import { Search, Plus, DollarSign, PieChart as PieChartIcon, Trash2, Edit2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ExpenseWithDetails extends Expense {
  vehicle?: Vehicle;
  user?: any;
}

export function ExpensesPage() {
  const [expenses, setExpenses] = useState<ExpenseWithDetails[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<ExpenseWithDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [expenseStats, setExpenseStats] = useState({ total: 0, byType: {} as Record<string, number> });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    expenseType: 'maintenance',
    amount: 0,
    description: '',
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await fetch('/api/expenses');
      const data: ExpenseWithDetails[] = await res.json();
      setExpenses(data);
      setFilteredExpenses(data);

      // Calculate stats
      const total = data.reduce((sum, exp) => sum + exp.amount, 0);
      const byType: Record<string, number> = {};
      data.forEach((exp) => {
        byType[exp.expenseType] = (byType[exp.expenseType] || 0) + exp.amount;
      });

      setExpenseStats({ total, byType });
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = expenses;

    if (searchTerm) {
      filtered = filtered.filter((exp) =>
        exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.vehicle?.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter((exp) => exp.expenseType === typeFilter);
    }

    setFilteredExpenses(filtered);
  }, [searchTerm, typeFilter, expenses]);

  const getTypeColor = (type: Expense['expenseType']) => {
    switch (type) {
      case 'fuel':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'maintenance':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'toll':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'other':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: Expense['expenseType']) => {
    switch (type) {
      case 'fuel':
        return '⛽';
      case 'maintenance':
        return '🔧';
      case 'toll':
        return '🛣️';
      case 'other':
        return '💰';
      default:
        return '💵';
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: '2-digit',
    });
  };

  const chartData = Object.entries(expenseStats.byType).map(([type, amount]) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    value: amount,
  }));

  const COLORS = ['#0066cc', '#00d4ff', '#ffc107', '#28a745'];

  const handleAddExpense = async () => {
    if (!formData.description.trim() || !formData.amount) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingId) {
      setExpenses(expenses.map((e) =>
        e.id === editingId
          ? {
              ...e,
              expenseType: formData.expenseType as any,
              amount: formData.amount,
              description: formData.description,
            }
          : e
      ));
      setEditingId(null);
    } else {
      const newExpense: ExpenseWithDetails = {
        id: `E${Date.now()}`,
        vehicleId: 'V1',
        expenseType: formData.expenseType as any,
        amount: formData.amount,
        description: formData.description,
        date: new Date(),
      };
      setExpenses([...expenses, newExpense]);
    }

    resetFormData();
    setShowModal(false);
  };

  const resetFormData = () => {
    setFormData({
      expenseType: 'maintenance',
      amount: 0,
      description: '',
    });
    setEditingId(null);
  };

  const handleEditExpense = (expense: ExpenseWithDetails) => {
    setFormData({
      expenseType: expense.expenseType,
      amount: expense.amount,
      description: expense.description,
    });
    setEditingId(expense.id);
    setShowModal(true);
  };

  const handleDeleteExpense = (id: string) => {
    if (confirm('Are you sure?')) {
      setExpenses(expenses.filter((e) => e.id !== id));
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading expenses...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Expenses</h1>
          <p className="text-muted-foreground mt-1">Track all operational expenses</p>
        </div>
        <Button 
          onClick={() => setShowModal(true)}
          className="bg-primary hover:bg-primary/90 text-white gap-2 w-fit shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Add Expense
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-3xl font-bold text-foreground">₹{Math.round(expenseStats.total).toLocaleString('en-IN')}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {chartData.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Breakdown by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Filters */}
      <Card className="bg-white/20 dark:bg-black/30 backdrop-blur-lg border-white/30 dark:border-white/20">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-input"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {['all', 'fuel', 'maintenance', 'toll', 'other'].map((type) => (
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

      {/* Expenses Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Expenses</CardTitle>
          <CardDescription>Detailed expense records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredExpenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-card rounded-lg flex items-center justify-center text-xl border border-border">
                    {getTypeIcon(expense.expenseType)}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{expense.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {expense.vehicle?.registrationNumber || 'General'} • {formatDate(expense.createdAt)}
                    </p>
                    {expense.notes && (
                      <p className="text-xs text-muted-foreground mt-1">Note: {expense.notes}</p>
                    )}
                  </div>
                </div>
                <div className="text-right flex items-center gap-4">
                  <div>
                    <div
                      className={`inline-flex px-2 py-1 rounded border text-xs font-medium mb-2 ${getTypeColor(
                        expense.expenseType
                      )}`}
                    >
                      {expense.expenseType}
                    </div>
                    <p className="text-lg font-bold text-foreground">₹{Math.round(expense.amount).toLocaleString('en-IN')}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleEditExpense(expense)}
                      variant="outline" 
                      size="sm" 
                      className="hover:bg-primary/10"
                    >
                      <Edit2 className="w-3.5 h-3.5 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      onClick={() => handleDeleteExpense(expense.id)}
                      variant="outline" 
                      size="sm" 
                      className="hover:bg-destructive/10 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {filteredExpenses.length === 0 && (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <p className="text-muted-foreground">No expenses found</p>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Expense Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetFormData();
        }}
        title={editingId ? 'Edit Expense' : 'Add New Expense'}
        description={editingId ? 'Update expense details' : 'Record a new operational expense'}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Expense Type *
            </label>
            <select
              value={formData.expenseType}
              onChange={(e) => setFormData({ ...formData, expenseType: e.target.value })}
              className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground"
            >
              <option value="fuel">Fuel</option>
              <option value="maintenance">Maintenance</option>
              <option value="toll">Toll</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Amount (₹) *
            </label>
            <Input
              type="number"
              placeholder="0"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) || 0 })}
              className="bg-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description *
            </label>
            <Input
              placeholder="e.g., Monthly maintenance check"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
              onClick={handleAddExpense}
              className="flex-1 bg-primary hover:bg-primary/90 text-white"
            >
              {editingId ? 'Update Expense' : 'Add Expense'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
