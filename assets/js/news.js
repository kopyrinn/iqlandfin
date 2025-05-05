    document.addEventListener('DOMContentLoaded', () => {
    const carouselWrapper = document.querySelector('.custom-carousel-wrapper');
    if (!carouselWrapper) return; // Exit if carousel doesn't exist

    const track = carouselWrapper.querySelector('.custom-carousel-track');
    const slides = Array.from(track.children);
    const nextButton = carouselWrapper.querySelector('.custom-carousel-next');
    const prevButton = carouselWrapper.querySelector('.custom-carousel-prev');

    if (!track || !slides.length || !nextButton || !prevButton) {
        console.error("Carousel elements not found!");
        return;
    }

    let slideWidth = 0;
    let slidesToShow = 1; // Default for mobile
    let currentIndex = 0;
    const totalSlides = slides.length;

    function updateCarouselState() {
        const windowWidth = window.innerWidth;

        // Determine slidesToShow based on breakpoints (matching CSS)
        if (windowWidth >= 1200) {
            slidesToShow = 3;
        } else if (windowWidth >= 768) {
            slidesToShow = 2;
        } else {
            slidesToShow = 1;
        }

        // Get the width of the first slide dynamically
        // This accounts for padding/margins defined in CSS
        if (slides.length > 0) {
             // Ensure the slide is visible for offsetWidth calculation (might be needed if display:none initially)
             // slides[0].style.display = 'block'; // Temporarily ensure visibility if needed
             slideWidth = slides[0].offsetWidth;
             // slides[0].style.display = ''; // Reset display if changed
        }

         // Safety check - if slideWidth is 0, recalculate potentially after layout reflow
         if(slideWidth === 0) {
             setTimeout(updateCarouselState, 100); // Try again shortly
             return;
         }

        // Clamp currentIndex to valid range after resize
        currentIndex = Math.max(0, Math.min(currentIndex, totalSlides - slidesToShow));

        moveToSlide(currentIndex);
        updateButtons();
    }

    function moveToSlide(index) {
        if (!track || slideWidth === 0) return; // Guard against errors
        const moveAmount = -index * slideWidth;
        track.style.transform = `translateX(${moveAmount}px)`;
        currentIndex = index; // Update current index
    }

    function updateButtons() {
        if (!prevButton || !nextButton) return;
        // Disable prev button if at the start
        prevButton.disabled = currentIndex === 0;
        // Disable next button if showing the last group of slides
        nextButton.disabled = currentIndex >= totalSlides - slidesToShow;
    }

    // Event Listeners
    nextButton.addEventListener('click', () => {
        // Move index forward, but not past the last possible starting slide
        const nextIndex = Math.min(currentIndex + 1, totalSlides - slidesToShow);
        moveToSlide(nextIndex);
        updateButtons();
    });

    prevButton.addEventListener('click', () => {
        // Move index backward, but not before the first slide
        const prevIndex = Math.max(currentIndex - 1, 0);
        moveToSlide(prevIndex);
        updateButtons();
    });

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        // Debounce resize event for performance
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateCarouselState, 250); // Update after 250ms of no resizing
    });

    // Initial setup
    updateCarouselState(); // Call once to set initial state

    // Optional: Add touch/swipe support (more complex, basic example below)
    let touchStartX = 0;
    let touchEndX = 0;
    const swipeThreshold = 50; // Minimum pixels to count as a swipe

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true }); // Use passive for better scroll performance

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const deltaX = touchEndX - touchStartX;
        if (Math.abs(deltaX) > swipeThreshold) {
            if (deltaX < 0) { // Swiped left (Next)
                if (!nextButton.disabled) nextButton.click();
            } else { // Swiped right (Previous)
                 if (!prevButton.disabled) prevButton.click();
            }
        }
         // Reset for next swipe
        touchStartX = 0;
        touchEndX = 0;
    }

}); // End DOMContentLoaded