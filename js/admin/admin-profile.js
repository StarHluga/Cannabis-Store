// js/admin-profile.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://YOUR_PROJECT_URL.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Assume admin ID is retrieved from session/auth
const adminId = 'current-admin-id'; 

const form = document.getElementById('admin-profile-form');

async function loadProfile() {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', adminId)
        .single();

    if (error) {
        alert('Error loading profile: ' + error.message);
        return;
    }

    document.getElementById('name').value = data.name || '';
    document.getElementById('email').value = data.email || '';
    document.getElementById('organisation').value = data.organisation || '';
    document.getElementById('license').value = data.license || '';
    document.getElementById('org-info').value = data.org_info || '';
}

// Save or update profile
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const updates = {
        name: form.name.value,
        email: form.email.value,
        organisation: form.organisation.value,
        license: form.license.value,
        org_info: form['org-info'].value
    };

    const { data, error } = await supabase
        .from('profiles')
        .upsert({ id: adminId, ...updates }, { onConflict: 'id' });

    if (error) {
        alert('Error saving profile: ' + error.message);
        return;
    }

    alert('Profile updated successfully!');
});

// Load profile when page opens
loadProfile();
