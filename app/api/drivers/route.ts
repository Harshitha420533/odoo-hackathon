import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { drivers, users } from "@/lib/schema";
import { mockDataStore } from "@/lib/mock-data";

export async function GET() {
  try {
    const driversData = await db.select().from(drivers);

    // Fetch associated user info for each driver
    const driversWithUsers = await Promise.all(
      driversData.map(async (driver: any) => {
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.id, driver.userId));
        return { ...driver, user };
      })
    );

    return NextResponse.json(driversWithUsers);
  } catch (error) {
    console.error("Error fetching drivers from DB, using mock data:", error);
    // Fallback to mock data
    const mockDrivers = mockDataStore.getAllDrivers();
    const driversWithUsers = mockDrivers.map(driver => {
      const user = mockDataStore.getUserById(driver.userId);
      return { ...driver, user };
    });
    return NextResponse.json(driversWithUsers);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      licenseNumber,
      licenseExpiry,
      licenseClass,
      aadharNumber,
      emergencyContact,
      emergencyPhone,
    } = body;

    if (!userId || !licenseNumber || !licenseExpiry || !licenseClass) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    try {
      // Check if driver already exists for this user
      const existingDriver = await db
        .select()
        .from(drivers)
        .where(eq(drivers.userId, userId));

      if (existingDriver.length > 0) {
        return NextResponse.json(
          { error: "Driver profile already exists for this user" },
          { status: 400 }
        );
      }

      const [newDriver] = await db
        .insert(drivers)
        .values({
          userId,
          licenseNumber,
          licenseExpiry: new Date(licenseExpiry),
          licenseClass,
          aadharNumber: aadharNumber || null,
          emergencyContact: emergencyContact || null,
          emergencyPhone: emergencyPhone || null,
        })
        .returning();

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId));

      return NextResponse.json({ ...newDriver, user }, { status: 201 });
    } catch (dbError) {
      // Fallback to mock data
      console.error("DB error, using mock data:", dbError);
      const newDriver = mockDataStore.createDriver({
        userId,
        licenseNumber,
        licenseExpiry: new Date(licenseExpiry),
        licenseClass,
        aadharNumber: aadharNumber || null,
        emergencyContact: emergencyContact || null,
        emergencyPhone: emergencyPhone || null,
        totalTrips: 0,
        totalKilometers: 0,
        rating: 5,
        isVerified: false,
      });
      const user = mockDataStore.getUserById(userId);
      return NextResponse.json({ ...newDriver, user }, { status: 201 });
    }
  } catch (error) {
    console.error("Error creating driver:", error);
    return NextResponse.json({ error: "Failed to create driver" }, { status: 500 });
  }
}
