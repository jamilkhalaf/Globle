const io = require('socket.io-client');

// Test WebSocket connection
async function testWebSocket() {
  console.log('Testing WebSocket connection...');
  
  // First get a token
  const loginResponse = await fetch('https://api.jamilweb.click/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      identifier: 'test@example.com',
      password: 'password123'
    })
  });
  
  if (!loginResponse.ok) {
    console.error('Failed to login:', await loginResponse.text());
    return;
  }
  
  const loginData = await loginResponse.json();
  const token = loginData.token;
  
  console.log('Got token:', token.substring(0, 20) + '...');
  
  // Connect to WebSocket
  const socket = io('https://api.jamilweb.click', {
    auth: { token },
    transports: ['websocket', 'polling']
  });
  
  socket.on('connect', () => {
    console.log('✅ Socket connected successfully');
    console.log('Socket ID:', socket.id);
    
    // Join queue
    console.log('Joining queue for Globle...');
    socket.emit('joinQueue', { gameType: 'Globle' });
  });
  
  socket.on('disconnect', () => {
    console.log('❌ Socket disconnected');
  });
  
  socket.on('connect_error', (error) => {
    console.error('❌ Socket connection error:', error);
  });
  
  socket.on('queueJoined', (data) => {
    console.log('✅ Joined queue:', data);
  });
  
  socket.on('queueError', (data) => {
    console.log('❌ Queue error:', data);
  });
  
  socket.on('matchFound', (data) => {
    console.log('🎮 Match found:', data);
  });
  
  socket.on('error', (error) => {
    console.error('❌ Socket error:', error);
  });
  
  // Keep connection alive for 30 seconds
  setTimeout(() => {
    console.log('Test completed');
    socket.disconnect();
    process.exit(0);
  }, 30000);
}

testWebSocket().catch(console.error); 