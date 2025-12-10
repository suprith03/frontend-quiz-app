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
    options: ['Bhau-Bhau', 'Meow-Meow', 'Oink-Oink'],
    correctIndex: 1,
  },
  {
    id: 2,
    text: 'Which is not a fruit',
    options: ['Apple', 'Potato', 'Banana'],
    correctIndex: 1,
  },
  {
    id: 3,
    text: 'How many stars are in the sky?',
    options: ['Two', 'Infinite', 'One Hundred'],
    correctIndex: 1,
  },
  {
    id: 4,
    text: 'Which planet do we live on?',
    options: ['Mars', 'Jupiter', 'Earth'],
    correctIndex: 2,
  },
  {
    id: 5,
    text: 'Which of these is not a smart phone brand?',
    options: ['Apple', 'Samsung', 'Predator'],
    correctIndex: 3,
  },
];
