import {showSignupForm, showLoginForm, openModal, closeModal} from './authModal.js';
import httpRequest from './httpRequest.js';

export function updateUiAfterLogin(data) {
    closeModal();
    const authButtons = document.querySelector(".auth-buttons");
    authButtons.style.display = "none";

    const dropdownItem = document.createElement("div");
    dropdownItem.className = "dropdown-item";

    const userName = document.createElement("span");
    userName.textContent = data.user["username"];
    dropdownItem.appendChild(userName);
    userDropdown.appendChild(dropdownItem);
}

export const refreshToken = async () => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
        try {
            //lấy thông tin user với token hiện tại trong localStorage
            const userData = await httpRequest.get("/users/me", {requiresAuth: true});
            console.log("thực hiện get current user!");
            
            updateUiAfterLogin(userData);
        } catch (error) {
            //lỗi token hết hạn, refresh token lại để lấy token mới
            if (error.status === 401) {
                try {
                    const refreshToken = await httpRequest.post("/auth/refresh-token", {}, {requiresAuth: true});
                    console.log("thực hiện refresh toke!");

                    localStorage.setItem("access_token", refreshToken.access_token);
                    //đăng nhập với token mới sau khi refresh
                    const currentUser = await httpRequest.get("/users/me", {requiresAuth: true});
                    updateUiAfterLogin(currentUser);
                } catch (error) {
                    //Nếu refresh token cũng hết hạn, xóa token và chuyển về đăng nhập
                    localStorage.removeItem("access_token");
                    authButtons.style.display = "block";
                    showLoginForm();
                }
            }
        }
    }
}
