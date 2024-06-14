import React, { useContext, useMemo, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { NotesContext } from '../context/NotesContext';
import { LabelsContext } from '../context/LabelsContext';
import NoteItem from '../components/NoteItem';
import SearchBar from '../components/SearchBar';

const Home = () => {
  const { notes } = useContext(NotesContext);
  const { labels } = useContext(LabelsContext);
  const [searchQuery, setSearchQuery] = React.useState('');
  const nav = useNavigation();
  const isFocused = useIsFocused();

  const filteredNotes = useMemo(() => {
    return notes.filter(
      (note) => !note.isDeleted && note.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [notes, searchQuery]);

  useEffect(() => {
    if (isFocused) {
      setSearchQuery('');
    }
  }, [isFocused]);

  const handleNotePress = useCallback((noteId) => {
    nav.navigate('EditNote', { noteId });
  }, [nav]);

  const renderNoteItem = useCallback(
    ({ item }) => <NoteItem item={item} labels={labels} onPress={handleNotePress} />,
    [labels, handleNotePress]
  );

  const keyExtractor = useCallback((item) => item.id, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </View>

      {filteredNotes.length === 0 ? (
        <Text style={styles.noNotesText}>
          {searchQuery ? 'No matching notes found!' : 'No notes yet, tap the + button to create one.'}
        </Text>
      ) : (
        <FlatList
          data={filteredNotes}
          renderItem={renderNoteItem}
          keyExtractor={keyExtractor}
          style={styles.notesList}
        />
      )}

      <TouchableOpacity style={styles.addButton} onPress={() => nav.navigate('NewNote')}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  noNotesText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
  notesList: {
    flex: 1,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ff0000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Home;