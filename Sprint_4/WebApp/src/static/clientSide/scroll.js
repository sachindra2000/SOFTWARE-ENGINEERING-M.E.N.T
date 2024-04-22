// This script adds a "scroll to top" button to the page that appears when the user scrolls down

document.addEventListener('DOMContentLoaded', (event) => {
    const scrollToTopButton = document.getElementById('scrollToTopButton');
    const scrollToBottomButton = document.getElementById('scrollToBottomButton');
    let lastScrollTop = 0; // Keep track of last scroll position

    // Show or hide the button based on scroll position and direction
    const toggleScrollButton = () => {
        const currentScrollTop = window.scrollY || document.documentElement.scrollTop;
        const atBottom = window.innerHeight + currentScrollTop >= document.documentElement.offsetHeight;
        // Use a fixed distance from the top of the page
        const fixedDistance = 150; // 150 pixels from the top

        if (atBottom) {
          // User is at the bottom of the page
          scrollToBottomButton.style.display = "none";
          scrollToTopButton.style.display = "block";
        } else if (currentScrollTop > fixedDistance) {
          // User has scrolled down more than the fixed distance
          if (currentScrollTop > lastScrollTop) {
            // Scrolling down
            scrollToTopButton.style.display = "none";
            scrollToBottomButton.style.display = "block";
          } else {
            // Scrolling up
            scrollToBottomButton.style.display = "none";
            scrollToTopButton.style.display = "block";
          }
        } else {
          // Within the fixed distance from the top of the page
          scrollToBottomButton.style.display = "none";
          scrollToTopButton.style.display = "none";
        }
        // Update last scroll position, with a delay
        clearTimeout(window.scrollTimeout);
        window.scrollTimeout = setTimeout(() => {
          lastScrollTop = currentScrollTop;
        }, 100);
    };
  
    // Scroll to the top of the document
    scrollToTopButton.addEventListener('click', () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
        // Use a timeout to ensure the scroll action completes before evaluating visibility
        setTimeout(() => {
            toggleScrollButton();
        }, 300); // Timeout duration
    });
  
    // Scroll to the bottom of the document
    scrollToBottomButton.addEventListener('click', () => {
        window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'});
    });
  
    // Listen for scroll events
    window.addEventListener('scroll', () => {
        toggleScrollButton();
    });
});
