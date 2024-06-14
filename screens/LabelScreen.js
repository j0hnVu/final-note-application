import React, { useState, useContext, useEffect } from 'react';
import { View, Text,TextInput, FlatList, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LabelsContext } from '../context/LabelsContext';
import { NotesContext } from '../context/NotesContext';
import SearchBar from '../components/SearchBar';

const LabelScreen = () => {
  const { labels, setLabels } = useContext(LabelsContext);
  const { notes, setNotes } = useContext(NotesContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLabels, setFilteredLabels] = useState(labels);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [editLabelText, setEditLabelText] = useState('');

  useEffect(() => {
    setFilteredLabels(labels);
  }, [labels]);

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text) {
      setFilteredLabels(labels.filter(label => label.label.toLowerCase().includes(text.toLowerCase())));
    } else {
      setFilteredLabels(labels);
    }
  };

  const handleAddLabel = () => {
    if (newLabel.trim() === '') return;

    const labelExists = labels.some(label => label.label.toLowerCase() === newLabel.trim().toLowerCase());

    if (labelExists) {
      alert("This label already exists.");
      return;
    }

    const newLabelObj = { id: `l${labels.length + 1}`, label: newLabel.trim() };
    setLabels([...labels, newLabelObj]);
    setNewLabel('');
    setIsCreateModalVisible(false);
  };

  const handleEditLabel = () => {
    if (editLabelText.trim() === '') return;

    const labelExists = labels.some(label => label.label.toLowerCase() === editLabelText.trim().toLowerCase() && label.id !== selectedLabel.id);

    if (labelExists) {
      alert("This label already exists.");
      return;
    }

    const updatedLabels = labels.map(label => 
      label.id === selectedLabel.id ? { ...label, label: editLabelText.trim() } : label
    );

    setLabels(updatedLabels);
    setIsEditModalVisible(false);
  };

  const handleDeleteLabel = () => {
    const updatedLabels = labels.filter(label => label.id !== selectedLabel.id);
    setLabels(updatedLabels);

    setNotes((prevNotes) => prevNotes.map(note => ({
      ...note,
      labelIds: note.labelIds.filter(labelId => labelId !== selectedLabel.id)
    })));

    setIsEditModalVisible(false);
  };

  const renderLabelItem = ({ item }) => (
    <TouchableOpacity style={styles.labelItem} onPress={() => {
      setSelectedLabel(item);
      setEditLabelText(item.label);
      setIsEditModalVisible(true);
    }}>
      <Text style={styles.labelText}>{item.label}</Text>
    </TouchableOpacity>
  );

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SearchBar
          isVisible='True'
          searchQuery={searchQuery}
          setSearchQuery={handleSearch}
          toggleSearch={toggleSearch}
        />
      </View>

      {filteredLabels.length > 0 ? (
        <Text style={styles.labelCount}>Total labels: {filteredLabels.length}</Text>
      ) : (
        <Text style={styles.noLabelsText}>No labels. {'\n'} 
        Click the button below to create a new label</Text>
      )}

      <TouchableOpacity
        style={styles.createButton}
        onPress={() => setIsCreateModalVisible(true)}
      >
        <Text style={styles.createButtonText}>+ Create New Label</Text>
      </TouchableOpacity>

      {filteredLabels.length > 0 && (
        <FlatList
          data={filteredLabels}
          renderItem={renderLabelItem}
          keyExtractor={(item) => item.id}
          style={styles.labelsList}
          numColumns={2} // Display labels in two columns
          columnWrapperStyle={styles.columnWrapper} // Style for the row
        />
      )}

      <Modal
        visible={isCreateModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsCreateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Create New Label</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Label name"
              value={newLabel}
              onChangeText={setNewLabel}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalButton} onPress={handleAddLabel}>
                <Text style={styles.modalButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Label</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Label name"
              value={editLabelText}
              onChangeText={setEditLabelText}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalButton} onPress={handleEditLabel}>
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.deleteButton]} onPress={handleDeleteLabel}>
                <Text style={styles.modalButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    paddingBottom:20,
    fontSize: 24,
    fontWeight: 'bold',
  },
  labelCount: {
    color: '#007BFF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  noLabelsText: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  labelsList: {
    marginTop: 20,
  },
  labelItem: {
    flex: 1,
    padding: 12,
    margin: 4,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#efefef',
    alignItems: 'center',
  },
  labelText: {
    fontSize: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between', // Distribute labels evenly across the row
  },
  createButton: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
    width: '80%',
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalInput: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 16,
    padding: 8,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: 'red',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default LabelScreen;
