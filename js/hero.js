import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

document.addEventListener("DOMContentLoaded", () => {
  const isHomePage = document.querySelector(".page.home-page");
  if (!isHomePage) return;

  gsap.registerPlugin(ScrollTrigger);

  let scrollTriggerInstances = [];
  let statsAnimationPlayed = false;
  let imageAnimationsPlayed = new Set();

  const initAnimations = () => {
    scrollTriggerInstances.forEach((instance) => {
      if (instance) instance.kill();
    });
    scrollTriggerInstances = [];

    const isMobile = window.innerWidth <= 1000;

    // Skip stats animation entirely on mobile
    if (!isMobile) {
      // Set initial state for stats items (Our Process cards) only if not played
      if (!statsAnimationPlayed) {
        gsap.set([".home-page .stats-item-1", ".home-page .stats-item-2", ".home-page .stats-item-3"], {
          scale: 0,
        });
      }

      // Gradual animation for Our Process section
      const statsAnimation = gsap.to(
        [".home-page .stats-item-1", ".home-page .stats-item-2", ".home-page .stats-item-3"],
        {
          scale: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".home-page .stats",
            start: "top 50%",
            toggleActions: "play none none none",
            onStart: () => {
              statsAnimationPlayed = true;
            }
          },
        }
      );
      scrollTriggerInstances.push(statsAnimation.scrollTrigger);
    } else {
      // On mobile, ensure stats items are visible by default
      gsap.set([".home-page .stats-item-1", ".home-page .stats-item-2", ".home-page .stats-item-3"], {
        scale: 1,
      });
    }

    // Handle inline images in About Us section
    const inlineImages = document.querySelectorAll(".inline-img");

    if (!isMobile) {
      // Desktop: Use animations
      inlineImages.forEach((img, index) => {
        if (!imageAnimationsPlayed.has(index)) {
          gsap.set(img, {
            width: 0,
          });
        }
      });

      // Animate inline images in About Us section
      inlineImages.forEach((img, index) => {
        if (imageAnimationsPlayed.has(index)) return;

        // Create a temporary image to get natural dimensions
        const tempImg = new Image();
        tempImg.onload = function() {
          const targetWidth = 90; // Desktop width

          const imageAnimation = gsap.to(img, {
            width: `${targetWidth}px`,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: img,
              start: "top 90%",
              toggleActions: "play none none none",
              onStart: () => {
                imageAnimationsPlayed.add(index);
              }
            },
          });
          scrollTriggerInstances.push(imageAnimation.scrollTrigger);
        };
        tempImg.src = img.src;
      });
    } else {
      // Mobile: No animation, set static width
      inlineImages.forEach((img) => {
        gsap.set(img, {
          width: "45px", // Static mobile width
        });
      });
    }
  };

  initAnimations();

  window.addEventListener("resize", () => {
    initAnimations();
  });
});
