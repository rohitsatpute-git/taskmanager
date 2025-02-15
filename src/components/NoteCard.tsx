import { Delete, Pencil, Trash2 } from 'lucide-react'
import React,{useState} from 'react'
import CreateModal from './Modals/CreateModal'

interface NoteCardProp {
    note: WithId<Note>
}

function NoteCard({note} : NoteCardProp) {
    const [showEditModal, setShowEditModal] = useState(false);

    const onDelete = async() => {
        const response = await fetch(`http://localhost:3000/api/notes`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: note._id
            })
        })
        console.log("response", response);
    }
    
    return (
        <div className='border p-2 rounded-md h-fit flex flex-col gap-y-4 relative'>
            <Pencil className='absolute top-2 right-12 cursor-pointer' onClick={() => setShowEditModal(true)}/>
            <Trash2 className='absolute top-2 right-2 cursor-pointer' onClick={onDelete}/>
            <h1>{note.title}</h1>
            <div>
                {note.content}
            </div>
            {showEditModal && <CreateModal onClose={() => setShowEditModal(false)} existingNote={note}/>}
        </div>
    )
}

export default NoteCard