import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export const POST = async (req: Request) => {
    try{
        await connectDB();
        const { username, email, password } = await req.json();



        console.log("username and all", username, email, password);

        const allUsers = await User.find({});
        console.log('allusets', allUsers)

        const userAlreadyPresent = await User.findOne({username});
        if(userAlreadyPresent) return NextResponse.json('username already existed');

        const emailAlreadyPresent = await User.findOne({email});
        if(emailAlreadyPresent) return NextResponse.json('email alrealy present');

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ email, password: hashedPassword, username });
        return NextResponse.json(user, { status: 201 });
    }catch {
        return NextResponse.json('something went wrong')
    }
}