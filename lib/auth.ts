import { hash, compare } from "bcryptjs";
import { db } from "./db";
import { users } from "./schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production"
);

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword);
}

export async function createToken(userId: string) {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string) {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload;
  } catch (err) {
    return null;
  }
}

export async function registerUser(email: string, password: string, name: string, role: string = "operator") {
  const hashedPassword = await hashPassword(password);
  
  const result = await db
    .insert(users)
    .values({
      email,
      password: hashedPassword,
      name,
      role: role as any,
    })
    .returning();

  return result[0];
}

export async function loginUser(email: string, password: string) {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user[0]) {
    throw new Error("User not found");
  }

  const passwordMatch = await verifyPassword(password, user[0].password);
  if (!passwordMatch) {
    throw new Error("Invalid password");
  }

  return user[0];
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return null;
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return null;
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, payload.userId as string))
    .limit(1);

  return user[0] || null;
}
