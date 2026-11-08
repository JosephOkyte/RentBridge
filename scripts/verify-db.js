/**
 * RentBridge Database Verification Script (ESM)
 * Run with: node --env-file=.env.local scripts/verify-db.js
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function checkDatabase() {
  console.log('--- RentBridge Supabase Schema Verification ---');
  console.log('Target Project:', supabaseUrl);

  const tables = ['profiles', 'properties', 'property_media', 'compliance_records', 'inspections', 'admin_audit_logs'];

  for (const table of tables) {
    try {
      const { data, count, error } = await supabase.from(table).select('*', { count: 'exact', head: false }).limit(5);
      if (error) {
        console.log(`❌ Table [${table}]: Not Found or Uninitialized (${error.message})`);
      } else {
        console.log(`✅ Table [${table}]: Online! Row count: ${count}`);
      }
    } catch (e) {
      console.log(`❌ Table [${table}]: Exception - ${e.message}`);
    }
  }

  // Check Storage Buckets
  console.log('\n--- RentBridge Storage Buckets Verification ---');
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (error) {
      console.log('❌ Buckets: Error -', error.message);
    } else {
      console.log('✅ Active Buckets:');
      buckets.forEach(b => console.log(`   - ${b.id} (${b.public ? 'Public' : 'Private'})`));
    }
  } catch (e) {
    console.log('❌ Buckets exception:', e.message);
  }
}

checkDatabase();
