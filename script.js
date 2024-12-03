let loggedInUser = null;
let users = JSON.parse(localStorage.getItem("users")) || [];

// Toggle the hamburger menu
function toggleMenu() {
    const navbar = document.getElementById("navbar");
    navbar.classList.toggle("active");
}

// Register a new user
function registerUser() {
    const username = document.getElementById("reg-username").value;
    const password = document.getElementById("reg-password").value;

    if (username && password) {
        // Check if the user already exists
        if (users.some(user => user.username === username)) {
            alert("Username already taken. Please choose another one.");
        } else {
            users.push({ username, password });
            localStorage.setItem("users", JSON.stringify(users));
            alert("Registration successful!");
            document.getElementById("register-form").classList.add("hidden");
            document.getElementById("login-form").classList.remove("hidden");
            // Auto-fill username for login
            document.getElementById("login-username").value = username;
        }
    } else {
        alert("Please fill in all fields.");
    }
}

// Log in an existing user
function loginUser() {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        loggedInUser = user;
        localStorage.setItem("loggedInUser", username); // Save logged-in user to localStorage
        alert(`Welcome, ${loggedInUser.username}!`);
        window.location.href = "index.html"; // Redirect to main page
    } else {
        alert("Invalid username or password.");
    }
}

// Log out the user
function logoutUser() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "auth.html"; // Redirect to login page
}

// Send a notification
function sendNotification() {
    const text = document.getElementById("notification-text").value;
    const type = document.getElementById("alert-type").value;

    if (text) {
        const alertItem = `${type}: ${text}`;
        saveAlert(alertItem);
        document.getElementById("notification-text").value = "";
        alert("Alert sent!");
    } else {
        alert("Please enter alert details.");
    }
}

// Save alert to local storage (shared between pages)
function saveAlert(alertText) {
    const alerts = JSON.parse(localStorage.getItem("alerts")) || [];
    alerts.push(alertText);
    localStorage.setItem("alerts", JSON.stringify(alerts));
}

// Load alerts for the alerts page
function loadAlerts() {
    const alerts = JSON.parse(localStorage.getItem("alerts")) || [];
    const alertsList = document.getElementById("alerts-list");
    alertsList.innerHTML = "";

    alerts.forEach(alert => {
        const alertItem = document.createElement("li");
        alertItem.textContent = alert;
        alertsList.appendChild(alertItem);
    });
}

// Auto-load alerts if on the alerts page
if (document.getElementById("alerts-list")) {
    loadAlerts();
}

// Toggle between login and registration forms
function toggleForms() {
    document.getElementById("register-form").classList.toggle("hidden");
    document.getElementById("login-form").classList.toggle("hidden");
}

// Set logged-in user username to display
function displayUsername() {
    const loggedInUsername = localStorage.getItem("loggedInUser");
    if (loggedInUsername) {
        document.getElementById("username-display").textContent = loggedInUsername;
    } else {
        window.location.href = "auth.html"; // Redirect if no user is logged in
    }
}

// Call this function when the page loads to display username on the dashboard
if (document.getElementById("username-display")) {
    displayUsername();
}
