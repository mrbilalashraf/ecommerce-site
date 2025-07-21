document.addEventListener('DOMContentLoaded', () => {
    fetch('footer.html')
      .then(res => res.text())
      .then(data => {
        document.getElementById('footer').innerHTML = data;
      });
});

const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const toggleForm = document.getElementById('toggleForm');
    const toggleText = document.getElementById('toggleText');
    const formTitle = document.getElementById('formTitle');

    let isLogin = true;

    toggleForm.addEventListener('click', (e) => {
      e.preventDefault();
      isLogin = !isLogin;
      loginForm.style.display = isLogin ? 'block' : 'none';
      signupForm.style.display = isLogin ? 'none' : 'block';
      toggleForm.textContent = isLogin ? 'Sign up' : 'Login';
      toggleText.textContent = isLogin ? "Don't have an account?" : "Already have an account?";
      formTitle.textContent = isLogin ? 'Login to MockMart' : 'Create a MockMart Account';
    });

// Signup logic
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim().toLowerCase();
    const password = document.getElementById('signupPassword').value;

    let users = JSON.parse(localStorage.getItem('users')) || [];

    const userExists = users.some(user => user.email === email);
    if (userExists) {
      alert('User with this email already exists!');
      return;
    }

    users.push({ name, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Signup successful! You can now login.');
    signupForm.reset();
    toggleForm.click(); // Switch to login form
  });

  // Login logic
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const matchedUser = users.find(user => user.email === email && user.password === password);

    if (!matchedUser) {
      alert('Invalid email or password');
      return;
    }

    localStorage.setItem('currentUser', JSON.stringify(matchedUser));
    alert(`Welcome back, ${matchedUser.name}!`);
    window.location.href = 'index.html'; // Redirect to homepage
  });
