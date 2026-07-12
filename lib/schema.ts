import { pgTable, text, varchar, integer, decimal, timestamp, boolean, uuid, pgEnum } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Enums
export const userRoleEnum = pgEnum("user_role", ["admin", "manager", "driver", "operator"]);
export const vehicleStatusEnum = pgEnum("vehicle_status", ["available", "in_use", "maintenance", "inactive"]);
export const tripStatusEnum = pgEnum("trip_status", ["pending", "in_progress", "completed", "cancelled"]);
export const maintenanceTypeEnum = pgEnum("maintenance_type", ["routine", "repair", "inspection", "urgent"]);
export const expenseTypeEnum = pgEnum("expense_type", ["fuel", "maintenance", "toll", "other"]);

// Users Table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  role: userRoleEnum("role").default("operator"),
  phone: varchar("phone", { length: 20 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Vehicles Table
export const vehicles = pgTable("vehicles", {
  id: uuid("id").primaryKey().defaultRandom(),
  registrationNumber: varchar("registration_number", { length: 50 }).unique().notNull(),
  make: varchar("make", { length: 100 }).notNull(),
  model: varchar("model", { length: 100 }).notNull(),
  year: integer("year").notNull(),
  chassisNumber: varchar("chassis_number", { length: 100 }).unique().notNull(),
  capacity: integer("capacity").notNull(), // Seating capacity
  maxCargoWeight: decimal("max_cargo_weight", { precision: 10, scale: 2 }).notNull(), // in kg
  fuelType: varchar("fuel_type", { length: 20 }).notNull(), // Diesel, Petrol, etc.
  status: vehicleStatusEnum("status").default("available"),
  insuranceExpiry: timestamp("insurance_expiry"),
  lastMaintenanceDate: timestamp("last_maintenance_date"),
  totalKilometers: decimal("total_kilometers", { precision: 15, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Drivers Table
export const drivers = pgTable("drivers", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  licenseNumber: varchar("license_number", { length: 50 }).unique().notNull(),
  licenseExpiry: timestamp("license_expiry").notNull(),
  licenseClass: varchar("license_class", { length: 10 }).notNull(), // HMV, LMV, etc.
  aadharNumber: varchar("aadhar_number", { length: 20 }).unique(),
  emergencyContact: varchar("emergency_contact", { length: 100 }),
  emergencyPhone: varchar("emergency_phone", { length: 20 }),
  totalTrips: integer("total_trips").default(0),
  totalKilometers: decimal("total_kilometers", { precision: 15, scale: 2 }).default("0"),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("5.00"),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Trips Table
export const trips = pgTable("trips", {
  id: uuid("id").primaryKey().defaultRandom(),
  vehicleId: uuid("vehicle_id").references(() => vehicles.id).notNull(),
  driverId: uuid("driver_id").references(() => drivers.id).notNull(),
  routeName: varchar("route_name", { length: 255 }).notNull(),
  sourceLocation: varchar("source_location", { length: 255 }).notNull(),
  destinationLocation: varchar("destination_location", { length: 255 }).notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  status: tripStatusEnum("status").default("pending"),
  cargoWeight: decimal("cargo_weight", { precision: 10, scale: 2 }).default("0"), // in kg
  cargoDescription: text("cargo_description"),
  distanceTraveled: decimal("distance_traveled", { precision: 10, scale: 2 }),
  fuelConsumed: decimal("fuel_consumed", { precision: 10, scale: 2 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Maintenance Logs Table
export const maintenanceLogs = pgTable("maintenance_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  vehicleId: uuid("vehicle_id").references(() => vehicles.id).notNull(),
  maintenanceType: maintenanceTypeEnum("maintenance_type").notNull(),
  description: text("description").notNull(),
  cost: decimal("cost", { precision: 10, scale: 2 }).notNull(),
  nextMaintenanceDue: timestamp("next_maintenance_due"),
  completedDate: timestamp("completed_date").defaultNow(),
  technician: varchar("technician", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Fuel Logs Table
export const fuelLogs = pgTable("fuel_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  vehicleId: uuid("vehicle_id").references(() => vehicles.id).notNull(),
  quantityInLiters: decimal("quantity_in_liters", { precision: 10, scale: 2 }).notNull(),
  cost: decimal("cost", { precision: 10, scale: 2 }).notNull(),
  fuelStation: varchar("fuel_station", { length: 100 }),
  currentOdometer: decimal("current_odometer", { precision: 15, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Expenses Table
export const expenses = pgTable("expenses", {
  id: uuid("id").primaryKey().defaultRandom(),
  vehicleId: uuid("vehicle_id").references(() => vehicles.id),
  expenseType: expenseTypeEnum("expense_type").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description").notNull(),
  createdBy: uuid("created_by").references(() => users.id).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User Accounts Table
export const userAccounts = pgTable("user_accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  companyName: varchar("company_name", { length: 255 }),
  industry: varchar("industry", { length: 100 }),
  subscriptionPlan: varchar("subscription_plan", { length: 50 }).default("free"), // free, pro, enterprise
  isSubscriptionActive: boolean("is_subscription_active").default(true),
  subscriptionStartDate: timestamp("subscription_start_date").defaultNow(),
  subscriptionEndDate: timestamp("subscription_end_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User Preferences Table
export const userPreferences = pgTable("user_preferences", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  theme: varchar("theme", { length: 10 }).default("light"), // light, dark
  language: varchar("language", { length: 10 }).default("en"),
  emailNotifications: boolean("email_notifications").default(true),
  pushNotifications: boolean("push_notifications").default(true),
  notificationsFrequency: varchar("notifications_frequency", { length: 20 }).default("daily"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
