// import "regenerator-runtime"

let titleElement: HTMLElement | null = null;
let originalTitle: string;
let translatedTitle: string;
let showingTranslated = true;

async function load() {
    if (!titleElement) {
        return;
    }

    titleElement.innerText = translatedTitle;
    titleElement.style.color = "";
    titleElement.style.cursor = "";
    titleElement.onclick = null;

    const data = await fetch(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(location.href)}`).then(o => o.json());
    originalTitle = data.title;

    if (originalTitle !== translatedTitle) {
        titleElement.innerText = originalTitle;
        titleElement.style.color = "rgb(164, 221, 255)";
        titleElement.style.cursor = "pointer";
        titleElement.onclick = e => {
            if (!e.altKey) {
                titleElement!.innerText = showingTranslated ? translatedTitle : originalTitle;
                showingTranslated = !showingTranslated;
            }
        }
    }
}

const getScriptTag = () => document.getElementById("scriptTag")?.innerText;

let currentScriptTag: string | undefined;
setInterval(() => {
    if (getScriptTag() != currentScriptTag) {
        currentScriptTag = getScriptTag();

        if (location.pathname === "/watch" && currentScriptTag) {
            translatedTitle = JSON.parse(currentScriptTag).name;
            refresh();
        }
    }
}, 300);

function refresh() {
    const params = new URLSearchParams(location.search);

    if (params.has("v")) {
        titleElement = document.querySelector<HTMLElement>("h1.title > *");
        if (titleElement) {
            showingTranslated = true;
            load();
        } else {
            setTimeout(refresh, 100);
        }
    }
}