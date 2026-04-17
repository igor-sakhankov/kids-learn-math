import { DIFFICULTY_LEVELS } from './constants';

/**
 * Generate a random math question based on difficulty level and operation
 */
export const generateQuestion = (difficulty, operation = null) => {
  const maxNum = DIFFICULTY_LEVELS[difficulty].maxNumber;
  const a = Math.floor(Math.random() * (maxNum + 1));
  const b = Math.floor(Math.random() * (maxNum + 1));
  
  // If operation not specified, randomly choose
  const op = operation || (Math.random() < 0.5 ? '+' : '-');
  
  let first = a;
  let second = b;
  
  // For subtraction, ensure positive result (larger number first)
  if (op === '-' && b > a) {
    first = b;
    second = a;
  }
  
  const answer = op === '+' ? first + second : first - second;
  
  return {
    first,
    second,
    operation: op,
    answer,
    text: `${first} ${op} ${second}`,
  };
};

/**
 * Generate a visual question with objects
 */
export const generateVisualQuestion = (difficulty, operation) => {
  const question = generateQuestion(difficulty, operation);
  
  // Available object types
  const objectTypes = ['apple', 'cube', 'bear', 'bird', 'flower', 'star'];
  const randomType = objectTypes[Math.floor(Math.random() * objectTypes.length)];
  
  return {
    ...question,
    objectType: randomType,
    visualFirst: Array(question.first).fill(randomType),
    visualSecond: Array(question.second).fill(randomType),
  };
};

/**
 * Generate a story problem
 */
export const generateStoryProblem = (difficulty, operation, t) => {
  const question = generateQuestion(difficulty, operation);
  
  // Story templates for addition
  const additionStories = [
    'story_problems.birds_tree',
    'story_problems.apples_basket',
    'story_problems.books',
  ];
  
  // Story templates for subtraction
  const subtractionStories = [
    'story_problems.candies',
    'story_problems.toys',
    'story_problems.flowers',
  ];
  
  const stories = operation === '+' ? additionStories : subtractionStories;
  const randomStory = stories[Math.floor(Math.random() * stories.length)];
  
  return {
    ...question,
    storyKey: randomStory,
    storyText: t(randomStory, { first: question.first, second: question.second }),
  };
};

/**
 * Generate a sequence pattern
 * Types: 'add' (adding), 'sub' (subtracting), 'even' (even numbers), 'odd' (odd numbers)
 */
export const generateSequence = (difficulty, type = null) => {
  const maxNum = DIFFICULTY_LEVELS[difficulty].maxNumber;
  
  const types = type ? [type] : ['add', 'sub', 'even', 'odd'];
  const selectedType = types[Math.floor(Math.random() * types.length)];
  
  let sequence = [];
  let missingIndices = [];
  
  switch (selectedType) {
    case 'add': {
      const start = Math.floor(Math.random() * (maxNum / 2));
      const step = Math.floor(Math.random() * 3) + 1; // 1-3
      for (let i = 0; i < 5; i++) {
        sequence.push(start + i * step);
      }
      break;
    }
    case 'sub': {
      const start = Math.floor(Math.random() * (maxNum / 2)) + maxNum / 2;
      const step = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < 5; i++) {
        sequence.push(start - i * step);
      }
      break;
    }
    case 'even': {
      const start = Math.floor(Math.random() * (maxNum / 4)) * 2;
      for (let i = 0; i < 5; i++) {
        sequence.push(start + i * 2);
      }
      break;
    }
    case 'odd': {
      const start = Math.floor(Math.random() * (maxNum / 4)) * 2 + 1;
      for (let i = 0; i < 5; i++) {
        sequence.push(start + i * 2);
      }
      break;
    }
  }
  
  // Select 2 random positions to hide
  missingIndices = [
    Math.floor(Math.random() * 2) + 1, // position 1 or 2
    Math.floor(Math.random() * 2) + 3, // position 3 or 4
  ];
  
  const answers = missingIndices.map(idx => sequence[idx]);
  
  return {
    sequence,
    missingIndices,
    answers,
    type: selectedType,
  };
};

/**
 * Generate pairs for memory game (equation and answer)
 */
export const generatePairs = (difficulty, count = 6) => {
  const pairs = [];
  const usedAnswers = new Set();
  
  for (let i = 0; i < count; i++) {
    let question;
    let attempts = 0;
    
    // Ensure unique answers
    do {
      question = generateQuestion(difficulty);
      attempts++;
    } while (usedAnswers.has(question.answer) && attempts < 20);
    
    usedAnswers.add(question.answer);
    
    pairs.push({
      id: i,
      equation: question.text,
      answer: question.answer,
    });
  }
  
  return pairs;
};

/**
 * Generate `count` plausible-but-wrong distractors plus the correct answer,
 * shuffled. Distractors are chosen near the correct answer (±5) and are
 * unique and non-negative.
 */
export const generateOptions = (correctAnswer, count = 3) => {
  const options = [correctAnswer];

  while (options.length < count + 1) {
    const offset = Math.floor(Math.random() * 10) - 5;
    const option = correctAnswer + offset;

    if (option >= 0 && !options.includes(option)) {
      options.push(option);
    }
  }

  return options.sort(() => Math.random() - 0.5);
};

