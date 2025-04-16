import React, {  useState, useEffect, useCallback } from 'react'

interface CreateModalProp {
    onClose: () => void;
    existingNote?: WithId<Note>
    fetchNotes: () => Promise<void>
}

function CreateModal({onClose, existingNote, fetchNotes}: CreateModalProp) {
    const [note , setNote] = useState<Note>({title: existingNote?.title || '', content: existingNote?.content || '', status: existingNote?.status || 'pending'});
    const [initialMount, setInitialMount] = useState(true);
    const [uploading, setUploading] = useState(false);

    const onSubmit =  async()=> {
        console.log("note", existingNote)
        if(!note) return;
        if(!note.title && !note.content) return;
        const response = await fetch('/api/notes', {
            method: existingNote ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({...note, _id: existingNote?._id, username: localStorage.getItem('username')}),
        })
        console.log("response", response);
        if(response.status === 201 || response.status === 200) {
            setNote({title: '', content: '', status: 'pending'});
            await fetchNotes();
        }
    }

    const saveAndClose = useCallback(async(e: React.MouseEvent) => {
        e.stopPropagation();
        if(uploading) return;
        console.log("note", note)
        if(!note || (note.content === ''  && note.title === '')) {
            onClose();
            return;
        }
        setUploading(true);
        await onSubmit();
        // setNotes(notes => [...notes, {title: note.title, content: note.content}]);
        onClose(); 
    }, [note, uploading])

    useEffect(() => {
        if(initialMount) {
            setInitialMount(false);
            return;
        }
        const timeoutId = setTimeout(() => {
          console.log("User stopped typing. Save note or trigger action:", note);
          onSubmit();
        }, 5000);
    
        return () => clearTimeout(timeoutId);
    }, [note, initialMount]);

    useEffect(() => {
      // Define reusable event handler functions
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };
    
      const handleEnter = async (e: KeyboardEvent) => {
        if (e.key === "Enter") {
          await onSubmit();
          onClose();
        }
      };
    
      // Attach event listeners
      window.addEventListener("keydown", handleEscape);
      window.addEventListener("keydown", handleEnter);
    
      // Cleanup function: Remove event listeners
      return () => {
        window.removeEventListener("keydown", handleEscape);
        window.removeEventListener("keydown", handleEnter);
      };
    }, [note, onSubmit]);

    const markAsDone = useCallback(async() => {
       const res = await fetch(`/api/notes`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({...note,_id: existingNote?._id , status: 'completed'})
       })
       if(res.status == 200) onClose();
    }, [])
    

    return (
        <div className='w-screen h-screen fixed inset-0 z-[2] text-[#161616] flex flex-col justify-center items-center bg-[#000]/60' onClick={e => saveAndClose(e)}>
          <div
            className="w-[50%] h-[80%] rounded-3xl p-10 bg-white flex flex-col gap-y-4 items-center relative"
            onClick={(e) => e.stopPropagation()}
            >
            <div className='top-2 right-2 rounded-md px-4 py-2 border self-end hover:scale-110 cursor-pointer' onClick={markAsDone}>Mark as done</div>
            {/* Title Input */}
            <input
                type="text"
                className="input-field text-2xl"
                placeholder="Enter title here..."
                value={note.title}
                onChange={(e) =>
                setNote((prev) => ({ title: e.target.value, content: prev.content, status: prev.status }))
                }
            />

            {/* Content Textarea */}
            <textarea
                className="input-field h-full w-full resize-none text-lg"
                placeholder="Write your task..."
                value={note.content}
                onChange={(e) =>
                setNote((prev) => ({ title: prev.title, content: e.target.value, status: prev.status }))
                }
            />

            
            </div>
        </div>
    )
}

export default CreateModal