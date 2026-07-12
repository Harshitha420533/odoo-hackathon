import { v4 as uuidv4 } from "uuid";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "manager" | "driver" | "operator";
  phone?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Vehicle {
  id: string;
  registrationNumber: string;
  make: string;
  model: string;
  year: number;
  chassisNumber: string;
  capacity: number;
  maxCargoWeight: number;
  fuelType: string;
  status: "available" | "in_use" | "maintenance" | "inactive";
  insuranceExpiry?: Date;
  lastMaintenanceDate?: Date;
  totalKilometers: number;
  createdAt: Date;
}

export interface Driver {
  id: string;
  userId: string;
  licenseNumber: string;
  licenseExpiry: Date;
  licenseClass: string;
  aadharNumber?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  totalTrips: number;
  totalKilometers: number;
  rating: number;
  isVerified: boolean;
  createdAt: Date;
}

export interface Trip {
  id: string;
  vehicleId: string;
  driverId: string;
  routeName: string;
  sourceLocation: string;
  destinationLocation: string;
  startTime: Date;
  endTime?: Date;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  cargoWeight: number;
  cargoDescription?: string;
  distanceTraveled?: number;
  fuelConsumed?: number;
  notes?: string;
  createdAt: Date;
}

export interface MaintenanceLog {
  id: string;
  vehicleId: string;
  maintenanceType: "routine" | "repair" | "inspection" | "urgent";
  description: string;
  cost: number;
  nextMaintenanceDue?: Date;
  completedDate: Date;
  technician?: string;
}

export interface FuelLog {
  id: string;
  vehicleId: string;
  quantityInLiters: number;
  cost: number;
  fuelStation?: string;
  currentOdometer: number;
  createdAt: Date;
}

export interface Expense {
  id: string;
  vehicleId?: string;
  expenseType: "fuel" | "maintenance" | "toll" | "other";
  amount: number;
  description: string;
  createdBy: string;
  notes?: string;
  createdAt: Date;
}

// Mock Data Storage with localStorage persistence
class MockDataStore {
  private users: Map<string, User> = new Map();
  private vehicles: Map<string, Vehicle> = new Map();
  private drivers: Map<string, Driver> = new Map();
  private trips: Map<string, Trip> = new Map();
  private maintenanceLogs: Map<string, MaintenanceLog> = new Map();
  private fuelLogs: Map<string, FuelLog> = new Map();
  private expenses: Map<string, Expense> = new Map();
  private authTokens: Map<string, { userId: string; expiresAt: Date }> = new Map();
  private isInitialized = false;

  constructor() {
    this.loadFromStorage();
    if (!this.isInitialized) {
      this.initializeMockData();
      this.saveToStorage();
    }
  }

  private saveToStorage() {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        const data = {
          vehicles: Array.from(this.vehicles.values()),
          drivers: Array.from(this.drivers.values()),
          trips: Array.from(this.trips.values()),
          maintenanceLogs: Array.from(this.maintenanceLogs.values()),
          fuelLogs: Array.from(this.fuelLogs.values()),
          expenses: Array.from(this.expenses.values()),
        };
        localStorage.setItem('transitops_data', JSON.stringify(data));
      } catch (e) {
        console.error('Failed to save to localStorage', e);
      }
    }
  }

  private loadFromStorage() {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        const data = localStorage.getItem('transitops_data');
        if (data) {
          const parsed = JSON.parse(data);
          parsed.vehicles?.forEach((v: Vehicle) => this.vehicles.set(v.id, v));
          parsed.drivers?.forEach((d: Driver) => this.drivers.set(d.id, d));
          parsed.trips?.forEach((t: Trip) => this.trips.set(t.id, t));
          parsed.maintenanceLogs?.forEach((m: MaintenanceLog) => this.maintenanceLogs.set(m.id, m));
          parsed.fuelLogs?.forEach((f: FuelLog) => this.fuelLogs.set(f.id, f));
          parsed.expenses?.forEach((e: Expense) => this.expenses.set(e.id, e));
          this.isInitialized = true;
        }
      } catch (e) {
        console.error('Failed to load from localStorage', e);
      }
    }
  }

  private initializeMockData() {
    // Admin User
    const adminId = uuidv4();
    this.users.set(adminId, {
      id: adminId,
      email: "admin@transitops.com",
      name: "Admin User",
      role: "admin",
      phone: "+91-9999999999",
      isActive: true,
      createdAt: new Date(),
    });

    // Manager User
    const managerId = uuidv4();
    this.users.set(managerId, {
      id: managerId,
      email: "manager@transitops.com",
      name: "Operations Manager",
      role: "manager",
      phone: "+91-8888888888",
      isActive: true,
      createdAt: new Date(),
    });

    // Driver Users
    const driver1Id = uuidv4();
    const driver1UserId = uuidv4();
    this.users.set(driver1UserId, {
      id: driver1UserId,
      email: "driver1@transitops.com",
      name: "Rajesh Kumar",
      role: "driver",
      phone: "+91-7777777777",
      isActive: true,
      createdAt: new Date(),
    });

    const driver2Id = uuidv4();
    const driver2UserId = uuidv4();
    this.users.set(driver2UserId, {
      id: driver2UserId,
      email: "driver2@transitops.com",
      name: "Amit Singh",
      role: "driver",
      phone: "+91-6666666666",
      isActive: true,
      createdAt: new Date(),
    });

    // Vehicles
    const vehicle1Id = uuidv4();
    this.vehicles.set(vehicle1Id, {
      id: vehicle1Id,
      registrationNumber: "DL-01-AB-1234",
      make: "Tata",
      model: "LPT 1613",
      year: 2022,
      chassisNumber: "TAT1234567890123",
      capacity: 2,
      maxCargoWeight: 5000,
      fuelType: "Diesel",
      status: "in_use",
      insuranceExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      lastMaintenanceDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      totalKilometers: 45000,
      createdAt: new Date(),
    });

    const vehicle2Id = uuidv4();
    this.vehicles.set(vehicle2Id, {
      id: vehicle2Id,
      registrationNumber: "DL-01-AB-5678",
      make: "Ashok Leyland",
      model: "AL 3118",
      year: 2021,
      chassisNumber: "ASH9876543210987",
      capacity: 2,
      maxCargoWeight: 6000,
      fuelType: "Diesel",
      status: "available",
      insuranceExpiry: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      lastMaintenanceDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      totalKilometers: 32000,
      createdAt: new Date(),
    });

    const vehicle3Id = uuidv4();
    this.vehicles.set(vehicle3Id, {
      id: vehicle3Id,
      registrationNumber: "DL-01-AB-9012",
      make: "Mahindra",
      model: "Bolero Pik-Up",
      year: 2023,
      chassisNumber: "MAH1357924680246",
      capacity: 2,
      maxCargoWeight: 1000,
      fuelType: "Petrol",
      status: "maintenance",
      insuranceExpiry: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000),
      lastMaintenanceDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      totalKilometers: 12000,
      createdAt: new Date(),
    });

    // Drivers
    this.drivers.set(driver1Id, {
      id: driver1Id,
      userId: driver1UserId,
      licenseNumber: "DL1234567890",
      licenseExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      licenseClass: "HMV",
      aadharNumber: "1234-5678-9012",
      emergencyContact: "Priya Kumar",
      emergencyPhone: "+91-7777777776",
      totalTrips: 245,
      totalKilometers: 125000,
      rating: 4.8,
      isVerified: true,
      createdAt: new Date(),
    });

    this.drivers.set(driver2Id, {
      id: driver2Id,
      userId: driver2UserId,
      licenseNumber: "DL9876543210",
      licenseExpiry: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000),
      licenseClass: "HMV",
      aadharNumber: "9876-5432-1098",
      emergencyContact: "Sharma Family",
      emergencyPhone: "+91-6666666665",
      totalTrips: 189,
      totalKilometers: 98000,
      rating: 4.6,
      isVerified: true,
      createdAt: new Date(),
    });

    // Trips
    const trip1Id = uuidv4();
    this.trips.set(trip1Id, {
      id: trip1Id,
      vehicleId: vehicle1Id,
      driverId: driver1Id,
      routeName: "Delhi to Mumbai Express",
      sourceLocation: "Delhi",
      destinationLocation: "Mumbai",
      startTime: new Date(Date.now() - 12 * 60 * 60 * 1000),
      endTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: "completed",
      cargoWeight: 4500,
      cargoDescription: "Electronics and Textiles",
      distanceTraveled: 1400,
      fuelConsumed: 280,
      notes: "Delivery completed on time",
      createdAt: new Date(),
    });

    const trip2Id = uuidv4();
    this.trips.set(trip2Id, {
      id: trip2Id,
      vehicleId: vehicle2Id,
      driverId: driver2Id,
      routeName: "Delhi to Bangalore Express",
      sourceLocation: "Delhi",
      destinationLocation: "Bangalore",
      startTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
      status: "pending",
      cargoWeight: 0,
      cargoDescription: "Awaiting cargo",
      notes: "Scheduled for afternoon departure",
      createdAt: new Date(),
    });

    // Maintenance Logs
    this.maintenanceLogs.set(uuidv4(), {
      id: uuidv4(),
      vehicleId: vehicle1Id,
      maintenanceType: "routine",
      description: "Regular oil change and filter replacement",
      cost: 5000,
      nextMaintenanceDue: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      completedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      technician: "Ramesh Sharma",
    });

    // Fuel Logs
    this.fuelLogs.set(uuidv4(), {
      id: uuidv4(),
      vehicleId: vehicle1Id,
      quantityInLiters: 100,
      cost: 9500,
      fuelStation: "Indian Oil - Delhi",
      currentOdometer: 45000,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    });

    // Expenses
    this.expenses.set(uuidv4(), {
      id: uuidv4(),
      vehicleId: vehicle1Id,
      expenseType: "toll",
      amount: 500,
      description: "Highway toll - Mumbai Route",
      createdBy: managerId,
      notes: "Toll collected at entry point",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    });
  }

  // User methods
  getAllUsers() {
    return Array.from(this.users.values());
  }

  getUserById(id: string) {
    return this.users.get(id);
  }

  getUserByEmail(email: string) {
    return Array.from(this.users.values()).find(u => u.email === email);
  }

  createUser(user: Omit<User, 'id' | 'createdAt'>) {
    const id = uuidv4();
    const newUser: User = { ...user, id, createdAt: new Date() };
    this.users.set(id, newUser);
    return newUser;
  }

  // Vehicle methods
  getAllVehicles() {
    return Array.from(this.vehicles.values());
  }

  getVehicleById(id: string) {
    return this.vehicles.get(id);
  }

  getVehiclesByStatus(status: Vehicle['status']) {
    return Array.from(this.vehicles.values()).filter(v => v.status === status);
  }

  createVehicle(vehicle: Omit<Vehicle, 'id' | 'createdAt'>) {
    const id = uuidv4();
    const newVehicle: Vehicle = { ...vehicle, id, createdAt: new Date() };
    this.vehicles.set(id, newVehicle);
    this.saveToStorage();
    return newVehicle;
  }

  updateVehicle(id: string, updates: Partial<Vehicle>) {
    const vehicle = this.vehicles.get(id);
    if (!vehicle) return null;
    const updated = { ...vehicle, ...updates };
    this.vehicles.set(id, updated);
    this.saveToStorage();
    return updated;
  }

  deleteVehicle(id: string) {
    this.vehicles.delete(id);
    this.saveToStorage();
  }

  // Driver methods
  getAllDrivers() {
    return Array.from(this.drivers.values());
  }

  getDriverById(id: string) {
    return this.drivers.get(id);
  }

  getDriverByUserId(userId: string) {
    return Array.from(this.drivers.values()).find(d => d.userId === userId);
  }

  createDriver(driver: Omit<Driver, 'id' | 'createdAt'>) {
    const id = uuidv4();
    const newDriver: Driver = { ...driver, id, createdAt: new Date() };
    this.drivers.set(id, newDriver);
    return newDriver;
  }

  // Trip methods
  getAllTrips() {
    return Array.from(this.trips.values());
  }

  getTripById(id: string) {
    return this.trips.get(id);
  }

  getTripsByStatus(status: Trip['status']) {
    return Array.from(this.trips.values()).filter(t => t.status === status);
  }

  getTripsByDriverId(driverId: string) {
    return Array.from(this.trips.values()).filter(t => t.driverId === driverId);
  }

  createTrip(trip: Omit<Trip, 'id' | 'createdAt'>) {
    const id = uuidv4();
    const newTrip: Trip = { ...trip, id, createdAt: new Date() };
    this.trips.set(id, newTrip);
    this.saveToStorage();
    return newTrip;
  }

  updateTrip(id: string, updates: Partial<Trip>) {
    const trip = this.trips.get(id);
    if (!trip) return null;
    const updated = { ...trip, ...updates };
    this.trips.set(id, updated);
    this.saveToStorage();
    return updated;
  }

  deleteTrip(id: string) {
    this.trips.delete(id);
    this.saveToStorage();
  }

  // Maintenance Logs
  getAllMaintenanceLogs() {
    return Array.from(this.maintenanceLogs.values());
  }

  getMaintenanceLogsByVehicle(vehicleId: string) {
    return Array.from(this.maintenanceLogs.values()).filter(m => m.vehicleId === vehicleId);
  }

  createMaintenanceLog(log: Omit<MaintenanceLog, 'id'>) {
    const id = uuidv4();
    const newLog: MaintenanceLog = { ...log, id };
    this.maintenanceLogs.set(id, newLog);
    this.saveToStorage();
    return newLog;
  }

  updateMaintenanceLog(id: string, updates: Partial<MaintenanceLog>) {
    const log = this.maintenanceLogs.get(id);
    if (!log) return null;
    const updated = { ...log, ...updates };
    this.maintenanceLogs.set(id, updated);
    this.saveToStorage();
    return updated;
  }

  deleteMaintenanceLog(id: string) {
    this.maintenanceLogs.delete(id);
    this.saveToStorage();
  }

  // Fuel Logs
  getAllFuelLogs() {
    return Array.from(this.fuelLogs.values());
  }

  getFuelLogsByVehicle(vehicleId: string) {
    return Array.from(this.fuelLogs.values()).filter(f => f.vehicleId === vehicleId);
  }

  createFuelLog(log: Omit<FuelLog, 'id'>) {
    const id = uuidv4();
    const newLog: FuelLog = { ...log, id };
    this.fuelLogs.set(id, newLog);
    this.saveToStorage();
    return newLog;
  }

  updateFuelLog(id: string, updates: Partial<FuelLog>) {
    const log = this.fuelLogs.get(id);
    if (!log) return null;
    const updated = { ...log, ...updates };
    this.fuelLogs.set(id, updated);
    this.saveToStorage();
    return updated;
  }

  deleteFuelLog(id: string) {
    this.fuelLogs.delete(id);
    this.saveToStorage();
  }

  // Expenses
  getAllExpenses() {
    return Array.from(this.expenses.values());
  }

  getExpensesByVehicle(vehicleId: string) {
    return Array.from(this.expenses.values()).filter(e => e.vehicleId === vehicleId);
  }

  createExpense(expense: Omit<Expense, 'id'>) {
    const id = uuidv4();
    const newExpense: Expense = { ...expense, id };
    this.expenses.set(id, newExpense);
    this.saveToStorage();
    return newExpense;
  }

  updateExpense(id: string, updates: Partial<Expense>) {
    const expense = this.expenses.get(id);
    if (!expense) return null;
    const updated = { ...expense, ...updates };
    this.expenses.set(id, updated);
    this.saveToStorage();
    return updated;
  }

  deleteExpense(id: string) {
    this.expenses.delete(id);
    this.saveToStorage();
  }

  // Auth
  createAuthToken(userId: string) {
    const token = uuidv4();
    this.authTokens.set(token, {
      userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    return token;
  }

  verifyAuthToken(token: string) {
    const auth = this.authTokens.get(token);
    if (!auth || auth.expiresAt < new Date()) {
      return null;
    }
    return auth.userId;
  }
}

export const mockDataStore = new MockDataStore();
