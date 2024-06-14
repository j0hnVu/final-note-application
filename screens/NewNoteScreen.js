import React, { useState, useContext } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NotesContext } from '../context/NotesContext';

const generateUniqueId = (() => {
  let counter = 0;
  return () => {
    counter += 1;
    const now = new Date();
    const timestamp = now.getTime();
    const randomString = Math.random().toString(36).substring(2, 8);
    return `note-${timestamp}-${counter}-${randomString}`;
  };
})();

const NewNoteScreen = () => {
  const [content, setContent] = useState('');
  const navigation = useNavigation();
  const { notes, setNotes } = useContext(NotesContext);

  const saveNoteHandler = () => {
    if (!content.trim()) {
      return;
    }

    const noteID = generateUniqueId();
    const newNote = {
      id: noteID,
      content,
      updateAt: new Date().toISOString(),
      color: null,
      labelIds: [],
      isBookmarked: false,
      isDeleted: false,
    };

    setNotes([...notes, newNote]);
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Write your note here..."
        value={content}
        onChangeText={setContent}
        multiline
      />
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
  input: {
    flex: 1,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 16,
  },
  actionButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007BFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default NewNoteScreen;
