import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://nayodkxfawyfgobxbpbd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5heW9ka3hmYXd5ZmdvYnhicGJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MzY3MTcsImV4cCI6MjA3MjMxMjcxN30.757LLeS2UeR6VPLiGWaK6awYQvYe_B_rkaVDrA_w4SM'
const supabase = createClient(supabaseUrl, supabaseKey)

// async function getProducts(){
//     const {data, error} = await supabase.from('products').select('*');
//     if(error) console.error(error);
//     else console.log(data);
// }

const signupForm = document.getElementById('signup-form');

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const full_name = document.getElementById('full_name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Sign up user with Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    document.getElementById('signup-msg').textContent = error.message;
    return;
  }

  // Add user profile to "profiles" table
  await supabase.from('profiles').insert([
    { id: data.user.id, full_name: full_name }
  ]);

  document.getElementById('signup-msg').textContent = "Sign-up successful! Check your email.";
});

const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    document.getElementById('login-msg').textContent = error.message;
    return;
  }

  // Redirect to client dashboard or admin dashboard based on role
  const { data: profileData } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single();

  if(profileData.role === 'admin') {
    window.location.href = 'admin.html';
  } else {
    window.location.href = 'index.html';
  }
});

supabase.auth.onAuthStateChange((event, session) => {
  if(session) {
    console.log("User logged in:", session.user.email);
    // You can display username, etc.
  } else {
    console.log("No user logged in");
  }
});

async function logout() {
  const { error } = await supabase.auth.signOut();
  if(!error) window.location.href = 'login.html';
}
