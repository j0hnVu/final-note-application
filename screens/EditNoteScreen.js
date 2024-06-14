import React, { useState, useEffect, useContext } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS } from '../data/dummy-data';
import { NotesContext } from '../context/NotesContext';
import { LabelsContext } from '../context/LabelsContext';

const EditNoteScreen = () => {
  const { notes, setNotes } = useContext(NotesContext);
  const { labels } = useContext(LabelsContext);
  const route = useRoute();
  const navigation = useNavigation();
  const { noteId } = route.params;
  const [note, setNote] = useState(notes.find(n => n.id === noteId));
  const [isBookmarked, setIsBookmarked] = useState(note ? note.isBookmarked : false);
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState(note ? note.color : null);
  const [selectedLabels, setSelectedLabels] = useState(note ? note.labelIds : []);

  useEffect(() => {
    if (route.params?.updatedLabels) {
      setSelectedLabels(route.params.updatedLabels);
    }
  }, [route.params?.updatedLabels]);

  const getLabelText = (labelId) => {
    const label = labels.find(label => label.id === labelId);
    return label ? label.label : labelId;
  };

  const saveNoteHandler = () => {
    if (note) {
      const updatedNote = {
        ...note,
        isBookmarked,
        color: selectedColor,
        labelIds: selectedLabels,
        updateAt: new Date().toISOString(),
      };

      const noteIndex = notes.findIndex(n => n.id === note.id);
      if (noteIndex !== -1) {
        const updatedNotes = [...notes];
        updatedNotes[noteIndex] = updatedNote;
        setNotes(updatedNotes);
      }

      navigation.navigate('Home', { updatedNote });
    }
  };

  const deleteNoteHandler = () => {
    const updatedNotes = notes.map(n => n.id === note.id ? { ...n, isDeleted: true } : n);
    setNotes(updatedNotes);
    navigation.goBack();
  };

  const manageLabelsHandler = () => {
    setBottomSheetVisible(false);
    navigation.navigate('ManageLabels', { noteId, selectedLabels });
  };

  if (!note) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Note not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        {selectedLabels.map(labelId => (
          <Text key={labelId} style={styles.label}>{getLabelText(labelId)}</Text>
        ))}
      </View>
      <View style={[styles.inputContainer, { backgroundColor: selectedColor || '#fff' }]}>
        <TextInput
          style={styles.input}
          value={note.content}
          onChangeText={(text) => setNote({ ...note, content: text })}
          multiline
        />
      </View>
      <View style={styles.bottomTab}>
        <Text style={styles.noteTime}>{`Edited ${new Date(note.updateAt).toLocaleString()}`}</Text>
        <TouchableOpacity onPress={() => setIsBookmarked(!isBookmarked)}>
          <Ionicons name={isBookmarked ? 'bookmark' : 'bookmark-outline'} size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setBottomSheetVisible(true)}>
          <Ionicons name="ellipsis-vertical" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <Modal
        isVisible={isBottomSheetVisible}
        onBackdropPress={() => setBottomSheetVisible(false)}
        style={styles.modal}
      >
        <View style={styles.bottomSheet}>
          <Text style={styles.bottomSheetTitle}>Select note's color</Text>
          <View style={styles.colorsContainer}>
            <TouchableOpacity
              key="no-color"
              style={[styles.colorOption, { backgroundColor: '#fff', borderColor: '#000', borderWidth: 1 }]}
              onPress={() => setSelectedColor(null)}
            >
              {selectedColor === null && <Ionicons name="checkmark" size={24} color="black" />}
            </TouchableOpacity>
            {COLORS.map(color => (
              <TouchableOpacity
                key={color}
                style={[styles.colorOption, { backgroundColor: color }]}
                onPress={() => setSelectedColor(color)}
              >
                {selectedColor === color && <Ionicons name="checkmark" size={24} color="black" />}
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.bottomSheetButton} onPress={manageLabelsHandler}>
            <Text style={styles.bottomSheetButtonText}>Manage labels</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomSheetButton} onPress={deleteNoteHandler}>
            <Text style={styles.bottomSheetButtonText}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomSheetButton} onPress={() => setBottomSheetVisible(false)}>
            <Text style={styles.bottomSheetButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <TouchableOpacity style={styles.actionButton} onPress={saveNoteHandler}>
        <Ionicons name="checkmark" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  label: {
    backgroundColor: '#ddd',
    borderRadius: 12,
    padding: 4,
    margin: 2,
    fontSize: 12,
  },
  inputContainer: {
    flex: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  bottomTab: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  noteTime: {
    fontSize: 12,
    color: '#555',
  },
  actionButton: {
    position: 'absolute',
    right: 16,
    bottom: 90,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007BFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  bottomSheet: {
    padding: 16,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  bottomSheetTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  colorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  colorOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSheetButton: {
    padding: 12,
    alignItems: 'center',
  },
  bottomSheetButtonText: {
    fontSize: 16,
    color: '#007BFF',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'red',
  },
});

export default EditNoteScreen;
