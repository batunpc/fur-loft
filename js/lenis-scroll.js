import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

document.addEventListener("DOMContentLoaded", () => {
  let isMobile = window.innerWidth <= 900;
  
  // Disable smooth scrolling on very low-end devices for better performance
  const isLowEndDevice = isMobile && (
    navigator.hardwareConcurrency <= 2 || 
    navigator.deviceMemory <= 2
  );

  const scrollSettings = isMobile
    ? {
        duration: 1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: "vertical",
        gestureDirection: "vertical",
        smooth: true,
        smoothTouch: false, // Disable smooth touch to prevent trembling
        touchMultiplier: 1,
        infinite: false,
        lerp: 0.1, // Increased for smoother performance
        wheelMultiplier: 1,
        orientation: "vertical",
        smoothWheel: false, // Disable smooth wheel on mobile
        syncTouch: false, // Disable sync touch to prevent conflicts
      }
    : {
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: "vertical",
        gestureDirection: "vertical",
        smooth: true,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
        lerp: 0.1,
        wheelMultiplier: 1,
        orientation: "vertical",
        smoothWheel: true,
        syncTouch: true,
      };

  let lenis;
  
  // Skip Lenis initialization on very low-end devices
  if (!isLowEndDevice) {
    lenis = new Lenis(scrollSettings);

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
  }

  gsap.ticker.lagSmoothing(0);

  const handleResize = () => {
    const wasMobile = isMobile;
    isMobile = window.innerWidth <= 900;

    if (wasMobile !== isMobile && lenis) {
      lenis.destroy();

      const newScrollSettings = isMobile
        ? {
            duration: 1,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: "vertical",
            gestureDirection: "vertical",
            smooth: true,
            smoothTouch: false, // Disable smooth touch to prevent trembling
            touchMultiplier: 1,
            infinite: false,
            lerp: 0.1, // Increased for smoother performance
            wheelMultiplier: 1,
            orientation: "vertical",
            smoothWheel: false, // Disable smooth wheel on mobile
            syncTouch: false, // Disable sync touch to prevent conflicts
          }
        : {
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: "vertical",
            gestureDirection: "vertical",
            smooth: true,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
            lerp: 0.1,
            wheelMultiplier: 1,
            orientation: "vertical",
            smoothWheel: true,
            syncTouch: true,
          };

      lenis = new Lenis(newScrollSettings);
      lenis.on("scroll", ScrollTrigger.update);
    }
  };

  window.addEventListener("resize", handleResize);
});
