// components/SearchBar.js
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const SearchBar = ({ isVisible, searchQuery, setSearchQuery, toggleSearch }) => {
  return (
    <View style={styles.searchContainer}>
      {isVisible && (
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

export default SearchBar;
