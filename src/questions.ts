export type Question = {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
};

export const questions: Question[] = [
  {
    id: 1,
    text: 'What sound does a cat make?',
    options: ['Bhau-Bhau', 'Meow-Meow', 'Oink-Oink', 'Roar'],
    correctIndex: 1,
  },
  {
    id: 2,
    text: 'Which animal is known as man’s best friend?',
    options: ['Cat', 'Dog', 'Cow', 'Elephant'],
    correctIndex: 1,
  },
  {
    id: 3,
    text: 'How many stars are in the sky?',
    options: ['Two', 'Infinite', 'One Hundred', 'Ten'],
    correctIndex: 1,
  },
  {
    id: 4,
    text: 'Which planet do we live on?',
    options: ['Mars', 'Jupiter', 'Earth', 'Venus'],
    correctIndex: 2,
  },
  {
    id: 5,
    text: 'Which of these is a primary color?',
    options: ['Green', 'Purple', 'Orange', 'Blue'],
    correctIndex: 3,
  },
];
