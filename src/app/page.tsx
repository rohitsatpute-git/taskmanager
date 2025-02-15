'use client'
import { useEffect, useState } from "react";
import NoteCard from "../components/NoteCard";
import CreateModal from "@/components/Modals/CreateModal";

export default function Home() {

    const [notes, setNotes] = useState<WithId<Note>[]>([]);
    const [showModal, setShowModal] = useState(false);

    const fetchNotes = async () => {
      const res = await fetch("/api/notes");
      const notes = await res.json();
      setNotes(notes);
      console.log("notes", notes)
    }

    useEffect(() => {
        fetchNotes();
    }, [showModal])


    const saveNote = async() => {
        const response = await fetch('/api/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: 'New Note', content: 'This is the content of the new note.' }),
        });
        console.log("response", response);
    }

    const logout = async() => {
        const response = await fetch(`/api/auth/logout`, {
            method: 'POST',
            credentials: "include",
        });
        console.log("response", response);
        window.location.href = '/login';
    }


    return (
      <div className="p-10 h-screen w-screen fixed flex justify-center items-center z-[1]">
          <div className="flex flex-wrap  gap-4 w-full h-full p-10 rounded-md border boder-[#fff] relative">
              <div className="absolute top-2 right-2 bg-white px-4 py-2 rounded-md text-[#161616] cursor-pointer" onClick={() => setShowModal(true)}>Add New Note</div>
              <div className="absolute top-24 right-2 bg-white px-4 py-2 rounded-md text-[#161616] cursor-pointer" onClick={() => saveNote()}>saveNote</div>
              <div className="absolute top-44 right-2 bg-white px-4 py-2 rounded-md text-[#161616] cursor-pointer" onClick={() => logout()}>LoutOut</div>

              {
                notes.map((note, index) => (
                  <NoteCard key={index} note={note}/>
                ))
              }

          </div>
          {showModal && <CreateModal onClose={() => setShowModal(false)}/>}
      </div>
    );
}
