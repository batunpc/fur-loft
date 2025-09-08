document.addEventListener("DOMContentLoaded", () => {
  const isContactPage = document.querySelector(".page.contact-page");
  if (isContactPage) return;

  const footer = document.querySelector("footer");
  const explosionContainer = document.querySelector(".explosion-container");
  const footerTitle = document.querySelector("footer .footer-header h1");
  let hasExploded = false;

  const config = {
    gravity: 0.25,
    friction: 0.99,
    imageSize: window.innerWidth < 1000 ? 60 : 150, // Much smaller on mobile
    horizontalForce: window.innerWidth < 1000 ? 12 : 20, // Reduced force on mobile
    verticalForce: window.innerWidth < 1000 ? 8 : 15, // Reduced force on mobile
    rotationSpeed: window.innerWidth < 1000 ? 6 : 10, // Less rotation on mobile
    resetDelay: 500,
  };

  const imageParticleCount = window.innerWidth < 1000 ? 6 : 10; // Fewer particles on mobile
  const imagePaths = Array.from(
    { length: imageParticleCount },
    (_, i) => `/images/illustrations/${(i % 10) + 1}.png`
  );

  imagePaths.forEach((path) => {
    const img = new Image();
    img.src = path;
  });

  const createParticles = () => {
    explosionContainer.innerHTML = "";

    imagePaths.forEach((path) => {
      const particle = document.createElement("img");
      particle.src = path;
      particle.classList.add("explosion-particle-img");
      particle.style.width = `${config.imageSize}px`;
      explosionContainer.appendChild(particle);
    });
  };

  class Particle {
    constructor(element) {
      this.element = element;

      // Ensure we have valid container dimensions
      const containerWidth = explosionContainer.offsetWidth || window.innerWidth;
      const containerHeight = explosionContainer.offsetHeight || window.innerHeight;

      this.x = (Math.random() - 0.5) * containerWidth * 0.8;
      this.y = (Math.random() - 0.5) * containerHeight * 0.6;
      this.vx = (Math.random() - 0.5) * config.horizontalForce;
      this.vy = -config.verticalForce - Math.random() * 10;
      this.rotation = 0;
      this.rotationSpeed = (Math.random() - 0.5) * config.rotationSpeed;
    }

    update() {
      this.vy += config.gravity;
      this.vx *= config.friction;
      this.vy *= config.friction;
      this.rotationSpeed *= config.friction;

      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotationSpeed;

      this.element.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${this.rotation}deg)`;
    }
  }

  const explode = (allowMultiple = false) => {
    console.log("Explode function called", { hasExploded, allowMultiple }); // Debug log
    if (hasExploded && !allowMultiple) return;
    if (!allowMultiple) hasExploded = true;

    createParticles();
    console.log("Particles created, container:", explosionContainer); // Debug log

    const particleElements = document.querySelectorAll(
      ".explosion-particle-img"
    );
    const particles = Array.from(particleElements).map(
      (element) => new Particle(element)
    );

    let animationId;

    const animate = () => {
      particles.forEach((particle) => particle.update());
      animationId = requestAnimationFrame(animate);

      if (
        particles.every(
          (particle) => particle.y > explosionContainer.offsetHeight / 2
        )
      ) {
        cancelAnimationFrame(animationId);
      }
    };

    animate();
  };

  const checkFooterPosition = () => {
    const footerRect = footer.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    if (footerRect.top > viewportHeight + 100) {
      hasExploded = false;
    }

    if (!hasExploded && footerRect.top <= viewportHeight + 250) {
      explode();
    }
  };

  let checkTimeout;
  const isMobile = window.innerWidth <= 1000;
  const throttleDelay = isMobile ? 16 : 5; // 16ms (~60fps) for mobile, 5ms for desktop
  
  window.addEventListener("scroll", () => {
    clearTimeout(checkTimeout);
    checkTimeout = setTimeout(checkFooterPosition, throttleDelay);
  });

  window.addEventListener("resize", () => {
    hasExploded = false;
  });

  // Add click and touch events to footer title
  if (footerTitle) {
    const handleInteraction = (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("Footer title clicked/touched"); // Debug log
      explode(true); // Allow multiple explosions on click
    };

    footerTitle.addEventListener("click", handleInteraction);
    footerTitle.addEventListener("touchstart", handleInteraction);
    footerTitle.addEventListener("touchend", handleInteraction);

    // Ensure the element is interactive on mobile
    footerTitle.style.touchAction = "manipulation";
    footerTitle.style.webkitTouchCallout = "none";
  }

  createParticles();
  setTimeout(checkFooterPosition, 500);
});
