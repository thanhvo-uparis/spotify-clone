import httpRequest from "../utils/httpRequest.js";
import {getPlaylist} from "../utils/utils.js";

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

        //khi chọn xem artist/playlist => hiện trang detail của artist/playlist tương ứng
        const libraryContent= this.shadowRoot.querySelector(".library-content");
        libraryContent.addEventListener("click", async (e) => {
            const item = e.target.closest(".library-item");
            const allItems = this.shadowRoot.querySelectorAll(".library-item");
            //kiểm tra nếu là artist hay playlist
            const isArtist = item?.className.includes("artist");
            const isPlaylist = item?.className.includes("playlist");
            if (item) {
                allItems.forEach(item => item.classList.remove("active"))
                item.classList.add("active");
            }
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
                console.log(idCurrentPlaylist);
                
                const dataPlaylist =  await httpRequest.get(`/playlists/${idCurrentPlaylist}`, {requiresAuth: true});
                const dataTracks = await httpRequest.get(`/playlists/${idCurrentPlaylist}/tracks`, {requiresAuth: true});
                const appMain = document.querySelector("app-main");
                if (appMain && typeof appMain.renderPlaylist === "function") {
                    appMain.renderPlaylist(dataPlaylist, dataTracks.tracks);
                }
            }
        })

        //when create new playlist
        const btnCreate = this.shadowRoot.querySelector(".create-btn");
        // const userCurrent = await httpRequest.get("/users/me", {requiresAuth: true});
        btnCreate.addEventListener("click", async (e) => {
            const appMain = document.querySelector("app-main");
            if (appMain && typeof appMain.createPlaylist === "function") {
                await appMain.createPlaylist();
                const libraryContent = this.shadowRoot.querySelector(".library-content");
                libraryContent.innerHTML = "";
                await getPlaylist(); //dùng await để đảm bảo render xong trước khi truy vấn DOM

                //lấy phần tử item đầu tiên (chính là playlist mới tạo)
                const libraryItem = this.shadowRoot.querySelector(".library-item");
                libraryItem.click(); //giả sử như click vào playlist mới tạo
            }
        })
    }
}
customElements.define("app-sidebar", AppSideBar);