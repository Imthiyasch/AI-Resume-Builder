const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Basic .env parser
const envPath = path.join(__dirname, '../../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) env[key.trim()] = value.trim();
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseAnonKey = env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function grantAdmin() {
    console.log('Fetching profiles...');
    const { data: profiles, error: fetchError } = await supabase.from('profiles').select('*');
    
    if (fetchError) {
        console.error('Fetch error:', fetchError);
        return;
    }

    if (!profiles || profiles.length === 0) {
        console.log('No profiles found in the database. Please sign up first!');
        return;
    }

    console.log(`Found ${profiles.length} profiles. Granting admin to all for verification...`);
    
    for (const profile of profiles) {
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ is_admin: true })
            .eq('id', profile.id);
        
        if (updateError) {
            console.error(`Error updating profile ${profile.email}:`, updateError);
        } else {
            console.log(`Granted admin to: ${profile.email}`);
        }
    }
}

grantAdmin();
