import { NextRequest, NextResponse } from "next/server";
import { mockDataStore } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vehicleId = searchParams.get("vehicleId");

    let expenses = mockDataStore.getAllExpenses();

    if (vehicleId) {
      expenses = mockDataStore.getExpensesByVehicle(vehicleId);
    }

    const expensesWithDetails = expenses.map(expense => {
      const vehicle = expense.vehicleId ? mockDataStore.getVehicleById(expense.vehicleId) : null;
      const user = mockDataStore.getUserById(expense.createdBy);
      return { ...expense, vehicle, user };
    });

    return NextResponse.json(expensesWithDetails);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch expenses" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const expense = mockDataStore.createExpense(data);
    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create expense" },
      { status: 500 }
    );
  }
}
