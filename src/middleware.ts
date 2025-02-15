import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    console.log("token", token);

    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        
        const { payload: user } = await jwtVerify(token, secret);

        const requestHeaders = new Headers(req.headers);
        requestHeaders.set("x-user", JSON.stringify(user));

        const res = NextResponse.next({
            request: { headers: requestHeaders },
        });

        res.headers.append("Access-Control-Allow-Origin", "https://taskmanager-sigma-six.vercel.app/");

        return res;
    } catch (error) {
        console.log("error", error);
        return NextResponse.redirect(new URL("/login", req.url));
    }
}


export const config = {
    matcher: ["/"], 
};