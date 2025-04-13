import {  Pencil, Trash2 } from 'lucide-react'
import React,{useState} from 'react'
import CreateModal from './Modals/CreateModal'

interface NoteCardProp {
    note: WithId<Note>
    fetchNotes: () => Promise<void>
}

function NoteCard({note, fetchNotes} : NoteCardProp) {
    const [showEditModal, setShowEditModal] = useState(false);
    const [hovered, setHovered] = useState('');

    const onDelete = async(e: React.MouseEvent) => {
        e.stopPropagation();
        const response = await fetch(`/api/notes`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: note._id
            })
        })
        if(response.status === 204) {
            fetchNotes();
        }
        console.log('respnose', response)
    }

    const onNoteCardClick = () => {
        setShowEditModal(true); 
        setHovered('');
    }
    
    return (
        <div className={`border p-2 rounded-md flex flex-col gap-y-4 relative h-[200px] w-[200px] ${hovered === note._id && 'border-[#b9b13d] border-4'} ${note.status === 'completed' && 'border-teal-600'} transition ease-in `} onMouseEnter={() => setHovered(note._id)} onMouseLeave={() => setHovered('')} onClick={() => onNoteCardClick()}>
            <div className='flex gap-x-4 self-end'>
                <Pencil className='top-2 right-12 cursor-pointer w-5 h-5' onClick={() => setShowEditModal(true)}/>
                <Trash2 className=' top-2 right-2 cursor-pointer w-5 h-5' onClick={(e) => onDelete(e)}/>
            </div>
            <h1 className='text-xl overflow-auto no-scrollbar'>{note.title}</h1>
            <div className='overflow-y-scroll no-scrollbar'>
                {note.content}
            </div>
            {showEditModal && <CreateModal onClose={() => setShowEditModal(false)} existingNote={note} fetchNotes={fetchNotes}/>}
        </div>
    )
}

export default NoteCard