import React, { useContext, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import NoteItem from '../components/NoteItem';
import { NotesContext } from '../context/NotesContext';
import { LabelsContext } from '../context/LabelsContext';

const TrashScreen = () => {
  const { notes, setNotes } = useContext(NotesContext);
  const { labels } = useContext(LabelsContext);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isNoteModalVisible, setIsNoteModalVisible] = useState(false);
  const [isRestoreAllModalVisible, setIsRestoreAllModalVisible] = useState(false);
  const [isEmptyTrashModalVisible, setIsEmptyTrashModalVisible] = useState(false);

  const trashNotes = notes.filter(note => note.isDeleted);

  const restoreNote = (noteId) => {
    setNotes(prevNotes =>
      prevNotes.map(note =>
        note.id === noteId ? { ...note, isDeleted: false } : note
      )
    );
    setIsNoteModalVisible(false);
  };

  const deleteNotePermanently = (noteId) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
    setIsNoteModalVisible(false);
  };

  const confirmRestoreAllNotes = () => {
    setIsRestoreAllModalVisible(true);
  };

  const confirmEmptyTrash = () => {
    setIsEmptyTrashModalVisible(true);
  };

  const restoreAllNotes = () => {
    setNotes(prevNotes =>
      prevNotes.map(note =>
        note.isDeleted ? { ...note, isDeleted: false } : note
      )
    );
    setIsRestoreAllModalVisible(false);
  };

  const emptyTrash = () => {
    setNotes(prevNotes => prevNotes.filter(note => !note.isDeleted));
    setIsEmptyTrashModalVisible(false);
  };

  const handleNotePress = (noteId) => {
    setSelectedNote(noteId);
    setIsNoteModalVisible(true);
  };

  const renderNoteItem = ({ item }) => (
    <NoteItem item={item} labels={labels} onPress={handleNotePress} />
  );

  return (
    <View style={styles.container}>
      {trashNotes.length > 0 && (
        <Text style={styles.noteCount}>{`${trashNotes.length} notes in trash`}</Text>
      )}

      {trashNotes.length === 0 ? (
        <Text style={styles.noNotesText}>Trash is empty</Text>
      ) : (
        <FlatList
          data={trashNotes}
          renderItem={renderNoteItem}
          keyExtractor={(item) => item.id}
          style={styles.notesList}
        />
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.actionButton, trashNotes.length === 0 && styles.disabledButton]}
          onPress={confirmRestoreAllNotes}
          disabled={trashNotes.length === 0}
        >
          <Text style={styles.actionButtonText}>Restore All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, trashNotes.length === 0 && styles.disabledButton, styles.deleteButton]}
          onPress={confirmEmptyTrash}
          disabled={trashNotes.length === 0}
        >
          <Text style={styles.actionButtonText}>Empty Trash</Text>
        </TouchableOpacity>
      </View>

      {/* Note Options Modal */}
      <Modal
        visible={isNoteModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsNoteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={() => restoreNote(selectedNote)}>
              <Text style={styles.restoreText}>Restore</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteNotePermanently(selectedNote)}>
              <Text style={styles.deleteText}>Delete permanently</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Restore All Confirmation Modal */}
      <Modal
        visible={isRestoreAllModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsRestoreAllModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={restoreAllNotes}>
              <Text style={styles.restoreText}>Restore All</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsRestoreAllModalVisible(false)}>
              <Text style={styles.deleteText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Empty Trash Confirmation Modal */}
      <Modal
        visible={isEmptyTrashModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsEmptyTrashModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={emptyTrash}>
              <Text style={styles.deleteText}>Empty Trash</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsEmptyTrashModalVisible(false)}>
              <Text style={styles.restoreText}>Cancel</Text>
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
    color: '#007BFF',
    fontSize: 16,
    textAlign: 'left',
    marginBottom: 16,
  },
  noNotesText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  notesList: {
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    padding: 16,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  deleteButton: {
    backgroundColor: 'red',
  },
  actionButtonText: {
    fontSize: 16,
    color: 'white',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    alignItems: 'center',
  },
  restoreText: {
    fontSize: 18,
    color: 'blue',
    marginBottom: 16,
  },
  deleteText: {
    fontSize: 18,
    color: 'red',
    marginBottom: 16,
  },
});

export default TrashScreen;
