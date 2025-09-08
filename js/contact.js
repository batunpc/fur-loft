document.addEventListener("DOMContentLoaded", () => {
  const isContactPage = document.querySelector(".page.contact-page");
  if (!isContactPage) return;

  const container = document.querySelector(".trail-container");
  let isDesktop = window.innerWidth > 1000;
  let animationId = null;
  let mouseMoveListener = null;

  const config = {
    imageCount: isDesktop ? 10 : 6, // Fewer images on mobile
    imageLifespan: isDesktop ? 750 : 500, // Shorter lifespan on mobile
    removalDelay: isDesktop ? 50 : 100, // Slower removal on mobile
    mouseThreshold: isDesktop ? 100 : 80, // Lower threshold on mobile
    inDuration: isDesktop ? 750 : 400, // Faster animation on mobile
    outDuration: isDesktop ? 1000 : 600, // Faster out animation on mobile
    inEasing: "cubic-bezier(.07,.5,.5,1)",
    outEasing: "cubic-bezier(.87, 0, .13, 1)",
    imageSize: isDesktop ? 150 : 80, // Smaller images on mobile
  };

  const images = Array.from(
    { length: config.imageCount },
    (_, i) => `/images/illustrations/${i + 1}.png`
  );
  const trail = [];

  let mouseX = 0,
    mouseY = 0,
    lastMouseX = 0,
    lastMouseY = 0;
  let isCursorInContainer = false;
  let lastRemovalTime = 0;

  const isInContainer = (x, y) => {
    const rect = container.getBoundingClientRect();
    return (
      x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
    );
  };

  const hasMovedEnough = () => {
    const distance = Math.sqrt(
      Math.pow(mouseX - lastMouseX, 2) + Math.pow(mouseY - lastMouseY, 2)
    );
    return distance > config.mouseThreshold;
  };

  const createImage = () => {
    const img = document.createElement("img");
    img.classList.add("trail-img");

    const randomIndex = Math.floor(Math.random() * images.length);
    const rotation = (Math.random() - 0.5) * 50;
    img.src = images[randomIndex];

    const rect = container.getBoundingClientRect();
    const relativeX = mouseX - rect.left;
    const relativeY = mouseY - rect.top;

    img.style.left = `${relativeX}px`;
    img.style.top = `${relativeY}px`;
    img.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(0)`;
    img.style.transition = `transform ${config.inDuration}ms ${config.inEasing}`;

    container.appendChild(img);

    setTimeout(() => {
      img.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(1)`;
    }, 10);

    trail.push({
      element: img,
      rotation: rotation,
      removeTime: Date.now() + config.imageLifespan,
    });
  };

  const removeOldImages = () => {
    const now = Date.now();

    if (now - lastRemovalTime < config.removalDelay || trail.length === 0)
      return;

    const oldestImage = trail[0];
    if (now >= oldestImage.removeTime) {
      const imgToRemove = trail.shift();

      imgToRemove.element.style.transition = `transform ${config.outDuration}ms ${config.outEasing}`;
      imgToRemove.element.style.transform = `translate(-50%, -50%) rotate(${imgToRemove.rotation}deg) scale(0)`;

      lastRemovalTime = now;

      setTimeout(() => {
        if (imgToRemove.element.parentNode) {
          imgToRemove.element.parentNode.removeChild(imgToRemove.element);
        }
      }, config.outDuration);
    }
  };

  const startAnimation = () => {
    // Handle both desktop mouse and mobile touch events
    mouseMoveListener = (e) => {
      // Handle both mouse and touch events
      const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
      const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);

      mouseX = clientX;
      mouseY = clientY;
      isCursorInContainer = isInContainer(mouseX, mouseY);

      if (isCursorInContainer && hasMovedEnough()) {
        lastMouseX = mouseX;
        lastMouseY = mouseY;
        createImage();
      }
    };

    // Add both mouse and touch event listeners
    document.addEventListener("mousemove", mouseMoveListener);
    if (!isDesktop) {
      document.addEventListener("touchmove", mouseMoveListener, { passive: true });
      document.addEventListener("touchstart", mouseMoveListener, { passive: true });
    }

    const animate = () => {
      removeOldImages();
      animationId = requestAnimationFrame(animate);
    };
    animate();
  };

  const stopAnimation = () => {
    if (mouseMoveListener) {
      document.removeEventListener("mousemove", mouseMoveListener);
      document.removeEventListener("touchmove", mouseMoveListener);
      document.removeEventListener("touchstart", mouseMoveListener);
      mouseMoveListener = null;
    }

    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }

    trail.forEach((item) => {
      if (item.element.parentNode) {
        item.element.parentNode.removeChild(item.element);
      }
    });
    trail.length = 0;
  };

  const handleResize = () => {
    const wasDesktop = isDesktop;
    isDesktop = window.innerWidth > 1000;

    // Restart animation with new config when switching between desktop/mobile
    if (wasDesktop !== isDesktop) {
      stopAnimation();
      // Update config for new screen size
      Object.assign(config, {
        imageCount: isDesktop ? 10 : 6,
        imageLifespan: isDesktop ? 750 : 500,
        removalDelay: isDesktop ? 50 : 100,
        mouseThreshold: isDesktop ? 100 : 80,
        inDuration: isDesktop ? 750 : 400,
        outDuration: isDesktop ? 1000 : 600,
        imageSize: isDesktop ? 150 : 80,
      });
      startAnimation();
    }
  };

  window.addEventListener("resize", handleResize);

  // Start animation for both desktop and mobile
  startAnimation();
});
