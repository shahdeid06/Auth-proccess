function showMessage(text, color = 'red') {
  const msgDiv = document.getElementById('msg');
  msgDiv.textContent = text;
  msgDiv.style.color = color;
  msgDiv.style.display = 'block';
  setTimeout(() => { msgDiv.style.display = 'none'; }, 3000);
}

function loadProfile() {
  const token = localStorage.getItem('access_Token');
  const data = JSON.parse(localStorage.getItem('userData')) || {};

  if (!token) return showMessage('No token found. Please login first.');

  document.getElementById('profileName').textContent = data.fullName || 'N/A';
  document.getElementById('profileEmail').textContent = data.email || 'N/A';
  document.getElementById('profilePhone').textContent = data.phone || 'N/A';
  document.getElementById('profileGender').textContent = data.gender || 'N/A';
}

document.addEventListener('DOMContentLoaded', loadProfile);

document.getElementById('editProfile').addEventListener('click', () => {
  const editForm = document.getElementById('editForm');
  const profileInfo = document.getElementById('profileInfo');
  const data = JSON.parse(localStorage.getItem('userData')) || {};

  document.getElementById('editName').value = data.fullName || '';
  document.getElementById('editPhone').value = data.phone || '';
  document.getElementById('editGender').value = data.gender || '';

  profileInfo.style.display = 'none';
  editForm.style.display = 'block';
});

document.getElementById('editForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('access_Token');
  if (!token) return showMessage('Please login again');

  const fullName = document.getElementById('editName').value.trim();
  const phone = document.getElementById('editPhone').value.trim();
  const gender = document.getElementById('editGender').value.trim();

  try {
    const response = await fetch('https://thetically-impressible-arla.ngrok-free.dev/users/', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ fullName, phone, gender }),
    });

    if (response.ok) {
      showMessage('Profile updated successfully!', 'green');
      const updated = { ...JSON.parse(localStorage.getItem('userData')), fullName, phone, gender };
      localStorage.setItem('userData', JSON.stringify(updated));
      loadProfile();
      document.getElementById('editForm').style.display = 'none';
      document.getElementById('profileInfo').style.display = 'block';
    } else {
      const data = await response.json();
      showMessage(data.message || 'Update failed');
    }
  } catch (err) {
    console.error(err);
    showMessage('Something went wrong while updating');
  }
});

document.getElementById('logout').addEventListener('click', () => {
  localStorage.removeItem('access_Token');
  localStorage.removeItem('userData');
  showMessage('Logging out...', 'green');
  setTimeout(() => { window.location.href = 'index.html'; }, 1500);
});

