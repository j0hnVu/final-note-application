import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
} from "react-native";
import NoteItem from "../components/noteItem";
import { NotesContext } from "../context/notesContext";
import { LabelsContext } from "../context/labelsContext";

const TrashScreen = () => {
  const { notes, setNotes } = useContext(NotesContext);
  const { labels } = useContext(LabelsContext);
  const [selectedNote, setSelectedNote] = useState(null);
  const [modals, setModals] = useState({
    noteModal: false,
    restoreAllModal: false,
    emptyTrashModal: false,
  });

  const trashNotes = notes.filter((note) => note.isDeleted);

  const handleNotePress = (noteId) => {
    setSelectedNote(noteId);
    setModals((prevModals) => ({ ...prevModals, noteModal: true }));
  };

  const handleRestoreNote = (noteId) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === noteId ? { ...note, isDeleted: false } : note
      )
    );
    setModals((prevModals) => ({ ...prevModals, noteModal: false }));
  };

  const handleDeleteNotePermanently = (noteId) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
    setModals((prevModals) => ({ ...prevModals, noteModal: false }));
  };

  const handleRestoreAllNotes = () => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.isDeleted ? { ...note, isDeleted: false } : note
      )
    );
    setModals((prevModals) => ({ ...prevModals, restoreAllModal: false }));
  };

  const handleEmptyTrash = () => {
    setNotes((prevNotes) => prevNotes.filter((note) => !note.isDeleted));
    setModals((prevModals) => ({ ...prevModals, emptyTrashModal: false }));
  };

  const renderItem = ({ item }) => (
    <NoteItem item={item} labels={labels} onPress={handleNotePress} />
  );

  return (
    <View style={styles.container}>
      {trashNotes.length > 0 && (
        <Text
          style={styles.noteCount}
        >{`${trashNotes.length} notes in trash`}</Text>
      )}

      {trashNotes.length === 0 ? (
        <Text style={styles.noNotesText}>Trash is empty</Text>
      ) : (
        <FlatList
          data={trashNotes}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.notesList}
        />
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            trashNotes.length === 0 && styles.disabledButton,
          ]}
          onPress={() =>
            setModals((prevModals) => ({
              ...prevModals,
              restoreAllModal: true,
            }))
          }
          disabled={trashNotes.length === 0}
        >
          <Text style={styles.buttonText}>Restore All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            styles.deleteButton,
            trashNotes.length === 0 && styles.disabledButton,
          ]}
          onPress={() =>
            setModals((prevModals) => ({
              ...prevModals,
              emptyTrashModal: true,
            }))
          }
          disabled={trashNotes.length === 0}
        >
          <Text style={styles.buttonText}>Empty Trash</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={modals.noteModal}
        transparent
        animationType="slide"
        onRequestClose={() =>
          setModals((prevModals) => ({ ...prevModals, noteModal: false }))
        }
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={() => handleRestoreNote(selectedNote)}>
              <Text style={styles.modalButtonText}>Restore</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDeleteNotePermanently(selectedNote)}
            >
              <Text style={[styles.modalButtonText, styles.deleteText]}>
                Delete permanently
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={modals.restoreAllModal}
        transparent
        animationType="slide"
        onRequestClose={() =>
          setModals((prevModals) => ({ ...prevModals, restoreAllModal: false }))
        }
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={handleRestoreAllNotes}>
              <Text style={styles.modalButtonText}>Restore All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                setModals((prevModals) => ({
                  ...prevModals,
                  restoreAllModal: false,
                }))
              }
            >
              <Text style={[styles.modalButtonText, styles.cancelText]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={modals.emptyTrashModal}
        transparent
        animationType="slide"
        onRequestClose={() =>
          setModals((prevModals) => ({ ...prevModals, emptyTrashModal: false }))
        }
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={handleEmptyTrash}>
              <Text style={[styles.modalButtonText, styles.deleteText]}>
                Empty Trash
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                setModals((prevModals) => ({
                  ...prevModals,
                  emptyTrashModal: false,
                }))
              }
            >
              <Text style={[styles.modalButtonText, styles.cancelText]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  noteCount: {
    color: "#007BFF",
    fontSize: 16,
    marginBottom: 16,
  },
  noNotesText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  notesList: {
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  button: {
    flex: 1,
    padding: 16,
    backgroundColor: "#007BFF",
    borderRadius: 8,
    marginHorizontal: 8,
  },
  deleteButton: {
    backgroundColor: "#dc3545",
  },
  buttonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    padding: 16,
    backgroundColor: "white",
    borderRadius: 8,
    alignItems: "center",
  },
  modalButtonText: {
    fontSize: 18,
    marginBottom: 16,
  },
  deleteText: {
    color: "#dc3545",
  },
  cancelText: {
    color: "#007BFF",
  },
});

export default TrashScreen;
