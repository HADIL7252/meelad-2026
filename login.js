const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", () => {

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const message = document.getElementById("message");

    if (username === "admin" && password === "12345") {

        // Admin Login
        sessionStorage.setItem("adminLoggedIn", "true");
        localStorage.setItem("loggedIn", "true");

        window.location.href = "dashboard.html";

    } else {

        message.innerText = "❌ Invalid Username or Password";
        message.style.color = "red";

    }

});