const io = require('socket.io-client');

// Test WebSocket connection and game functionality
async function testWebSocket() {
  console.log('Testing WebSocket connection...');
  
  // Create a test token (you'll need to replace this with a real token)
  const testToken = 'your-test-token-here';
  
  const socket = io('https://api.jamilweb.click', {
    auth: { token: testToken }
  });

  socket.on('connect', () => {
    console.log('✅ Connected to WebSocket server');
    
    // Test joining a queue
    socket.emit('joinQueue', { gameType: 'Globle' });
  });

  socket.on('disconnect', () => {
    console.log('❌ Disconnected from WebSocket server');
  });

  socket.on('queueJoined', (data) => {
    console.log('✅ Joined queue:', data);
  });

  socket.on('queueError', (data) => {
    console.log('❌ Queue error:', data);
  });

  socket.on('matchFound', (data) => {
    console.log('✅ Match found:', data);
  });

  socket.on('gameStart', (data) => {
    console.log('✅ Game started:', data);
  });

  socket.on('gameEnd', (data) => {
    console.log('✅ Game ended:', data);
  });

  socket.on('error', (data) => {
    console.log('❌ Error:', data);
  });

  // Test game data generation
  console.log('\nTesting game data generation...');
  
  const gameData = {
    'Globle': {
      countries: [
        { name: 'United States', coordinates: [39.8283, -98.5795] },
        { name: 'Canada', coordinates: [56.1304, -106.3468] }
      ]
    },
    'Findle': {
      letters: ['U', 'A', 'C'],
      countries: {
        'U': ['United States', 'United Kingdom'],
        'A': ['Australia', 'Austria'],
        'C': ['Canada', 'China']
      }
    },
    'Flagle': {
      flags: [
        { country: 'United States', flag: '🇺🇸' },
        { country: 'Canada', flag: '🇨🇦' }
      ]
    }
  };

  // Test question generation
  function generateQuestion(gameType) {
    switch (gameType) {
      case 'Globle':
        const globleCountries = gameData.Globle.countries;
        const randomGlobleCountry = globleCountries[Math.floor(Math.random() * globleCountries.length)];
        return {
          question: `Find the country: ${randomGlobleCountry.name}`,
          target: randomGlobleCountry.name,
          answer: randomGlobleCountry.name,
          type: 'country'
        };
      
      case 'Findle':
        const findleLetters = gameData.Findle.letters;
        const randomFindleLetter = findleLetters[Math.floor(Math.random() * findleLetters.length)];
        const randomFindleCountry = gameData.Findle.countries[randomFindleLetter][Math.floor(Math.random() * gameData.Findle.countries[randomFindleLetter].length)];
        return {
          question: `Find a country starting with "${randomFindleLetter}": ${randomFindleCountry}`,
          target: randomFindleCountry,
          answer: randomFindleCountry,
          type: 'findle',
          letter: randomFindleLetter
        };
      
      case 'Flagle':
        const flags = gameData.Flagle.flags;
        const randomFlag = flags[Math.floor(Math.random() * flags.length)];
        return {
          question: `Identify the flag: ${randomFlag.flag}`,
          target: randomFlag.country,
          answer: randomFlag.country,
          type: 'flagle',
          flag: randomFlag.flag
        };
      
      default:
        return {
          question: 'What is the answer?',
          target: 'Answer',
          answer: 'Answer',
          type: 'general'
        };
    }
  }

  // Test answer validation
  function checkAnswer(gameType, answer, correctAnswer) {
    if (!answer || !correctAnswer) return false;
    
    const userAnswer = answer.toLowerCase().trim();
    const correctAnswerLower = correctAnswer.answer.toLowerCase().trim();
    
    switch (gameType) {
      case 'Globle':
        return userAnswer === correctAnswerLower || 
               userAnswer.includes(correctAnswerLower) || 
               correctAnswerLower.includes(userAnswer);
      
      case 'Findle':
        return userAnswer.startsWith(correctAnswer.letter.toLowerCase());
      
      case 'Flagle':
        return userAnswer === correctAnswerLower || 
               userAnswer.includes(correctAnswerLower) || 
               correctAnswerLower.includes(userAnswer);
      
      default:
        return userAnswer === correctAnswerLower;
    }
  }

  // Test question generation for each game type
  const gameTypes = ['Globle', 'Findle', 'Flagle'];
  
  gameTypes.forEach(gameType => {
    console.log(`\nTesting ${gameType}:`);
    const question = generateQuestion(gameType);
    console.log('Question:', question.question);
    console.log('Target:', question.target);
    console.log('Answer:', question.answer);
    
    // Test answer validation
    const testAnswers = [question.answer, 'wrong answer', question.answer.toLowerCase()];
    testAnswers.forEach(testAnswer => {
      const isCorrect = checkAnswer(gameType, testAnswer, question);
      console.log(`  "${testAnswer}" -> ${isCorrect ? '✅ Correct' : '❌ Wrong'}`);
    });
  });

  console.log('\n✅ WebSocket test completed');
}

// Run the test
testWebSocket().catch(console.error); 