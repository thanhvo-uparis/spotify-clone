// Function to show signup form
export function showSignupForm() {
    signupForm.style.display = "block";
    loginForm.style.display = "none";
}

// Function to show login form
export function showLoginForm() {
    signupForm.style.display = "none";
    loginForm.style.display = "block";
}

// Function to open modal
export function openModal() {
    authModal.classList.add("show");
    document.body.style.overflow = "hidden"; // Prevent background scrolling
}

// Close modal function
export function closeModal() {
    authModal.classList.remove("show");
    document.body.style.overflow = "auto"; // Restore scrolling
}

// Close modal when clicking close button
    