import { connectDB } from "@/lib/mongodb";
import Note from "@/models/Note";
import { NextResponse } from "next/server";

// GET: Fetch all notes
export async function GET() {
  await connectDB();
  const notes = await Note.find({});
  return NextResponse.json(notes);
}

export async function POST(req: Request) {
  await connectDB();
  const { title, content } = await req.json();

  if (!title || !content) {
    return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
  }
  const newNote = new Note({ title, content });
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
  return NextResponse.json({ message: "Note deleted successfully" }, { status: 200 });
}