import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    console.log("token", token)

    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url)); 
    }

    try {        
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);

        const user = jwtVerify(token, secret); 
        req.headers.set("x-user", JSON.stringify(user)); 
    } catch (error) {
        console.log("error", error)
        return NextResponse.redirect(new URL("/login", req.url)); 
    }

    return NextResponse.next(); 
}

export const config = {
    matcher: ["/"], 
};