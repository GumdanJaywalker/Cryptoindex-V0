const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xozgwidnikzhdiommtwk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhvemd3aWRuaWt6aGRpb21tdHdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTQ0NDQ3NCwiZXhwIjoyMDY3MDIwNDc0fQ.8xpmJmJswbU88o6lzfiy0g8XOcoKySybSFD0ezNO44A';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAfterMigration() {
  console.log('🧪 TESTING AFTER MIGRATION...\n');
  
  // Test 1: Check if get_privy_user_id function exists
  try {
    const { data, error } = await supabase.rpc('get_privy_user_id');
    if (error) {
      console.log('❌ get_privy_user_id function test failed:', error.message);
    } else {
      console.log('✅ get_privy_user_id function works');
    }
  } catch (error) {
    console.log('❌ Function test error:', error.message);
  }
  
  // Test 2: Test users table with new columns
  try {
    const testUser = {
      privy_user_id: 'privy_test_user_456',
      auth_type: 'email',
      email: 'test@privy.com',
      email_verified: true,
      is_active: true
    };
    
    const { data, error } = await supabase
      .from('users')
      .insert(testUser)
      .select();
    
    if (error) {
      console.log('❌ Users table insert failed:', error.message);
    } else {
      console.log('✅ Users table insert successful');
      console.log('📝 Inserted user:', data[0]);
      
      // Clean up
      await supabase
        .from('users')
        .delete()
        .eq('privy_user_id', testUser.privy_user_id);
      
      console.log('✅ Test data cleaned up');
    }
  } catch (error) {
    console.log('❌ Users table test error:', error.message);
  }
  
  // Test 3: Test wallet user creation
  try {
    const walletUser = {
      privy_user_id: 'privy_wallet_user_789',
      auth_type: 'wallet',
      wallet_address: '0x1234567890abcdef1234567890abcdef12345678',
      wallet_type: 'metamask',
      is_active: true
    };
    
    const { data, error } = await supabase
      .from('users')
      .insert(walletUser)
      .select();
    
    if (error) {
      console.log('❌ Wallet user insert failed:', error.message);
    } else {
      console.log('✅ Wallet user insert successful');
      
      // Test wallet creation
      const { data: walletData, error: walletError } = await supabase
        .from('user_wallets')
        .insert({
          user_id: data[0].id,
          wallet_address: walletUser.wallet_address,
          wallet_provider: 'privy',
          is_primary: true
        })
        .select();
      
      if (walletError) {
        console.log('❌ Wallet insert failed:', walletError.message);
      } else {
        console.log('✅ Wallet insert successful');
      }
      
      // Clean up
      await supabase
        .from('user_wallets')
        .delete()
        .eq('user_id', data[0].id);
      
      await supabase
        .from('users')
        .delete()
        .eq('privy_user_id', walletUser.privy_user_id);
      
      console.log('✅ Wallet test data cleaned up');
    }
  } catch (error) {
    console.log('❌ Wallet user test error:', error.message);
  }
  
  console.log('\n🎯 MIGRATION VERIFICATION COMPLETE');
  console.log('If all tests pass, your Privy integration is ready!');
}

testAfterMigration().catch(console.error);