# Globle Web App

A comprehensive web application featuring multiple geography-based games with user authentication, progress tracking, and achievement badges.

## Features

### Games
- **Globle**: Guess countries based on distance and direction
- **Population**: Estimate country populations
- **Findle**: Find countries based on clues
- **Flagle**: Identify countries from flag images
- **Worldle**: Locate countries on a world map
- **Capitals**: Multiple choice capital city quiz

### User System
- User registration and authentication
- Progress tracking across all games
- Achievement badges system
- Streak tracking
- Statistics dashboard

### Technical Features
- Modern React frontend with Material-UI
- Node.js/Express backend
- MongoDB database
- JWT authentication
- Responsive design
- Real-time statistics updates

## Project Structure

```
project/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── data/           # Game data files
│   │   └── App.jsx         # Main app component
│   └── package.json
├── backend/                 # Node.js backend application
│   ├── config/             # Database configuration
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── server.js           # Main server file
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd project/backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure MongoDB:**
   - The backend is already configured to use your MongoDB Atlas cluster
   - Connection string: `mongodb+srv://jamil04k:jamil123@cluster0.amw0e.mongodb.net/globle-webapp`
   - Database name: `globle-webapp`

4. **Start the backend server:**
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd project/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the frontend development server:**
   ```bash
   npm start
   ```
   The application will open on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Games
- `POST /api/games/update-stats` - Update game statistics
- `GET /api/games/stats` - Get user game statistics

### Badges
- `GET /api/badges` - Get user badges
- `GET /api/badges/progress` - Get badge progress summary

## Database Collections

### Users Collection
Stores user information and game statistics:
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  joinDate: Date,
  lastLogin: Date,
  totalGamesPlayed: Number,
  totalScore: Number,
  currentStreak: Number,
  longestStreak: Number,
  games: {
    globle: { gamesPlayed, bestScore, currentStreak, longestStreak, averageScore, lastPlayed },
    population: { ... },
    findle: { ... },
    flagle: { ... },
    worldle: { ... },
    capitals: { ... }
  }
}
```

### Badges Collection
Stores user achievement badges:
```javascript
{
  userId: ObjectId,
  badgeId: String,
  unlocked: Boolean,
  unlockedAt: Date,
  progress: Number,
  maxProgress: Number,
  category: String
}
```

## Game Integration

To integrate game statistics with the backend, call the update-stats endpoint after each game:

```javascript
const updateGameStats = async (gameId, score, time) => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch('http://localhost:5000/api/games/update-stats', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gameId,
        score,
        time
      }),
    });
    
    if (response.ok) {
      console.log('Stats updated successfully');
    }
  } catch (error) {
    console.error('Error updating stats:', error);
  }
};
```

## Badge System

The application includes a comprehensive badge system with categories:

### Overall Badges
- First Steps (play first game)
- Getting Started (play 10 games)
- Regular Player (play 50 games)
- Dedicated Player (play 100 games)
- On Fire (3-day streak)
- Week Warrior (7-day streak)
- Monthly Master (30-day streak)
- Veteran (1 year of playing)

### Game-Specific Badges
Each game has its own set of badges for:
- First win
- High scores
- Streaks
- Game-specific achievements

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation with express-validator
- Rate limiting
- CORS configuration
- Helmet security headers

## Deployment

### Backend Deployment
1. Set environment variables for production
2. Deploy to platforms like Heroku, Railway, or DigitalOcean
3. Update CORS origins for production domain

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy to platforms like Vercel, Netlify, or GitHub Pages
3. Update API endpoints to production URLs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please contact the developer or create an issue in the repository. 