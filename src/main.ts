import "./styles.css";
import { parsePath } from "./app/router";
import { setMeta } from "./app/html";
import { site } from "./site";
import { renderBoot, unbindBoot } from "./ui/boot";
import { renderProfessional } from "./ui/professional";

const app = document.querySelector<HTMLDivElement>("#app")!;
const onekoScriptSrc = "https://cdn.jsdelivr.net/gh/adryd325/oneko.js@main/oneko.js";
const onekoSpriteSrc = "https://cdn.jsdelivr.net/gh/adryd325/oneko.js@main/oneko.gif";

function mountOneko(): void {
  if (document.querySelector("#oneko, script[data-oneko]")) return;
  const script = document.createElement("script");
  script.src = onekoScriptSrc;
  script.async = true;
  script.dataset.oneko = "true";
  script.dataset.cat = onekoSpriteSrc;
  script.dataset.persistPosition = "false";
  document.body.append(script);
}

function unmountOneko(): void {
  document.querySelector("#oneko")?.remove();
  document.querySelector("script[data-oneko]")?.remove();
}

function mount(): void {
  const route = parsePath(location.pathname);

  if (route.name === "boot") {
    unmountOneko();
    setMeta(`${site.name} — boot`, "Choose a destination.");
    renderBoot(app);
    return;
  }

  unbindBoot(app);
  renderProfessional(app, route);
  mountOneko();
}

window.addEventListener("popstate", mount);
mount();
