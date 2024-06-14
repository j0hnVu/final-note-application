// components/NoteItem.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const getLabelText = (labelId, labels) => {
  const label = labels.find(label => label.id === labelId);
  return label ? label.label : labelId;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
};

const NoteItem = ({ item, labels, onPress }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={[styles.noteItem]}
      onPress={() => onPress(item.id)}
    >
      <Text style={styles.noteContent}>{item.content}</Text>
      <View style={styles.labelContainer}>
        {item.labelIds.map(labelId => (
          <Text key={labelId} style={styles.label}>{getLabelText(labelId, labels)}</Text>
        ))}
      </View>
      <Text style={styles.noteTime}>Updated: {formatDate(item.updateAt)}</Text>
      {item.isBookmarked && (
        <Ionicons name="bookmark" size={16} color="black" style={styles.bookmarkIcon} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  noteItem: {
    padding: 16,
    paddingTop: 10,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 10,
    position: 'relative',
  },
  noteContent: {
    fontSize: 20,
  },
  noteTime: {
    fontSize: 12,
    color: '#888',
  },
  labelContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  label: {
    backgroundColor: '#efefef',
    borderRadius: 6,
    padding: 4,
    marginTop: 8,
    marginBottom: 6,
    marginRight: 4,
    fontSize: 12,
  },
  bookmarkIcon: {
    position: 'absolute',
    top: 50,
    right: 16,
  },
});

export default NoteItem;
