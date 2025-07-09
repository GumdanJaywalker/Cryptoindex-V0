const { verifyPrivyJWT, extractPrivyUserId } = require('./lib/auth/privy-jwt');

async function testPrivyIntegration() {
  console.log('🔗 TESTING PRIVY INTEGRATION...\n');
  
  // Test 1: Check environment variables
  console.log('1. Environment Variables:');
  console.log(`   PRIVY_APP_ID: ${process.env.PRIVY_APP_ID}`);
  console.log(`   PRIVY_JWKS_ENDPOINT: ${process.env.PRIVY_JWKS_ENDPOINT}`);
  console.log(`   PRIVY_APP_SECRET: ${process.env.PRIVY_APP_SECRET ? '✓ Set' : '✗ Missing'}`);
  
  // Test 2: Test development token extraction
  console.log('\n2. Development Token Extraction:');
  const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJwcml2eV91c2VyXzEyMyIsInByaXZ5X3VzZXJfaWQiOiJwcml2eV91c2VyXzEyMyIsImVtYWlsIjp7ImFkZHJlc3MiOiJ0ZXN0QGV4YW1wbGUuY29tIiwidmVyaWZpZWQiOnRydWV9fQ.signature';
  
  try {
    const userId = extractPrivyUserId(mockToken);
    console.log(`   Extracted User ID: ${userId}`);
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }
  
  // Test 3: Test JWKS endpoint accessibility
  console.log('\n3. JWKS Endpoint Test:');
  try {
    const response = await fetch(process.env.PRIVY_JWKS_ENDPOINT);
    if (response.ok) {
      const jwks = await response.json();
      console.log(`   ✓ JWKS endpoint accessible`);
      console.log(`   Keys available: ${jwks.keys ? jwks.keys.length : 0}`);
    } else {
      console.log(`   ✗ JWKS endpoint error: ${response.status}`);
    }
  } catch (error) {
    console.log(`   ✗ JWKS endpoint error: ${error.message}`);
  }
  
  // Test 4: Test middleware integration
  console.log('\n4. Middleware Integration Test:');
  const { extractPrivyAuthFromRequest } = require('./lib/middleware/privy-auth');
  
  // Create a mock request
  const mockRequest = {
    headers: {
      get: (name) => {
        if (name === 'authorization') return `Bearer ${mockToken}`;
        return null;
      }
    },
    cookies: {
      get: (name) => {
        if (name === 'privy-token') return { value: mockToken };
        return null;
      }
    }
  };
  
  try {
    const authResult = await extractPrivyAuthFromRequest(mockRequest);
    console.log(`   Authentication: ${authResult.authenticated ? '✓ Success' : '✗ Failed'}`);
    if (authResult.authenticated) {
      console.log(`   User ID: ${authResult.user.id}`);
      console.log(`   Email: ${authResult.user.email}`);
      console.log(`   Auth Type: ${authResult.user.authType}`);
    } else {
      console.log(`   Error: ${authResult.error}`);
    }
  } catch (error) {
    console.log(`   ✗ Middleware error: ${error.message}`);
  }
  
  console.log('\n🎯 PRIVY INTEGRATION TEST COMPLETE');
}

// Set development environment
process.env.NODE_ENV = 'development';

// Load environment variables
require('dotenv').config();

testPrivyIntegration().catch(console.error);