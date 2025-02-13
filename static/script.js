document.addEventListener("DOMContentLoaded", () => {
    initHeroSlider();
    initGallery();
    initNavigation();
    initBookNow();
    //not sure why I had to add an additional event listern in for this
    document.addEventListener("DOMContentLoaded", () => {
        initCarousel();
    });

    initVideoPlayer();
    initDonationProgress();
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
            const response = await fetch('http://ec2-34-232-108-31.compute-1.amazonaws.com/hero-images');
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
            const response = await fetch('http://ec2-34-232-108-31.compute-1.amazonaws.com:8080/gallery-images');
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
    initCarousel(".card-carousel-scroll", ".carousel-card", ".carousel-btn.left", ".carousel-btn.right");
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

//prevent JS functions from affecting sticky header
document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector(".sticky-header");

    // Prevent unwanted transforms or animations
    if (header) {
        header.style.transform = "none";
        header.style.willChange = "unset";
    }
});

window.addEventListener("scroll", () => {
    const header = document.querySelector(".sticky-header");
    if (header) {
        header.style.position = "fixed";  // Ensure it stays fixed
        header.style.transform = "none";  // Override transformations
        header.style.top = "0";           // Prevent jumping
    }
});




//gallery caption
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
        const caption = document.querySelector('.gallery-caption');
        const thumbnailContainer = document.querySelector('.gallery-thumbnails');

        // Predefined captions for each image - needs to be modified to create image association
        const captions = [
            "John, age: 37, Software Engineer - Fido, age: 8, Whippet x - together 5 years",
            "Stephany, age: 31, Architect - Dozer, age: 6, Staffy x - together 4 years",
            "Lillian, age: 42, Business Consultant - Donny, age: 4, Beagle x - together 2 years",
            "Corey, age: 45, Accountant - Radix, age: 6, Shepherd x - together 3 years",
            "Sarah, age: 24, Student - Zara, age: 4, Cheshire - together 2 years",
            "Malcom, age: 62, Retiree - Pepe, age: 5, Tabby - together 3 years",
            "Rose, age: 74, Retiree - Tukker, age: 7, Labrador x - together 4 years"
        ];



        if (images.length > 0) {
            updateGallery(images[0], captions[0]);

            images.forEach((imageUrl, index) => {
                const thumbnail = document.createElement('img');
                thumbnail.src = imageUrl;
                thumbnail.alt = `Gallery image ${index + 1}`;
                thumbnail.classList.add('thumbnail-image');

                // Change main image and caption on thumbnail click
                thumbnail.addEventListener('click', () => updateGallery(imageUrl, captions[index]));
                thumbnailContainer.appendChild(thumbnail);
            });
        }
    }

    function updateGallery(imageUrl, text) {
        const mainGallery = document.querySelector('.gallery-main');
        const caption = document.querySelector('.gallery-caption');

        mainGallery.style.backgroundImage = `url(${imageUrl})`;

        // Clear previous text and apply animation
        caption.innerHTML = "";
        text.split("").forEach((char, index) => {
            const span = document.createElement("span");
            span.textContent = char;
            span.style.transitionDelay = `${index * 50}ms`; // Staggered fade-in effect

            if (char === " ") {
                span.innerHTML = "&nbsp;";
            }

            caption.appendChild(span);
        });

        // Make caption visible
        caption.style.opacity = "1";

        // Animate each letter appearing
        setTimeout(() => {
            caption.querySelectorAll("span").forEach(span => {
                span.style.opacity = "1";
                span.style.transform = "translateY(0)";
            });
        }, 200);
    }

    fetchGalleryImages().then(populateGallery);
}


//darkmode logic
document.addEventListener("DOMContentLoaded", () => {
    const darkModeToggle = document.getElementById("dark-mode-toggle");

    // Check if user has a preference stored
    if (localStorage.getItem("theme") === "dark") {
        document.documentElement.classList.add("dark-mode");
        darkModeToggle.checked = true;
    }

    darkModeToggle.addEventListener("sl-change", () => {
        if (darkModeToggle.checked) {
            document.documentElement.classList.add("dark-mode");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark-mode");
            localStorage.setItem("theme", "light");
        }
    });

    //default tab
    document.addEventListener("DOMContentLoaded", () => {
        document.querySelector("sl-tab[panel='adoption']").click();
    });

    document.addEventListener("DOMContentLoaded", async () => {
        const videoElement = document.getElementById("s3-video");

        try {
            const response = await fetch("https://good-dog-images.s3.us-east-1.amazonaws.com/videos/donate-videos/video1.mp4");
            const videoURL = await response.text(); // Assuming API returns the S3 video URL

            videoElement.src = videoURL;
            videoElement.load();
        } catch (error) {
            console.error("Error fetching S3 video:", error);
        }
    });


});


function initDonationProgress() {
    let progress = 40; // Initial progress value

    document.querySelector("#donation-form")?.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent actual form submission

        if (progress >= 100) {
            // Reset the progress bar if it's full
            progress = 0;
        } else {
            // Otherwise, increase progress normally
            progress = Math.min(progress + 20, 100);
        }

        document.getElementById("donation-progress").value = progress;
    });
}

// Ensure the Donate Now button only scrolls and switches tabs, not affecting progress
function initDonateNowButton() {
    document.querySelector(".donate-btn")?.addEventListener("click", () => {
        document.getElementById("enquire").scrollIntoView({ behavior: "smooth" });
        document.querySelector('sl-tab[panel="donation"]').click();
    });
}

// Initialize both functions when the page loads
document.addEventListener("DOMContentLoaded", () => {
    initDonationProgress();
    initDonateNowButton();
});


document.addEventListener("DOMContentLoaded", () => {
    const volunteerButtons = document.querySelectorAll(".volunteer-btn");

    volunteerButtons.forEach(button => {
        button.addEventListener("click", () => {
            const enquirySection = document.getElementById("enquire");
            const formTabs = document.querySelector("sl-tab-group");

            if (enquirySection) {
                enquirySection.scrollIntoView({ behavior: "smooth" });

                // Ensure tab group exists before switching
                if (formTabs) {
                    formTabs.show("volunteer");
                }
            } else {
                console.error("Error: #enquiry-forms not found in the DOM.");
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    initCarousel("#volunteers .card-carousel-scroll", "#volunteers .carousel-card", "#volunteers .carousel-btn.left", "#volunteers .carousel-btn.right");
});


function scrollLeft(selector) {
    const scrollContainer = document.querySelector(selector);
    scrollContainer.scrollBy({ left: -300, behavior: "smooth" });
}

function scrollRight(selector) {
    const scrollContainer = document.querySelector(selector);
    scrollContainer.scrollBy({ left: 300, behavior: "smooth" });
}


document.addEventListener("DOMContentLoaded", () => {
    // Select all adopt buttons in the adoptees carousel
    const adoptButtons = document.querySelectorAll("#adoptees .adopt-btn");

    // Function to switch to the adoption tab and scroll to enquiry section
    function handleAdoptClick() {
        const enquirySection = document.getElementById("enquire");
        const tabPanel = document.querySelector("sl-tab-group");

        if (tabPanel) {
            // Set active tab to 'adoption'
            tabPanel.show("adoption-form");
        }

        if (enquirySection) {
            // Scroll to enquiry section smoothly
            enquirySection.scrollIntoView({ behavior: "smooth" });
        }
    }

    // Attach event listeners to all adopt buttons
    adoptButtons.forEach((button) => {
        button.addEventListener("click", handleAdoptClick);
    });
});

document.addEventListener("DOMContentLoaded", () => {
    // Select the "Adopt Now" button
    const adoptNowButton = document.querySelector(".adopt-now"); // Ensure this matches the button's class

    if (adoptNowButton) {
        adoptNowButton.addEventListener("click", () => {
            const adopteeSection = document.getElementById("adoptees"); // Ensure the ID matches your section

            if (adopteeSection) {
                adopteeSection.scrollIntoView({ behavior: "smooth" });
            }
        });
    }
});

