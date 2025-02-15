import { Plus } from 'lucide-react';
import React, { useState } from 'react'

interface CreateModalProp {
    onClose: () => void;
    existingNote?: WithId<Note>
}

function CreateModal({onClose, existingNote}: CreateModalProp) {
    const [note , setNote] = useState<Note>({title: existingNote?.title || '', content: existingNote?.content || ''});

    const submit =  async() => {
        console.log("note", existingNote)
        const response = await fetch('http://localhost:3000/api/notes', {
            method: existingNote ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({...note, _id: existingNote?._id}),
        })
        console.log("response", response);
        if(response.status === 201) {
            setNote({title: '', content: ''});
        }
        onClose();
    }

    return (
        <div className='w-screen h-screen fixed inset-0 z-[2] text-[#161616] flex flex-col justify-center items-center bg-[#000]/90'>
            <div className='p-10 bg-white flex flex-col gap-y-4 items-center relative'>
                { <Plus className='absolute top-2 right-2 text-[#000] rotate-45 cursor-pointer' onClick={onClose}/>}
                <div className='flex gap-x-2'>
                    <span>Enter Title</span>
                    <input type='text' className='border' value={note.title} onChange={(e) => setNote(prev => ({title: e.target.value, content: prev.content}))}/>
                </div>
                <div className='flex gap-x-2'>
                    <span>Enter Content</span>
                    <input type='text' className='border' value={note.content} onChange={(e) => setNote(prev => ({title: prev.title, content: e.target.value}))}/>
                </div>
                <button onClick={submit} className='border w-fit p-2'>Submit</button>
            </div>
        </div>
    )
}

export default CreateModal