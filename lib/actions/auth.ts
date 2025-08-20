"use server";

import { prisma } from "../db";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const SECRET_KEY = process.env.SECRET_KEY || "";

// ✅ Helper function: generate JWT
function generateToken(userId: number) {
  return jwt.sign({ id: userId }, SECRET_KEY, { expiresIn: "7d" }); // Token valid for 7 days
}

// ✅ Check Authentication
export const checkAuthentication = async (token: string): Promise<boolean> => {
  try {
    jwt.verify(token, SECRET_KEY);
    return true;
  } catch {
    return false;
  }
};

// ✅ Login function
export async function login(username: string, password: string) {
  try {
    const user = await prisma.user.findFirst({
      where: { username },
    });

    if (!user) {
      return { status: 404, message: "User not found", token: "" };
    }

    // Compare password with hashed password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return { status: 401, message: "Invalid credentials", token: "" };
    }

    const token = generateToken(user.id);

    return {
      status: 200,
      message: "Login successful",
      token,
    };
  } catch (error) {
    console.error(error);
    return { status: 500, message: "Server error", token: "" };
  }
}

// ✅ Register function
export async function register(
  name: string,
  username: string,
  email: string,
  password: string,
  state: string,
  bio: string
) {
  try {
    // Check if email/username already exists
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      return { status: 400, message: "Email or Username already exists", token: "" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        state,
        bio,
        token: 0,
      },
    });

    const token = generateToken(user.id);

    return {
      status: 200,
      message: "Registration successful",
      token,
    };
  } catch (e) {
    console.error(e);
    return { status: 500, message: "Server error", token: "" };
  }
}
