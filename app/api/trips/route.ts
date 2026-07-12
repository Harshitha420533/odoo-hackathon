import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { trips, vehicles, drivers, users } from "@/lib/schema";
import { mockDataStore } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const driverId = searchParams.get("driverId");

    let query = db.select().from(trips);

    if (status) {
      query = query.where(eq(trips.status, status as any));
    }

    const tripsData = await query;

    // Fetch related vehicle and driver data
    const tripsWithDetails = await Promise.all(
      tripsData.map(async (trip: any) => {
        const [vehicle] = await db
          .select()
          .from(vehicles)
          .where(eq(vehicles.id, trip.vehicleId));

        let driver = null;
        let driverUser = null;
        if (trip.driverId) {
          const driverData = await db
            .select()
            .from(drivers)
            .where(eq(drivers.id, trip.driverId));
          
          if (driverData.length > 0) {
            driver = driverData[0];
            const userData = await db
              .select()
              .from(users)
              .where(eq(users.id, driver.userId));
            driverUser = userData[0] || null;
          }
        }

        return {
          ...trip,
          vehicle,
          driver,
          driverUser,
        };
      })
    );

    return NextResponse.json(tripsWithDetails);
  } catch (error) {
    console.error("Error fetching trips from DB, using mock data:", error);
    // Fallback to mock data
    let mockTrips = mockDataStore.getAllTrips();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    
    if (status) {
      mockTrips = mockTrips.filter(t => t.status === status as any);
    }

    const tripsWithDetails = mockTrips.map(trip => {
      const vehicle = mockDataStore.getVehicleById(trip.vehicleId);
      const driver = mockDataStore.getDriverById(trip.driverId);
      const driverUser = driver ? mockDataStore.getUserById(driver.userId) : null;
      return {
        ...trip,
        vehicle,
        driver,
        driverUser,
      };
    });

    return NextResponse.json(tripsWithDetails);
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const {
      vehicleId,
      driverId,
      routeName,
      sourceLocation,
      destinationLocation,
      startTime,
      cargoWeight,
      cargoDescription,
    } = data;

    if (!vehicleId || !routeName || !sourceLocation || !destinationLocation || !startTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    try {
      const [newTrip] = await db
        .insert(trips)
        .values({
          vehicleId,
          driverId: driverId || null,
          routeName,
          sourceLocation,
          destinationLocation,
          startTime: new Date(startTime),
          cargoWeight: cargoWeight ? parseFloat(cargoWeight) : 0,
          cargoDescription: cargoDescription || null,
          status: "pending",
        })
        .returning();

      return NextResponse.json(newTrip, { status: 201 });
    } catch (dbError) {
      // Fallback to mock data
      console.error("DB error, using mock data:", dbError);
      const newTrip = mockDataStore.createTrip({
        vehicleId,
        driverId: driverId || "",
        routeName,
        sourceLocation,
        destinationLocation,
        startTime: new Date(startTime),
        cargoWeight: cargoWeight ? parseFloat(cargoWeight) : 0,
        cargoDescription: cargoDescription || null,
        status: "pending",
      });
      return NextResponse.json(newTrip, { status: 201 });
    }
  } catch (error) {
    console.error("Error creating trip:", error);
    return NextResponse.json({ error: "Failed to create trip" }, { status: 500 });
  }
}
