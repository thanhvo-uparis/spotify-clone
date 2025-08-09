import httpRequest from './utils/httpRequest.js';
import {showSignupForm, showLoginForm, openModal, closeModal} from './utils/authModal.js'
// Auth Modal Functionality
document.addEventListener("DOMContentLoaded", function () {
    // Get DOM elements
     const signupBtn = document.querySelector(".signup-btn");
     const loginBtn = document.querySelector(".login-btn");
     const authModal = document.getElementById("authModal");
     const modalClose = document.getElementById("modalClose");
     const signupForm = document.getElementById("signupForm");
     const loginForm = document.getElementById("loginForm");
     const showLoginBtn = document.getElementById("showLogin");
     const showSignupBtn = document.getElementById("showSignup");
     const userDropdown = document.getElementById("userDropdown");
    
    // Open modal with Sign Up form when clicking Sign Up button
    signupBtn.addEventListener("click", function () {
        showSignupForm();
        openModal();
    });

    modalClose.addEventListener("click", closeModal);

    // Close modal when clicking overlay (outside modal container)
    authModal.addEventListener("click", function (e) {
        if (e.target === authModal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && authModal.classList.contains("show")) {
            closeModal();
        }
    });

    // Switch to Login form
    showLoginBtn.addEventListener("click", function () {
        showLoginForm();
    });

    // Open modal with Login form when clicking Login button
    loginBtn.addEventListener("click", function () {
        showLoginForm();
        openModal();
    });

    // Switch to Signup form
    showSignupBtn.addEventListener("click", function () {
        showSignupForm();
    });
});

// User Menu Dropdown Functionality
document.addEventListener("DOMContentLoaded", function () {
    const userAvatar = document.getElementById("userAvatar");
    const logoutBtn = document.getElementById("logoutBtn");

    // Toggle dropdown when clicking avatar
    userAvatar.addEventListener("click", function (e) {
        e.stopPropagation();
        userDropdown.classList.toggle("show");
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", function (e) {
        if (
            !userAvatar.contains(e.target) &&
            !userDropdown.contains(e.target)
        ) {
            userDropdown.classList.remove("show");
        }
    });

    // Close dropdown when pressing Escape
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && userDropdown.classList.contains("show")) {
            userDropdown.classList.remove("show");
        }
    });

    // Handle logout button click
    logoutBtn.addEventListener("click", function () {
        // Close dropdown first
        userDropdown.classList.remove("show");

        console.log("Logout clicked");
        // TODO: Students will implement logout logic here
    });
});

// Other functionality
signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = document.getElementById("userName").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    const avatar_url = ""
    try {
        const data = await httpRequest.post("/auth/register", {username, email, password});
        //thông tin người dùng đăng ký
        localStorage.setItem("user name", data.user["username"]);
        localStorage.setItem("email", data.user["email"]);
        localStorage.setItem("password", password);
        showLoginForm();
        alert(`Chào bạn ${username}, bạn đã tạo tài khoản thành công!\nVui lòng đăng nhập.`);
    } catch (error) {
        console.error("Lỗi đăng ký: ", error.message);
    }
});

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    
    try {
        const data = await httpRequest.post("/auth/login", {email, password});
        localStorage.setItem("access_token", data.access_token);
        updateUiAfterLogin(data.user);
    } catch (error) {
        console.error("Lỗi đăng nhập: ", error.message);
    }
})

function updateUiAfterLogin(data) {
    closeModal();
    const authButtons = document.querySelector(".auth-buttons");
    authButtons.style.display = "none";

    const dropdownItem = document.createElement("div");
    dropdownItem.className = "dropdown-item";

    const userName = document.createElement("span");
    userName.textContent = data["username"];
    dropdownItem.appendChild(userName);
    userDropdown.appendChild(dropdownItem);
}