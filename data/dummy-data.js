import Note from '../models/Note';
import Label from '../models/Label';

export const LABELS = [
  new Label('1', 'React Native'),
  new Label('2', 'Final Exam'),
  new Label('3', 'Mini Project'),
  new Label('4', 'Team Work'),
  new Label('5', 'React Basic'),
];

export const COLORS = [
  'lightseagreen', 'skyblue', 'lightcoral',
  'lightpink', 'lightgreen', 'lightblue',
  'orange', 'palegreen'
];

export const NOTES = [
  new Note('n1', null, ['1', '2'], 'Final Project Preparation', new Date('2024-5-10T12:30:00'), false),
  new Note('n2', COLORS[3], ['3'], 'For our mini project!', new Date('2024-5-10T12:35:00'), true),
  new Note('n3', COLORS[4], ['2'], 'Second note!', new Date('2024-4-20T15:30:00'), false),
  new Note('n4', COLORS[5], ['1'], 'Ok the first note here!', new Date('2024-4-20T12:25:00'), false),
];

export const TRASH = [
  new Note('n5', COLORS[0], ['4'], 'Learn React Native Navigation', new Date('2024-5-10T14:30:00'), true),
  new Note('n6', null, ['4', '2', '1'], 'A simple note', new Date('2024-5-10T14:35:00'), false),
  new Note('n7', COLORS[6], ['1', '2', '3', '4'], 'One more note', new Date('2024-4-20T15:30:00'), false),
];
