const { io } = require('socket.io-client');

// Test WebSocket connection
const testSocket = () => {
  console.log('Testing WebSocket connection...');
  
  // Create a test token (you'll need to generate a real one)
  const testToken = 'test-token';
  
  const socket = io('http://localhost:5051', {
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

  socket.on('connect_error', (error) => {
    console.log('❌ Connection error:', error.message);
  });

  // Cleanup after 10 seconds
  setTimeout(() => {
    socket.disconnect();
    process.exit(0);
  }, 10000);
};

// Run the test
testSocket(); 