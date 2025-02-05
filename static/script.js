document.addEventListener("DOMContentLoaded", () => {
    initHeroSlider();
    initGallery();
    initNavigation();
    initBookNow();
    initCarousel();
    initVideoPlayer();
    initDonationProgress();
    initPawPrints();
});

/** -------------------------------
 *  HERO SLIDER: Fetch and cycle hero images
 *  -------------------------------- */
function initHeroSlider() {
    let slideIndex = 0;
    let heroImages = [];

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    async function fetchHeroImages() {
        try {
            const response = await fetch('http://ec2-98-80-34-138.compute-1.amazonaws.com:8080/hero-images');
            heroImages = await response.json();
            if (heroImages.length > 0) {
                shuffleArray(heroImages);
                updateHeroImage(0);
            }
        } catch (error) {
            console.error("Error fetching hero images:", error);
        }
    }

    function updateHeroImage(index) {
        document.querySelector('.hero').style.backgroundImage = `url(${heroImages[index]})`;
    }

    setInterval(() => {
        if (heroImages.length > 0) {
            slideIndex = (slideIndex + 1) % heroImages.length;
            updateHeroImage(slideIndex);
        }
    }, 5000);

    fetchHeroImages();
}

/** -------------------------------
 *  GALLERY: Load thumbnails dynamically
 *  -------------------------------- */
function initGallery() {
    async function fetchGalleryImages() {
        try {
            const response = await fetch('http://ec2-98-80-34-138.compute-1.amazonaws.com:8080/gallery-images');
            return await response.json();
        } catch (error) {
            console.error("Error fetching gallery images:", error);
            return [];
        }
    }

    function populateGallery(images) {
        const mainGallery = document.querySelector('.gallery-main');
        const thumbnailContainer = document.querySelector('.gallery-thumbnails');

        if (images.length > 0) {
            mainGallery.style.backgroundImage = `url(${images[0]})`;

            images.forEach((imageUrl) => {
                const thumbnail = document.createElement('img');
                thumbnail.src = imageUrl;
                thumbnail.alt = "Thumbnail";
                thumbnail.classList.add('thumbnail-image');
                thumbnail.addEventListener('click', () => mainGallery.style.backgroundImage = `url(${imageUrl})`);
                thumbnailContainer.appendChild(thumbnail);
            });
        }
    }

    fetchGalleryImages().then(populateGallery);
}

/** -------------------------------
 *  NAVIGATION MENU: Toggle visibility
 *  -------------------------------- */
function initNavigation() {
    const menuToggle = document.getElementById("menu-toggle");
    const navigation = document.querySelector(".navigation");
    const overlay = document.createElement("div");

    overlay.classList.add("overlay");
    document.body.appendChild(overlay);

    function toggleMenu() {
        navigation.classList.toggle("show");
        overlay.classList.toggle("show");
        menuToggle.classList.toggle("active");
    }

    if (menuToggle && navigation) {
        menuToggle.addEventListener("click", toggleMenu);
        overlay.addEventListener("click", toggleMenu);
        document.querySelectorAll(".navigation a").forEach(link =>
            link.addEventListener("click", toggleMenu)
        );
    }
}

/** -------------------------------
 *  BOOK NOW BUTTON: Scroll to booking section
 *  -------------------------------- */
function initBookNow() {
    const bookNowButton = document.querySelector(".book-now");
    if (bookNowButton) {
        bookNowButton.addEventListener("click", () => {
            document.getElementById("bookings")?.scrollIntoView({ behavior: "smooth" });
        });
    }
}

/** -------------------------------
 *  CAROUSEL: Horizontal scrolling
 *  -------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    initCarousel(".adopt-scroll", ".adopt-panel", ".carousel-btn.left", ".carousel-btn.right");
});

/**
 * Initializes a horizontal scrolling carousel with drag support and arrow navigation.
 * @param {string} scrollContainerSelector - Selector for the scrollable container.
 * @param {string} panelSelector - Selector for the individual panels inside the carousel.
 * @param {string} leftBtnSelector - Selector for the left scroll button.
 * @param {string} rightBtnSelector - Selector for the right scroll button.
 */
function initCarousel(scrollContainerSelector, panelSelector, leftBtnSelector, rightBtnSelector) {
    const scrollContainer = document.querySelector(scrollContainerSelector);
    const panels = Array.from(document.querySelectorAll(panelSelector));
    const leftBtn = document.querySelector(leftBtnSelector);
    const rightBtn = document.querySelector(rightBtnSelector);

    if (!scrollContainer || panels.length === 0 || !leftBtn || !rightBtn) {
        console.error("Carousel elements not found. Initialization failed.");
        return;
    }

    let isDragging = false;
    let startX = 0;
    let scrollLeft;
    const panelWidth = panels[0].offsetWidth + 40; // Panel width including margin

    // Click & Drag Scrolling
    scrollContainer.addEventListener("mousedown", (e) => {
        isDragging = true;
        startX = e.pageX - scrollContainer.getBoundingClientRect().left;
        scrollLeft = scrollContainer.scrollLeft;
        scrollContainer.style.cursor = "grabbing";
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    });

    function onMouseMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollContainer.getBoundingClientRect().left;
        const walk = (x - startX) * 2; // Adjust scrolling speed
        scrollContainer.scrollLeft = scrollLeft - walk;
    }

    function onMouseUp() {
        isDragging = false;
        scrollContainer.style.cursor = "grab";
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
    }

    // Prevent text selection while dragging
    scrollContainer.addEventListener("dragstart", (e) => e.preventDefault());

    // Update button states based on scroll position
    function updateButtonState() {
        leftBtn.disabled = scrollContainer.scrollLeft <= 0;
        rightBtn.disabled = scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth;
    }

    // Listen for scroll changes to update button states
    scrollContainer.addEventListener("scroll", updateButtonState);

    // Arrow Button Clicks - Prevent Over-scrolling
    rightBtn.addEventListener("click", () => scrollByPanel(1));
    leftBtn.addEventListener("click", () => scrollByPanel(-1));

    function scrollByPanel(direction) {
        scrollContainer.scrollBy({ left: panelWidth * direction, behavior: "smooth" });

        // Delay update to ensure accurate state
        setTimeout(updateButtonState, 300);
    }

    // Initialize button states on load
    updateButtonState();
}

/** -------------------------------
 *  VIDEO PLAYER: Change video source
 *  -------------------------------- */
function initVideoPlayer() {
    document.querySelectorAll(".video-thumbnail").forEach(thumbnail => {
        thumbnail.addEventListener("click", () => {
            const video = document.getElementById("main-video");
            video.src = thumbnail.dataset.video;
            video.play();
        });
    });
}

/** -------------------------------
 *  DONATION PROGRESS: Update on click
 *  -------------------------------- */
function initDonationProgress() {
    let progress = 40;
    document.querySelector(".donate-btn")?.addEventListener("click", () => {
        progress = Math.min(progress + 20, 100);
        document.getElementById("donation-progress").value = progress;
    });
}

/** -------------------------------
 *  PAW PRINTS: Appear randomly on scroll
 *  -------------------------------- */
let lastScrollY = 0; // Track last scroll position
let ticking = false; // Prevent excessive function calls

function addPawPrints() {
    lastScrollY = window.scrollY; // Get current scroll position

    // Random chance to reduce excessive prints
    if (Math.random() > 0.1) {
        ticking = false;
        return;
    }

    const pawPrint = document.createElement("div");
    pawPrint.classList.add("paw-print");

    // Set random X position across the screen
    const xPosition = Math.random() * window.innerWidth;

    // Y position set directly at the scroll position (prevents lag)
    const yPosition = lastScrollY + Math.random() * window.innerHeight * 0.8;

    pawPrint.style.left = `${xPosition}px`;
    pawPrint.style.top = `${yPosition}px`;

    document.body.appendChild(pawPrint);

    // Remove paw print after animation to avoid clutter
    setTimeout(() => {
        pawPrint.remove();
    }, 2500);

    ticking = false; // Allow the next requestAnimationFrame call
}

// Optimize scrolling event handling
document.addEventListener("scroll", () => {
    if (!ticking) {
        requestAnimationFrame(addPawPrints);
        ticking = true;
    }
});

// Typewriter effect when section-content scrolls into view
document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll(".section-content");

    sections.forEach(section => {
        const paragraphs = section.querySelectorAll("p");

        paragraphs.forEach(paragraph => {
            if (paragraph.innerText.trim() !== "") {
                const text = paragraph.innerText;
                paragraph.innerHTML = ""; // Clear original text but keep structure

                text.split("").forEach((char, index) => {
                    const span = document.createElement("span");
                    span.textContent = char;
                    span.style.opacity = "0";
                    span.style.display = "inline-block";
                    span.style.transform = "translateY(10px)";
                    span.style.transition = `opacity 0.3s ease-in-out ${index * 50}ms, transform 0.4s ease-out ${index * 50}ms`;

                    // Preserve spaces by using a non-breaking space
                    if (char === " ") {
                        span.innerHTML = "&nbsp;";
                    }

                    paragraph.appendChild(span);
                });
            }
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const spans = entry.target.querySelectorAll("p span");
                spans.forEach(span => {
                    span.style.opacity = "1";
                    span.style.transform = "translateY(0)";
                });

                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    sections.forEach(section => observer.observe(section));
});


//enlarged sections
document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll(".section-content");

    sections.forEach(section => {
        section.addEventListener("click", (event) => {
            // Remove "enlarged" class from all sections
            sections.forEach(sec => sec.classList.remove("enlarged"));

            // Apply "enlarged" class to the clicked section
            section.classList.add("enlarged");

            // Stop click from propagating to the document
            event.stopPropagation();
        });
    });

    // Click anywhere outside to reset
    document.addEventListener("click", () => {
        sections.forEach(section => section.classList.remove("enlarged"));
    });
});


