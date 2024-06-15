import Note from "../components/Note";
import Label from "../components/Label";

export const LABELS = [
  new Label("1", "React Native"),
  new Label("2", "JavaScript"),
  new Label("3", "Mobile Development"),
];

export const NOTES = [
  new Note(
    "n1",
    ["1", "3"],
    "Learn React Native Navigation",
    new Date("2024-06-15T10:30:00"),
    false
  ),
  new Note(
    "n2",
    ["2", "3"],
    "Closures and Scoping in JavaScript",
    new Date("2024-06-10T14:45:00"),
    true
  ),
  new Note(
    "n3",
    ["1", "2"],
    "React Native State Management",
    new Date("2024-06-05T09:15:00"),
    false
  ),
];

export const TRASH = [
];
