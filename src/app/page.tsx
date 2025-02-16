'use client'
import {  useEffect, useState } from "react";
import NoteCard from "../components/NoteCard";
import CreateModal from "@/components/Modals/CreateModal";
import { Github, Linkedin } from "lucide-react";

export default function Home() {

    const [notes, setNotes] = useState<WithId<Note>[]>([]);
    const [showModal, setShowModal] = useState(false);

    const fetchNotes = async () => {
      const res = await fetch(`/api/notes?username=${localStorage.getItem('username')}`);
      const notes = await res.json();
      setNotes(notes);
      console.log("notes", notes)
    }

    const logout = async() => {
        const response = await fetch(`/api/auth/logout`, {
            method: 'POST',
            credentials: "include",
        });
        console.log("response", response);
        window.location.href = '/login';
    }

    useEffect(() => {
        fetchNotes();
    }, [])

    return (
      <div className="p-10 h-screen w-screen fixed flex flex-col justify-center items-center z-[1] gap-y-2">
          <div className="flex flex-wrap  gap-4 w-full h-full p-10 rounded-md border boder-[#fff] relative overflow-scroll">
              <div className="fixed top-12 right-12 bg-white px-4 py-2 rounded-md text-[#161616] cursor-pointer z-[2]" onClick={() => logout()}>Logout</div>
              <div className="fixed top-24 right-12 bg-white px-4 py-2 rounded-md text-[#161616] cursor-pointer z-[2]" onClick={() => setShowModal(true)}>Add Note</div>

              {
                notes.map((note, index) => (
                  <NoteCard key={index} note={note} fetchNotes={fetchNotes}/>
                ))
              }

          </div>
          {showModal && <CreateModal onClose={() => setShowModal(false)} fetchNotes={fetchNotes}/>}
            <div className="flex self-end gap-x-2">
              <span>© Rohit</span>
              <Github className="cursor-pointer" onClick={() => window.location.href = 'https://github.com/rohitsatpute-git/taskmanager'}/>
          { <Linkedin className="cursor-pointer" onClick={() => window.location.href = 'https://www.linkedin.com/in/rohitsatpute01/'}/> }
          </div>
      </div>
    );
}
