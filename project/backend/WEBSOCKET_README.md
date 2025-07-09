# WebSocket Game Server Implementation

## Overview
This implementation provides real-time multiplayer gaming functionality using Socket.IO for the Globle Web App.

## Features

### 1. Real-time Matchmaking
- Players can join queues for different game types
- Automatic matching when 2 players are available
- Support for all 10 game types: Globle, Population, Findle, Flagle, Worldle, Capitals, Hangman, Shaple, US, Namle

### 2. Game Logic
- 60-second timer for each game
- First player to answer correctly wins
- Point system: +100 points for winner, -100 points for loser
- Real-time game state updates

### 3. User Statistics
- Online points tracking
- Games played/won statistics
- Win rate calculation
- Leaderboard integration

## Setup

### Backend Dependencies
```bash
npm install socket.io
```

### Environment Variables
Make sure you have these in your `.env` file:
```
JWT_SECRET=your-jwt-secret
MONGODB_URI=your-mongodb-connection-string
PORT=5051
```

### Frontend Dependencies
The frontend already has `socket.io-client` installed.

## API Endpoints

### GET /api/games/leaderboard
Returns the top 50 players sorted by online points.

## WebSocket Events

### Client to Server
- `joinQueue` - Join a game queue
- `leaveQueue` - Leave a game queue
- `submitAnswer` - Submit game answer
- `requestNewOpponent` - Request new opponent after game

### Server to Client
- `queueJoined` - Confirmation of queue join
- `queueError` - Error joining queue
- `matchFound` - Match found, starting countdown
- `gameStart` - Game started, timer begins
- `gameEnd` - Game ended with results
- `opponentDisconnected` - Opponent left the game

## Game Flow

1. **Queue Join**: Player selects game type and joins queue
2. **Matchmaking**: Server matches 2 players
3. **Countdown**: 3-second countdown before game starts
4. **Game Play**: 60-second timer, players submit answers
5. **Results**: Winner determined, points updated
6. **Post-Game**: Option to leave or find new opponent

## Database Schema Updates

The User model has been updated with online gaming fields:
- `onlinePoints` - Current point total
- `onlineGamesPlayed` - Total games played
- `onlineGamesWon` - Total games won
- `onlineWinRate` - Win percentage

## Testing

1. Start the backend server: `npm run dev`
2. Start the frontend: `npm run dev`
3. Login to the application
4. Navigate to `/online`
5. Select a game type and join queue
6. Open another browser/tab to test multiplayer

## Security

- JWT authentication required for WebSocket connections
- Rate limiting on HTTP endpoints
- Input validation for game answers
- User authentication middleware for all socket events

## Future Enhancements

- More sophisticated question generation
- Tournament mode
- Team games
- Spectator mode
- Chat functionality
- Custom game rooms
- Advanced matchmaking algorithms 