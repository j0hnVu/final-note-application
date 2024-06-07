import React, { useContext, useState, useEffect } from "react";
import { Text, View, TextInput, Keyboard } from "react-native";

import styled from "styled-components/native";
import { useTheme } from "styled-components";
import { Spacer } from "../../../components/spacer/spacer.component";
import { NotesContext } from "../../../services/notes/notes.context";
import { useIsFocused } from "@react-navigation/native";
import { SafeArea } from "../../../components/utility/safe-area.component";

const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.colors.bg.primary};
`;
const TitleContainer = styled.View`
  padding-horizontal: ${(props) => props.theme.space[4]};
  padding-vertical: ${(props) => props.theme.space[2]};
  margin-horizontal: ${(props) => props.theme.space[2]};
  background-color: ${(props) => props.theme.colors.ui.primary};
  border-radius: ${(props) => props.theme.sizes[1]};
`;
const NoteContainer = styled.View`
  flex: 1;
  padding-vertical: ${(props) => props.theme.space[2]};
  padding-horizontal: ${(props) => props.theme.space[4]};
  margin: ${(props) => props.theme.space[2]};
  background-color: ${(props) => props.theme.colors.ui.primary};
  border-radius: ${(props) => props.theme.sizes[1]};
`;
const Loading = styled.ActivityIndicator`
  flex: 1;
`;

export const EditNoteScreen = ({ route, navigation }) => {
  const isFocused = useIsFocused();
  const theme = useTheme();
  const { noteId } = route.params;
  const [id, setId] = useState(noteId);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState(new Date());
  const [newNote, setNewNote] = useState(false);
  const {
    notes,
    getNotes,
    getNote,
    updateNote,
    addNote,
    removeNote,
    isLoading,
  } = useContext(NotesContext);

  const [contentUndoStack, setContentUndoStack] = useState([]);
  const [contentRedoStack, setContentRedoStack] = useState([]);

  const updateContent = (text) => {
    setContentUndoStack([...contentUndoStack, content]);
    setContentRedoStack([]);
    setContent(text);
  };

  const undoContent = () => {
    if (contentUndoStack.length > 0) {
      setContentRedoStack([...contentRedoStack, content]);
      setContent(contentUndoStack.pop());
      setContentUndoStack([...contentUndoStack]);
    }
  };

  const redoContent = () => {
    if (contentRedoStack.length > 0) {
      setContentUndoStack([...contentUndoStack, content]);
      setContent(contentRedoStack.pop());
      setContentRedoStack([...contentRedoStack]);
    }
  };

  useEffect(() => {
    navigation.setParams({
      undoContent: undoContent,
      redoContent: redoContent,
      contentUndoStackLength: contentUndoStack.length,
      contentRedoStackLength: contentRedoStack.length,
    });
  }, [contentUndoStack, contentRedoStack]);

  // Fetch note data from local file
  const fetchNoteData = () => {
    console.log("fetching note data ", id);
    const noteData = getNote(id);
    if (noteData != null) {
      console.log("fetchNoteData data:", noteData);
      setTitle(noteData.title);
      setContent(noteData.content);
      setDate(new Date(noteData.date));
      setNewNote(false);
    } else {
      console.log("fetchNoteData null");
      setNewNote(true);
    }
  };

  const handleFinishEdit = () => {
    if (title === "" && content === "") {
      console.log("removing note");
      if (!newNote) {
        removeNote(id);
      }
    } else {
      const updatedNote = { id, title, content, date: new Date().toISOString() };
      if (newNote) {
        addNote(updatedNote);
      } else {
        updateNote(updatedNote);
      }
    }
  };

  useEffect(() => {
    fetchNoteData();
  }, [id]);

  useEffect(() => {
    if (!isFocused) {
      console.log("Navigated away from EditNoteScreen");
      handleFinishEdit();
    }
  }, [isFocused]);

  return (
    <Container>
      <Spacer position="top" size="large"></Spacer>
      {isLoading ? (
        <SafeArea>
          <Loading animating={true} color="tomato" size={100} />
        </SafeArea>
      ) : (
        <>
          <TitleContainer>
            <TextInput
              placeholder="Title"
              multiline={true}
              value={title}
              onChangeText={(text) => setTitle(text)}
              style={{
                fontSize: 25,
                color: theme.colors.text.primary,
              }}
              placeholderTextColor={theme.colors.text.secondary}
            />
          </TitleContainer>
          <NoteContainer>
            <TextInput
              placeholder="Write something..."
              value={content}
              onChangeText={(text) => updateContent(text)}
              multiline={true}
              style={{
                fontSize: 16,
                color: theme.colors.text.primary,
              }}
              placeholderTextColor={theme.colors.text.secondary}
            />
          </NoteContainer>
        </>
      )}
    </Container>
  );
};