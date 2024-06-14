import React, { useState, useContext, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { LabelsContext } from '../context/LabelsContext';
import { useNavigation, useRoute } from '@react-navigation/native';

const ManageLabelsScreen = () => {
  const { labels } = useContext(LabelsContext);
  const route = useRoute();
  const navigation = useNavigation();
  const { noteId, selectedLabels } = route.params;
  const [labelsState, setLabelsState] = useState(selectedLabels || []);

  useEffect(() => {
    setLabelsState(selectedLabels || []);
  }, [selectedLabels]);

  const toggleLabel = (labelId) => {
    setLabelsState((prevLabels) => {
      if (prevLabels.includes(labelId)) {
        return prevLabels.filter((id) => id !== labelId);
      } else {
        return [...prevLabels, labelId];
      }
    });
  };

  const saveLabelsHandler = () => {
    navigation.navigate('EditNote', { noteId, updatedLabels: labelsState });
  };

  const renderLabelItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.labelItem,
        labelsState.includes(item.id) ? styles.selectedLabel : styles.unselectedLabel,
      ]}
      onPress={() => toggleLabel(item.id)}
    >
      <Text style={[
        styles.labelText,
        labelsState.includes(item.id) ? styles.selectedLabelText : styles.unselectedLabelText,
      ]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  const totalLabels = labels.length;
  const selectedLabelsCount = labelsState.length;

  return (
    <View style={styles.container}>
      <Text style={styles.labelCount}>{`${totalLabels} total, ${selectedLabelsCount} selected`}</Text>
      <FlatList
        data={labels}
        renderItem={renderLabelItem}
        keyExtractor={(item) => item.id}
        numColumns={2} // Display labels in two columns
        columnWrapperStyle={styles.columnWrapper} // Style for the row
      />
      <TouchableOpacity style={styles.saveButton} onPress={saveLabelsHandler}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  labelCount: {
    color: '#007BFF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  labelItem: {
    flex: 1,
    padding: 12,
    margin: 4,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedLabel: {
    backgroundColor: '#007BFF',
  },
  unselectedLabel: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  labelText: {
    fontSize: 16,
  },
  selectedLabelText: {
    color: 'white',
  },
  unselectedLabelText: {
    color: 'black',
  },
  columnWrapper: {
    justifyContent: 'space-between', // Distribute labels evenly across the row
  },
  saveButton: {
    padding: 16,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    fontSize: 16,
    color: 'white',
  },
});

export default ManageLabelsScreen;
