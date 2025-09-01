import { NextResponse } from "next/server";
import { register } from "@/lib/actions/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, username, email, password, state, bio } = body;

    const result = await register({
      name,
      username,
      email,
      password,
      state,
      bio,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Register API error:", error);
    return NextResponse.json(
      { status: 500, error: "Something went wrong" },
      { status: 500 }
    );
  }
}
