const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const { createServer } = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

// Import routes
const authRoutes = require('./routes/auth');
const gamesRoutes = require('./routes/games');
const badgesRoutes = require('./routes/badges');

const app = express();
const server = createServer(app);

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: true, // Allow all origins temporarily for debugging
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Trust proxy for rate limiting behind reverse proxy
app.set('trust proxy', 1);

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(limiter);

// CORS
app.use(cors({
  origin: true, // Allow all origins temporarily for debugging
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/games', gamesRoutes);
app.use('/api/badges', badgesRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Globle Web App Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Game queues and active matches
const gameQueues = {
  'Globle': [],
  'Population': [],
  'Findle': [],
  'Flagle': [],
  'Worldle': [],
  'Capitals': [],
  'Hangman': [],
  'Shaple': [],
  'US': [],
  'Namle': []
};

const activeMatches = new Map();
const userSockets = new Map();

// Game-specific data and logic
const gameData = {
  'Globle': {
    countries: [
      { name: 'United States', coordinates: [39.8283, -98.5795] },
      { name: 'Canada', coordinates: [56.1304, -106.3468] },
      { name: 'Mexico', coordinates: [23.6345, -102.5528] },
      { name: 'Brazil', coordinates: [-14.2350, -51.9253] },
      { name: 'Argentina', coordinates: [-38.4161, -63.6167] },
      { name: 'United Kingdom', coordinates: [55.3781, -3.4360] },
      { name: 'France', coordinates: [46.2276, 2.2137] },
      { name: 'Germany', coordinates: [51.1657, 10.4515] },
      { name: 'Italy', coordinates: [41.8719, 12.5674] },
      { name: 'Spain', coordinates: [40.4637, -3.7492] },
      { name: 'China', coordinates: [35.8617, 104.1954] },
      { name: 'Japan', coordinates: [36.2048, 138.2529] },
      { name: 'India', coordinates: [20.5937, 78.9629] },
      { name: 'Australia', coordinates: [-25.2744, 133.7751] },
      { name: 'South Africa', coordinates: [-30.5595, 22.9375] }
    ]
  },
  'Population': {
    countries: [
      { name: 'United States', population: 331002651 },
      { name: 'Canada', population: 37742154 },
      { name: 'Mexico', population: 128932753 },
      { name: 'Brazil', population: 212559417 },
      { name: 'Argentina', population: 45195774 },
      { name: 'United Kingdom', population: 67886011 },
      { name: 'France', population: 65273511 },
      { name: 'Germany', population: 83783942 },
      { name: 'Italy', population: 60461826 },
      { name: 'Spain', population: 46754778 },
      { name: 'China', population: 1439323776 },
      { name: 'Japan', population: 126476461 },
      { name: 'India', population: 1380004385 },
      { name: 'Australia', population: 25499884 },
      { name: 'South Africa', population: 59308690 }
    ]
  },
  'US': {
    states: [
      { name: 'California', coordinates: [36.7783, -119.4179] },
      { name: 'Texas', coordinates: [31.9686, -99.9018] },
      { name: 'Florida', coordinates: [27.6648, -81.5158] },
      { name: 'New York', coordinates: [42.1657, -74.9481] },
      { name: 'Pennsylvania', coordinates: [40.5908, -77.2098] },
      { name: 'Illinois', coordinates: [40.6331, -89.3985] },
      { name: 'Ohio', coordinates: [40.4173, -82.9071] },
      { name: 'Georgia', coordinates: [32.1656, -82.9001] },
      { name: 'North Carolina', coordinates: [35.7596, -79.0193] },
      { name: 'Michigan', coordinates: [44.3148, -85.6024] },
      { name: 'New Jersey', coordinates: [40.0583, -74.4057] },
      { name: 'Virginia', coordinates: [37.7693, -78.1699] },
      { name: 'Washington', coordinates: [47.4009, -121.4905] },
      { name: 'Arizona', coordinates: [33.7298, -111.4312] },
      { name: 'Massachusetts', coordinates: [42.2307, -71.5306] }
    ]
  },
  'Findle': {
    letters: ['U', 'A', 'C', 'B', 'F', 'G', 'I', 'J', 'M', 'N', 'P', 'S', 'T'],
    countries: {
      'U': ['United States', 'United Kingdom', 'Ukraine', 'Uruguay', 'Uzbekistan'],
      'A': ['Australia', 'Austria', 'Argentina', 'Algeria', 'Afghanistan'],
      'C': ['Canada', 'China', 'Colombia', 'Cuba', 'Chile'],
      'B': ['Brazil', 'Belgium', 'Bulgaria', 'Bangladesh', 'Belarus'],
      'F': ['France', 'Finland', 'Fiji', 'Fiji'],
      'G': ['Germany', 'Greece', 'Ghana', 'Guatemala'],
      'I': ['Italy', 'India', 'Indonesia', 'Iran', 'Iraq'],
      'J': ['Japan', 'Jamaica', 'Jordan'],
      'M': ['Mexico', 'Morocco', 'Malaysia', 'Mali'],
      'N': ['Netherlands', 'Norway', 'New Zealand', 'Nigeria'],
      'P': ['Poland', 'Portugal', 'Pakistan', 'Peru'],
      'S': ['Spain', 'Sweden', 'Switzerland', 'South Africa'],
      'T': ['Thailand', 'Turkey', 'Tunisia', 'Tanzania']
    }
  },
  'Flagle': {
    flags: [
      { country: 'United States', flag: '🇺🇸' },
      { country: 'Canada', flag: '🇨🇦' },
      { country: 'United Kingdom', flag: '🇬🇧' },
      { country: 'France', flag: '🇫🇷' },
      { country: 'Germany', flag: '🇩🇪' },
      { country: 'Italy', flag: '🇮🇹' },
      { country: 'Spain', flag: '🇪🇸' },
      { country: 'China', flag: '🇨🇳' },
      { country: 'Japan', flag: '🇯🇵' },
      { country: 'India', flag: '🇮🇳' },
      { country: 'Australia', flag: '🇦🇺' },
      { country: 'Brazil', flag: '🇧🇷' },
      { country: 'Mexico', flag: '🇲🇽' },
      { country: 'Argentina', flag: '🇦🇷' },
      { country: 'South Africa', flag: '🇿🇦' }
    ]
  }
};

// Socket.IO middleware for authentication
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return next(new Error('User not found'));
    }

    socket.userId = user._id.toString();
    socket.username = user.username;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.username} (${socket.userId})`);
  
  userSockets.set(socket.userId, socket);

  // Join game queue
  socket.on('joinQueue', async (data) => {
    const { gameType } = data;
    console.log(`User ${socket.username} joining queue for ${gameType}`);
    
    if (!gameQueues[gameType]) {
      gameQueues[gameType] = [];
    }

    // Check if user is already in queue
    const alreadyInQueue = gameQueues[gameType].find(player => player.userId === socket.userId);
    if (alreadyInQueue) {
      socket.emit('queueError', { message: 'Already in queue for this game' });
      return;
    }

    // Add to queue
    const player = {
      userId: socket.userId,
      username: socket.username,
      socketId: socket.id,
      gameType
    };

    gameQueues[gameType].push(player);
    socket.join(`queue_${gameType}`);
    socket.emit('queueJoined', { gameType, position: gameQueues[gameType].length });
    
    console.log(`Queue for ${gameType}: ${gameQueues[gameType].length} players`);

    // Try to match players
    await tryMatchPlayers(gameType);
  });

  // Leave queue
  socket.on('leaveQueue', (data) => {
    const { gameType } = data;
    leaveQueue(socket, gameType);
  });

  // Submit answer
  socket.on('submitAnswer', async (data) => {
    const { matchId, answer, timeTaken } = data;
    const match = activeMatches.get(matchId);
    
    if (!match) {
      socket.emit('error', { message: 'Match not found' });
      return;
    }

    if (match.winner) {
      socket.emit('error', { message: 'Match already ended' });
      return;
    }

    // Check if answer is correct based on game type
    const isCorrect = checkAnswer(match.gameType, answer, match.correctAnswer);
    
    if (isCorrect) {
      // Player wins
      match.winner = socket.userId;
      match.winnerTime = timeTaken;
      match.endTime = Date.now();
      
      // Update points
      await updatePlayerPoints(socket.userId, 100, true);
      await updatePlayerPoints(match.players.find(p => p.userId !== socket.userId).userId, -100, false);
      
      // Notify both players
      io.to(matchId).emit('gameEnd', {
        winner: socket.username,
        winnerTime: timeTaken,
        correctAnswer: match.correctAnswer,
        points: {
          [socket.userId]: 100,
          [match.players.find(p => p.userId !== socket.userId).userId]: -100
        }
      });
      
      // Clean up match after delay
      setTimeout(() => {
        activeMatches.delete(matchId);
      }, 5000);
    } else {
      // Player loses
      match.winner = match.players.find(p => p.userId !== socket.userId).userId;
      match.loserTime = timeTaken;
      match.endTime = Date.now();
      
      // Update points
      await updatePlayerPoints(socket.userId, -100, false);
      await updatePlayerPoints(match.players.find(p => p.userId !== socket.userId).userId, 100, true);
      
      // Notify both players
      io.to(matchId).emit('gameEnd', {
        winner: match.players.find(p => p.userId !== socket.userId).username,
        loserTime: timeTaken,
        correctAnswer: match.correctAnswer,
        points: {
          [socket.userId]: -100,
          [match.players.find(p => p.userId !== socket.userId).userId]: 100
        }
      });
      
      // Clean up match after delay
      setTimeout(() => {
        activeMatches.delete(matchId);
      }, 5000);
    }
  });

  // Request new opponent
  socket.on('requestNewOpponent', async (data) => {
    const { gameType } = data;
    await tryMatchPlayers(gameType);
  });

  // Disconnect handling
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.username}`);
    
    // Remove from all queues
    Object.keys(gameQueues).forEach(gameType => {
      leaveQueue(socket, gameType);
    });
    
    // Remove from active matches
    for (const [matchId, match] of activeMatches.entries()) {
      if (match.players.some(p => p.userId === socket.userId)) {
        activeMatches.delete(matchId);
        io.to(matchId).emit('opponentDisconnected');
      }
    }
    
    userSockets.delete(socket.userId);
  });
});

// Helper functions
function leaveQueue(socket, gameType) {
  if (gameQueues[gameType]) {
    gameQueues[gameType] = gameQueues[gameType].filter(player => player.userId !== socket.userId);
    socket.leave(`queue_${gameType}`);
    socket.emit('queueLeft', { gameType });
  }
}

async function tryMatchPlayers(gameType) {
  const queue = gameQueues[gameType];
  console.log(`Trying to match players for ${gameType}. Queue length: ${queue.length}`);
  
  if (queue.length >= 2) {
    const player1 = queue.shift();
    const player2 = queue.shift();
    
    console.log(`Creating match: ${player1.username} vs ${player2.username}`);
    
    const matchId = `match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Generate game-specific question
    const gameQuestion = generateQuestion(gameType);
    console.log(`Generated question for ${gameType}:`, gameQuestion);
    
    // Create match
    const match = {
      id: matchId,
      gameType,
      players: [player1, player2],
      startTime: Date.now(),
      correctAnswer: gameQuestion,
      winner: null
    };
    
    activeMatches.set(matchId, match);
    console.log(`Match created with ID: ${matchId}`);
    
    // Join match room
    const socket1 = userSockets.get(player1.userId);
    const socket2 = userSockets.get(player2.userId);
    
    if (socket1 && socket2) {
      socket1.join(matchId);
      socket2.join(matchId);
      
      console.log(`Both players joined match room: ${matchId}`);
      
      // Notify players
      const matchData = {
        matchId,
        gameType,
        players: [
          { username: player1.username },
          { username: player2.username }
        ],
        question: gameQuestion.question,
        target: gameQuestion.target,
        startTime: Date.now() + 3000 // 3 second countdown
      };
      
      console.log('Emitting matchFound with data:', matchData);
      io.to(matchId).emit('matchFound', matchData);
      
      // Start game after countdown
      setTimeout(() => {
        const gameStartData = {
          matchId,
          gameType,
          question: gameQuestion.question,
          target: gameQuestion.target,
          startTime: Date.now()
        };
        
        console.log('Emitting gameStart with data:', gameStartData);
        io.to(matchId).emit('gameStart', gameStartData);
      }, 3000);
    } else {
      console.log('Error: One or both sockets not found');
      if (!socket1) console.log(`Socket not found for player1: ${player1.userId}`);
      if (!socket2) console.log(`Socket not found for player2: ${player2.userId}`);
    }
  } else {
    console.log(`Not enough players in queue for ${gameType}. Need 2, have ${queue.length}`);
  }
}

function generateQuestion(gameType) {
  console.log(`Generating question for game type: ${gameType}`);
  
  switch (gameType) {
    case 'Globle':
      const globleCountries = gameData.Globle.countries;
      const randomGlobleCountry = globleCountries[Math.floor(Math.random() * globleCountries.length)];
      const globleQuestion = {
        question: `Find the country: ${randomGlobleCountry.name}`,
        target: randomGlobleCountry.name,
        answer: randomGlobleCountry.name,
        type: 'country',
        coordinates: randomGlobleCountry.coordinates
      };
      console.log('Generated Globle question:', globleQuestion);
      return globleQuestion;
    
    case 'Population':
      const populationCountries = gameData.Population.countries;
      const randomPopulationCountry = populationCountries[Math.floor(Math.random() * populationCountries.length)];
      const populationQuestion = {
        question: `Guess the population of ${randomPopulationCountry.name}`,
        target: randomPopulationCountry.name,
        answer: randomPopulationCountry.population.toString(),
        type: 'population',
        actualPopulation: randomPopulationCountry.population
      };
      console.log('Generated Population question:', populationQuestion);
      return populationQuestion;
    
    case 'US':
      const usStates = gameData.US.states;
      const randomUSState = usStates[Math.floor(Math.random() * usStates.length)];
      const usQuestion = {
        question: `Find the US state: ${randomUSState.name}`,
        target: randomUSState.name,
        answer: randomUSState.name,
        type: 'state',
        coordinates: randomUSState.coordinates
      };
      console.log('Generated US question:', usQuestion);
      return usQuestion;
    
    case 'Findle':
      const findleLetters = gameData.Findle.letters;
      const randomFindleLetter = findleLetters[Math.floor(Math.random() * findleLetters.length)];
      const randomFindleCountry = gameData.Findle.countries[randomFindleLetter][Math.floor(Math.random() * gameData.Findle.countries[randomFindleLetter].length)];
      const findleQuestion = {
        question: `Find a country starting with "${randomFindleLetter}": ${randomFindleCountry}`,
        target: randomFindleCountry,
        answer: randomFindleCountry,
        type: 'findle',
        letter: randomFindleLetter
      };
      console.log('Generated Findle question:', findleQuestion);
      return findleQuestion;
    
    case 'Flagle':
      const flags = gameData.Flagle.flags;
      const randomFlag = flags[Math.floor(Math.random() * flags.length)];
      const flagleQuestion = {
        question: `Identify the flag: ${randomFlag.flag}`,
        target: randomFlag.country,
        answer: randomFlag.country,
        type: 'flagle',
        flag: randomFlag.flag
      };
      console.log('Generated Flagle question:', flagleQuestion);
      return flagleQuestion;
    
    default:
      // Fallback for other games
      const fallbackQuestion = {
        question: 'What is the answer?',
        target: 'Answer',
        answer: 'Answer',
        type: 'general'
      };
      console.log('Generated fallback question:', fallbackQuestion);
      return fallbackQuestion;
  }
}

function checkAnswer(gameType, answer, correctAnswer) {
  if (!answer || !correctAnswer) return false;
  
  const userAnswer = answer.toLowerCase().trim();
  const correctAnswerLower = correctAnswer.answer.toLowerCase().trim();
  
  switch (gameType) {
    case 'Globle':
      // For Globle, check if the country name matches
      return userAnswer === correctAnswerLower || 
             userAnswer.includes(correctAnswerLower) || 
             correctAnswerLower.includes(userAnswer);
    
    case 'Population':
      // For Population, check if the population guess is within 10% of actual
      const userPopulation = parseInt(userAnswer.replace(/[^\d]/g, ''));
      const actualPopulation = correctAnswer.actualPopulation;
      if (isNaN(userPopulation)) return false;
      
      const percentageDiff = Math.abs(userPopulation - actualPopulation) / actualPopulation;
      return percentageDiff <= 0.1; // Within 10%
    
    case 'US':
      // For US States, check if the state name matches
      return userAnswer === correctAnswerLower || 
             userAnswer.includes(correctAnswerLower) || 
             correctAnswerLower.includes(userAnswer);
    
    case 'Findle':
      // For Findle, check if the country name starts with the correct letter
      return userAnswer.startsWith(correctAnswer.letter.toLowerCase());
    
    case 'Flagle':
      // For Flagle, check if the country name matches
      return userAnswer === correctAnswerLower || 
             userAnswer.includes(correctAnswerLower) || 
             correctAnswerLower.includes(userAnswer);
    
    default:
      // Default exact match
      return userAnswer === correctAnswerLower;
  }
}

async function updatePlayerPoints(userId, pointsChange, isWin) {
  try {
    const user = await User.findById(userId);
    if (user) {
      await user.updateOnlinePoints(pointsChange, isWin);
    }
  } catch (error) {
    console.error('Error updating player points:', error);
  }
}

const PORT = process.env.PORT || 5051;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
}); 