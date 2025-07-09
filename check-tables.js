const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xozgwidnikzhdiommtwk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhvemd3aWRuaWt6aGRpb21tdHdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTQ0NDQ3NCwiZXhwIjoyMDY3MDIwNDc0fQ.8xpmJmJswbU88o6lzfiy0g8XOcoKySybSFD0ezNO44A';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  console.log('Checking existing tables...');
  
  // Check various table names to see which ones exist
  const tablesToCheck = [
    'users',
    'user_sessions', 
    'email_verification_codes',
    'user_wallets',
    'user_2fa'
  ];
  
  for (const table of tablesToCheck) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`❌ Table '${table}' does not exist or has error:`, error.message);
      } else {
        console.log(`✅ Table '${table}' exists`);
        
        // Get count
        const { count, error: countError } = await supabase
          .from(table)
          .select('*', { count: 'exact' });
          
        if (!countError) {
          console.log(`   - Row count: ${count}`);
        }
      }
    } catch (err) {
      console.log(`❌ Table '${table}' check failed:`, err.message);
    }
  }
}

checkTables().catch(console.error);