// Wait until the DOM content is fully loaded before running the script
document.addEventListener("DOMContentLoaded", async () => {
    let slideIndex = 0; // Initialize the slide index 
    let heroImages = []; // Array to hold the URLs of hero images

    // Helper function to shuffle the array for random image order
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
    }

    // Fetch the list of hero images from the server
    try {
        const response = await fetch('http://ec2-98-80-34-138.compute-1.amazonaws.com:8080/hero-images'); // Update to Flask API
        heroImages = await response.json();

        if (heroImages.length > 0) {
            shuffleArray(heroImages);
            document.querySelector('.hero').style.backgroundImage = `url(${heroImages[0]})`;
        }
    } catch (error) {
        console.error("Error fetching hero images:", error);
    }

    // Change the hero image every 5 seconds
    setInterval(() => {
        if (heroImages.length > 0) {
            slideIndex = (slideIndex + 1) % heroImages.length;
            document.querySelector('.hero').style.backgroundImage = `url(${heroImages[slideIndex]})`;
        }
    }, 5000);
});

// Toggle red border for debugging
function toggleDebugOutline() {
    document.body.classList.toggle('debug-outline');
}

// Set main gallery image when a thumbnail is clicked
function setMainImage(imagePath) {
    document.querySelector('.gallery-main').style.backgroundImage = `url(${imagePath})`;
}

// Load gallery images and thumbnails dynamically
document.addEventListener("DOMContentLoaded", async () => {
    let galleryImages = [];

    try {
        const response = await fetch('http://ec2-98-80-34-138.compute-1.amazonaws.com:8080/gallery-images'); // Update to Flask API
        galleryImages = await response.json();
    } catch (error) {
        console.error("Error fetching gallery images:", error);
        return;
    }

    const mainGallery = document.querySelector('.gallery-main');
    const thumbnailContainer = document.querySelector('.gallery-thumbnails');

    if (galleryImages.length > 0) {
        mainGallery.style.backgroundImage = `url(${galleryImages[0]})`;

        galleryImages.forEach((imageUrl) => {
            const thumbnail = document.createElement('img');
            thumbnail.src = imageUrl;
            thumbnail.alt = "Thumbnail";
            thumbnail.classList.add('thumbnail-image');

            thumbnail.addEventListener('click', () => {
                mainGallery.style.backgroundImage = `url(${imageUrl})`;
            });

            thumbnailContainer.appendChild(thumbnail);
        });
    }
});

// Toggle navigation menu visibility
document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menu-toggle");
    const navigation = document.querySelector(".navigation");
    const overlay = document.createElement("div");
    const navigationLinks = document.querySelectorAll(".navigation a"); // Select all navigation links

    // Add overlay to the body
    overlay.classList.add("overlay");
    document.body.appendChild(overlay);

    if (menuToggle && navigation) {
        // Toggle the menu and overlay visibility
        menuToggle.addEventListener("click", () => {
            navigation.classList.toggle("show");
            overlay.classList.toggle("show");
            menuToggle.classList.toggle("active");
        });

        // Close menu when clicking on the overlay
        overlay.addEventListener("click", () => {
            navigation.classList.remove("show");
            overlay.classList.remove("show");
            menuToggle.classList.remove("active");
        });

        // Close menu when clicking on any navigation link
        navigationLinks.forEach(link => {
            link.addEventListener("click", () => {
                navigation.classList.remove("show");
                overlay.classList.remove("show");
                menuToggle.classList.remove("active");
            });
        });
    } else {
        console.error("Menu toggle button or navigation element not found.");
    }
});

// Book now click handler
document.addEventListener("DOMContentLoaded", () => {
    const bookNowButton = document.querySelector(".book-now");

    if (bookNowButton) {
        bookNowButton.addEventListener("click", () => {
            // Example action: Scroll to the bookings section
            const bookingSection = document.getElementById("bookings");
            if (bookingSection) {
                bookingSection.scrollIntoView({ behavior: "smooth" });
            }
        });
    } else {
        console.error("Book Now button not found.");
    }
});

const adoptScroll = document.querySelector('.adopt-scroll');
const panels = Array.from(document.querySelectorAll('.adopt-panel'));
const leftBtn = document.querySelector('.carousel-btn.left');
const rightBtn = document.querySelector('.carousel-btn.right');

let isDragging = false;
let startX;
let scrollLeft;
let velocity = 0;
let animationFrame;
const panelWidth = panels[0].offsetWidth + 40; // Panel width including margin

// Clone first and last panels for seamless looping
const firstClone = panels[0].cloneNode(true);
const lastClone = panels[panels.length - 1].cloneNode(true);

adoptScroll.appendChild(firstClone); // Clone first to end
adoptScroll.insertBefore(lastClone, panels[0]); // Clone last to start

// Update the panel list after cloning
const allPanels = document.querySelectorAll('.adopt-panel');

// **Key Fix:** Start scrolled at first real panel
adoptScroll.scrollLeft = panelWidth;

// Click & Drag Scrolling
adoptScroll.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX - adoptScroll.getBoundingClientRect().left;
    scrollLeft = adoptScroll.scrollLeft;
    adoptScroll.style.cursor = 'grabbing';
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
});

function onMouseMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - adoptScroll.getBoundingClientRect().left;
    const walk = (x - startX) * 2; // Adjust scrolling speed
    adoptScroll.scrollLeft = scrollLeft - walk;
}

// Prevent text selection while dragging
adoptScroll.addEventListener('dragstart', (e) => e.preventDefault());

function onMouseUp() {
    isDragging = false;
    adoptScroll.style.cursor = 'grab';
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
}

adoptScroll.addEventListener('mouseleave', () => {
    if (isDragging) {
        isDragging = false;
        adoptScroll.style.cursor = 'grab';
        adoptScroll.classList.remove('active');
    }
});

adoptScroll.addEventListener('mouseup', () => {
    isDragging = false;
    adoptScroll.style.cursor = 'grab';
    adoptScroll.classList.remove('active');
});

adoptScroll.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - adoptScroll.offsetLeft;
    const walk = (x - startX) * 2; // Adjust scrolling speed
    adoptScroll.scrollLeft = scrollLeft - walk;
});

// Ensure release on global mouseup to prevent the stuck state
document.addEventListener('mouseup', () => {
    isDragging = false;
    adoptScroll.style.cursor = 'grab';
    adoptScroll.classList.remove('active');
});

// Smooth inertia effect after drag release
function smoothScroll() {
    if (Math.abs(velocity) > 0.1) {
        adoptScroll.scrollLeft -= velocity;
        velocity *= 0.95; // Gradually slow down (friction)
        animationFrame = requestAnimationFrame(smoothScroll);
    } else {
        checkLoop(); // Ensure seamless loop after inertia stops
    }
}

function checkLoop() {
    const maxScroll = panels.length * panelWidth; // Max scroll before looping

    if (adoptScroll.scrollLeft <= panelWidth / 2) {
        // **Jump to last REAL panel when scrolling left**
        adoptScroll.style.scrollBehavior = 'auto'; // Disable smooth animation for jump
        adoptScroll.scrollLeft = maxScroll - panelWidth;
    } else if (adoptScroll.scrollLeft >= maxScroll - panelWidth / 2) {
        // **Jump to first REAL panel when scrolling right**
        adoptScroll.style.scrollBehavior = 'auto';
        adoptScroll.scrollLeft = panelWidth;
    }
}


// Auto-scrolling for arrow buttons
function scrollToPanel(direction) {
    adoptScroll.style.scrollBehavior = 'smooth'; // Enable smooth scrolling for buttons
    adoptScroll.scrollBy({ left: panelWidth * direction, behavior: 'smooth' });

    setTimeout(() => {
        checkLoop(); // Ensure seamless infinite scroll
    }, 300); // Give time for animation before correcting position
}

// Right Button Click
rightBtn.addEventListener('click', () => scrollToPanel(1));

// Left Button Click
leftBtn.addEventListener('click', () => scrollToPanel(-1));

// **Final Fix:** Ensure seamless loop on page load
setTimeout(() => {
    adoptScroll.scrollLeft = panelWidth;
}, 100);

function changeVideo(videoSrc) {
    const video = document.getElementById("main-video");
    video.src = videoSrc;
    video.play();
}

// Simulating progress bar increase
let progress = 40;
function updateDonationProgress(amount) {
    progress += amount;
    if (progress > 100) {
        progress = 100;
    }
    document.getElementById("donation-progress").value = progress;
}

document.querySelector(".donate-btn").addEventListener("click", () => {
    updateDonationProgress(20);
});

let lastScrollY = 0; // Track last scroll position
let ticking = false; // Prevent excessive function calls

function addPawPrints() {
    lastScrollY = window.scrollY; // Get current scroll position

    // Random chance to reduce excessive prints
    if (Math.random() > 0.6) {
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
