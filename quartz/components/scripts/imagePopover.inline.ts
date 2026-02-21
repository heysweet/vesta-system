// quartz/components/scripts/imagePopover.inline.ts
// Handles interactive popover for sized images

export function enableImagePopover() {
  document.addEventListener("click", function (e) {
    const target = e.target as HTMLElement;
    if (target.tagName === "IMG" && target.dataset.interactive === "true") {
      showImagePopover(target);
    }
  });
}

function showImagePopover(img: HTMLElement) {
  const src = img.getAttribute("src");
  const alt = img.getAttribute("alt") || "";

  // Prevent background scroll
  const prevOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";

  // Create overlay
  const overlay = document.createElement("div");
  overlay.className = "image-popover-overlay";
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.background = "rgba(0,0,0,0.8)";
  overlay.style.zIndex = "9999";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";

  // Create popover image
  const popImg = document.createElement("img");
  popImg.src = src!;
  popImg.alt = alt;
  popImg.style.maxWidth = "90vw";
  popImg.style.maxHeight = "90vh";
  popImg.style.cursor = "grab";
  popImg.style.transition = "transform 0.2s";
  popImg.style.transform = "scale(1)";

  // Zoom state
  let scale = 1;

  // Zoom on overlay scroll
  overlay.addEventListener("wheel", (ev) => {
    ev.preventDefault();
    scale += ev.deltaY < 0 ? 0.1 : -0.1;
    scale = Math.max(0.5, Math.min(3, scale));
    popImg.style.transform = `scale(${scale})`;
  });

  // Pinch/scroll zoom
  popImg.addEventListener("wheel", (ev) => {
    ev.preventDefault();
    scale += ev.deltaY < 0 ? 0.1 : -0.1;
    scale = Math.max(0.5, Math.min(3, scale));
    popImg.style.transform = `scale(${scale})`;
  });

  popImg.addEventListener("touchstart", handleTouchStart, { passive: false });
  popImg.addEventListener("touchmove", handleTouchMove, { passive: false });

  let lastDistance = 0;
  function handleTouchStart(ev: TouchEvent) {
    if (ev.touches.length === 2) {
      lastDistance = getTouchDistance(ev.touches);
    }
  }
  function handleTouchMove(ev: TouchEvent) {
    if (ev.touches.length === 2) {
      ev.preventDefault();
      const dist = getTouchDistance(ev.touches);
      if (lastDistance) {
        const delta = dist - lastDistance;
        scale += delta / 200;
        scale = Math.max(0.5, Math.min(3, scale));
        popImg.style.transform = `scale(${scale})`;
      }
      lastDistance = dist;
    }
  }
  function getTouchDistance(touches: TouchList) {
    const [a, b] = [touches[0], touches[1]];
    return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  }

  // Close popover on overlay click
  overlay.addEventListener("click", (ev) => {
    if (ev.target === overlay) {
      document.body.removeChild(overlay);
      document.body.style.overflow = prevOverflow;
    }
  });

  // Reset zoom on close
  overlay.addEventListener("click", () => {
    scale = 1;
    popImg.style.transform = "scale(1)";
  });

  overlay.appendChild(popImg);
  document.body.appendChild(overlay);

  // ESC key closes overlay
  function escListener(ev: KeyboardEvent) {
    if (ev.key === "Escape") {
      if (document.body.contains(overlay)) {
        document.body.removeChild(overlay);
        document.body.style.overflow = prevOverflow;
        document.removeEventListener("keydown", escListener);
        scale = 1;
        popImg.style.transform = "scale(1)";
      }
    }
  }
  document.addEventListener("keydown", escListener);
}

// Add global style so images with data-interactive="true" show pointer cursor, indicating clickability
function setInteractiveImageCursor() {
  const style = document.createElement("style");
  style.innerHTML = '[data-interactive="true"] { cursor: pointer !important; }';
  document.head.appendChild(style);
}

// Add global style for top-right images
function setTopRightImageStyle() {
  const style = document.createElement("style");
  style.innerHTML = `
    [data-topright="true"] {
      float: right;
      margin: 0 0 1.5rem 2rem;
      margin-top: -4.2rem;
      max-width: 220px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      border-radius: 8px;
      z-index: 10;
    }
  `;
  document.head.appendChild(style);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setInteractiveImageCursor);
} else {
  setInteractiveImageCursor();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setTopRightImageStyle);
} else {
  setTopRightImageStyle();
}
