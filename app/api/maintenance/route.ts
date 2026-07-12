import { NextRequest, NextResponse } from "next/server";
import { mockDataStore } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vehicleId = searchParams.get("vehicleId");

    let logs = mockDataStore.getAllMaintenanceLogs();

    if (vehicleId) {
      logs = mockDataStore.getMaintenanceLogsByVehicle(vehicleId);
    }

    const logsWithVehicle = logs.map(log => {
      const vehicle = mockDataStore.getVehicleById(log.vehicleId);
      return { ...log, vehicle };
    });

    return NextResponse.json(logsWithVehicle);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch maintenance logs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const log = mockDataStore.createMaintenanceLog(data);
    return NextResponse.json(log, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create maintenance log" },
      { status: 500 }
    );
  }
}
