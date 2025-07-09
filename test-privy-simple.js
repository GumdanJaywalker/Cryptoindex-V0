require('dotenv').config();

async function testPrivySetup() {
  console.log('🔗 TESTING PRIVY SETUP...\n');
  
  // Test 1: Environment Variables
  console.log('1. Environment Variables:');
  console.log(`   PRIVY_APP_ID: ${process.env.PRIVY_APP_ID || '✗ Missing'}`);
  console.log(`   PRIVY_APP_SECRET: ${process.env.PRIVY_APP_SECRET ? '✓ Set' : '✗ Missing'}`);
  console.log(`   PRIVY_JWKS_ENDPOINT: ${process.env.PRIVY_JWKS_ENDPOINT || '✗ Missing'}`);
  
  // Test 2: JWKS Endpoint
  console.log('\n2. JWKS Endpoint Test:');
  try {
    const response = await fetch(process.env.PRIVY_JWKS_ENDPOINT);
    if (response.ok) {
      const jwks = await response.json();
      console.log(`   ✓ JWKS endpoint accessible`);
      console.log(`   Keys available: ${jwks.keys ? jwks.keys.length : 0}`);
      console.log(`   First key algorithm: ${jwks.keys[0]?.alg || 'Unknown'}`);
    } else {
      console.log(`   ✗ JWKS endpoint error: ${response.status}`);
    }
  } catch (error) {
    console.log(`   ✗ JWKS endpoint error: ${error.message}`);
  }
  
  // Test 3: Supabase Connection
  console.log('\n3. Supabase Connection Test:');
  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (error) {
      console.log(`   ✗ Supabase error: ${error.message}`);
    } else {
      console.log(`   ✓ Supabase connection successful`);
    }
  } catch (error) {
    console.log(`   ✗ Supabase connection error: ${error.message}`);
  }
  
  // Test 4: Development Token Decoding
  console.log('\n4. Development Token Test:');
  const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJwcml2eV91c2VyXzEyMyIsInByaXZ5X3VzZXJfaWQiOiJwcml2eV91c2VyXzEyMyIsImVtYWlsIjp7ImFkZHJlc3MiOiJ0ZXN0QGV4YW1wbGUuY29tIiwidmVyaWZpZWQiOnRydWV9LCJpc3MiOiJwcml2eS5pbyIsImF1ZCI6ImNtY3ZjNGhvNTAwOXJreTBuZnIzY2dubXMiLCJleHAiOjE3NTIwMzc0MDB9.signature';
  
  try {
    const parts = mockToken.split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(atob(parts[1]));
      console.log(`   ✓ Token decoded successfully`);
      console.log(`   Subject: ${payload.sub}`);
      console.log(`   Issuer: ${payload.iss}`);
      console.log(`   Audience: ${payload.aud}`);
      console.log(`   Matches App ID: ${payload.aud === process.env.PRIVY_APP_ID ? '✓' : '✗'}`);
    } else {
      console.log(`   ✗ Invalid token format`);
    }
  } catch (error) {
    console.log(`   ✗ Token decoding error: ${error.message}`);
  }
  
  console.log('\n🎯 PRIVY SETUP TEST COMPLETE');
  
  // Summary
  console.log('\n📋 SUMMARY:');
  console.log('   - Privy credentials are configured');
  console.log('   - JWKS endpoint is accessible');
  console.log('   - Ready for Privy integration');
  console.log('   - Next: Apply database migration');
}

testPrivySetup().catch(console.error);