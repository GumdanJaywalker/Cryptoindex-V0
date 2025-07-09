const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xozgwidnikzhdiommtwk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhvemd3aWRuaWt6aGRpb21tdHdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTQ0NDQ3NCwiZXhwIjoyMDY3MDIwNDc0fQ.8xpmJmJswbU88o6lzfiy0g8XOcoKySybSFD0ezNO44A';

const supabase = createClient(supabaseUrl, supabaseKey);

async function executeSQL(query) {
  try {
    const { data, error } = await supabase.rpc('exec_sql', { query });
    if (error) {
      console.error('SQL Error:', error);
      return false;
    }
    return data;
  } catch (error) {
    console.error('Execution error:', error);
    return false;
  }
}

async function applyPrivyMigration() {
  console.log('Starting Privy migration...');

  // 1. Apply the schema from our file
  const fs = require('fs');
  const schemaSQL = fs.readFileSync('./supabase/schema.sql', 'utf8');
  
  // Split into individual statements
  const statements = schemaSQL
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  console.log(`Found ${statements.length} SQL statements to execute`);

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    if (statement.includes('CREATE TABLE IF NOT EXISTS') || 
        statement.includes('ALTER TABLE') || 
        statement.includes('CREATE INDEX') ||
        statement.includes('CREATE POLICY') ||
        statement.includes('CREATE OR REPLACE FUNCTION')) {
      
      console.log(`Executing statement ${i + 1}: ${statement.substring(0, 50)}...`);
      
      // Execute via raw HTTP request since RPC might not be available
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey
        },
        body: JSON.stringify({ query: statement })
      });

      if (!response.ok) {
        console.error(`Failed to execute statement ${i + 1}:`, await response.text());
      } else {
        console.log(`✓ Statement ${i + 1} executed successfully`);
      }
    }
  }

  console.log('Migration completed!');
}

// Execute the migration
applyPrivyMigration().catch(console.error);