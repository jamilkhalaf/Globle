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

// Official lists for game targets
const officialCountries = [
  "India","China","United States of America","Indonesia","Pakistan","Nigeria","Brazil","Bangladesh","Russia","Ethiopia","Mexico","Japan","Egypt","Kosovo","Philippines","Democratic Republic of the Congo","Vietnam","Iran","Turkey","Germany","Thailand","United Republic of Tanzania","United Kingdom","France","South Africa","Italy","Kenya","Myanmar","Colombia","South Korea","Sudan","Uganda","Spain","Algeria","Iraq","Argentina","Afghanistan","Yemen","Canada","Angola","Ukraine","Morocco","Poland","Uzbekistan","Malaysia","Mozambique","Ghana","Peru","Saudi Arabia","Madagascar","Ivory Coast","Cameroon","Nepal","Venezuela","Niger","Australia","North Korea","Syria","Mali","Burkina Faso","Sri Lanka","Malawi","Zambia","Chad","Kazakhstan","Chile","Somalia","Senegal","Romania","Guatemala","Netherlands","Ecuador","Cambodia","Zimbabwe","Guinea","Benin","Rwanda","Burundi","Bolivia","Tunisia","South Sudan","Haiti","Belgium","Jordan","Dominican Republic","United Arab Emirates","Honduras","Cuba","Tajikistan","Papua New Guinea","Sweden","Czechia","Portugal","Azerbaijan","Greece","Togo","Hungary","Israel","Austria","Belarus","Switzerland","Sierra Leone","Laos","Turkmenistan","Libya","Kyrgyzstan","Paraguay","Nicaragua","Bulgaria","Republic of Serbia","Republic of the Congo","El Salvador","Denmark","Singapore","Lebanon","Liberia","Finland","Norway","Palestine","Central African Republic","Oman","Slovakia","Mauritania","Ireland","New Zealand","Costa Rica","Kuwait","Panama","Croatia","Georgia","Eritrea","Mongolia","Uruguay","Bosnia and Herzegovina","Qatar","Namibia","Moldova","Armenia","Jamaica","Lithuania","Gambia","Albania","Gabon","Botswana","Lesotho","Guinea-Bissau","Slovenia","Equatorial Guinea","Latvia","North Macedonia","Bahrain","Trinidad and Tobago","East Timor","Cyprus","Estonia","Mauritius","eSwatini","Djibouti","Fiji","Comoros","Solomon Islands","Guyana","Bhutan","Luxembourg","Suriname","Montenegro","Malta","Maldives","Cabo Verde","Brunei","Belize","Bahamas, The","Iceland","Vanuatu","Barbados","Sao Tome and Principe","Samoa","St. Lucia","Kiribati","Seychelles","Grenada","Micronesia, Fed. Sts.","Tonga","St. Vincent and the Grenadines","Antigua and Barbuda","Andorra","Dominica","Saint Kitts and Nevis","Liechtenstein","Monaco","Marshall Islands","San Marino","Palau","Nauru","Tuvalu","Vatican City"
];

const stateList = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

// Function to get random target from appropriate list
function getRandomTarget(gameType) {
  switch (gameType) {
    case 'Globle':
    case 'Population':
    case 'Flagle':
    case 'Worldle':
    case 'Capitals':
    case 'Hangman':
    case 'Shaple':
      return officialCountries[Math.floor(Math.random() * officialCountries.length)];
    case 'US':
      return stateList[Math.floor(Math.random() * stateList.length)];
    case 'Findle':
      // For Findle (Wordle), use countries for now
      return officialCountries[Math.floor(Math.random() * officialCountries.length)];
    default:
      return officialCountries[Math.floor(Math.random() * officialCountries.length)];
  }
}

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
  'US': []
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
    
    console.log(`User ${socket.username} trying to join queue for ${gameType}`);
    
    if (!gameQueues[gameType]) {
      gameQueues[gameType] = [];
    }

    // Check if user is already in queue
    const alreadyInQueue = gameQueues[gameType].find(player => player.userId === socket.userId);
    if (alreadyInQueue) {
      console.log(`User ${socket.username} already in queue for ${gameType}`);
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
    
    console.log(`User ${socket.username} joined queue for ${gameType}. Queue length: ${gameQueues[gameType].length}`);
    console.log(`Current queue for ${gameType}:`, gameQueues[gameType].map(p => p.username));
    
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

    // Check if answer is correct using the shared target
    const isCorrect = checkAnswer(match.gameType, answer, match.sharedTarget);
    
    // Store the player's answer
    const playerIndex = match.players.findIndex(p => p.userId === socket.userId);
    if (playerIndex === -1) {
      socket.emit('error', { message: 'Player not found in match' });
      return;
    }
    
    // Initialize answers array if it doesn't exist
    if (!match.answers) {
      match.answers = [];
    }
    
    // Store this player's answer
    match.answers[playerIndex] = {
      userId: socket.userId,
      username: socket.username,
      answer: answer,
      timeTaken: timeTaken,
      isCorrect: isCorrect
    };
    
    console.log(`Player ${socket.username} submitted answer: ${answer} (correct: ${isCorrect})`);
    console.log(`Match answers so far:`, match.answers);
    
    // Check if both players have answered
    if (match.answers.length === 2 && match.answers.every(a => a !== undefined)) {
      // Both players have answered, determine winner
      const player1 = match.answers[0];
      const player2 = match.answers[1];
      
      console.log(`Both players answered. Player1: ${player1.username} (${player1.answer}, correct: ${player1.isCorrect}, time: ${player1.timeTaken})`);
      console.log(`Player2: ${player2.username} (${player2.answer}, correct: ${player2.isCorrect}, time: ${player2.timeTaken})`);
      
      let winner, loser, winnerTime, loserTime;
      let points = {};
      
      if (player1.isCorrect && !player2.isCorrect) {
        // Player 1 wins
        winner = player1.username;
        loser = player2.username;
        winnerTime = player1.timeTaken;
        loserTime = player2.timeTaken;
        points[player1.userId] = 100;
        points[player2.userId] = -100;
        match.winner = player1.userId;
        
        console.log(`Player1 wins: ${player1.username} (correct answer)`);
        
        await updatePlayerPoints(player1.userId, 100, true);
        await updatePlayerPoints(player2.userId, -100, false);
      } else if (!player1.isCorrect && player2.isCorrect) {
        // Player 2 wins
        winner = player2.username;
        loser = player1.username;
        winnerTime = player2.timeTaken;
        loserTime = player1.timeTaken;
        points[player2.userId] = 100;
        points[player1.userId] = -100;
        match.winner = player2.userId;
        
        console.log(`Player2 wins: ${player2.username} (correct answer)`);
        
        await updatePlayerPoints(player2.userId, 100, true);
        await updatePlayerPoints(player1.userId, -100, false);
      } else if (player1.isCorrect && player2.isCorrect) {
        // Both correct - faster player wins
        if (player1.timeTaken < player2.timeTaken) {
          winner = player1.username;
          loser = player2.username;
          winnerTime = player1.timeTaken;
          loserTime = player2.timeTaken;
          points[player1.userId] = 100;
          points[player2.userId] = -100;
          match.winner = player1.userId;
          
          console.log(`Player1 wins: ${player1.username} (faster time: ${player1.timeTaken}s vs ${player2.timeTaken}s)`);
          
          await updatePlayerPoints(player1.userId, 100, true);
          await updatePlayerPoints(player2.userId, -100, false);
        } else {
          winner = player2.username;
          loser = player1.username;
          winnerTime = player2.timeTaken;
          loserTime = player1.timeTaken;
          points[player2.userId] = 100;
          points[player1.userId] = -100;
          match.winner = player2.userId;
          
          console.log(`Player2 wins: ${player2.username} (faster time: ${player2.timeTaken}s vs ${player1.timeTaken}s)`);
          
          await updatePlayerPoints(player2.userId, 100, true);
          await updatePlayerPoints(player1.userId, -100, false);
        }
      } else {
        // Both wrong - no winner, both lose points
        winner = null;
        loser = null;
        points[player1.userId] = -100;
        points[player2.userId] = -100;
        match.winner = null;
        
        console.log(`Both players wrong - no winner`);
        
        await updatePlayerPoints(player1.userId, -100, false);
        await updatePlayerPoints(player2.userId, -100, false);
      }
      
      match.endTime = Date.now();
      
      console.log(`Final result - Winner: ${winner}, Loser: ${loser}, Points:`, points);
      
      // Notify both players
      io.to(matchId).emit('gameEnd', {
        winner: winner,
        loser: loser,
        winnerTime: winnerTime,
        loserTime: loserTime,
        correctAnswer: match.sharedTarget.target,
        points: points,
        bothCorrect: player1.isCorrect && player2.isCorrect,
        bothWrong: !player1.isCorrect && !player2.isCorrect
      });
      
      // Clean up match after delay
      setTimeout(() => {
        activeMatches.delete(matchId);
      }, 5000);
    } else {
      // First player to answer - wait for second player
      console.log(`Waiting for second player to answer...`);
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
  console.log(`Queue contents:`, queue.map(p => ({ username: p.username, userId: p.userId })));
  
  if (queue.length >= 2) {
    const player1 = queue.shift();
    const player2 = queue.shift();
    
    console.log(`Matching players: ${player1.username} vs ${player2.username} for ${gameType}`);
    
    const matchId = `match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Generate shared target for the game
    const sharedTarget = generateSharedTarget(gameType);
    
    // Create match
    const match = {
      id: matchId,
      gameType,
      players: [player1, player2],
      startTime: Date.now(),
      sharedTarget: sharedTarget,
      winner: null
    };
    
    activeMatches.set(matchId, match);
    
    // Join match room
    const socket1 = userSockets.get(player1.userId);
    const socket2 = userSockets.get(player2.userId);
    
    console.log(`Socket1 found: ${!!socket1}, Socket2 found: ${!!socket2}`);
    console.log(`Socket1 ID: ${socket1?.id}, Socket2 ID: ${socket2?.id}`);
    
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
        sharedTarget: sharedTarget,
        startTime: Date.now() + 3000 // 3 second countdown
      };
      
      console.log(`Sending matchFound event with data:`, matchData);
      io.to(matchId).emit('matchFound', matchData);
      
      console.log(`Match found event sent to both players`);
      
      // Start game after countdown
      setTimeout(() => {
        const gameStartData = {
          matchId,
          gameType,
          sharedTarget: sharedTarget,
          startTime: Date.now()
        };
        console.log(`Sending gameStart event with data:`, gameStartData);
        io.to(matchId).emit('gameStart', gameStartData);
        console.log(`Game start event sent to both players`);
        
        // Set a timeout to end the game after 60 seconds if not already ended
        setTimeout(() => {
          const currentMatch = activeMatches.get(matchId);
          if (currentMatch && !currentMatch.winner) {
            console.log(`Game timeout for match ${matchId}`);
            
            // Determine winner based on who answered (if any)
            let winner = null;
            let loser = null;
            let points = {};
            
            if (currentMatch.answers && currentMatch.answers.length === 2) {
              const player1 = currentMatch.answers[0];
              const player2 = currentMatch.answers[1];
              
              if (player1 && player2) {
                // Both answered - determine winner
                if (player1.isCorrect && !player2.isCorrect) {
                  winner = player1.username;
                  loser = player2.username;
                  points[player1.userId] = 100;
                  points[player2.userId] = -100;
                  currentMatch.winner = player1.userId;
                  
                  updatePlayerPoints(player1.userId, 100, true);
                  updatePlayerPoints(player2.userId, -100, false);
                } else if (!player1.isCorrect && player2.isCorrect) {
                  winner = player2.username;
                  loser = player1.username;
                  points[player2.userId] = 100;
                  points[player1.userId] = -100;
                  currentMatch.winner = player2.userId;
                  
                  updatePlayerPoints(player2.userId, 100, true);
                  updatePlayerPoints(player1.userId, -100, false);
                } else if (player1.isCorrect && player2.isCorrect) {
                  // Both correct - faster player wins
                  if (player1.timeTaken < player2.timeTaken) {
                    winner = player1.username;
                    loser = player2.username;
                    points[player1.userId] = 100;
                    points[player2.userId] = -100;
                    currentMatch.winner = player1.userId;
                    
                    updatePlayerPoints(player1.userId, 100, true);
                    updatePlayerPoints(player2.userId, -100, false);
                  } else {
                    winner = player2.username;
                    loser = player1.username;
                    points[player2.userId] = 100;
                    points[player1.userId] = -100;
                    currentMatch.winner = player2.userId;
                    
                    updatePlayerPoints(player2.userId, 100, true);
                    updatePlayerPoints(player1.userId, -100, false);
                  }
                } else {
                  // Both wrong
                  points[player1.userId] = -100;
                  points[player2.userId] = -100;
                  currentMatch.winner = null;
                  
                  updatePlayerPoints(player1.userId, -100, false);
                  updatePlayerPoints(player2.userId, -100, false);
                }
              } else if (player1 && !player2) {
                // Only player1 answered
                if (player1.isCorrect) {
                  winner = player1.username;
                  points[player1.userId] = 100;
                  points[player2.userId] = -100;
                  currentMatch.winner = player1.userId;
                  
                  updatePlayerPoints(player1.userId, 100, true);
                  updatePlayerPoints(player2.userId, -100, false);
                } else {
                  winner = player2.username;
                  points[player1.userId] = -100;
                  points[player2.userId] = 100;
                  currentMatch.winner = player2.userId;
                  
                  updatePlayerPoints(player1.userId, -100, false);
                  updatePlayerPoints(player2.userId, 100, true);
                }
              } else if (!player1 && player2) {
                // Only player2 answered
                if (player2.isCorrect) {
                  winner = player2.username;
                  points[player1.userId] = -100;
                  points[player2.userId] = 100;
                  currentMatch.winner = player2.userId;
                  
                  updatePlayerPoints(player1.userId, -100, false);
                  updatePlayerPoints(player2.userId, 100, true);
                } else {
                  winner = player1.username;
                  points[player1.userId] = 100;
                  points[player2.userId] = -100;
                  currentMatch.winner = player1.userId;
                  
                  updatePlayerPoints(player1.userId, 100, true);
                  updatePlayerPoints(player2.userId, -100, false);
                }
              }
            } else {
              // No one answered - both lose
              points[currentMatch.players[0].userId] = -100;
              points[currentMatch.players[1].userId] = -100;
              currentMatch.winner = null;
              
              updatePlayerPoints(currentMatch.players[0].userId, -100, false);
              updatePlayerPoints(currentMatch.players[1].userId, -100, false);
            }
            
            currentMatch.endTime = Date.now();
            
            // Notify both players
            io.to(matchId).emit('gameEnd', {
              winner: winner,
              loser: loser,
              correctAnswer: currentMatch.sharedTarget.target,
              points: points,
              timeout: true
            });
            
            // Clean up match
            setTimeout(() => {
              activeMatches.delete(matchId);
            }, 5000);
          }
        }, 60000); // 60 second timeout
      }, 3000);
    } else {
      console.log(`Failed to find sockets for players. Socket1: ${!!socket1}, Socket2: ${!!socket2}`);
      // Put players back in queue if sockets not found
      if (socket1) queue.unshift(player1);
      if (socket2) queue.unshift(player2);
    }
  } else {
    console.log(`Not enough players in queue for ${gameType}. Need 2, have ${queue.length}`);
  }
}

function generateSharedTarget(gameType) {
  // Generate a shared target for both players using official lists
  const target = getRandomTarget(gameType);
  
  const targetTypes = {
    'Globle': 'country',
    'Population': 'country',
    'Findle': 'country',
    'Flagle': 'country',
    'Worldle': 'country',
    'Capitals': 'country',
    'Hangman': 'word',
    'Shaple': 'country',
    'US': 'state'
  };
  
  return {
    target: target,
    type: targetTypes[gameType] || 'country'
  };
}

function generateQuestion(gameType) {
  // More realistic question generation
  const questions = {
    'Globle': {
      question: 'Guess the country: This country has a population of 331 million and is located in North America',
      answer: 'United States',
      type: 'country'
    },
    'Population': {
      question: 'What is the population of China?',
      answer: '1.4 billion',
      type: 'population'
    },
    'Findle': {
      question: 'Name a country that starts with the letter "B"',
      answer: 'Brazil',
      type: 'name'
    },
    'Flagle': {
      question: 'Which country has a red flag with a white cross?',
      answer: 'Switzerland',
      type: 'flag'
    },
    'Worldle': {
      question: 'Where is Brazil located?',
      answer: 'South America',
      type: 'location'
    },
    'Capitals': {
      question: 'What is the capital of France?',
      answer: 'Paris',
      type: 'capital'
    },
    'Hangman': {
      question: 'Guess the word: _ _ _ _ _ _ _ (Hint: A type of fruit)',
      answer: 'BANANA',
      type: 'word'
    },
    'Shaple': {
      question: 'What shape is Italy?',
      answer: 'Boot',
      type: 'shape'
    },
    'US': {
      question: 'Which US state is known as the Golden State?',
      answer: 'California',
      type: 'state'
    }
  };
  
  return questions[gameType] || questions['Globle'];
}

function checkAnswer(gameType, answer, sharedTarget) {
  // Check if the answer matches the shared target
  const userAnswer = answer.toLowerCase().trim();
  const targetAnswer = sharedTarget.target.toLowerCase();
  
  // Basic exact match
  if (userAnswer === targetAnswer) {
    return true;
  }
  
  // For countries, also accept common variations
  if (sharedTarget.type === 'country') {
    const variations = {
      'united states': ['usa', 'america', 'united states of america'],
      'china': ['peoples republic of china', 'prc'],
      'brazil': ['brasil'],
      'switzerland': ['swiss'],
      'france': ['republic of france'],
      'italy': ['italian republic']
    };
    
    const targetVariations = variations[targetAnswer] || [];
    if (targetVariations.includes(userAnswer)) {
      return true;
    }
  }
  
  // For US states, accept abbreviations
  if (sharedTarget.type === 'state') {
    const stateAbbreviations = {
      'california': ['ca', 'cal'],
      'texas': ['tx'],
      'new york': ['ny'],
      'florida': ['fl'],
      'illinois': ['il']
    };
    
    const targetAbbreviations = stateAbbreviations[targetAnswer] || [];
    if (targetAbbreviations.includes(userAnswer)) {
      return true;
    }
  }
  
  return false;
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