document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const email = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  try {
    const response = await fetch('https://thetically-impressible-arla.ngrok-free.dev/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) throw new Error('Invalid email or password');
    const data = await response.json();

    const token = data.access_Token;
    localStorage.setItem('access_Token', token);

    const storedUser = JSON.parse(localStorage.getItem('userData')) || {};
    const pendingUser = JSON.parse(localStorage.getItem('pendingUser')) || {};

    const userData = {
      fullName: pendingUser.fullName || storedUser.fullName || 'Unknown User',
      email: email,
      phone: pendingUser.phone || storedUser.phone || 'N/A',
      gender: pendingUser.gender || storedUser.gender || 'N/A'
    };

    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.removeItem('pendingUser');

    window.location.href = 'profile.html';
  } catch (error) {
    alert(error.message);
    console.error(error);
  }
});
