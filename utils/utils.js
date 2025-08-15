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

export const getBiggestHits = async () => {
        const hitsGrid = document.querySelector(".hits-grid");
        const res = await httpRequest.get("/tracks/popular?limit=20");
        const listTracks = res.tracks;
        const html = listTracks.map((item) => {
            return `
            <div class="hit-card">
            <div class="hit-card-cover">
                <img
                    src="${item.image_url}?height=160&width=160"
                    alt="Flowers"
                />
                <button class="hit-play-btn">
                    <i class="fas fa-play"></i>
                </button>
            </div>
            <div class="hit-card-info">
                <h3 class="hit-card-title">${item.title}</h3>
                <p class="hit-card-artist">${item.artist_name}</p>
            </div>
            </div>
            `
        }).join("");
        hitsGrid.innerHTML = html;
}

export const getPopularArtists = async () => {
        const artistsGrid = document.querySelector(".artists-grid");
        const res = await httpRequest.get("/artists");
        const listArtists = res.artists;
        const html = listArtists.map((item) => {
            return `
            <div class="artist-card">
                <div class="artist-card-cover">
                    <img
                        src="${item.image_url}?height=160&width=160"
                        alt="Đen"
                    />
                    <button class="artist-play-btn">
                        <i class="fas fa-play"></i>
                    </button>
                </div>
                <div class="artist-card-info">
                    <h3 class="artist-card-name">${item.name}</h3>
                    <p class="artist-card-type">Artist</p>
                </div>
            </div>
            `
        }).join("");
        artistsGrid.innerHTML = html;
}