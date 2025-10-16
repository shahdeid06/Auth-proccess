function showMessage(text, color = 'red') {
  const msgDiv = document.getElementById('msg');
  msgDiv.textContent = text;
  msgDiv.style.color = color;
  msgDiv.style.display = 'block';
}

const email = localStorage.getItem('resetEmail');
console.log("Email from localStorage:", email);

document.getElementById('otpForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const otp = document.getElementById('otp').value.trim();

  try {
    const res = await fetch('https://thetically-impressible-arla.ngrok-free.dev/auth/verify-forget-code', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    });

    const text = await res.text();
    console.log("Server response (verify):", text);

    if (!res.ok) throw new Error('Invalid OTP');

    showMessage('OTP verified successfully!', 'green');

    document.getElementById('otpForm').style.display = 'none';
    document.getElementById('resetForm').style.display = 'flex';
    document.getElementById('formTitle').textContent = 'Reset Password';

  } catch (err) {
    showMessage(err.message);
  }
});

document.getElementById('resetForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const otp = document.getElementById('otp').value.trim();
  const password = document.getElementById('password').value.trim();
  const confirmPassword = document.getElementById('confirmPassword').value.trim();

  try {
    const res = await fetch('https://thetically-impressible-arla.ngrok-free.dev/auth/reset-password', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, password, confirmPassword })
    });

    const text = await res.text();
    console.log("Server response (reset):", text);

    if (!res.ok) throw new Error('Password reset failed');

    showMessage('Password reset successfully!', 'green');
    setTimeout(() => window.location.href = 'index.html', 2000);

  } catch (err) {
    showMessage(err.message);
  }
});


