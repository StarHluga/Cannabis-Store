import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://nayodkxfawyfgobxbpbd.supabase.co'
const supabaseKey = 'YOUR_ANON_KEY_HERE' // Keep this public anon key
const supabase = createClient(supabaseUrl, supabaseKey)

// ----- Signup -----
const signupForm = document.getElementById('signup-form');
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const full_name = document.getElementById('full_name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Sign up user
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      document.getElementById('signup-msg').textContent = error.message;
      return;
    }

    // Add profile to "profiles" table
    await supabase.from('profiles').insert([
      { id: data.user.id, full_name: full_name, role: 'user' }
    ]);

    document.getElementById('signup-msg').textContent = "Sign-up successful! Check your email.";

    signupForm.reset();
  });
}

// ----- Login -----
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      document.getElementById('login-msg').textContent = error.message;
      return;
    }

    // Check role in profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      document.getElementById('login-msg').textContent = profileError.message;
      return;
    }

    if (profileData.role === 'admin') {
      window.location.href = 'admin.html';
    } else {
      window.location.href = 'index.html';
    }
  });
}

// ----- Auth State Listener -----
supabase.auth.onAuthStateChange((event, session) => {
  if(session) {
    console.log("User logged in:", session.user.email);
  } else {
    console.log("No user logged in");
  }
});

// ----- Logout -----
window.logout = async function() {
  const { error } = await supabase.auth.signOut();
  if (!error) window.location.href = 'login.html';
}
