#!/usr/bin/env npx tsx

/**
 * Clear all reports and related data from the database
 * Usage: npx tsx scripts/clear-reports.ts
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local
config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables:');
  if (!supabaseUrl) console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  if (!supabaseKey) console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  console.error('\nMake sure .env.local exists with proper values.');
  process.exit(1);
}

console.log(`📍 Connecting to Supabase at: ${supabaseUrl}`);

const supabase = createClient(supabaseUrl, supabaseKey);

async function clearReports() {
  console.log('🗑️  Clearing all report data...\n');

  try {
    // Delete report views first (foreign key constraint)
    const { error: viewsError } = await supabase
      .from('report_views')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (viewsError) {
      console.log('⚠️  Report views table might not exist or is empty');
    } else {
      console.log(`✓ Deleted report views`);
    }

    // Delete all reports
    const { error: reportsError } = await supabase
      .from('reports')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (reportsError) {
      console.error('❌ Error deleting reports:', reportsError.message);
      return;
    }
    console.log('✓ Deleted all reports');

    // Delete all sites
    const { error: sitesError } = await supabase
      .from('sites')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (sitesError) {
      console.error('❌ Error deleting sites:', sitesError.message);
      return;
    }
    console.log('✓ Deleted all sites');

    // Reset user report counts (but keep users)
    const { error: usersError } = await supabase
      .from('users')
      .update({ reports_used_this_month: 0 })
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Update all

    if (usersError) {
      console.error('❌ Error resetting user counts:', usersError.message);
      return;
    }
    console.log('✓ Reset user report counts');

    console.log('\n✅ All report data cleared successfully!');
    console.log('   Users are preserved with reset report counts.');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

clearReports();
