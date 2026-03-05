#!/usr/bin/env tsx
/**
 * Verify Production Database Schema
 * Checks if all migrations were applied successfully
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_PROD_URL!;
const supabaseKey = process.env.SUPABASE_PROD_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyDatabase() {
  console.log('🔍 Verifying Production Database Schema...\n');

  try {
    // Check if tables exist
    console.log('📋 Checking Tables:');
    const tables = ['users', 'sites', 'reports', 'report_views', 'magic_links', 'brand_recognition_cache'];

    for (const table of tables) {
      const { error } = await supabase.from(table).select('id').limit(1);
      if (error) {
        console.log(`❌ ${table}: Missing or inaccessible`);
        console.error(`   Error: ${error.message}`);
      } else {
        console.log(`✅ ${table}: Exists`);
      }
    }

    // Check specific columns in reports table
    console.log('\n📊 Checking Reports Table Columns:');
    const { data: report, error: reportError } = await supabase
      .from('reports')
      .select('id, is_public, design_authenticity_score, analysis_type, pages_analyzed')
      .limit(1)
      .maybeSingle();

    if (reportError) {
      console.log('❌ Could not verify reports columns');
      console.error(`   Error: ${reportError.message}`);
    } else {
      console.log('✅ is_public column exists');
      console.log('✅ design_authenticity_score column exists');
      console.log('✅ analysis_type column exists');
      console.log('✅ pages_analyzed column exists');
    }

    // Check users table columns
    console.log('\n👤 Checking Users Table Columns:');
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, one_time_purchase_id, email_verified, last_login_at')
      .limit(1)
      .maybeSingle();

    if (userError) {
      console.log('❌ Could not verify users columns');
      console.error(`   Error: ${userError.message}`);
    } else {
      console.log('✅ one_time_purchase_id column exists');
      console.log('✅ email_verified column exists');
      console.log('✅ last_login_at column exists');
    }

    console.log('\n✨ Database verification complete!');

  } catch (error) {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  }
}

verifyDatabase();
