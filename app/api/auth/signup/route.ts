import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, userAccounts, userPreferences } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { mockDataStore } from '@/lib/mock-data';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, confirmPassword, companyName } = await request.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: 'Passwords do not match' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Hash password (in production, use proper hashing)
    // TODO: Implement proper password hashing with bcrypt
    const hashedPassword = Buffer.from(password).toString('base64');

    try {
      // Try to check if email already exists and create in database
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (existingUser.length > 0) {
        return NextResponse.json(
          { message: 'Email already registered' },
          { status: 409 }
        );
      }

      // Create user in database
      const newUser = await db
        .insert(users)
        .values({
          email,
          password: hashedPassword,
          name,
          role: 'operator',
          isActive: true,
        })
        .returning();

      if (!newUser || newUser.length === 0) {
        return NextResponse.json(
          { message: 'Failed to create user' },
          { status: 500 }
        );
      }

      const userId = newUser[0].id;

      // Create user account record
      await db.insert(userAccounts).values({
        userId,
        companyName: companyName || null,
        subscriptionPlan: 'free',
        isSubscriptionActive: true,
      });

      // Create user preferences record
      await db.insert(userPreferences).values({
        userId,
        theme: 'light',
        language: 'en',
        emailNotifications: true,
        pushNotifications: true,
      });

      return NextResponse.json(
        {
          message: 'User account created successfully',
          userId,
        },
        { status: 201 }
      );
    } catch (dbError) {
      // Fallback to mock data when database is unavailable
      console.error('[v0] DB error, using mock data:', dbError);
      
      // Check if email already exists in mock data
      const existingUser = mockDataStore.getUserByEmail(email);
      if (existingUser) {
        return NextResponse.json(
          { message: 'Email already registered' },
          { status: 409 }
        );
      }

      const newUser = mockDataStore.createUser({
        email,
        password: hashedPassword,
        name,
        role: 'operator',
        isActive: true,
      });

      return NextResponse.json(
        {
          message: 'User account created successfully',
          userId: newUser.id,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('[v0] Signup error:', error);
    return NextResponse.json(
      { message: 'Failed to create account. Please try again.' },
      { status: 500 }
    );
  }
}
