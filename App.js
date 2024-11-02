import React, { useEffect, useState } from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import { 
        onSnapshot, 
        addDoc, 
        doc, 
        deleteDoc,
        setDoc 
       } from "firebase/firestore" //onSnapshot listner watches over a db like a eagle, it executes the same operations on our local code that were performed on the database by the user. It helps to maintain a single source of truth. 
import { notesCollection, db } from "./firebase"

export default function App() {
    
    //initialised state for notes 
    const [notes, setNotes] = React.useState([])
    
    //initialised state for setting up the current note id
    const [currentNoteId, setCurrentNoteId] = React.useState("")
    const [tempNoteText, setTempNoteText] = useState("")
    const currentNote = 
        notes.find(note => note.id === currentNoteId) || 
        (notes.length > 0 ? notes[0] : null)

    console.log(currentNote)
    
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

    useEffect(() => {
        if(!currentNoteId) return

        const timeoutId = setTimeout(() => {
            if(tempNoteText !== currentNote.body) {
                updateNote(tempNoteText)
            }
        }, 500)

        return () => clearTimeout(timeoutId)
    }, [tempNoteText])

    //useEffect to set the tempNoteText to the currentNote's body
    useEffect(() => {
        if(currentNote) {
            setTempNoteText(currentNote.body)
        }else{
            setTempNoteText("# Type your markdown note's title here")
        }
    }, [currentNote])

    //function to create a new note
    async function createNewNote() {
        const newNote = {
            body: tempNoteText,
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
        const newNoteRef = await addDoc(notesCollection, newNote)
        setCurrentNoteId(newNoteRef.id)
        console.log(newNote.createdAt)
    }

    //initializing a useEffect for setting up the currentNoteId 
    useEffect(() => {
        if(!currentNoteId && notes.length > 0) {
            setCurrentNoteId(notes[0].id)
        } 
    }, [notes])

    console.log(currentNoteId)   
    //function to delete a note
    async function deleteNote(noteId) {
        //get the reference of the document which needs to be deleted 
      const docRef = doc(db, "notes", noteId )
       //delete the document using deleteDoc function
      await deleteDoc(docRef)
    }

    //function to update the note
    async function updateNote(tempNoteText) {
       try{
        //capturing the reference of the document which needs to be updated
        const docRef = doc(db, "notes", currentNoteId)
        //updating the document in the firestore, merging the body property 
        await setDoc(docRef, 
                    { body: tempNoteText, 
                      updatedAt: Date.now()}, 
                    { merge: true }
                    )
       } catch(error) {
        console.log("Failed to update the note", error)
       }
    }
    
    //sorting the notes based on the updatedAt property
    const sortedNotes = notes.sort((a,b) => b.updatedAt - a.updatedAt)

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
                    notes={sortedNotes}
                    currentNote={currentNote}
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNewNote}
                    deleteNote={deleteNote}
                />
                    
                <Editor 
                    tempNoteText={tempNoteText}
                    setTempNoteText={setTempNoteText}
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
