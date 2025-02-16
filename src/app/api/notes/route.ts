import { connectDB } from "@/lib/mongodb";
import Note from "@/models/Note";
import { NextResponse } from "next/server";

// GET: Fetch all notes
export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");
  if (!username) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const notes = await Note.find({username});
  return NextResponse.json(notes);
}

export async function POST(req: Request) {
  await connectDB();
  const { title, content, username } = await req.json();

  console.log("title, content, username", title, content, username)

  if(!username) return NextResponse.json({message: "username not found"}, {status: 400})

  const newNote = new Note({ title, content, username });
  await newNote.save();
  console.log("note saved successfully")
  return NextResponse.json(newNote, { status: 201 });

}


export async function PUT(req: Request) {
  const { _id, title, content } = await req.json();
  await Note.findByIdAndUpdate(_id, { title, content });
  return NextResponse.json({ message: "Note updated successfully" }, { status: 200 });
}

export async function DELETE(req: Request) {
  await connectDB();
  const { id } = await req.json();
  await Note.findByIdAndDelete(id);
  return new NextResponse(null, { status: 204 });
}