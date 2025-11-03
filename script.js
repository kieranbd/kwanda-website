// Dynamic text rotation for H1 with smooth animation
const businessTypes = [
    'accounting firm.',
    'law firm.',
    'restaurant.',
    'construction company.',
    'marketing agency.',
    'real estate firm.',
    'customer support team.',
    'internal processes.',
    'data entry processes.'
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
    setInterval(rotateBusinessType, 4000);
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
    challengeTextarea.placeholder = challengePlaceholders[placeholderIndex];
    placeholderIndex = (placeholderIndex + 1) % challengePlaceholders.length;
}

// Initialize placeholder and start rotation
rotatePlaceholder();
setInterval(rotatePlaceholder, 3000);

// Form submission
waitlistForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
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

if (hamburgerMenu && navMenu) {
    hamburgerMenu.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburgerMenu.classList.toggle('active');
    });

    // Close menu when a nav link is clicked (for mobile)
    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburgerMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside (only on mobile)
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (!hamburgerMenu.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                hamburgerMenu.classList.remove('active');
            }
        }
    });
}

