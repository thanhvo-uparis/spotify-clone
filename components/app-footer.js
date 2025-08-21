import httpRequest from "../utils/httpRequest.js";

class AppFooter extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({mode: "open"});
    }

    updatePlayerLeft(dataSong, playerLeft) {
        playerLeft.innerHTML = `
            <img
                src="${dataSong.image_url}?height=56&width=56"
                alt="Current track"
                class="player-image"
            />
            <div class="player-info">
                <div class="player-title">
                    ${dataSong.title}
                </div>
                <div class="player-artist">${dataSong.artist_name}</div>
            </div>
            <button class="add-btn">
                <i class="fa-solid fa-plus"></i>
            </button>
        `;
    }

    async connectedCallback() {
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
        const html = await fetch("../templates/footer.html").then(res => res.text());
        this.shadowRoot.innerHTML = `
        ${fontAwesomeLink}
        <style>${css}</style>
        ${html}
        `
        //get state initial
        const dataSong = await httpRequest.get(`/tracks/${localStorage.getItem("idCurrentSong")}`);
        const audioElement = this.shadowRoot.querySelector(".audioPlayer");
        audioElement.setAttribute("src", `${dataSong.audio_url}`);
        
        const playerLeft = this.shadowRoot.querySelector(".player-left");
        const playBtn = this.shadowRoot.querySelector(".play-btn");
        this.updatePlayerLeft(dataSong, playerLeft)
        //sự kiện khi bấm nút play ở footer
        playBtn.addEventListener("click", async (e) => {
            let isPlaying = localStorage.getItem("isPlaying") === "true" ? true : false;
            localStorage.setItem("isPlaying", !isPlaying);
            isPlaying = !isPlaying;
            if (isPlaying) {
                audioElement.play();
                playBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`
            }
            else {
                audioElement.pause();
                playBtn.innerHTML = `<i class="fas fa-play"></i>`;
            }
        })

        //lắng nghe sự kiện play/pause nhạc ở app-main
        window.addEventListener("playerStateChanged", async (e) => {
            const {isPlaying, idCurrentSong} = e.detail;
            
            if (idCurrentSong) {
                const dataSong = await httpRequest.get(`/tracks/${idCurrentSong}`);
                audioElement.setAttribute("src", `${dataSong.audio_url}`);
                const playerLeft = this.shadowRoot.querySelector(".player-left");
                this.updatePlayerLeft(dataSong, playerLeft)
            }
            if (isPlaying) {
                audioElement.play();
                playBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
            }
            else {
                audioElement.pause();
                playBtn.innerHTML = `<i class="fas fa-play"></i>`;
            }
        })
    }
}
customElements.define("app-footer", AppFooter);