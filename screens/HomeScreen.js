import React, { useContext, useMemo, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { NotesContext } from "../context/notesContext";
import { LabelsContext } from "../context/labelsContext";
import NoteItem from "../components/noteItem";
import SearchBar from "../components/searchBar";

const Home = () => {
  const { notes } = useContext(NotesContext);
  const { labels } = useContext(LabelsContext);
  const [searchQuery, setSearchQuery] = React.useState("");
  const nav = useNavigation();
  const isFocused = useIsFocused();

  const filteredNotes = useMemo(() => {
    return notes.reduce((acc, note) => {
      if (
        !note.isDeleted &&
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        acc.push(note);
      }
      return acc;
    }, []);
  }, [notes, searchQuery]);

  useEffect(() => {
    if (isFocused) {
      setSearchQuery("");
    }
  }, [isFocused]);

  const handlePress = useCallback(
    (noteId) => {
      nav.navigate("Edit", { noteId });
    },
    [nav]
  );

  const renderItem = useCallback(
    function renderNoteItem({ item }) {
      return <NoteItem item={item} labels={labels} onPress={handlePress} />;
    },
    [labels, handlePress]
  );

  const keyExtractor = useCallback((item) => item.id, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </View>

      {filteredNotes.length > 0 ? (
        <FlatList
          data={filteredNotes}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          style={styles.notesList}
        />
      ) : (
        <Text style={styles.noNotesText}>
          {searchQuery ? "Note not found!" : "Press + to create new note."}
        </Text>
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => nav.navigate("NewNote")}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  noNotesText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
  notesList: {
    flex: 1,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ff0000",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Home;
