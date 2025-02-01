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
        const response = await fetch('http://ec2-98-80-76-94.compute-1.amazonaws.com:8080/hero-images'); // Update to Flask API
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
        const response = await fetch('http://ec2-98-80-76-94.compute-1.amazonaws.com:8080/gallery-images'); // Update to Flask API
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
