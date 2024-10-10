document.getElementById('registration-form').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const feedbackDiv = document.getElementById('form-feedback');
    const userList = document.getElementById('user-list');

    let messages = [];
    let isValid = true;

    let users = JSON.parse(localStorage.getItem('users')) || [];

    if (users.some(user => user.email === email)) {
        isValid = false;
        messages.push("This email is already registered.");
    }

    if (users.some(user => user.username === username)) {
        isValid = false;
        messages.push("This username is already taken.");
    }

    if (username.length < 3) {
        isValid = false;
        messages.push("Username must be at least 3 characters long.");
    }

    if (!email.includes('@') || !email.includes('.')) {
        isValid = false;
        messages.push("Please enter a valid email address.");
    }

    if (password.length < 8) {
        isValid = false;
        messages.push("Password must be at least 8 characters long.");
    }

    if (!isValid) {
        feedbackDiv.style.color = "red";
        feedbackDiv.innerHTML = messages.join("<br>");
        feedbackDiv.style.display = "block";
        return;
    } else {
        feedbackDiv.style.color = "green";
        feedbackDiv.textContent = "Registration successful!";
        feedbackDiv.style.display = "block";
    }

    users.push({ username, email });
    localStorage.setItem('users', JSON.stringify(users));

    displayUsers();
    
    document.getElementById('registration-form').reset();
    checkFormValidity(); 
});

document.getElementById('username').addEventListener('input', validateUsername);
document.getElementById('email').addEventListener('input', validateEmail);
document.getElementById('password').addEventListener('input', validatePassword);

function validateUsername() {
    const username = document.getElementById('username').value.trim();
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (users.some(user => user.username === username)) {
        showError('username', 'This username is already taken.');
    } else if (username.length < 3) {
        showError('username', 'Username must be at least 3 characters long.');
    } else {
        clearError('username');
    }
    checkFormValidity();
}

function validateEmail() {
    const email = document.getElementById('email').value.trim();
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (users.some(user => user.email === email)) {
        showError('email', 'This email is already registered.');
    } else if (!email.includes('@') || !email.includes('.')) {
        showError('email', 'Please enter a valid email address.');
    } else {
        clearError('email');
    }
    checkFormValidity();
}

function validatePassword() {
    const password = document.getElementById('password').value.trim();
    const strength = getPasswordStrength(password);

    const passwordStrengthDiv = document.getElementById('password-strength');
    passwordStrengthDiv.textContent = `Password Strength: ${strength}`;
    
    if (password.length < 8) {
        showError('password', 'Password must be at least 8 characters long.');
    } else {
        clearError('password');
    }
    checkFormValidity();
}

function getPasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&#]/.test(password)) strength++;

    switch (strength) {
        case 5:
            return 'Very Strong';
        case 4:
            return 'Strong';
        case 3:
            return 'Moderate';
        case 2:
            return 'Weak';
        default:
            return 'Very Weak';
    }
}

function showError(field, message) {
    const input = document.getElementById(field);
    input.style.borderColor = 'red';
    const feedback = input.nextElementSibling;
    feedback.textContent = message;
    feedback.style.color = 'red';
}

function clearError(field) {
    const input = document.getElementById(field);
    input.style.borderColor = '';
    const feedback = input.nextElementSibling;
    feedback.textContent = '';
}

function checkFormValidity() {
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    const isValidUsername = username.length >= 3 && !localStorage.getItem('users').includes(username);
    const isValidEmail = email.includes('@') && email.includes('.') && !localStorage.getItem('users').includes(email);
    const isValidPassword = password.length >= 8;

    const submitBtn = document.getElementById('submit-btn');
    if (isValidUsername && isValidEmail && isValidPassword) {
        submitBtn.disabled = false;
    } else {
        submitBtn.disabled = true;
    }
}
document.addEventListener('DOMContentLoaded', displayUsers);

function displayUsers() {
    const userList = document.getElementById('user-list');
    userList.innerHTML = '';  
    let users = JSON.parse(localStorage.getItem('users')) || [];

    users.forEach(user => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${user.username}</span> - ${user.email}`;
        userList.appendChild(li);
    });
}