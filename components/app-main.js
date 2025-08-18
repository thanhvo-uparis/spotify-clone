import httpRequest from "../utils/httpRequest.js";

class AppMain extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({mode: "open"});
    }

    renderPlaylist(dataPlaylist, dataTracks) {
            const pageDetails = `
                    <section class="artist-hero">
                        <div class="hero-background">
                            <img
                                src="${dataPlaylist.image_url}"
                                alt=""
                                class="hero-image"
                            />
                            <div class="hero-overlay"></div>
                        </div>
                        <div class="hero-content">
                            <div class="verified-badge">
                                <i class="fas fa-check-circle"></i>
                                <span>Verified Artist</span>
                            </div>
                            <p>${(dataPlaylist.is_public === 1) ? "Public Playlist" : "Private Playlist"}<p>
                            <h1 class="artist-name">${dataPlaylist.name}</h1>
                            <p class="monthly-listeners">
                                ${dataPlaylist.user_username ?? "null"} ${dataPlaylist.total_tracks} songs, ${dataPlaylist.total_duration} sec
                            </p>
                        </div>
                    </section>

                    <!-- Artist Controls -->
                    <section class="artist-controls">
                        <button class="play-btn-large">
                            <i class="fas fa-play"></i>
                        </button>
                    </section>

                    <!-- Popular Tracks -->
                    <section class="popular-section">
                        <div class = "track-list">
                        </div>
                    </section>
                `;
            this.shadowRoot.innerHTML = `
                ${this.fontAwesomeLink}
                <style>${this.css}</style>
                ${pageDetails}
            `
            const trackList = this.shadowRoot.querySelector(".track-list");
            dataTracks.forEach(track => {
                const item = document.createElement("div");
                item.className = "track-item";
                item.setAttribute("data-trackId", track.track_id);
                //có sẵn class playing để thể hiện track đang phát
                item.innerHTML = `
                    <div class="track-btn-play">
                            <i class="fa-solid fa-play"></i>
                    </div>
                    <div class="track-image">
                        <img
                            src="${track.track_image_url}?height=40&width=40"
                            alt="${track.track_title}"
                        />
                    </div>
                    <div class="track-info">
                        <div class="track-name playing-text">
                            ${track.track_title}
                        </div>
                    </div>
                    <div class="track-plays">${track.track_play_count}</div>
                    <div class="track-duration">4:12</div>
                    <button class="track-menu-btn">
                        <i class="fas fa-ellipsis-h"></i>
                    </button>
                `;
                trackList.appendChild(item);
            })
    }

    renderArtist(data) {
            const tracks = data.tracks;
            const pageDetails = `
                    <section class="artist-hero">
                        <div class="hero-background">
                            <img
                                src="${data.artist.image_url}"
                                alt=""
                                class="hero-image"
                            />
                            <div class="hero-overlay"></div>
                        </div>
                        <div class="hero-content">
                            <div class="verified-badge">
                                <i class="fas fa-check-circle"></i>
                                <span>Verified Artist</span>
                            </div>
                            <h1 class="artist-name">${data.artist.name}</h1>
                            <p class="monthly-listeners">
                                1,021,833 monthly listeners
                            </p>
                        </div>
                    </section>

                    <!-- Artist Controls -->
                    <section class="artist-controls">
                        <button class="play-btn-large">
                            <i class="fas fa-play"></i>
                        </button>
                    </section>

                    <!-- Popular Tracks -->
                    <section class="popular-section">
                        <h2 class="section-title">Popular</h2>
                        <div class = "track-list">
                        </div>
                    </section>
                `;
            this.shadowRoot.innerHTML = `
                ${this.fontAwesomeLink}
                <style>${this.css}</style>
                ${pageDetails}
            `
            const trackList = this.shadowRoot.querySelector(".track-list");
            tracks.forEach(track => {
                const item = document.createElement("div");
                item.className = "track-item";
                item.setAttribute("data-trackId", track.id);
                //có sẵn class playing để  thể hiện track đang phát
                item.innerHTML = `
                    <div class="track-btn-play">
                            <i class="fa-solid fa-play"></i>
                    </div>
                    <div class="track-image">
                        <img
                            src="${track.image_url}?height=40&width=40"
                            alt="${track.title}"
                        />
                    </div>
                    <div class="track-info">
                        <div class="track-name playing-text">
                            ${track.title}
                        </div>
                    </div>
                    <div class="track-plays">${track.play_count}</div>
                    <div class="track-duration">4:12</div>
                    <button class="track-menu-btn">
                        <i class="fas fa-ellipsis-h"></i>
                    </button>
                `;
                trackList.appendChild(item);
            })
    }

    renderTrack(data) {
        const pageDetails = `
                <section class="artist-hero">
                    <div class="hero-background">
                        <img
                            src="${data.image_url}"
                            alt=""
                            class="hero-image"
                        />
                        <div class="hero-overlay"></div>
                    </div>
                    <div class="hero-content">
                        <div class="verified-badge">
                            <i class="fas fa-check-circle"></i>
                            <span>Verified Artist</span>
                        </div>
                        <h1 class="artist-name">${data.title}</h1>
                        <p class="monthly-listeners">
                            1,021,833 monthly listeners
                        </p>
                    </div>
                </section>

                <!-- Artist Controls -->
                <section class="artist-controls">
                    <button class="play-btn-large">
                        <i class="fas fa-play"></i>
                    </button>
                </section>

                <!-- Popular Tracks -->
                <section class="popular-section">
                    <h2 class="section-title">Popular</h2>
                    <div class="track-list">
                        <div class="track-item playing">
                            <div class="track-btn-play">
                                <i class="fa-solid fa-play"></i>
                            </div>
                            <div class="track-image">
                                <img
                                    src="?height=40&width=40"
                                    alt="${data.title}"
                                />
                            </div>
                            <div class="track-info">
                                <div class="track-name playing-text">
                                    ${data.title}
                                </div>
                            </div>
                            <div class="track-plays">${data.play_count}</div>
                            <div class="track-duration">4:12</div>
                            <button class="track-menu-btn">
                                <i class="fas fa-ellipsis-h"></i>
                            </button>
                        </div>
                    </div>
                </section>
            `;
        this.shadowRoot.innerHTML = `
        ${this.fontAwesomeLink}
        <style>${this.css}</style>
        ${pageDetails}
        `
    }

    async connectedCallback() {
        let isPlaying = false;
        localStorage.setItem("isPlaying", isPlaying);
        let id = "";
        const cssFiles = [
            "../templates/styles/reset.css",
            "../templates/styles/components.css",
            "../templates/styles/layout.css",
            "../templates/styles/responsive.css",
            "../templates/styles/variables.css"
        ];
        const fontAwesomeLink = `<link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />`
        const cssArr = await Promise.all(cssFiles.map(path => fetch(path).then(res => res.text())))
        const css = cssArr.join("\n");
        this.fontAwesomeLink = fontAwesomeLink;
        this.css = css;
        const html = await fetch("../templates/main.html").then(res => res.text());
        this.shadowRoot.innerHTML = `
        ${fontAwesomeLink}
        <style>${css}</style>
        ${html}
        `
        
        //lưu ý: ở callback, cần sử dụng arrow function để this trỏ đúng về instance của AppMain
        // nếu dùng function (e) {....}: this sẽ trỏ tới chính shadowRoot => lỗi hoặc ko làm gì cả.
        this.shadowRoot.addEventListener("click", async (e) => {
            const card = e.target.closest(".hit-card");
            const hitplayBtn = e.target.closest(".hit-play-btn");

            if (hitplayBtn) {
                id = card.getAttribute("data-id");
                const allItems = this.shadowRoot.querySelectorAll(".hit-play-btn");

                if (id !== localStorage.getItem("idCurrentSong")) {
                    isPlaying = true;
                    localStorage.setItem("idCurrentSong", id);
                    localStorage.setItem("isPlaying", isPlaying);
                }
                else {
                    localStorage.setItem("idCurrentSong", id);
                    localStorage.setItem("isPlaying", !isPlaying);
                    isPlaying = !isPlaying;
                }
                
                if (isPlaying) {
                    allItems.forEach(item => item.innerHTML = `<i class="fas fa-play"></i>`)
                    hitplayBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
                }
                else allItems.forEach(item => item.innerHTML = `<i class="fas fa-play"></i>`)
            }
            else if (card) {
                id = card.getAttribute("data-id");
                const dataTrack = await httpRequest.get(`/tracks/${id}`);
                this.renderTrack(dataTrack);

                const playbtnLarge = this.shadowRoot.querySelector(".play-btn-large");
                playbtnLarge.addEventListener("click", (e) => {
                    localStorage.setItem("idCurrentSong", id);
                    localStorage.setItem("isPlaying", !isPlaying);
                    isPlaying = !isPlaying;
                })
            }
        })
    }
}
customElements.define("app-main", AppMain);