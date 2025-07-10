const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const { createServer } = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

// Import countryInfo for population data
const countryInfo = {
  'Aruba': { capital: 'Oranjestad', population: 108_000 },
  'Afghanistan': { capital: 'Kabul', population: 41_315_000 },
  'Angola': { capital: 'Luanda', population: 36_698_000 },
  'Albania': { capital: 'Tirane', population: 2_793_000 },
  'Andorra': { capital: 'Andorra la Vella', population: 77_000 },
  'United Arab Emirates': { capital: 'Abu Dhabi', population: 9_993_000 },
  'Argentina': { capital: 'Buenos Aires', population: 46_175_000 },
  'Armenia': { capital: 'Yerevan', population: 2_793_000 },
  'American Samoa': { capital: 'Pago Pago', population: 47_000 },
  'Antigua and Barbuda': { capital: 'Saint Johns', population: 102_000 },
  'Australia': { capital: 'Canberra', population: 27_232_000 },
  'Austria': { capital: 'Vienna', population: 9_089_000 },
  'Azerbaijan': { capital: 'Baku', population: 10_348_000 },
  'Burundi': { capital: 'Bujumbura', population: 13_398_000 },
  'Belgium': { capital: 'Brussels', population: 11_716_000 },
  'Benin': { capital: 'Porto-Novo', population: 13_411_000 },
  'Burkina Faso': { capital: 'Ouagadougou', population: 22_102_000 },
  'Bangladesh': { capital: 'Dhaka', population: 171_467_000 },
  'Bulgaria': { capital: 'Sofia', population: 6_886_000 },
  'Bahrain': { capital: 'Manama', population: 1_772_000 },
  'Bahamas, The': { capital: 'Nassau', population: 420_000 },
  'Bosnia and Herzegovina': { capital: 'Sarajevo', population: 3_263_000 },
  'Belarus': { capital: 'Minsk', population: 9_237_000 },
  'Belize': { capital: 'Belmopan', population: 419_000 },
  'Bermuda': { capital: 'Hamilton', population: 63_000 },
  'Bolivia': { capital: 'La Paz', population: 12_055_000 },
  'Brazil': { capital: 'Brasilia', population: 203_262_000 },
  'Barbados': { capital: 'Bridgetown', population: 293_000 },
  'Brunei Darussalam': { capital: 'Bandar Seri Begawan', population: 453_000 },
  'Bhutan': { capital: 'Thimphu', population: 773_000 },
  'Botswana': { capital: 'Gaborone', population: 2_643_000 },
  'Central African Republic': { capital: 'Bangui', population: 5_683_000 },
  'Canada': { capital: 'Ottawa', population: 39_087_000 },
  'Switzerland': { capital: 'Bern', population: 8_822_000 },
  'Chile': { capital: 'Santiago', population: 19_725_000 },
  'China': { capital: 'Beijing', population: 1_425_180_000 },
  'Cote dIvoire': { capital: 'Yamoussoukro', population: 29_017_000 },
  'Cameroon': { capital: 'Yaounde', population: 28_060_000 },
  'Congo, Dem. Rep.': { capital: 'Kinshasa', population: 108_396_000 },
  'Congo, Rep.': { capital: 'Brazzaville', population: 5_821_000 },
  'Colombia': { capital: 'Bogota', population: 51_069_000 },
  'Comoros': { capital: 'Moroni', population: 931_000 },
  'Cabo Verde': { capital: 'Praia', population: 608_000 },
  'Costa Rica': { capital: 'San Jose', population: 5_274_000 },
  'Cuba': { capital: 'Havana', population: 11_234_000 },
  'Curacao': { capital: 'Willemstad', population: 156_000 },
  'Cayman Islands': { capital: 'George Town', population: 66_000 },
  'Cyprus': { capital: 'Nicosia', population: 945_000 },
  'Czechia': { capital: 'Prague', population: 10_594_000 },
  'Germany': { capital: 'Berlin', population: 83_238_000 },
  'Djibouti': { capital: 'Djibouti', population: 1_079_000 },
  'Dominica': { capital: 'Roseau', population: 73_000 },
  'Denmark': { capital: 'Copenhagen', population: 5_920_000 },
  'Dominican Republic': { capital: 'Santo Domingo', population: 11_377_000 },
  'Algeria': { capital: 'Algiers', population: 44_178_000 },
  'Ecuador': { capital: 'Quito', population: 18_057_000 },
  'Egypt, Arab Rep.': { capital: 'Cairo', population: 110_990_000 },
  'Eritrea': { capital: 'Asmara', population: 3_669_000 },
  'Spain': { capital: 'Madrid', population: 47_581_000 },
  'Estonia': { capital: 'Tallinn', population: 1_326_000 },
  'Ethiopia': { capital: 'Addis Ababa', population: 123_379_000 },
  'Finland': { capital: 'Helsinki', population: 5_571_000 },
  'Fiji': { capital: 'Suva', population: 923_000 },
  'France': { capital: 'Paris', population: 65_707_000 },
  'Faroe Islands': { capital: 'Torshavn', population: 53_000 },
  'Micronesia, Fed. Sts.': { capital: 'Palikir', population: 118_000 },
  'Gabon': { capital: 'Libreville', population: 2_433_000 },
  'United Kingdom': { capital: 'London', population: 67_508_000 },
  'Georgia': { capital: 'Tbilisi', population: 3_728_000 },
  'Ghana': { capital: 'Accra', population: 34_169_000 },
  'Guinea': { capital: 'Conakry', population: 14_764_000 },
  'Gambia, The': { capital: 'Banjul', population: 2_731_000 },
  'Guinea-Bissau': { capital: 'Bissau', population: 2_047_000 },
  'Equatorial Guinea': { capital: 'Malabo', population: 1_632_000 },
  'Greece': { capital: 'Athens', population: 10_432_000 },
  'Grenada': { capital: 'Saint Georges', population: 124_000 },
  'Greenland': { capital: 'Nuuk', population: 59_000 },
  'Guatemala': { capital: 'Guatemala City', population: 17_633_000 },
  'Guam': { capital: 'Agana', population: 168_000 },
  'Guyana': { capital: 'Georgetown', population: 822_000 },
  'Honduras': { capital: 'Tegucigalpa', population: 10_178_000 },
  'Croatia': { capital: 'Zagreb', population: 3_865_000 },
  'Haiti': { capital: 'Port-au-Prince', population: 11_825_000 },
  'Hungary': { capital: 'Budapest', population: 9_605_000 },
  'Indonesia': { capital: 'Jakarta', population: 276_361_000 },
  'Isle of Man': { capital: 'Douglas', population: 85_000 },
  'India': { capital: 'New Delhi', population: 1_425_423_000 },
  'Ireland': { capital: 'Dublin', population: 5_253_000 },
  'Iran, Islamic Rep.': { capital: 'Tehran', population: 88_289_000 },
  'Iraq': { capital: 'Baghdad', population: 43_533_000 },
  'Iceland': { capital: 'Reykjavik', population: 396_000 },
  'Israel': { capital: 'Tel Aviv', population: 9_523_000 },
  'Italy': { capital: 'Rome', population: 58_983_000 },
  'Jamaica': { capital: 'Kingston', population: 2_732_000 },
  'Jordan': { capital: 'Amman', population: 11_235_000 },
  'Japan': { capital: 'Tokyo', population: 125_584_000 },
  'Kazakhstan': { capital: 'Astana', population: 19_542_000 },
  'Kenya': { capital: 'Nairobi', population: 54_027_000 },
  'Kyrgyz Republic': { capital: 'Bishkek', population: 7_059_000 },
  'Cambodia': { capital: 'Phnom Penh', population: 17_170_000 },
  'Kiribati': { capital: 'Tarawa', population: 137_000 },
  'St. Kitts andNevis': { capital: 'Basseterre', population: 55_000 },
  'Korea, Rep.': { capital: 'Seoul', population: 51_925_000 },
  'Kuwait': { capital: 'Kuwait City', population: 4_415_000 },
  'Lebanon': { capital: 'Beirut', population: 6_089_000 },
  'Liberia': { capital: 'Monrovia', population: 5_343_000 },
  'Libya': { capital: 'Tripoli', population: 7_352_000 },
  'St. Lucia': { capital: 'Castries', population: 190_000 },
  'Liechtenstein': { capital: 'Vaduz', population: 38_000 },
  'Sri Lanka': { capital: 'Colombo', population: 21_456_000 },
  'Lesotho': { capital: 'Maseru', population: 2_204_000 },
  'Lithuania': { capital: 'Vilnius', population: 2_801_000 },
  'Luxembourg': { capital: 'Luxembourg', population: 645_000 },
  'Latvia': { capital: 'Riga', population: 1_826_000 },
  'St. Martin (French part)': { capital: 'Marigot', population: 40_000 },
  'Morocco': { capital: 'Rabat', population: 38_162_000 },
  'Monaco': { capital: 'Monaco', population: 39_000 },
  'Moldova': { capital: 'Chisinau', population: 2_603_000 },
  'Madagascar': { capital: 'Antananarivo', population: 29_719_000 },
  'Maldives': { capital: 'Male', population: 551_000 },
  'Mexico': { capital: 'Mexico City', population: 129_740_000 },
  'Marshall Islands': { capital: 'Majuro', population: 61_000 },
  'North Macedonia': { capital: 'Skopje', population: 2_068_000 },
  'Mali': { capital: 'Bamako', population: 20_250_000 },
  'Malta': { capital: 'Valletta', population: 518_000 },
  'Myanmar': { capital: 'Naypyidaw', population: 54_797_000 },
  'Montenegro': { capital: 'Podgorica', population: 601_000 },
  'Mongolia': { capital: 'Ulaanbaatar', population: 3_442_000 },
  'Northern Mariana Islands': { capital: 'Saipan', population: 51_000 },
  'Mozambique': { capital: 'Maputo', population: 33_899_000 },
  'Mauritania': { capital: 'Nouakchott', population: 5_428_000 },
  'Mauritius': { capital: 'Port Louis', population: 1_323_000 },
  'Malawi': { capital: 'Lilongwe', population: 20_675_000 },
  'Malaysia': { capital: 'Kuala Lumpur', population: 33_871_000 },
  'Namibia': { capital: 'Windhoek', population: 2_679_000 },
  'Niger': { capital: 'Niamey', population: 28_950_000 },
  'Nigeria': { capital: 'Abuja', population: 236_747_000 },
  'Nicaragua': { capital: 'Managua', population: 7_198_000 },
  'Netherlands': { capital: 'Amsterdam', population: 17_757_000 },
  'Norway': { capital: 'Oslo', population: 5_499_000 },
  'Nepal': { capital: 'Kathmandu', population: 30_035_000 },
  'Nauru': { capital: 'Yaren District', population: 12_000 },
  'New Zealand': { capital: 'Wellington', population: 5_124_000 },
  'Oman': { capital: 'Muscat', population: 5_628_000 },
  'Pakistan': { capital: 'Islamabad', population: 241_500_000 },
  'Palestine': { capital: 'Jerusalem', population: 5_357_000 },
  'Panama': { capital: 'Panama City', population: 4_385_000 },
  'Peru': { capital: 'Lima', population: 34_482_000 },
  'Philippines': { capital: 'Manila', population: 113_524_000 },
  'Palau': { capital: 'Koror', population: 18_000 },
  'Papua New Guinea': { capital: 'Port Moresby', population: 9_397_000 },
  'Poland': { capital: 'Warsaw', population: 37_651_000 },
  'Puerto Rico': { capital: 'San Juan', population: 3_239_000 },
  'Korea, Dem. Peoples Rep.': { capital: 'Pyongyang', population: 26_043_000 },
  'Portugal': { capital: 'Lisbon', population: 10_298_000 },
  'Paraguay': { capital: 'Asuncion', population: 7_456_000 },
  'French Polynesia': { capital: 'Papeete', population: 324_000 },
  'Qatar': { capital: 'Doha', population: 2_877_000 },
  'Romania': { capital: 'Bucharest', population: 19_121_000 },
  'Russian Federation': { capital: 'Moscow', population: 145_034_000 },
  'Rwanda': { capital: 'Kigali', population: 13_033_000 },
  'Saudi Arabia': { capital: 'Riyadh', population: 36_017_000 },
  'Sudan': { capital: 'Khartoum', population: 49_390_000 },
  'Senegal': { capital: 'Dakar', population: 18_901_000 },
  'Singapore': { capital: 'Singapore', population: 5_703_000 },
  'Solomon Islands': { capital: 'Honiara', population: 768_000 },
  'Sierra Leone': { capital: 'Freetown', population: 8_308_000 },
  'El Salvador': { capital: 'San Salvador', population: 6_519_000 },
  'San Marino': { capital: 'San Marino', population: 34_000 },
  'Somalia': { capital: 'Mogadishu', population: 18_476_000 },
  'Serbia': { capital: 'Belgrade', population: 6_642_000 },
  'South Sudan': { capital: 'Juba', population: 11_709_000 },
  'Sao Tome and Principe': { capital: 'Sao Tome', population: 226_000 },
  'Suriname': { capital: 'Paramaribo', population: 609_000 },
  'Slovak Republic': { capital: 'Bratislava', population: 5_466_000 },
  'Slovenia': { capital: 'Ljubljana', population: 2_108_000 },
  'Sweden': { capital: 'Stockholm', population: 10_502_000 },
  'Eswatini': { capital: 'Mbabane', population: 1_187_000 },
  'Sint Maarten (Dutch part)': { capital: 'Philipsburg', population: 42_000 },
  'Seychelles': { capital: 'Victoria', population: 101_000 },
  'Syrian Arab Republic': { capital: 'Damascus', population: 23_204_000 },
  'Turks and Caicos Islands': { capital: 'Grand Turk', population: 58_000 },
  'Chad': { capital: 'NDjamena', population: 18_264_000 },
  'Togo': { capital: 'Lome', population: 8_798_000 },
  'Thailand': { capital: 'Bangkok', population: 71_887_000 },
  'Tajikistan': { capital: 'Dushanbe', population: 10_678_000 },
  'Turkmenistan': { capital: 'Ashgabat', population: 7_145_000 },
  'Timor-Leste': { capital: 'Dili', population: 1_371_000 },
  'Tonga': { capital: 'Nukualofa', population: 108_000 },
  'Trinidad and Tobago': { capital: 'Port-of-Spain', population: 1_410_000 },
  'Tunisia': { capital: 'Tunis', population: 12_103_000 },
  'Turkiye': { capital: 'Ankara', population: 86_277_000 },
  'Tuvalu': { capital: 'Funafuti', population: 12_000 },
  'Tanzania': { capital: 'Dodoma', population: 64_700_000 },
  'Uganda': { capital: 'Kampala', population: 49_123_000 },
  'Ukraine': { capital: 'Kiev', population: 36_159_000 },
  'Uruguay': { capital: 'Montevideo', population: 3_517_000 },
  'United States of America': { capital: 'Washington D.C.', population: 343_477_000 }
};

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

// Track multi-round game state
const multiRoundGames = new Map(); // matchId -> { player1Rounds: 0, player2Rounds: 0, currentRound: 1, originalTarget: null }

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
    const isCorrect = checkAnswer(gameType, answer, match.sharedTarget);
    
    // Store the player's answer
    const playerIndex = match.players.findIndex(p => p.userId === socket.userId);
    if (playerIndex === -1) {
      socket.emit('error', { message: 'Player not found in match' });
      return;
    }
    
    // Validate playerIndex is within bounds
    if (playerIndex < 0 || playerIndex >= 2) {
      console.error(`Invalid playerIndex: ${playerIndex} for user ${socket.username}`);
      socket.emit('error', { message: 'Invalid player index' });
      return;
    }
    
    // Initialize answers array if it doesn't exist
    if (!match.answers) {
      match.answers = [];
    }
    
    // Ensure answers array has 2 slots
    while (match.answers.length < 2) {
      match.answers.push(undefined);
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
    
    // If this player got it correct, notify the other player immediately
    if (isCorrect) {
      const otherPlayerIndex = playerIndex === 0 ? 1 : 0;
      const otherPlayer = match.players[otherPlayerIndex];
      
      // Notify the other player that someone got it right
      io.to(matchId).emit('playerCorrect', {
        correctPlayer: socket.username,
        correctAnswer: match.sharedTarget.target,
        timeTaken: timeTaken
      });
    }
    
    // Check if both players have answered
    if (match.answers.length === 2 && match.answers.every(a => a !== undefined)) {
      // Both players have answered, determine winner
      const player1 = match.answers[0];
      const player2 = match.answers[1];
      
      // Add null checks to prevent the username error
      if (!player1 || !player2) {
        console.error('One or both players missing from answers:', match.answers);
        return;
      }
      
      console.log(`Both players answered. Player1: ${player1.username} (${player1.answer}, correct: ${player1.isCorrect}, time: ${player1.timeTaken})`);
      console.log(`Player2: ${player2.username} (${player2.answer}, correct: ${player2.isCorrect}, time: ${player2.timeTaken})`);
      
      let roundWinner, roundLoser, winnerTime, loserTime;
      let points = {};
      
      // Get current multi-round game state
      const multiRoundState = multiRoundGames.get(matchId) || { player1Rounds: 0, player2Rounds: 0, currentRound: 1 };
      
      if (player1.isCorrect && !player2.isCorrect) {
        // Player 1 wins this round
        roundWinner = player1.username;
        roundLoser = player2.username;
        winnerTime = player1.timeTaken;
        loserTime = player2.timeTaken;
        multiRoundState.player1Rounds++;
        
        console.log(`Player1 wins round: ${player1.username} (correct answer)`);
      } else if (!player1.isCorrect && player2.isCorrect) {
        // Player 2 wins this round
        roundWinner = player2.username;
        roundLoser = player1.username;
        winnerTime = player2.timeTaken;
        loserTime = player1.timeTaken;
        multiRoundState.player2Rounds++;
        
        console.log(`Player2 wins round: ${player2.username} (correct answer)`);
      } else if (player1.isCorrect && player2.isCorrect) {
        // Both correct - faster player wins this round
        if (player1.timeTaken < player2.timeTaken) {
          roundWinner = player1.username;
          roundLoser = player2.username;
          winnerTime = player1.timeTaken;
          loserTime = player2.timeTaken;
          multiRoundState.player1Rounds++;
          
          console.log(`Player1 wins round: ${player1.username} (faster time: ${player1.timeTaken}s vs ${player2.timeTaken}s)`);
        } else {
          roundWinner = player2.username;
          roundLoser = player1.username;
          winnerTime = player2.timeTaken;
          loserTime = player1.timeTaken;
          multiRoundState.player2Rounds++;
          
          console.log(`Player2 wins round: ${player2.username} (faster time: ${player2.timeTaken}s vs ${player1.timeTaken}s)`);
        }
      } else {
        // Both wrong - no round winner
        roundWinner = null;
        roundLoser = null;
        console.log(`Both players wrong - no round winner`);
      }
      
      // Check if game is over (first to 5 rounds)
      const gameOver = multiRoundState.player1Rounds >= 5 || multiRoundState.player2Rounds >= 5;
      
      if (gameOver) {
        // Game is over, determine overall winner
        const overallWinner = multiRoundState.player1Rounds >= 5 ? player1.username : player2.username;
        const overallLoser = multiRoundState.player1Rounds >= 5 ? player2.username : player1.username;
        
        // Award 100 points to overall winner, -100 to loser
        points[player1.userId] = multiRoundState.player1Rounds >= 5 ? 100 : -100;
        points[player2.userId] = multiRoundState.player2Rounds >= 5 ? 100 : -100;
        match.winner = multiRoundState.player1Rounds >= 5 ? player1.userId : player2.userId;
        
        console.log(`Game over! Overall winner: ${overallWinner} (${multiRoundState.player1Rounds}-${multiRoundState.player2Rounds})`);
        
        await updatePlayerPoints(player1.userId, points[player1.userId], multiRoundState.player1Rounds >= 5);
        await updatePlayerPoints(player2.userId, points[player2.userId], multiRoundState.player2Rounds >= 5);
        
        match.endTime = Date.now();
        
        // Notify both players of game end
        io.to(matchId).emit('gameEnd', {
          winner: overallWinner,
          loser: overallLoser,
          winnerTime: winnerTime,
          loserTime: loserTime,
          correctAnswer: match.sharedTarget.target,
          points: points,
          bothCorrect: player1.isCorrect && player2.isCorrect,
          bothWrong: !player1.isCorrect && !player2.isCorrect,
          gameOver: true,
          finalScore: `${multiRoundState.player1Rounds}-${multiRoundState.player2Rounds}`
        });
        
        // Clean up match after delay
        setTimeout(() => {
          activeMatches.delete(matchId);
          multiRoundGames.delete(matchId);
        }, 5000);
      } else {
        // Game continues to next round
        multiRoundState.currentRound++;
        multiRoundGames.set(matchId, multiRoundState);
        
        console.log(`Round ${multiRoundState.currentRound - 1} complete. Score: ${multiRoundState.player1Rounds}-${multiRoundState.player2Rounds}`);
        
        // Notify both players of round result
        io.to(matchId).emit('roundEnd', {
          roundWinner: roundWinner,
          roundLoser: roundLoser,
          winnerTime: winnerTime,
          loserTime: loserTime,
          correctAnswer: match.sharedTarget.target,
          player1Rounds: multiRoundState.player1Rounds,
          player2Rounds: multiRoundState.player2Rounds,
          currentRound: multiRoundState.currentRound,
          gameOver: false
        });
        
        // Keep the same target for the next round (don't generate new target)
        // match.sharedTarget stays the same
        match.answers = []; // Reset answers for next round
        
        // Start next round after short delay
        setTimeout(() => {
          io.to(matchId).emit('nextRound', {
            matchId,
            gameType: match.gameType,
            sharedTarget: match.sharedTarget, // Same target as before
            startTime: Date.now(),
            currentRound: multiRoundState.currentRound
          });
        }, 2000);
      }
    } else {
      // First player to answer - wait for second player
      console.log(`Waiting for second player to answer...`);
      console.log(`Current answers:`, match.answers.map(a => a ? `${a.username}: ${a.answer}` : 'undefined'));
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
    
    // Initialize multi-round game state
    multiRoundGames.set(matchId, {
      player1Rounds: 0,
      player2Rounds: 0,
      currentRound: 1
    });
    
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
        
        // The game will only end when both players have answered or one disconnects.
        // No explicit timeout for the game round itself.
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
      'italy': ['italian republic'],
      'united kingdom': ['uk', 'great britain', 'britain', 'england'],
      'russia': ['russian federation'],
      'germany': ['deutschland'],
      'spain': ['espana'],
      'netherlands': ['holland'],
      'czech republic': ['czechia'],
      'vatican city': ['holy see'],
      'myanmar': ['burma'],
      'congo': ['republic of the congo'],
      'democratic republic of the congo': ['drc', 'zaire'],
      'ivory coast': ['cote divoire'],
      'east timor': ['timor-leste'],
      'bosnia and herzegovina': ['bosnia'],
      'trinidad and tobago': ['trinidad'],
      'antigua and barbuda': ['antigua'],
      'saint kitts and nevis': ['st kitts'],
      'saint vincent and the grenadines': ['st vincent'],
      'sao tome and principe': ['sao tome'],
      'marshall islands': ['marshall'],
      'solomon islands': ['solomon'],
      'micronesia, fed. sts.': ['micronesia'],
      'united arab emirates': ['uae', 'emirates']
    };
    
    const targetVariations = variations[targetAnswer] || [];
    if (targetVariations.includes(userAnswer)) {
      return true;
    }
  }
  
  // For US states, accept abbreviations and common variations
  if (sharedTarget.type === 'state') {
    const stateAbbreviations = {
      'alabama': ['al'],
      'alaska': ['ak'],
      'arizona': ['az'],
      'arkansas': ['ar'],
      'california': ['ca', 'cal'],
      'colorado': ['co'],
      'connecticut': ['ct'],
      'delaware': ['de'],
      'florida': ['fl'],
      'georgia': ['ga'],
      'hawaii': ['hi'],
      'idaho': ['id'],
      'illinois': ['il'],
      'indiana': ['in'],
      'iowa': ['ia'],
      'kansas': ['ks'],
      'kentucky': ['ky'],
      'louisiana': ['la'],
      'maine': ['me'],
      'maryland': ['md'],
      'massachusetts': ['ma'],
      'michigan': ['mi'],
      'minnesota': ['mn'],
      'mississippi': ['ms'],
      'missouri': ['mo'],
      'montana': ['mt'],
      'nebraska': ['ne'],
      'nevada': ['nv'],
      'new hampshire': ['nh'],
      'new jersey': ['nj'],
      'new mexico': ['nm'],
      'new york': ['ny'],
      'north carolina': ['nc'],
      'north dakota': ['nd'],
      'ohio': ['oh'],
      'oklahoma': ['ok'],
      'oregon': ['or'],
      'pennsylvania': ['pa'],
      'rhode island': ['ri'],
      'south carolina': ['sc'],
      'south dakota': ['sd'],
      'tennessee': ['tn'],
      'texas': ['tx'],
      'utah': ['ut'],
      'vermont': ['vt'],
      'virginia': ['va'],
      'washington': ['wa'],
      'west virginia': ['wv'],
      'wisconsin': ['wi'],
      'wyoming': ['wy']
    };
    
    const targetAbbreviations = stateAbbreviations[targetAnswer] || [];
    if (targetAbbreviations.includes(userAnswer)) {
      return true;
    }
  }
  
  // For Population game, check if answer is within 5% of target
  if (gameType === 'Population') {
    // Get the target country data from countryInfo
    const targetCountryData = countryInfo[sharedTarget.target];
    if (!targetCountryData) {
      console.error('Target country not found in countryInfo:', sharedTarget.target);
      return false;
    }
    
    const targetPopulation = targetCountryData.population;
    const guessedPopulation = parseInt(answer.replace(/,/g, ''));
    
    if (!isNaN(targetPopulation) && !isNaN(guessedPopulation)) {
      const difference = Math.abs(guessedPopulation - targetPopulation);
      const percentageError = (difference / targetPopulation) * 100;
      return percentageError <= 5; // Within 5% is considered correct
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