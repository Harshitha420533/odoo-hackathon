import { NextRequest, NextResponse } from "next/server";
import { mockDataStore } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vehicleId = searchParams.get("vehicleId");

    let logs = mockDataStore.getAllFuelLogs();

    if (vehicleId) {
      logs = mockDataStore.getFuelLogsByVehicle(vehicleId);
    }

    const logsWithVehicle = logs.map(log => {
      const vehicle = mockDataStore.getVehicleById(log.vehicleId);
      return { ...log, vehicle };
    });

    return NextResponse.json(logsWithVehicle);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch fuel logs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const log = mockDataStore.createFuelLog(data);
    return NextResponse.json(log, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create fuel log" },
      { status: 500 }
    );
  }
}
