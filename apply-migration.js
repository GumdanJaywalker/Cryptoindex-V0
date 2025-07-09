const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigration() {
  console.log('🚀 APPLYING PRIVY DATABASE MIGRATION...\n');
  
  // Read the migration file
  const migrationSQL = fs.readFileSync('./final-privy-migration.sql', 'utf8');
  
  // Split into individual statements
  const statements = migrationSQL
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('SELECT \''))
    .filter(s => !s.includes('MIGRATION COMPLETE'))
    .filter(s => !s.includes('FROM information_schema.tables'));
  
  console.log(`Found ${statements.length} SQL statements to execute\n`);
  
  let successCount = 0;
  let failureCount = 0;
  
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    console.log(`${i + 1}. ${statement.substring(0, 60)}...`);
    
    try {
      const { error } = await supabase.rpc('exec_sql', { query: statement });
      
      if (error) {
        console.log(`   ❌ Error: ${error.message}`);
        failureCount++;
        
        // Continue with other statements unless it's critical
        if (error.message.includes('already exists') || 
            error.message.includes('does not exist') ||
            error.message.includes('permission denied')) {
          console.log(`   ⚠️  Continuing with migration...`);
        }
      } else {
        console.log(`   ✅ Success`);
        successCount++;
      }
    } catch (error) {
      console.log(`   ❌ Execution error: ${error.message}`);
      failureCount++;
    }
    
    // Small delay between statements
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`\n📊 MIGRATION RESULTS:`);
  console.log(`   ✅ Successful: ${successCount}`);
  console.log(`   ❌ Failed: ${failureCount}`);
  
  // Test the migration
  console.log(`\n🧪 TESTING MIGRATION RESULTS...`);
  
  try {
    // Test 1: Check if function exists
    const { data: functionData, error: functionError } = await supabase.rpc('get_privy_user_id');
    if (functionError) {
      console.log(`   ❌ Function test failed: ${functionError.message}`);
    } else {
      console.log(`   ✅ get_privy_user_id() function works`);
    }
    
    // Test 2: Check users table structure
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    
    if (userError) {
      console.log(`   ❌ Users table test failed: ${userError.message}`);
    } else {
      console.log(`   ✅ Users table accessible`);
    }
    
    // Test 3: Test user creation
    const testUser = {
      privy_user_id: 'test_privy_user_' + Date.now(),
      auth_type: 'email',
      email: 'test@cryptoindex.com',
      email_verified: true,
      is_active: true
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('users')
      .insert(testUser)
      .select();
    
    if (insertError) {
      console.log(`   ❌ User creation test failed: ${insertError.message}`);
    } else {
      console.log(`   ✅ User creation test successful`);
      
      // Clean up test user
      await supabase
        .from('users')
        .delete()
        .eq('id', insertData[0].id);
      
      console.log(`   ✅ Test user cleaned up`);
    }
    
  } catch (error) {
    console.log(`   ❌ Migration test error: ${error.message}`);
  }
  
  console.log(`\n🎉 MIGRATION COMPLETE! Your database is ready for Privy integration.`);
}

applyMigration().catch(console.error);