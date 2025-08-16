import "./components/app-heading.js"
import "./components/app-sidebar.js"
import "./components/app-main.js"
import "./components/app-footer.js"

import httpRequest from './utils/httpRequest.js';
import {showSignupForm, showLoginForm, openModal, closeModal} from './utils/authModal.js'
import {updateUiAfterLogin, refreshToken, getBiggestHits, getPopularArtists} from './utils/utils.js';

getBiggestHits();
getPopularArtists();

export async function waitForShadowElement(hostSelector, shadowSelector, timeout = 2000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
        const host = document.querySelector(hostSelector);
        if (host && host.shadowRoot) {
            const el = host.shadowRoot.querySelector(shadowSelector);
            if (el) return el;
        }
        await new Promise(r => setTimeout(r, 20));
    }
    return null;
}

const authModal = document.getElementById("authModal");
const modalClose = document.getElementById("modalClose");
const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");
const showLoginBtn = document.getElementById("showLogin");
const showSignupBtn = document.getElementById("showSignup");

document.addEventListener("DOMContentLoaded", async function () {
    const signupBtn = await waitForShadowElement("app-heading", ".signup-btn");
    const loginBtn = await waitForShadowElement("app-heading", ".login-btn");

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
    
})

document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
})

// User Menu Dropdown Functionality
document.addEventListener("DOMContentLoaded", async function () {
    const userAvatar = await waitForShadowElement("app-heading", "#userAvatar");
    const logoutBtn = await waitForShadowElement("app-heading", "#logoutBtn");
    const userDropdown = await waitForShadowElement("app-heading", "#userDropdown");
    // Toggle dropdown when clicking avatar
    userAvatar.addEventListener("click", function (e) {
        e.stopPropagation();
        console.log(userDropdown);
        
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

document.addEventListener("DOMContentLoaded", async function () {
    if (localStorage.getItem("access_token")) {
        const authButtons = await waitForShadowElement("app-heading", ".auth-buttons");
        if (authButtons) authButtons.style.display = "none";
    }
    refreshToken();
});

// Other functionality
signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = document.getElementById("userName").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
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
        updateUiAfterLogin(data);
    } catch (error) {
        console.error("Lỗi đăng nhập: ", error.message);
    }
})