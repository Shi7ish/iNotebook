import NoteContext from "./noteContext";
import { useState } from "react";

const NoteState = (props) => {
  const host = "https://inotebook-backend-psi-five.vercel.app";
  const notesInitial = [];
  const [notes, setNotes] = useState(notesInitial);

  // Get a note
  const getNote = async () => {
    //TODO API calls
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token":localStorage.getItem('token'),
      },
    });
    const json = await response.json();
    setNotes(json);
    console.log("TOKEN SENDING:", localStorage.getItem("token"));
  };

  // Add a note
  const addNote = async (title, description, tag) => {
    //TODO API calls
    const response = await fetch(`${host}/api/notes/addnotes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token":localStorage.getItem('token'), 
      },
      body: JSON.stringify({ title, description, tag }),
    })
    const note = await response.json()
    setNotes(notes.concat(note));
  };
  // Delete a note
  const deleteNote = async (id) => {
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token":localStorage.getItem('token'),
      },
    });
    const json = await response.json();
    console.log(json);
    const newNote = notes.filter((note) => {
      return note._id !== id;
    });
    setNotes(newNote);
  };
  // Edit a note
  const editNote = async (id, title, description, tag) => {
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token":localStorage.getItem('token'),
      },
      body: JSON.stringify({ title, description, tag }),
    });

    let newNotes = JSON.parse(JSON.stringify(notes));

    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
    }
    setNotes(newNotes);
    const json = response.json()
    console.log(json)
  };
  return (
    <NoteContext.Provider
      value={{ notes, addNote, deleteNote, editNote, getNote }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
