import httpRequest from "../utils/httpRequest.js";

class AppSideBar extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({mode: "open"});
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
        const html = await fetch("../templates/sidebar.html").then(res => res.text());
        this.shadowRoot.innerHTML = `
        ${fontAwesomeLink}
        <style>${css}</style>
        ${html}
        `
        const libraryContent= this.shadowRoot.querySelector(".library-content");
        
        libraryContent.addEventListener("click", async (e) => {
            const item = e.target.closest(".library-item");
            //kiểm tra nếu là artist hay playlist
            const isArtist = item?.className.includes("artist");
            const isPlaylist = item?.className.includes("playlist");
            
            if (isArtist) {
                let idCurrentArtist = item.dataset.id;
                const data =  await httpRequest.get(`/artists/${idCurrentArtist}/tracks/popular`);                
                localStorage.setItem("idCurrentArtist", idCurrentArtist);
                const appMain = document.querySelector("app-main");
                if (appMain && typeof appMain.renderArtist === "function") {
                    appMain.renderArtist(data);
                }
            }
            if (isPlaylist) {
                let idCurrentPlaylist = item.dataset.id;
                localStorage.setItem("idCurrentPlaylist", idCurrentPlaylist);
                const dataPlaylist =  await httpRequest.get(`/playlists/${idCurrentPlaylist}`);
                const dataTracks = await httpRequest.get(`/playlists/${idCurrentPlaylist}/tracks`);
                const appMain = document.querySelector("app-main");
                if (appMain && typeof appMain.renderArtist === "function") {
                    appMain.renderPlaylist(dataPlaylist, dataTracks.tracks);
                }
            }
        })
    }
}
customElements.define("app-sidebar", AppSideBar);