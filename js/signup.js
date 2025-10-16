function showMessage(text, color = 'red') {
  const msgDiv = document.getElementById('msg');
  msgDiv.textContent = text;
  msgDiv.style.color = color;
  msgDiv.style.display = 'block';
  setTimeout(() => { msgDiv.style.display = 'none'; }, 3000);
}

const signForm = document.getElementById("signupForm");

signForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const fullName = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone-num').value.trim();
  const gender = document.getElementById('gender').value.trim();
  const password = document.getElementById('password').value.trim();
  const confirmPassword = document.getElementById('confirm-password').value.trim();

  if (!fullName || !email || !phone || !gender || !password || !confirmPassword)
    return showMessage('Please fill in all fields');
  if (password !== confirmPassword) return showMessage('Passwords do not match');

  const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
  if (!email.match(emailPattern)) return showMessage('Invalid email');

  const phonePattern = /^[0-9]{10,15}$/;
  if (!phone.match(phonePattern)) return showMessage('Invalid phone number');

  try {
    const response = await fetch('https://thetically-impressible-arla.ngrok-free.dev/auth/signup/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, phone, gender, password, confirmPassword })
    });

    const data = await response.json();

    if (response.ok) {
      showMessage('Sign up successful! Check your email for OTP', 'green');
      signForm.style.display = 'none';
      document.getElementById('otpSection').style.display = 'block';

      localStorage.setItem('pendingUser', JSON.stringify({ fullName, email, phone, gender }));
    } else {
      showMessage(data.message || 'Something went wrong');
    }
  } catch (error) {
    console.error(error);
    showMessage('Something went wrong');
  }
});

document.getElementById('verifyOtpBtn').addEventListener('click', async () => {
  const otp = document.getElementById('otpInput').value.trim();
  const email = document.getElementById('email').value.trim();
  if (!otp) return showMessage('Please enter OTP');

  try {
    const response = await fetch('https://thetically-impressible-arla.ngrok-free.dev/auth/confirm-email', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ otp, email })
    });

    const data = await response.json();

    if (response.ok) {
      showMessage('OTP confirmed! Your account is activated', 'green');
      document.getElementById('otpSection').style.display = 'none';

      const userData = JSON.parse(localStorage.getItem('pendingUser'));
      if (userData) {
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.removeItem('pendingUser');
      }

      setTimeout(() => { window.location.href = 'index.html'; }, 2000);
    } else {
      showMessage(data.message || 'Invalid OTP');
    }
  } catch (err) {
    console.error(err);
    showMessage('Something went wrong');
  }
});

