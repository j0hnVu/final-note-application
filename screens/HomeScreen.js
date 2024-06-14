import React, { useContext, useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import NoteItem from '../components/NoteItem';
import { NotesContext } from '../context/NotesContext';
import { LabelsContext } from '../context/LabelsContext';
import SearchBar from '../components/SearchBar';

const HomeScreen = () => {
  const { notes } = useContext(NotesContext);
  const { labels } = useContext(LabelsContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      setFilteredNotes(notes.filter(note => !note.isDeleted));
    }
  }, [notes, isFocused]);

  useEffect(() => {
    const filtered = notes.filter(
      note => note.content.toLowerCase().includes(searchQuery.toLowerCase()) && !note.isDeleted
    );
    setFilteredNotes(filtered);
  }, [searchQuery, notes]);

  const handleNotePress = (noteId) => {
    navigation.navigate('EditNote', { noteId });
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SearchBar
          isVisible="true"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          toggleSearch={toggleSearch}
        />
      </View>

      {filteredNotes.length === 0 ? (
        <Text style={styles.noNotesText}>{searchQuery ? 'Not found!' : 'No Notes \n Tap + icon to create new note'}</Text>
      ) : (
        <FlatList
          data={filteredNotes}
          renderItem={({ item }) => <NoteItem item={item} labels={labels} onPress={handleNotePress} />}
          keyExtractor={(item) => item.id}
          style={styles.notesList}
        />
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('NewNote')}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    paddingBottom:20,
    fontSize: 24,
    fontWeight: 'bold',
  },
  noNotesText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  notesList: {
    marginTop: 10,
  },
  addButton: {
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

export default HomeScreen;
