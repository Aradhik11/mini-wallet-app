// Simple test to check if server is running
const http = require('http');

// Test health endpoint
const healthOptions = {
  hostname: 'localhost',
  port: 4000,
  path: '/health',
  method: 'GET'
};

console.log('Testing server health...');

const healthReq = http.request(healthOptions, (res) => {
  console.log(`Health check status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Health response:', data);
    testGraphQL();
  });
});

healthReq.on('error', (e) => {
  console.error('Health check failed:', e.message);
  console.log('Server might not be running. Start it with: npm run dev');
});

healthReq.end();

// Test GraphQL endpoint
function testGraphQL() {
  const graphqlData = JSON.stringify({
    query: `
      mutation Register($username: String!, $password: String!) {
        register(username: $username, password: $password) {
          token
          user { username }
        }
      }
    `,
    variables: { username: 'testuser', password: 'password123' }
  });

  const graphqlOptions = {
    hostname: 'localhost',
    port: 4000,
    path: '/graphql',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(graphqlData)
    }
  };

  console.log('\nTesting GraphQL registration...');

  const graphqlReq = http.request(graphqlOptions, (res) => {
    console.log(`GraphQL status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('GraphQL response:', data);
    });
  });

  graphqlReq.on('error', (e) => {
    console.error('GraphQL test failed:', e.message);
  });

  graphqlReq.write(graphqlData);
  graphqlReq.end();
}