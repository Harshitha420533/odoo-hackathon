import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { trips } from "@/lib/schema";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, driverId, endTime, distanceTraveled, fuelConsumed, notes } = body;

    // Build update object with only provided fields
    const updateData: any = {};
    if (status) updateData.status = status;
    if (driverId) updateData.driverId = driverId;
    if (endTime) updateData.endTime = new Date(endTime);
    if (distanceTraveled !== undefined) updateData.distanceTraveled = parseFloat(distanceTraveled);
    if (fuelConsumed !== undefined) updateData.fuelConsumed = parseFloat(fuelConsumed);
    if (notes) updateData.notes = notes;
    updateData.updatedAt = new Date();

    const [updatedTrip] = await db
      .update(trips)
      .set(updateData)
      .where(eq(trips.id, id))
      .returning();

    if (!updatedTrip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    return NextResponse.json(updatedTrip);
  } catch (error) {
    console.error("Error updating trip:", error);
    return NextResponse.json({ error: "Failed to update trip" }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const tripData = await db
      .select()
      .from(trips)
      .where(eq(trips.id, id));

    if (tripData.length === 0) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    return NextResponse.json(tripData[0]);
  } catch (error) {
    console.error("Error fetching trip:", error);
    return NextResponse.json({ error: "Failed to fetch trip" }, { status: 500 });
  }
}
