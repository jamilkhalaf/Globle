# Online Gaming System

This document describes the online gaming system implementation for the Globle Web App.

## Overview

The online gaming system allows players to compete against each other in real-time across multiple game types. Players are matched automatically and compete for points based on their performance.

## Architecture

### Frontend Components

#### Main Online Component (`online.jsx`)
- **Location**: `project/frontend/src/components/online.jsx`
- **Purpose**: Main interface for online gaming
- **Features**:
  - Leaderboard display
  - Game selection and queue joining
  - Real-time match status
  - WebSocket connection management

#### Online Game Components
Each game has its own online component located in `project/frontend/src/components/online/`:

1. **OnlineGloble.jsx** - Interactive map-based country finding game
2. **OnlinePopulation.jsx** - Population guessing game with map visualization
3. **OnlineUS.jsx** - US states identification game
4. **OnlineFindle.jsx** - Country name finding game
5. **OnlineFlagle.jsx** - Flag identification game

### Backend Server (`server.js`)

#### WebSocket Implementation
- **Socket.IO Server**: Handles real-time communication
- **Authentication**: JWT-based user authentication
- **Game Queues**: Manages player matchmaking
- **Match Management**: Tracks active games and results

#### Game Data Structure
```javascript
const gameData = {
  'Globle': {
    countries: [
      { name: 'United States', coordinates: [39.8283, -98.5795] },
      // ... more countries
    ]
  },
  'Population': {
    countries: [
      { name: 'United States', population: 331002651 },
      // ... more countries with populations
    ]
  },
  'US': {
    states: [
      { name: 'California', coordinates: [36.7783, -119.4179] },
      // ... more states
    ]
  },
  'Findle': {
    letters: ['U', 'A', 'C', 'B', 'F', 'G', 'I', 'J', 'M', 'N', 'P', 'S', 'T'],
    countries: {
      'U': ['United States', 'United Kingdom', 'Ukraine', 'Uruguay', 'Uzbekistan'],
      // ... more letters and countries
    }
  },
  'Flagle': {
    flags: [
      { country: 'United States', flag: '🇺🇸' },
      // ... more flags
    ]
  }
};
```

## Game Types

### 1. Globle
- **Objective**: Find the target country on an interactive map
- **Scoring**: First correct answer wins 100 points
- **Interface**: Interactive map with country selection
- **Validation**: Country name matching with fuzzy logic

### 2. Population
- **Objective**: Guess the population of a target country
- **Scoring**: Within 10% accuracy wins 100 points
- **Interface**: Map visualization with country selection
- **Validation**: Percentage-based accuracy checking

### 3. US States
- **Objective**: Identify US states on an interactive map
- **Scoring**: First correct answer wins 100 points
- **Interface**: Interactive US map with state selection
- **Validation**: State name matching

### 4. Findle
- **Objective**: Find countries starting with specific letters
- **Scoring**: First correct answer wins 100 points
- **Interface**: Text-based input with letter constraints
- **Validation**: Letter-based country name validation

### 5. Flagle
- **Objective**: Identify countries from flag emojis
- **Scoring**: First correct answer wins 100 points
- **Interface**: Flag display with text input
- **Validation**: Country name matching

## WebSocket Events

### Client to Server
- `joinQueue`: Join game queue
- `leaveQueue`: Leave game queue
- `submitAnswer`: Submit game answer
- `requestNewOpponent`: Request new opponent

### Server to Client
- `queueJoined`: Confirmation of queue join
- `queueError`: Queue-related errors
- `matchFound`: Match created with opponent
- `gameStart`: Game begins
- `gameEnd`: Game ends with results
- `opponentDisconnected`: Opponent left the game

## Database Integration

### User Model Updates
The User model includes online gaming fields:
- `onlinePoints`: Total points earned from online games
- `onlineGamesPlayed`: Number of online games played
- `onlineWinRate`: Win rate percentage

### Points System
- **Win**: +100 points
- **Loss**: -100 points
- **Win Rate**: Calculated as (wins / total games) * 100

## API Endpoints

### Leaderboard
- **GET** `/api/games/leaderboard`
- **Response**: Array of top players with scores and stats

### Game Stats
- **POST** `/api/games/update-stats`
- **Purpose**: Update offline game statistics

## Setup and Configuration

### Environment Variables
```bash
JWT_SECRET=your-jwt-secret-key
MONGODB_URI=your-mongodb-connection-string
PORT=5051
```

### Dependencies
```json
{
  "socket.io": "^4.7.0",
  "socket.io-client": "^4.7.0",
  "jsonwebtoken": "^9.0.0"
}
```

## Testing

### WebSocket Test Script
Run the test script to verify WebSocket functionality:
```bash
node test-websocket.js
```

### Manual Testing
1. Start the backend server
2. Open the frontend application
3. Navigate to the Online section
4. Select a game type and join the queue
5. Wait for opponent matchmaking
6. Play the game and verify scoring

## Security Considerations

1. **JWT Authentication**: All WebSocket connections require valid JWT tokens
2. **Rate Limiting**: API endpoints are rate-limited to prevent abuse
3. **CORS Configuration**: Proper CORS settings for cross-origin requests
4. **Input Validation**: All user inputs are validated server-side

## Performance Optimizations

1. **Connection Pooling**: Efficient WebSocket connection management
2. **Memory Management**: Automatic cleanup of completed matches
3. **Queue Optimization**: Efficient player matching algorithms
4. **Error Handling**: Graceful error handling and recovery

## Future Enhancements

1. **Additional Game Types**: Support for more geography-based games
2. **Tournament System**: Organized competitive play
3. **Spectator Mode**: Allow watching ongoing matches
4. **Chat System**: In-game communication between players
5. **Achievement System**: Badges and rewards for accomplishments
6. **Mobile Optimization**: Enhanced mobile gaming experience

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure proper CORS configuration in server.js
2. **Authentication Failures**: Verify JWT token validity
3. **Connection Timeouts**: Check network connectivity and server status
4. **Game State Issues**: Clear browser cache and restart application

### Debug Mode
Enable debug logging by setting environment variable:
```bash
DEBUG=socket.io:*
```

## Contributing

When adding new game types:

1. Create online component in `components/online/`
2. Add game data to `gameData` object in server.js
3. Implement `generateQuestion()` and `checkAnswer()` functions
4. Update the main online component to include the new game
5. Test thoroughly with the WebSocket test script

## License

This online gaming system is part of the Globle Web App project. 