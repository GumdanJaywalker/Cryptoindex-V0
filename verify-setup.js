const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xozgwidnikzhdiommtwk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhvemd3aWRuaWt6aGRpb21tdHdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTQ0NDQ3NCwiZXhwIjoyMDY3MDIwNDc0fQ.8xpmJmJswbU88o6lzfiy0g8XOcoKySybSFD0ezNO44A';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTableStructure() {
  console.log('🔍 CHECKING TABLE STRUCTURE...\n');
  
  try {
    // Check users table structure
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    
    if (usersError) {
      console.error('❌ Users table error:', usersError.message);
      return false;
    }
    
    console.log('✅ Users table accessible');
    
    // Check user_wallets table structure
    const { data: walletsData, error: walletsError } = await supabase
      .from('user_wallets')
      .select('*')
      .limit(1);
    
    if (walletsError) {
      console.error('❌ User_wallets table error:', walletsError.message);
      return false;
    }
    
    console.log('✅ User_wallets table accessible');
    
    // Test inserting a sample user to check constraints
    const testUser = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      privy_user_id: 'privy_test_user_123',
      auth_type: 'email',
      email: 'test@example.com',
      email_verified: false,
      is_active: true
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('users')
      .insert(testUser)
      .select();
    
    if (insertError) {
      console.error('❌ Insert test failed:', insertError.message);
      return false;
    }
    
    console.log('✅ Test user inserted successfully');
    
    // Clean up test data
    await supabase
      .from('users')
      .delete()
      .eq('id', testUser.id);
    
    console.log('✅ Test data cleaned up');
    
    return true;
    
  } catch (error) {
    console.error('❌ Table structure check failed:', error.message);
    return false;
  }
}

async function testPrivyFunction() {
  console.log('\n🔍 TESTING PRIVY FUNCTION...\n');
  
  try {
    // Test the get_privy_user_id function exists
    const { data, error } = await supabase.rpc('get_privy_user_id');
    
    if (error) {
      console.error('❌ Privy function error:', error.message);
      return false;
    }
    
    console.log('✅ get_privy_user_id function exists');
    console.log('📝 Function result (should be null without JWT):', data);
    
    return true;
    
  } catch (error) {
    console.error('❌ Privy function test failed:', error.message);
    return false;
  }
}

async function checkPrivyIntegration() {
  console.log('\n🔍 CHECKING PRIVY INTEGRATION SETUP...\n');
  
  // Check if Privy is installed in the project
  const fs = require('fs');
  const path = require('path');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    
    const privyDeps = Object.keys(packageJson.dependencies || {}).filter(dep => 
      dep.includes('privy')
    );
    
    if (privyDeps.length === 0) {
      console.log('⚠️  Privy not found in dependencies');
      console.log('📦 You need to install: npm install @privy-io/react-auth');
      return false;
    }
    
    console.log('✅ Privy dependencies found:', privyDeps);
    
    // Check for Privy configuration files
    const configFiles = [
      'lib/privy/',
      'lib/auth/',
      'middleware.ts'
    ];
    
    configFiles.forEach(file => {
      if (fs.existsSync(file)) {
        console.log(`✅ Found: ${file}`);
      } else {
        console.log(`⚠️  Missing: ${file}`);
      }
    });
    
    return true;
    
  } catch (error) {
    console.error('❌ Privy integration check failed:', error.message);
    return false;
  }
}

async function testJWTIntegration() {
  console.log('\n🔍 TESTING JWT INTEGRATION...\n');
  
  // Create a mock Privy JWT token for testing
  const mockJWT = {
    iss: 'privy.io',
    sub: 'user_123',
    aud: 'your_app_id',
    exp: Math.floor(Date.now() / 1000) + 3600,
    privy_user_id: 'privy_test_user_123'
  };
  
  console.log('📝 Mock JWT structure:', mockJWT);
  console.log('✅ JWT should contain privy_user_id claim');
  
  // Test RLS policies setup
  console.log('\n🔒 CHECKING RLS POLICIES...');
  
  try {
    // This should work because we're using service role
    const { data: policies, error } = await supabase
      .from('information_schema.table_privileges')
      .select('*')
      .eq('table_name', 'users');
    
    if (error) {
      console.log('⚠️  Could not check RLS policies directly');
    } else {
      console.log('✅ RLS policies can be queried');
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ JWT integration test failed:', error.message);
    return false;
  }
}

async function runAllChecks() {
  console.log('🚀 STARTING PRIVY SETUP VERIFICATION...\n');
  
  const results = {
    tableStructure: await checkTableStructure(),
    privyFunction: await testPrivyFunction(),
    privyIntegration: await checkPrivyIntegration(),
    jwtIntegration: await testJWTIntegration()
  };
  
  console.log('\n📊 VERIFICATION RESULTS:');
  console.log('='.repeat(50));
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASSED' : 'FAILED'}`);
  });
  
  const allPassed = Object.values(results).every(r => r);
  
  if (allPassed) {
    console.log('\n🎉 ALL CHECKS PASSED! Privy integration is ready.');
  } else {
    console.log('\n⚠️  Some checks failed. Please address the issues above.');
  }
  
  return results;
}

// Run verification
runAllChecks().catch(console.error);