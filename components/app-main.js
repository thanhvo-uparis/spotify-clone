import httpRequest from "../utils/httpRequest.js";
import {getPlaylist, openEditPlaylist} from "../utils/utils.js";

class AppMain extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({mode: "open"});
        this.listPlaylistName = JSON.parse(localStorage.getItem("listPlaylistName") || "[]");
    }
    //render nội dung ở app-main khi click chọn các playlist bên sidebar
    //dataPlaylistById: from endpoint Get Playlist by ID
    //dataPlaylistTracks: from endpoint Get Playlist Tracks
    renderPlaylistDetails(dataPlaylistById, dataPlaylistTracks) {
            const pageDetails = `
                    <section class="artist-hero">
                        <div class="hero-background">
                           <img
                                src="${dataPlaylistById.image_url}"
                                alt=""
                                class="hero-image"
                            />
                        </div>
                        <div class="hero-content">
                            <p>${(dataPlaylistById.is_public === 1) ? "Public Playlist" : "Private Playlist"}<p>
                            <h1 class="playlist-name">${dataPlaylistById.name}</h1>
                            <p class="monthly-listeners">
                                ${dataPlaylistById.user_username ?? "null"} • ${dataPlaylistById.total_tracks} songs
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
            //render phần danh sách các bài hát của playlist
            const trackList = this.shadowRoot.querySelector(".track-list");
            dataPlaylistTracks.forEach(track => {
                const item = document.createElement("div");
                item.className = "track-item";
                item.setAttribute("data-trackId", track.track_id);
                //có sẵn class playing để thể hiện track đang phát
                item.innerHTML = `
                    <div class="play-btn-below">
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
    //render nội dung ở app-main khi click chọn các artist bên sidebar
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
                item.setAttribute("data-id", track.id);
                //có sẵn class playing để  thể hiện track đang phát
                item.innerHTML = `
                    <div class="play-btn-below">
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
    //render nội dung ở app-main khi click chọn các bài hát ở app-main
    renderTrack(data, isPlaying) {
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
                    <button class="play-btn-large  play-btn-track">
                        ${isPlaying ? `<i class="fa-solid fa-pause"></i>` : `<i class="fa-solid fa-play"></i>`}
                    </button>
                </section>

                <!-- Popular Tracks -->
                <section class="popular-section">
                    <h2 class="section-title">Popular</h2>
                    <div class="track-list">
                        <div class="track-item playing">
                            <div class="play-btn-below play-btn-track">
                                ${isPlaying ? `<i class="fa-solid fa-pause"></i>` : `<i class="fa-solid fa-play"></i>`}
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

    //cấp tên playlist mặc định
    providePlaylistName() {
        let number = 1;
        let name = `My Playlist#${number}`;
        while (this.listPlaylistName.includes(name)) {
            number++;
            name = `My Playlist#${number}`;
        }
        this.listPlaylistName.push(name);
        localStorage.setItem("listPlaylistName", JSON.stringify(this.listPlaylistName));
        return name;
    }

    async createPlaylist() {
        const newPlaylistName = this.providePlaylistName();
        
        const res = await httpRequest.post("/playlists", {name: newPlaylistName, image_url: "https://www.afrocharts.com/images/song_cover.png"}, {requiresAuth: true});
        
        const pageDetails = `
            <section class="artist-hero">
                <div class="hero-background">
                    <img
                        src="${res.playlist.image_url}"
                        alt=""
                        class="hero-image"
                    />
                </div>
                <div class="hero-content">
                    <p>${res.playlist.is_public ? "Public Playlist" : "Private Playlist"}<p>
                    <h1 class="artist-name">${newPlaylistName}</h1>
                    <p class="monthly-listeners">
                        ${res.playlist.user_username ?? "null"}
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
    }

    async renderHome() {
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

        //render biggest hit và popular artist lần đầu
        import("../utils/utils.js").then(utils => {
            utils.getBiggestHits();
            utils.getPopularArtists();
        })
    }

    //hàm lắng nghe giá trị của id, isPlaying khi phát/dừng nhạc
    listenerStateChange(id, isPlaying) {
        window.dispatchEvent(new CustomEvent("playerStateChanged", {
            detail: {
                idCurrentSong: id,
                isPlaying: isPlaying
            }
        }))
    }

    //idCurrent: "idCurrentSong" or "idCurrentArtist"
    //Điều khiển nút play bên ngoài ở hit-card và artist-card
    async handlePlayBtn(id, allItemsElement, idCurrent, isPlaying, hitplayBtn) {

        if (id !== localStorage.getItem(idCurrent)) {
            isPlaying = true;
            localStorage.setItem(idCurrent, id);
            localStorage.setItem("isPlaying", true);
            this.listenerStateChange(id, isPlaying); // lắng nghe việc phát/dừng nhạc
        }
        else {
            isPlaying = localStorage.getItem("isPlaying") === "true" ? true : false;
            localStorage.setItem(idCurrent, id);
            localStorage.setItem("isPlaying", !isPlaying);
            isPlaying = !isPlaying;
            this.listenerStateChange(id, isPlaying); // lắng nghe việc phát/dừng nhạc
        }
        
        if (isPlaying) {
            allItemsElement.forEach(item => item.innerHTML = `<i class="fas fa-play"></i>`)
            hitplayBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
        }
        else allItemsElement.forEach(item => item.innerHTML = `<i class="fas fa-play"></i>`)
    }

    async connectedCallback() {
        let isPlaying = false;
        localStorage.setItem("isPlaying", isPlaying);
        let id = "";
        
        await this.renderHome();
        //lưu ý: ở callback, cần sử dụng arrow function để this trỏ đúng về instance của AppMain
        // nếu dùng function (e) {....}: this sẽ trỏ tới chính shadowRoot => lỗi hoặc ko làm gì cả.
        this.shadowRoot.addEventListener("click", async (e) => {
            const card = e.target.closest(".hit-card");
            const hitplayBtn = e.target.closest(".hit-play-btn");
            const artistCard = e.target.closest(".artist-card");
            const artistPlayBtn = e.target.closest(".artist-play-btn");
            
            if (hitplayBtn) {
                id = card.getAttribute("data-id");
                const allItems = this.shadowRoot.querySelectorAll(".hit-play-btn");
                this.handlePlayBtn(id, allItems, "idCurrentSong", isPlaying, hitplayBtn);
            }
            else if (artistPlayBtn) {
                let idArtist = artistCard.getAttribute("data-id");
                const data = await httpRequest.get(`/artists/${idArtist}/tracks/popular`);
                //phát bài hát đầu tiên trong danh sách nhạc của Artist
                id = data.tracks[0].id;
                localStorage.setItem("idCurrentSong", id);
                const allItems = this.shadowRoot.querySelectorAll(".artist-play-btn");
                this.handlePlayBtn(id, allItems, "idCurrentArtist", isPlaying, artistPlayBtn);
            }
            else if (card) {
                id = card.getAttribute("data-id");
                const dataTrack = await httpRequest.get(`/tracks/${id}`);
                //khi phát nhạc bên ngoài thì nút play bên trong hit-card đồng bộ trạng thái lần đầu
                isPlaying = localStorage.getItem("isPlaying");
                const idCurrentSong = localStorage.getItem("idCurrentSong");
                if ((isPlaying === "true") && (idCurrentSong === id)) this.renderTrack(dataTrack, true);
                else this.renderTrack(dataTrack, false);
            }
            else if (artistCard) {
                let idArtist = artistCard.getAttribute("data-id");
                localStorage.setItem("idCurrentArtist", idArtist);
                const data = await httpRequest.get(`/artists/${idArtist}/tracks/popular`); 
                //khi phát nhạc bên ngoài thì nút play bên trong hit-card đồng bộ trạng thái lần đầu
                isPlaying = localStorage.getItem("isPlaying");
                id = data.tracks[0].id;
                this.renderArtist(data);
            }
        })

        //khi ở bên trong mỗi card bài hát
        this.shadowRoot.addEventListener("click", async (e) => {
            //khi đang phát nhạc bài A nhưng vào renderTrack bài B
            const btnPlay = e.target.closest(".play-btn-track");
            const listBtns = this.shadowRoot.querySelectorAll(".play-btn-track"); //nút play bên trong hit card

                if (btnPlay && localStorage.getItem("idCurrentSong") !== id) {
                    isPlaying = true;
                    localStorage.setItem("idCurrentSong", id);
                    localStorage.setItem("isPlaying", true);
                    this.listenerStateChange(id, isPlaying);
                    listBtns.forEach(btn => {
                        btn.innerHTML = `<i class="fa-solid fa-pause"></i>`
                    })
                }
                else if (btnPlay && localStorage.getItem("idCurrentSong") === id) {
                    isPlaying = localStorage.getItem("isPlaying") === "true" ? true : false;
                    localStorage.setItem("idCurrentSong", id);
                    localStorage.setItem("isPlaying", !isPlaying);
                    isPlaying = !isPlaying;
                    this.listenerStateChange(id, isPlaying);
                    if (isPlaying) {
                        listBtns.forEach(btn => {
                        btn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
                        })
                    }
                    else {
                        listBtns.forEach(btn => {
                        btn.innerHTML = `<i class="fas fa-play"></i>`
                        })
                    }
                }
        })

        //khi bấm chọn vào tên của playlist ở app-main
        this.shadowRoot.addEventListener("click", async (e) => {
            const playlistNameElement = e.target.closest(".playlist-name");
            if (playlistNameElement) {
                openEditPlaylist();
            }
        })
    }           
}
customElements.define("app-main", AppMain);