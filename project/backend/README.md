# Globle Backend

Backend server for the Globle Web App with MongoDB integration.

## Environment Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the backend directory with the following variables:

```bash
# Copy the example file
cp env.example .env
```

Then edit the `.env` file with your actual values:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/globle-webapp?retryWrites=true&w=majority

# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-here

# Server Configuration
PORT=5051
NODE_ENV=development
```

### 3. Generate JWT Secret
You can generate a secure JWT secret using:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. MongoDB Setup
1. Create a MongoDB Atlas account or use a local MongoDB instance
2. Create a database named `globle-webapp`
3. Update the `MONGODB_URI` in your `.env` file with your connection string

## Security Notes

⚠️ **IMPORTANT**: Never commit the following files to version control:
- `.env` (contains sensitive credentials)
- `config/db.js` (contains database credentials)
- Any files with API keys or secrets

These files are already added to `.gitignore` to prevent accidental commits.

## Running the Server

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

The server will start on port 5051 (or the port specified in your `.env` file).

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/games/update-stats` - Update game statistics
- `GET /api/games/stats` - Get user statistics
- `POST /api/badges/update` - Update badge progress
- `GET /api/badges` - Get user badges

## Database Schema

The application uses MongoDB with the following collections:
- `users` - User accounts and statistics
- `badges` - User badge achievements

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Input validation with express-validator
- Rate limiting
- Helmet.js for security headers
- CORS configuration 