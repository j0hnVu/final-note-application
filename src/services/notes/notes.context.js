import React, { createContext, useState, useEffect, useCallback } from "react";
import { localNotes as initialNotes } from "./localNotes";

export const NotesContext = createContext();

export const NotesContextProvider = ({ children }) => {
  const [notes, setNotes] = useState(initialNotes);
  const [filteredNotes, setFilteredNotes] = useState(initialNotes);
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submittedKeyword, setSubmittedKeyword] = useState("");

  const getNotes = useCallback(() => {
    setIsLoading(true);
    let updatedFilteredNotes = [...notes];

    if (submittedKeyword) {
      updatedFilteredNotes = updatedFilteredNotes.filter(
        (note) =>
          note.title.toLowerCase().includes(submittedKeyword.toLowerCase()) ||
          note.content.toLowerCase().includes(submittedKeyword.toLowerCase())
      );
    }

    updatedFilteredNotes.sort((a, b) => new Date(b.date) - new Date(a.date));

    console.log("returning getNotes", updatedFilteredNotes);
    setIsLoading(false);
    setFilteredNotes(updatedFilteredNotes); // Update the filtered notes state with filtered notes
  }, [notes, submittedKeyword]);

  const onSearch = useCallback((searchKeyword) => {
    setIsLoading(true);
    setKeyword(searchKeyword);
    setSubmittedKeyword(searchKeyword);
  }, []);

  useEffect(() => {
    getNotes();
  }, [getNotes]);

  const getNote = (id) => {
    setIsLoading(true);
    const note = notes.find((note) => note.id === id);
    console.log("note data retrieved");
    setIsLoading(false);
    return note;
  };

  const addNote = (note) => {
    const newNotes = [...notes, note];
    setNotes(newNotes);
    console.log("note added");
    updateLocalNotes(newNotes);
  };

  const removeNote = (id) => {
    const newNotes = notes.filter((note) => note.id !== id);
    setNotes(newNotes);
    console.log("note removed");
    updateLocalNotes(newNotes);
  };

  const updateNote = (note) => {
    console.log("new note data:", note);
    const noteIndex = notes.findIndex((n) => n.id === note.id);
    if (noteIndex !== -1) {
      const updatedNotes = [...notes];
      updatedNotes[noteIndex] = note;
      setNotes(updatedNotes);
      console.log("note updated", notes);
      updateLocalNotes(updatedNotes);
    }
  };

  // New function to update localNotes.js
  const updateLocalNotes = (updatedNotes) => {
    // In a real app, you'd use a file system or database here.
    // This is just a placeholder to show you where you'd update the file.
    console.log("Updating localNotes.js with:", updatedNotes);
    // You'd write updatedNotes to localNotes.js here.
  };

  return (
    <NotesContext.Provider
      value={{
        notes: filteredNotes, // Use filteredNotes here
        getNotes,
        getNote,
        addNote,
        removeNote,
        updateNote,
        search: onSearch,
        keyword,
        isLoading,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};
