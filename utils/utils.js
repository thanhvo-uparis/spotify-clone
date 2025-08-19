import {showSignupForm, showLoginForm, openModal, closeModal} from './authModal.js';
import httpRequest from './httpRequest.js';
import {waitForShadowElement} from '../main.js';

export async function updateUiAfterLogin(data) {
    closeModal();
    const authButtons = await waitForShadowElement("app-heading", ".auth-buttons");
    authButtons.style.display = "none";

    const dropdownItem = document.createElement("div");
    dropdownItem.className = "dropdown-item";

    const userName = document.createElement("span");
    userName.textContent = data.user["username"];
    dropdownItem.appendChild(userName);

    const userDropdown = await waitForShadowElement("app-heading", "#userDropdown");
    userDropdown.appendChild(dropdownItem);

    //cập nhật avatar của người dùng, nếu bằng null => hiện avatar default
    const avatarUrl = data.user["avatar_url"] ?? "../assets/img/img-avatar-default.png";
    const avatarImg = await waitForShadowElement("app-heading", "#img-userAvatar");
    avatarImg.setAttribute("src", avatarUrl);
}

export const refreshToken = async () => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
        try {
            //lấy thông tin user với token hiện tại trong localStorage
            const userData = await httpRequest.get("/users/me", {requiresAuth: true});
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
        const hitsGrid = await waitForShadowElement("app-main", ".hits-grid");
        const res = await httpRequest.get("/tracks/popular?limit=20");
        const listTracks = res.tracks;
        listTracks.map((item) => {
            const hitCard = document.createElement("div");
            hitCard.className = "hit-card";
            const id = item.id;
            hitCard.setAttribute("data-id", id);

            const idCurrentSong = localStorage.getItem("idCurrentSong");
            const isPlaying = localStorage.getItem("isPlaying");
            const html = `
                <div class="hit-card-cover">
                    <img
                        src="${item.image_url}?height=160&width=160"
                        alt="Flowers"
                    />
                    <button class="hit-play-btn">
                        ${((idCurrentSong === id) && (isPlaying === "true")) ? `<i class="fa-solid fa-pause"></i>` : `<i class="fa-solid fa-play"></i>`}
                    </button>
                </div>
                <div class="hit-card-info">
                    <h3 class="hit-card-title">${item.title}</h3>
                    <p class="hit-card-artist">${item.artist_name}</p>
                </div>
            `;
            hitCard.innerHTML = html;
            hitsGrid.appendChild(hitCard);
        })
}

export const getPopularArtists = async () => {
        const artistsGrid = await waitForShadowElement("app-main", ".artists-grid");
        const res = await httpRequest.get("/artists");
        const listArtists = res.artists;

        listArtists.map((item) => {
            const artistCard = document.createElement("div");
            artistCard.className = "artist-card";
            const id = item.id;
            artistCard.setAttribute("data-id", id);

            const idCurrentArtist = localStorage.getItem("idCurrentArtist");
            const isPlaying = localStorage.getItem("isPlaying");
            const html = `
                <div class="artist-card-cover">
                    <img
                        src="${item.image_url}?height=160&width=160"
                        alt="Đen"
                    />
                    <button class="artist-play-btn">
                        ${(idCurrentArtist === id) && (isPlaying === "true") ? `<i class="fa-solid fa-pause"></i>` : `<i class="fa-solid fa-play"></i>`}
                    </button>
                </div>
                <div class="artist-card-info">
                    <h3 class="artist-card-name">${item.name}</h3>
                    <p class="artist-card-type">Artist</p>
                </div>
            `;
            
            artistCard.innerHTML = html;
            artistsGrid.appendChild(artistCard);
        })
}

export const getArtist = async () => {
        const libraryContent = await waitForShadowElement("app-sidebar", ".library-content");
        const res = await httpRequest.get("/artists/trending?limit=4");
        const listArtists = res.artists;
        
        listArtists.map((item) => {
            let libraryItem = document.createElement("div");
            libraryItem.className = "library-item artist";
            let html =  `
            <div class = "item-image-wrapper">
                <img
                    src="${item.image_url}"
                    alt="${item.name}"
                    class="item-image"
                />
                <button class = "sidebar-play-btn">
                    <i class="fa-solid fa-play"></i>
                </button>
            </div>
            <div class="item-info">
                <div class="item-title">${item.name}</div>
                <div class="item-subtitle">Artist</div>
            </div>
            `;
            const id = item.id;
            libraryItem.setAttribute("data-id", id);
            libraryItem.innerHTML = html;
            libraryContent.appendChild(libraryItem);
        })
}

export const getPlaylist = async () => {
        const libraryContent = await waitForShadowElement("app-sidebar", ".library-content");
        const res = await httpRequest.get("/playlists?limit=4");
        const listPlaylists = res.playlists;
        
        listPlaylists.map((item) => {
            let libraryItem = document.createElement("div");
            libraryItem.className = "library-item playlist";
            let html =  `
            <div class = "item-image-wrapper">
                <img
                    src="${item.image_url}"
                    alt="${item.name}"
                    class="item-image"
                />
                <button class="sidebar-play-btn">
                    <i class="fa-solid fa-play"></i>
                </button>
            </div>
            <div class="item-info">
                <div class="item-title">${item.name}</div>
                <div class="item-subtitle">Playlist</div>
            </div>
            `;
            const id = item.id;
            libraryItem.setAttribute("data-id", id);
            libraryItem.innerHTML = html;
            libraryContent.appendChild(libraryItem);
        })
}

//appName, classDiv, classItem sont sous un format de string
//@def: get Id of element when clicked
export const getId = async (appName, classDiv, classItem) => {
    document.addEventListener("DOMContentLoaded", async function () {
        const libraryContent = await waitForShadowElement(appName, classDiv);
        console.log(libraryContent);
        
        libraryContent.addEventListener("click", (e) => {
            const itemSelected = e.target.closest(classItem);
            if (itemSelected) {
                console.log(itemSelected.dataset.id);
            }
        })
    })
}

//rendeer Home Page when clicking logo and home icon
export async function renderHomePage(elementTarget) {
    const appMain = document.querySelector("app-main");
    if (elementTarget && appMain && typeof appMain.renderHome === "function") {
        await appMain.renderHome();
    }
}