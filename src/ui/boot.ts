import { navigate } from "../app/router";

const nekowebUrl = "https://zepredos.nekoweb.org/";

export function renderBoot(root: HTMLElement): void {
  root.innerHTML = `
    <div class="boot">
      <section class="grub" aria-label="GRUB mode select">
        <p class="grub-title">GNU GRUB version 2.67</p>
        <div class="grub-menu" role="menu" aria-label="Boot entries">
          <button type="button" role="menuitem" tabindex="-1" data-destination="main" class="selected">zep's website</button>
          <button type="button" role="menuitem" tabindex="-1" data-destination="nekoweb">zep's nekoweb website</button>
        </div>
        <p class="grub-help">Use the ↑ and ↓ keys to select which entry is highlighted.<br />Press enter to boot the selected destination.</p>
      </section>
    </div>
  `;

  const buttons = [...root.querySelectorAll<HTMLButtonElement>("button[data-destination]")];
  const select = (index: number) => buttons.forEach((btn, i) => btn.classList.toggle("selected", i === index));
  const boot = (destination?: string) => {
    if (destination === "nekoweb") {
      window.location.assign(nekowebUrl);
      return;
    }
    navigate("/main");
  };
  const bootSelected = () => {
    const selected = buttons.find((btn) => btn.classList.contains("selected")) ?? buttons[0];
    boot(selected.dataset.destination);
  };

  const onKey = (event: KeyboardEvent) => {
    const current = buttons.findIndex((btn) => btn.classList.contains("selected"));
    if (event.key === "ArrowDown") {
      event.preventDefault();
      select((current + 1) % buttons.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      select((current - 1 + buttons.length) % buttons.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      bootSelected();
    }
  };

  buttons.forEach((button) => {
    button.addEventListener("pointerup", (event) => {
      if (event.pointerType !== "touch") return;
      event.preventDefault();
      boot(button.dataset.destination);
    });
  });

  window.addEventListener("keydown", onKey);
  (root as HTMLElement & { _bootKey?: (event: KeyboardEvent) => void })._bootKey = onKey;
}

export function unbindBoot(root: HTMLElement): void {
  const key = (root as HTMLElement & { _bootKey?: (event: KeyboardEvent) => void })._bootKey;
  if (key) window.removeEventListener("keydown", key);
}
