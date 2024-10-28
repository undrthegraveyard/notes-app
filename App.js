import React, { useEffect } from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import { nanoid } from "nanoid"
import { onSnapshot, addDoc, doc, deleteDoc } from "firebase/firestore" //onSnapshot listner watches over a db like a eagle, it executes the same operations on our local code that were performed on the database by the user. It helps to maintain a single source of truth. 
import { notesCollection, db } from "./firebase"

export default function App() {
    //initialised state for notes 
    //lazily initialised state so that it does not run on every render
    const [notes, setNotes] = React.useState([])
    
    //useEffect to mount onSnapshot listner  
    useEffect(() => {
        const unsubscribe = onSnapshot(notesCollection, function (snapshot){
            //sync our database with our local code
            const notesArray = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id 
            }))
            setNotes(notesArray)
        })

        return unsubscribe
    }, [])

    //initialised state for setting up the current note id
    const [currentNoteId, setCurrentNoteId] = React.useState("")

    const currentNote = notes.find(note => note.id === currentNoteId) || notes[0]

    //function to create a new note
    async function createNewNote() {
        const newNote = {
            body: "# Type your markdown note's title here"
        }
        const newNoteRef = await addDoc(notesCollection, newNote)
        setCurrentNoteId(newNoteRef.id)
    }
    
    //initializing a useEffect for setting up the currentNoteId 
    useEffect(() => {
        if(!currentNoteId) {
            setCurrentNoteId(notes[0].id)
        }
    }, 
    [notes])

    //function to delete a note
    async function deleteNote(noteId) {
        //get the reference of the document which needs to be deleted 
      const docRef = doc(db, "notes", noteId )
       //delete the document using deleteDoc function
      await deleteDoc(docRef)
    }

    //function to update the note
    function updateNote(text) {
        //initialising a new array
        const newArray = [];
        //calling setnotes to change the notes array state
        setNotes(oldNotes => {
            //looping over the existing array
            for(let note of oldNotes){
                //condition to fing the current note being edited
                if(note.id === currentNoteId){
                    //pushing the current note at the top of the array
                    newArray.unshift({...note, body: text})
                }
                else {
                    //otherwise pushing it at the bottom of the array
                    newArray.push(note)
                }
            }

        return newArray
        })
    }
    
    return (
        <main>
        {
            notes.length > 0 
            ?
            <Split 
                sizes={[30, 70]} 
                direction="horizontal" 
                className="split"
            >
                <Sidebar
                    notes={notes}
                    currentNote={currentNote}
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNewNote}
                    deleteNote={deleteNote}
                />
                    
                <Editor 
                    currentNote={currentNote} 
                    updateNote={updateNote} 
                />
                
            </Split>
            :
            <div className="no-notes">
                <h1>You have no notes</h1>
                <button 
                    className="first-note" 
                    onClick={createNewNote}
                >
                    Create one now
                </button>
            </div>
            
        }
        </main>
    )
}
