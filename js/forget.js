function showMessage(text, color = 'red') {
  const msgDiv = document.getElementById('msg');
  msgDiv.textContent = text;
  msgDiv.style.color = color;
  msgDiv.style.display = 'block';
}

document.getElementById("forgotForm").addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.getElementById('forgotEmail').value.trim();

  try {
    const response = await fetch('https://thetically-impressible-arla.ngrok-free.dev/auth/forgot-password', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    if (!response.ok)
         throw new Error('Email not found or failed to send OTP');

    showMessage('OTP sent to your email', 'green');

    localStorage.setItem('resetEmail', email);
    window.location.href = 'reset.html';
  } catch (error) {
    showMessage(error.message);
  }
});
