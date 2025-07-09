const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xozgwidnikzhdiommtwk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhvemd3aWRuaWt6aGRpb21tdHdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTQ0NDQ3NCwiZXhwIjoyMDY3MDIwNDc0fQ.8xpmJmJswbU88o6lzfiy0g8XOcoKySybSFD0ezNO44A';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  try {
    // Check existing tables using raw SQL
    const { data: tables, error: tablesError } = await supabase
      .rpc('sql', {
        query: `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name`
      });

    if (tablesError) {
      console.error('Error fetching tables:', tablesError);
      // Try alternative method
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('*')
        .limit(5);

      if (usersError) {
        console.error('Error fetching users:', usersError);
      } else {
        console.log('Users table exists. Sample data:', users);
      }
      return;
    }

    console.log('Current tables:', tables?.map(t => t.table_name));

    // Check users table data
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*');

    if (usersError) {
      console.error('Error fetching users:', usersError);
    } else {
      console.log('Users data:', users);
    }

  } catch (error) {
    console.error('Database check error:', error);
  }
}

checkDatabase();