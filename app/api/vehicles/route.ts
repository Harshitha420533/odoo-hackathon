import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { vehicles } from "@/lib/schema";
import { mockDataStore } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");

    let query = db.select().from(vehicles);

    if (status) {
      query = query.where(eq(vehicles.status, status as any));
    }

    const result = await query;
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching vehicles from DB, using mock data:", error);
    // Fallback to mock data
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    
    const mockVehicles = mockDataStore.getAllVehicles();
    const filtered = status ? mockVehicles.filter(v => v.status === status) : mockVehicles;
    return NextResponse.json(filtered);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      registrationNumber,
      make,
      model,
      year,
      chassisNumber,
      capacity,
      maxCargoWeight,
      fuelType,
    } = body;

    if (!registrationNumber || !make || !model || !year || !chassisNumber) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    try {
      const [newVehicle] = await db
        .insert(vehicles)
        .values({
          registrationNumber,
          make,
          model,
          year: parseInt(year),
          chassisNumber,
          capacity: parseInt(capacity) || 0,
          maxCargoWeight: maxCargoWeight ? parseFloat(maxCargoWeight) : 0,
          fuelType: fuelType || "Diesel",
          status: "available",
        })
        .returning();

      return NextResponse.json(newVehicle, { status: 201 });
    } catch (dbError) {
      // Fallback to mock data
      console.error("DB error, using mock data:", dbError);
      const newVehicle = mockDataStore.createVehicle({
        registrationNumber,
        make,
        model,
        year: parseInt(year),
        chassisNumber,
        capacity: parseInt(capacity) || 0,
        maxCargoWeight: maxCargoWeight ? parseFloat(maxCargoWeight) : 0,
        fuelType: fuelType || "Diesel",
        status: "available",
        totalKilometers: 0,
      });
      return NextResponse.json(newVehicle, { status: 201 });
    }
  } catch (error) {
    console.error("Error creating vehicle:", error);
    return NextResponse.json({ error: "Failed to create vehicle" }, { status: 500 });
  }
}
