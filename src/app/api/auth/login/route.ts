import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";
import { serialize } from "cookie";
import { NextResponse } from "next/server";



export async function POST(req: Request) {
    await connectDB();
    const { username, password } = await req.json();

    if (!username || !password) {
        return new Response("Missing credentials", { status: 400 });
    }

    const user = await User.findOne({ username });

    if (!user) {
        return new Response("Invalid credentials", { status: 401 });
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password);

    if (!isCorrectPassword) {
        return new Response("Invalid credentials", { status: 401 });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
        expiresIn: "1d",
    });

    const cookie = serialize("token", token, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production", 
        sameSite: "strict", 
        path: "/", 
        maxAge: 60 * 60, 
    });

    
    const response = NextResponse.json({ message: "Login successful" });
    response.headers.set("Set-Cookie", cookie);
    return response;
}