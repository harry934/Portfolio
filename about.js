// about.js
document.addEventListener('DOMContentLoaded', () => {
  // --- Data Configuration ---
  // Modify or add items here up to 10. 
  // Make sure to replace the placeholder "src" links with your actual image paths from assets/img
  const aboutData = [
   {
  name: "Harry Otieno Mokaya",
  designation: "Software & DevOps Engineer",
  quote: "I'm a Software Engineer from Nairobi with roots in Migori County. I enjoy building digital products and exploring different areas of technology. For me, the best part is turning ideas into something real that people can interact with and benefit from.",
  src: "assets/img/chillen.webp"
},
{
  name: "Networking",
  designation: "Open to Opportunities",
  quote: "I enjoy meeting people, exchanging ideas, and collaborating on projects that challenge me to grow. If you're building something meaningful or just want to connect, I’d be glad to have the conversation.",
  src: "assets/img/nss.webp"
},
{
  name: "Building Solutions",
  designation: "Problem Solver",
  quote: "I really enjoy solving real-world problems through technology. Whether it's designing systems, developing platforms, or improving existing ideas, I like the process of taking something from concept to a working solution that creates actual value.",
  src: "assets/img/IoT.webp"
},
{
  name: "Beyond Coding",
  designation: "Nature & Adventure",
  quote: "When I'm away from the screen, I enjoy taking walks, spending time outdoors, and exploring new places. I enjoy nature, adventure, and moments that help me reset, stay inspired, and enjoy life beyond technology.",
  src: "assets/img/pfp1.webp"
},
{
  name: "Gym & Discipline",
  designation: "Fitness Lifestyle",
  quote: "Outside tech, I spend time in the gym and genuinely enjoy training. Fitness has taught me consistency, discipline, and showing up even when motivation isn’t there. I try to carry those qualities into my projects and personal growth as well.",
  src: "assets/img/gym.webp"
},
{
  name: "Always Improving",
  designation: "Continuous Learning",
  quote: "Technology changes quickly, and I enjoy keeping up through projects, experimentation, and learning new approaches. I see growth as an ongoing process and always try to leave every project knowing more than when I started.",
  src: "assets/img/tech.webp"
}
  ];

  // --- DOM Elements ---
  const imageContainer = document.getElementById('about-image-container');
  const nameEl = document.getElementById('about-name');
  const designationEl = document.getElementById('about-designation');
  const quoteEl = document.getElementById('about-quote');
  const textContainer = document.getElementById('about-text-container');
  const prevBtn = document.getElementById('about-prev-btn');
  const nextBtn = document.getElementById('about-next-btn');

  // Verify all elements exist before proceeding
  if (!imageContainer || !textContainer || !prevBtn || !nextBtn) return;

  // --- State ---
  let activeIndex = 0;
  let containerWidth = imageContainer.offsetWidth || 1200;
  const length = aboutData.length;

  // --- Initialization ---
  // Create and append images
  aboutData.forEach((item, index) => {
    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.name;
    img.className = 'about-image';
    img.dataset.index = index;
    // Preload image to avoid pop-in
    img.loading = 'eager';
    imageContainer.appendChild(img);
  });

  const images = document.querySelectorAll('.about-image');

  // --- Helpers ---
  function calculateGap(width) {
    const minWidth = 1024;
    const maxWidth = 1456;
    const minGap = 60;
    const maxGap = 86;
    if (width <= minWidth) return minGap;
    if (width >= maxWidth) return Math.max(minGap, maxGap + 0.06018 * (width - maxWidth));
    return minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth));
  }

  function updateLayout() {
    containerWidth = imageContainer.offsetWidth || 1200;
    const gap = calculateGap(containerWidth);
    const maxStickUp = gap * 0.8;

    images.forEach((img, index) => {
      // Clean previous state
      img.classList.remove('is-active', 'is-left', 'is-right', 'is-far-left', 'is-far-right');
      img.style.transform = ''; 

      // Calculate relative positions
      const isLeft = (activeIndex - 1 + length) % length === index;
      const isRight = (activeIndex + 1) % length === index;
      const isFarLeft = length > 4 && (activeIndex - 2 + length) % length === index;
      const isFarRight = length > 4 && (activeIndex + 2) % length === index;
      const isActive = index === activeIndex;

      // Apply appropriate styles replicating the Framer Motion transforms
      if (isActive) {
        img.classList.add('is-active');
      } else if (isLeft) {
        img.classList.add('is-left');
        img.style.transform = `translateX(-${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(15deg)`;
      } else if (isRight) {
        img.classList.add('is-right');
        img.style.transform = `translateX(${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(-15deg)`;
      } else if (isFarLeft) {
        img.classList.add('is-far-left');
        img.style.transform = `translateX(-${gap * 1.5}px) translateY(-${maxStickUp}px) scale(0.7) rotateY(30deg)`;
      } else if (isFarRight) {
        img.classList.add('is-far-right');
        img.style.transform = `translateX(${gap * 1.5}px) translateY(-${maxStickUp}px) scale(0.7) rotateY(-30deg)`;
      }
    });
  }

  function renderContent() {
    const item = aboutData[activeIndex];

    // Trigger exit animation (mirrors framer-motion 'exit' variant)
    textContainer.style.opacity = '0';
    textContainer.style.transform = 'translateY(20px)';
    
    // Wait for exit transition to complete before swapping content
    setTimeout(() => {
      nameEl.textContent = item.name;
      designationEl.textContent = item.designation;
      
      // Clear quote and append animated spans
      quoteEl.innerHTML = '';
      const words = item.quote.split(' ');
      words.forEach((word, i) => {
        const span = document.createElement('span');
        // Add non-breaking space for correct layout
        span.textContent = word + '\u00A0';
        span.className = 'about-word';
        // Delay corresponds to framer-motion: delay: 0.025 * i
        span.style.animationDelay = `${i * 0.025}s`;
        quoteEl.appendChild(span);
      });

      // Trigger enter animation (mirrors framer-motion 'animate' variant)
      textContainer.style.opacity = '1';
      textContainer.style.transform = 'translateY(0)';
    }, 300); // 300ms matches the CSS transition duration
  }

  // --- Handlers ---
  function handleNext() {
    activeIndex = (activeIndex + 1) % length;
    updateLayout();
    renderContent();
  }

  function handlePrev() {
    activeIndex = (activeIndex - 1 + length) % length;
    updateLayout();
    renderContent();
  }

  // --- Event Listeners ---
  nextBtn.addEventListener('click', handleNext);
  prevBtn.addEventListener('click', handlePrev);

  // Touch swipe navigation for mobile
  let touchStartX = 0;
  const swipeThreshold = 40;

  imageContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  imageContainer.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) < swipeThreshold) return;
    if (diff < 0) {
      handleNext(); // swipe left → next
    } else {
      handlePrev(); // swipe right → prev
    }
    // Prevent global page-swipe handler from also firing
    e.stopPropagation();
  }, { passive: true });

  // Resize observer to recalculate gaps responsively
  window.addEventListener('resize', () => {
    requestAnimationFrame(updateLayout);
  });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    // Only handle arrow keys if the section is in viewport to prevent page jumping
    const section = document.getElementById('about');
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const inViewport = rect.top < window.innerHeight && rect.bottom >= 0;
    
    if (inViewport) {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    }
  });

  // --- Start ---
  updateLayout();
  renderContent();
});
