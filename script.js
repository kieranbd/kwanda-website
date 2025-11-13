// Dynamic text rotation for H1 with smooth animation
const businessTypes = [
    'accounting firm',
    'law firm',
    'restaurant',
    'construction company',
    'marketing agency',
    'real estate firm',
    'customer support team',
    'internal processes',
    'data entry processes'
];

const dynamicTextContainer = document.querySelector('.dynamic-text-container');
const aiReadyText = document.querySelector('.dynamic-text-ai-ready');
let currentIndex = 0;

function rotateBusinessType() {
    // Get current text element
    const currentText = dynamicTextContainer.querySelector('.dynamic-text.active');
    if (!currentText) return;
    
    // Store current width before fade out
    const currentWidth = currentText.offsetWidth;
    
    // Fade out current text
    currentText.classList.remove('active');
    
    // After fade out completes, update text and fade in
    setTimeout(() => {
        currentIndex = (currentIndex + 1) % businessTypes.length;
        
        // Update text content while invisible
        currentText.textContent = businessTypes[currentIndex];
        
        // Get new width
        const newWidth = currentText.offsetWidth;
        
        // If widths differ significantly, the "AI ready" will naturally adjust
        // Fade in new text
        currentText.classList.add('active');
    }, 300);
}

// Initialize with first business type
const initialText = dynamicTextContainer.querySelector('.dynamic-text');
if (initialText) {
    initialText.textContent = businessTypes[currentIndex];
    initialText.classList.add('active');
}

// Start rotation after a short delay to ensure page is loaded
setTimeout(() => {
    setInterval(rotateBusinessType, 2000);
}, 1000);

// Modal functionality
const modalOverlay = document.getElementById('modalOverlay');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const contactLinks = document.querySelectorAll('.contact-link');
const waitlistForm = document.getElementById('waitlistForm');

function openModal() {
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

openModalBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);

contactLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
    });
});

// Close modal when clicking outside
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeModal();
    }
});

// Rotating placeholder text for challenge textarea
const challengePlaceholders = [
    "I run a 30-person marketing agency and need to automate our client reporting.",
    "I need help upskilling my organisation on AI.",
    "We're a real estate firm and want to build a chatbot to qualify new leads.",
    "Our customer support team is overwhelmed, and we're exploring AI solutions.",
    "I'm not sure where to start, but I know our internal processes are inefficient.",
    "We're spending too much time on manual data entry and want to automate it.",
    "I need to match incoming invoices with purchase orders across multiple entities.",
    "I'm looking for talent to help me build a custom GPT or AI chatbot.",
    "I want a conversational voice chatbot on my website.",
    "We need help with data analysis and predictive modelling.",
    "Tell us the type of AI service you're looking for, or the problem you need to solve."
];

const challengeTextarea = document.getElementById('challenge');
let placeholderIndex = 0;

function rotatePlaceholder() {
    // Fade out
    challengeTextarea.classList.add('placeholder-fade-out');
    
    setTimeout(() => {
        // Change placeholder text while invisible
        challengeTextarea.placeholder = challengePlaceholders[placeholderIndex];
        placeholderIndex = (placeholderIndex + 1) % challengePlaceholders.length;
        
        // Fade in
        setTimeout(() => {
            challengeTextarea.classList.remove('placeholder-fade-out');
        }, 50); // Small delay to ensure text is updated
    }, 200); // Wait for fade out transition to complete
}

// Initialize placeholder and start rotation
if (challengeTextarea) {
    challengeTextarea.placeholder = challengePlaceholders[placeholderIndex];
    placeholderIndex = (placeholderIndex + 1) % challengePlaceholders.length;
    setInterval(rotatePlaceholder, 3000);
}

// Form submission
waitlistForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        companyName: document.getElementById('companyName').value,
        companySize: document.getElementById('companySize').value,
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('challenge').value
    };
    
    try {
        const response = await fetch('https://whyc.app.n8n.cloud/webhook/kwanda-waitlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            // Show success message
            alert('Thank you for joining the waitlist! We\'ll be in touch soon.');
            
            // Reset form and close modal
            waitlistForm.reset();
            closeModal();
        } else {
            throw new Error('Failed to submit form');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('Sorry, there was an error submitting your form. Please try again.');
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '#how-it-works') {
            return; // Let default behavior handle non-section links
        }
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Set card max-width to 1.2x height when in single column mode
function updateCardWidths() {
    const cards = document.querySelectorAll('.card');
    const cardsContainer = document.querySelector('.cards-container');
    
    if (!cardsContainer) return;
    
    // Check if we're in single column mode (max-width: 950px)
    const isSingleColumn = window.matchMedia('(max-width: 950px)').matches;
    
    if (isSingleColumn) {
        cards.forEach(card => {
            // Reset max-width to get natural height
            card.style.maxWidth = '';
            
            // Use requestAnimationFrame to ensure layout is calculated
            requestAnimationFrame(() => {
                const height = card.offsetHeight;
                const maxWidth = height * 1.2;
                card.style.maxWidth = `${maxWidth}px`;
            });
        });
    } else {
        // Reset max-width when in 3-column mode
        cards.forEach(card => {
            card.style.maxWidth = '';
        });
    }
}

// Update on load and resize
window.addEventListener('load', updateCardWidths);
window.addEventListener('resize', updateCardWidths);

// Also update when DOM changes (in case cards load dynamically)
const observer = new MutationObserver(updateCardWidths);
const cardsContainer = document.querySelector('.cards-container');
if (cardsContainer) {
    observer.observe(cardsContainer, { childList: true, subtree: true });
}

// Hamburger menu functionality
const hamburgerMenu = document.getElementById('hamburgerMenu');
const navMenu = document.getElementById('navMenu');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');

function toggleMobileMenu() {
    const isActive = navMenu.classList.contains('active');
    navMenu.classList.toggle('active');
    hamburgerMenu.classList.toggle('active');
    
    if (isActive) {
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    } else {
        mobileMenuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeMobileMenu() {
    navMenu.classList.remove('active');
    hamburgerMenu.classList.remove('active');
    mobileMenuOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

if (hamburgerMenu && navMenu && mobileMenuOverlay) {
    hamburgerMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMobileMenu();
    });

    // Close menu when a nav link is clicked (for mobile)
    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    // Close menu when clicking on overlay
    mobileMenuOverlay.addEventListener('click', () => {
        closeMobileMenu();
    });

    // Close menu when clicking outside (only on mobile)
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (!hamburgerMenu.contains(e.target) && !navMenu.contains(e.target)) {
                closeMobileMenu();
            }
        }
    });
}

// Logos Carousel
const logosCarousel = document.getElementById('logosCarousel');
if (logosCarousel) {
    // List of logo files (excluding Python scripts)
    const logoFiles = [
        'Anthropic.png',
        'copilot.png',
        'ElevenLabs.png',
        'ffmpeg.png',
        'Gemini.png',
        'Google-Workspace.png',
        'LangChain.png',
        'Make.png',
        'n8n.png',
        'OpenAI.png',
        'pinecone.png',
        'Python.png',
        'supabase.png',
        'vapi.png',
        'zapier.png'
    ];

    // Create logo items (duplicate for seamless infinite scroll)
    function createLogoItems() {
        // Clear existing content
        logosCarousel.innerHTML = '';
        
        // Create items for each logo (duplicate 3 times for seamless scroll)
        for (let i = 0; i < 3; i++) {
            logoFiles.forEach(logoFile => {
                const item = document.createElement('div');
                item.className = 'logos-carousel-item';
                const img = document.createElement('img');
                img.src = `logos/${logoFile}`;
                img.alt = logoFile.replace('.png', '').replace(/-/g, ' ');
                img.draggable = false; // Prevent image dragging
                img.style.userSelect = 'none'; // Prevent text selection
                // Prevent drag events on images
                img.addEventListener('dragstart', (e) => e.preventDefault());
                img.addEventListener('drag', (e) => e.preventDefault());
                item.appendChild(img);
                logosCarousel.appendChild(item);
            });
        }
    }

    createLogoItems();

    // Carousel state
    let scrollPosition = 0;
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;
    let animationId = null;
    let autoScrollSpeed = 0.5; // pixels per frame (slower scroll)
    let isPaused = false;

    // Calculate single set width
    function getSingleSetWidth() {
        const items = logosCarousel.querySelectorAll('.logos-carousel-item');
        if (items.length === 0) return 0;
        
        const firstItem = items[0];
        const itemWidth = firstItem.offsetWidth;
        // Get gap from computed CSS (3.2rem desktop, 2.56rem mobile at 480px)
        const computedStyle = window.getComputedStyle(logosCarousel);
        const gapValue = computedStyle.gap || computedStyle.columnGap || '3.2rem';
        // Convert rem to pixels (1rem = 16px by default)
        let gap = 51.2; // Default fallback: 3.2rem = 51.2px
        if (gapValue) {
            if (gapValue.includes('rem')) {
                const remValue = parseFloat(gapValue);
                gap = remValue * 16; // Convert rem to pixels
            } else if (gapValue.includes('px')) {
                gap = parseFloat(gapValue);
            }
        }
        return (itemWidth + gap) * logoFiles.length;
    }

    // Constrain scroll position to prevent gaps during manual dragging
    function constrainScrollPosition(position, startPosition) {
        const singleSetWidth = getSingleSetWidth();
        // Constrain movement relative to start position to prevent large gaps
        // Allow movement within 30% of one set width in either direction from start
        const maxOffset = singleSetWidth * 0.3;
        const movement = position - startPosition;
        const constrainedMovement = Math.max(-maxOffset, Math.min(maxOffset, movement));
        return startPosition + constrainedMovement;
    }

    // Auto-scroll animation
    function autoScroll() {
        if (!isPaused && !isDragging) {
            scrollPosition -= autoScrollSpeed;
            
            // Reset position when we've scrolled one full set
            const singleSetWidth = getSingleSetWidth();
            if (Math.abs(scrollPosition) >= singleSetWidth) {
                scrollPosition = 0;
            }
            
            logosCarousel.style.transform = `translateX(${scrollPosition}px)`;
        }
        
        animationId = requestAnimationFrame(autoScroll);
    }

    // Start auto-scroll
    autoScroll();

    // Drag functionality
    logosCarousel.addEventListener('mousedown', (e) => {
        isDragging = true;
        isPaused = true;
        startX = e.pageX - logosCarousel.offsetLeft;
        scrollLeft = scrollPosition;
        logosCarousel.style.cursor = 'grabbing';
    });

    logosCarousel.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            isPaused = false;
            logosCarousel.style.cursor = 'grab';
        }
    });

    logosCarousel.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            // Resume auto-scroll after a short delay
            setTimeout(() => {
                isPaused = false;
            }, 1000);
            logosCarousel.style.cursor = 'grab';
        }
    });

    logosCarousel.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - logosCarousel.offsetLeft;
        const walk = (x - startX) * 2; // Scroll speed multiplier
        scrollPosition = constrainScrollPosition(scrollLeft + walk, scrollLeft);
        logosCarousel.style.transform = `translateX(${scrollPosition}px)`;
    });

    // Touch support for mobile
    let touchStartX = 0;
    let touchScrollLeft = 0;

    logosCarousel.addEventListener('touchstart', (e) => {
        isPaused = true;
        touchStartX = e.touches[0].pageX;
        touchScrollLeft = scrollPosition;
    });

    logosCarousel.addEventListener('touchend', () => {
        setTimeout(() => {
            isPaused = false;
        }, 1000);
    });

    logosCarousel.addEventListener('touchmove', (e) => {
        if (!isPaused) return;
        e.preventDefault();
        const x = e.touches[0].pageX;
        const walk = (x - touchStartX) * 2;
        scrollPosition = constrainScrollPosition(touchScrollLeft + walk, touchScrollLeft);
        logosCarousel.style.transform = `translateX(${scrollPosition}px)`;
    });

    // Pause on hover (optional - can be removed if not desired)
    logosCarousel.addEventListener('mouseenter', () => {
        // Optionally pause on hover
        // isPaused = true;
    });

    logosCarousel.addEventListener('mouseleave', () => {
        if (!isDragging) {
            // isPaused = false;
        }
    });
}

