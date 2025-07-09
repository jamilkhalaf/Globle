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

    // Check if answer is correct (simplified for now)
    const isCorrect = checkAnswer(match.gameType, answer);
    
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
  
  if (queue.length >= 2) {
    const player1 = queue.shift();
    const player2 = queue.shift();
    
    const matchId = `match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create match
    const match = {
      id: matchId,
      gameType,
      players: [player1, player2],
      startTime: Date.now(),
      correctAnswer: generateQuestion(gameType),
      winner: null
    };
    
    activeMatches.set(matchId, match);
    
    // Join match room
    const socket1 = userSockets.get(player1.userId);
    const socket2 = userSockets.get(player2.userId);
    
    if (socket1 && socket2) {
      socket1.join(matchId);
      socket2.join(matchId);
      
      // Notify players
      io.to(matchId).emit('matchFound', {
        matchId,
        gameType,
        players: [
          { username: player1.username },
          { username: player2.username }
        ],
        question: match.correctAnswer.question,
        startTime: Date.now() + 3000 // 3 second countdown
      });
      
      // Start game after countdown
      setTimeout(() => {
        io.to(matchId).emit('gameStart', {
          matchId,
          gameType,
          question: match.correctAnswer.question,
          startTime: Date.now()
        });
      }, 3000);
    }
  }
}

function generateQuestion(gameType) {
  // Simplified question generation - you can expand this
  const questions = {
    'Globle': {
      question: 'What country is this?',
      answer: 'United States',
      type: 'country'
    },
    'Population': {
      question: 'What is the population of this country?',
      answer: '331 million',
      type: 'population'
    },
    'Findle': {
      question: 'What country name starts with "U"?',
      answer: 'United States',
      type: 'name'
    },
    'Flagle': {
      question: 'What country does this flag belong to?',
      answer: 'United States',
      type: 'flag'
    },
    'Worldle': {
      question: 'Where is this country located?',
      answer: 'North America',
      type: 'location'
    },
    'Capitals': {
      question: 'What is the capital of this country?',
      answer: 'Washington D.C.',
      type: 'capital'
    },
    'Hangman': {
      question: 'Guess the word: _ _ _ _ _ _ _ _',
      answer: 'COUNTRY',
      type: 'word'
    },
    'Shaple': {
      question: 'What shape is this country?',
      answer: 'Rectangle',
      type: 'shape'
    },
    'US': {
      question: 'What US state is this?',
      answer: 'California',
      type: 'state'
    },
    'Namle': {
      question: 'What country name contains "A"?',
      answer: 'Canada',
      type: 'name'
    }
  };
  
  return questions[gameType] || questions['Globle'];
}

function checkAnswer(gameType, answer) {
  // Simplified answer checking - you can make this more sophisticated
  const correctAnswers = {
    'Globle': ['united states', 'usa', 'america'],
    'Population': ['331 million', '331m', '331'],
    'Findle': ['united states', 'usa'],
    'Flagle': ['united states', 'usa', 'america'],
    'Worldle': ['north america', 'america'],
    'Capitals': ['washington d.c.', 'washington', 'dc'],
    'Hangman': ['country'],
    'Shaple': ['rectangle'],
    'US': ['california', 'ca'],
    'Namle': ['canada']
  };
  
  const answers = correctAnswers[gameType] || [];
  return answers.some(correct => answer.toLowerCase().includes(correct));
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