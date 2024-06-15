import React, { useState, useEffect, useContext } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NotesContext } from "../context/notesContext";
import { LabelsContext } from "../context/labelsContext";

const EditNoteScreen = () => {
  const { notes, setNotes } = useContext(NotesContext);
  const { labels } = useContext(LabelsContext);
  const { noteId } = route.params;
  const route = useRoute();
  const nav = useNavigation();
  const note = notes.find((n) => n.id === noteId) || null;
  const [content, setContent] = useState(note?.content || "");
  const [isBookmarked, setIsBookmarked] = useState(note?.isBookmarked || false);
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [selectedLabels, setSelectedLabels] = useState(note?.labelIds || []);

  useEffect(() => {
    if (route.params?.updatedLabels) {
      setSelectedLabels(route.params.updatedLabels);
    }
  }, [route.params?.updatedLabels]);

  const getLabelText = (labelId) => {
    const label = labels.find((l) => l.id === labelId);
    return label ? label.label : labelId;
  };

  const saveNoteHandler = () => {
    if (note) {
      const updatedNote = {
        ...note,
        content,
        isBookmarked,
        labelIds: selectedLabels,
        updateAt: new Date().toISOString(),
      };

      const updatedNotes = notes.map((n) =>
        n.id === note.id ? updatedNote : n
      );
      setNotes(updatedNotes);

      nav.navigate("Home", { updatedNote });
    }
  };

  const deleteNoteHandler = () => {
    if (note && notes) {
      const updatedNotes = notes.map((n) =>
        n.id === note.id ? { ...n, isDeleted: true } : n
      );
      setNotes(updatedNotes);
      nav.goBack();
    }
  };

  const manageLabelsHandler = () => {
    setBottomSheetVisible(false);
    nav.navigate("ManageLabels", { noteId, selectedLabels });
  };

  const calculateTimeAgo = (dateTimeString) => {
    const currentTime = new Date();
    const updatedAt = new Date(dateTimeString);

    const getTimeAgo = (value, unit) => {
      if (value === 1) {
        return `${value} ${unit} ago`;
      } else {
        return `${value} ${unit}s ago`;
      }
    };

    const timeDiff = currentTime - updatedAt;

    if (timeDiff < 60 * 1000) {
      // Less than a minute
      const seconds = Math.floor(timeDiff / 1000);
      return getTimeAgo(seconds, "second");
    } else if (timeDiff < 60 * 60 * 1000) {
      // Less than an hour
      const minutes = Math.floor(timeDiff / (60 * 1000));
      return getTimeAgo(minutes, "minute");
    } else if (timeDiff < 24 * 60 * 60 * 1000) {
      // Less than a day
      const hours = Math.floor(timeDiff / (60 * 60 * 1000));
      return getTimeAgo(hours, "hour");
    } else {
      // More than a day
      const days = Math.floor(timeDiff / (24 * 60 * 60 * 1000));
      return getTimeAgo(days, "day");
    }
  };

  const ActionButton = () => (
    <TouchableOpacity style={styles.actionButton} onPress={saveNoteHandler}>
      <Ionicons name="checkmark-done" size={24} color="white" />
    </TouchableOpacity>
  );

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
        {selectedLabels.map((labelId) => (
          <Text key={labelId} style={styles.label}>
            {getLabelText(labelId)}
          </Text>
        ))}
      </View>
      <View
        style={[
          styles.inputContainer,
          { backgroundColor: "#fff", paddingTop: 12 },
        ]}
      >
        <TextInput
          style={styles.input}
          value={content}
          onChangeText={setContent}
          multiline
          selectionColor="#888"
        />
      </View>
      <View style={styles.bottomTab}>
        <Text style={styles.noteTime}>{`Edited ${calculateTimeAgo(
          note.updateAt
        )}`}</Text>
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => setIsBookmarked(!isBookmarked)}
          >
            <Ionicons
              name={isBookmarked ? "bookmark" : "bookmark-outline"}
              size={24}
              color="black"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => setBottomSheetVisible(true)}
          >
            <Ionicons name="ellipsis-vertical" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        isVisible={isBottomSheetVisible}
        onBackdropPress={() => setBottomSheetVisible(false)}
        style={styles.modal}
      >
        <View style={styles.bottomSheet}>
          <TouchableOpacity
            style={styles.bottomSheetButton}
            onPress={manageLabelsHandler}
          >
            <Text style={styles.bottomSheetButtonText}>Manage labels</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bottomSheetButton}
            onPress={deleteNoteHandler}
          >
            <Text style={styles.bottomSheetButtonText}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bottomSheetButton}
            onPress={() => setBottomSheetVisible(false)}
          >
            <Text style={styles.bottomSheetButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <ActionButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  labelContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  label: {
    backgroundColor: "#e0e0e0",
    padding: 4,
    margin: 2,
    fontSize: 12,
    color: "#888",
  },
  inputContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    textAlign: "left",
    textAlignVertical: "top",
  },
  bottomTab: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#f8f8f8",
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  noteTime: {
    fontSize: 16,
    color: "#555",
  },
  bottomActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  actionButton: {
    position: "absolute",
    right: 16,
    bottom: 72,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#ff0000",
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  bottomSheet: {
    padding: 16,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  bottomSheetTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  colorsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 16,
  },
  colorOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomSheetButton: {
    padding: 12,
    alignItems: "center",
  },
  bottomSheetButtonText: {
    fontSize: 16,
    color: "#007BFF",
  },
  errorText: {
    fontSize: 18,
    textAlign: "center",
    color: "red",
  },
});

export default EditNoteScreen;
