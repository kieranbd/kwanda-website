// Tech Stack Pills Functionality
const techStackInput = document.getElementById('techStack');
const techStackPills = document.getElementById('techStackPills');
let techStackValues = [];

function createPill(value) {
    const pill = document.createElement('div');
    pill.className = 'tech-stack-pill';
    pill.innerHTML = `
        <span>${value.trim()}</span>
        <button type="button" class="tech-stack-pill-remove" aria-label="Remove ${value.trim()}">×</button>
    `;
    
    pill.querySelector('.tech-stack-pill-remove').addEventListener('click', () => {
        const index = techStackValues.indexOf(value);
        if (index > -1) {
            techStackValues.splice(index, 1);
            pill.remove();
        }
    });
    
    return pill;
}

if (techStackInput) {
    techStackInput.addEventListener('keydown', (e) => {
        if (e.key === ',' || e.key === 'Enter') {
            e.preventDefault();
            const value = techStackInput.value.trim();
            if (value && !techStackValues.includes(value)) {
                techStackValues.push(value);
                const pill = createPill(value);
                techStackPills.appendChild(pill);
                techStackInput.value = '';
            }
        }
    });
    
    // Handle paste events
    techStackInput.addEventListener('paste', (e) => {
        setTimeout(() => {
            const value = techStackInput.value.trim();
            if (value.includes(',')) {
                const values = value.split(',').map(v => v.trim()).filter(v => v);
                techStackInput.value = '';
                values.forEach(val => {
                    if (val && !techStackValues.includes(val)) {
                        techStackValues.push(val);
                        const pill = createPill(val);
                        techStackPills.appendChild(pill);
                    }
                });
            }
        }, 0);
    });
}

// File Upload Display
const portfolioInput = document.getElementById('portfolio');
const fileUploadText = document.querySelector('.file-upload-text');

if (portfolioInput && fileUploadText) {
    portfolioInput.addEventListener('change', (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            if (files.length === 1) {
                fileUploadText.textContent = files[0].name;
            } else {
                fileUploadText.textContent = `${files.length} files selected`;
            }
        } else {
            fileUploadText.textContent = 'No file chosen';
        }
    });
}

// Character Count for Expertise
const expertiseTextarea = document.getElementById('expertise');
const charCount = document.querySelector('.char-count');

if (expertiseTextarea && charCount) {
    expertiseTextarea.addEventListener('input', () => {
        const length = expertiseTextarea.value.length;
        const minLength = expertiseTextarea.getAttribute('minlength') || 300;
        charCount.textContent = `${length} / ${minLength} characters (minimum ${minLength})`;
        
        if (length < minLength) {
            charCount.style.color = 'var(--slate-cyan)';
        } else {
            charCount.style.color = 'var(--gunmetal)';
        }
    });
}

// Form Submission
const expertForm = document.getElementById('expertForm');

if (expertForm) {
    expertForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Update hidden input with tech stack values
        const techStackHidden = document.getElementById('techStack');
        if (techStackHidden) {
            techStackHidden.value = techStackValues.join(',');
        }
        
        const formData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            currency: document.getElementById('currency').value,
            rate: document.getElementById('rate').value,
            billingUnit: document.getElementById('billingUnit').value,
            linkedin: document.getElementById('linkedin').value,
            expertise: document.getElementById('expertise').value,
            techStack: techStackValues,
            terms: document.querySelector('input[name="terms"]:checked')?.value
        };
        
        // Handle file uploads if needed
        const portfolioFiles = portfolioInput?.files;
        if (portfolioFiles && portfolioFiles.length > 0) {
            // You'll need to handle file uploads separately via FormData
            const formDataObj = new FormData(expertForm);
            formDataObj.append('techStack', JSON.stringify(techStackValues));
            
            try {
                const response = await fetch('YOUR_WEBHOOK_URL_HERE', {
                    method: 'POST',
                    body: formDataObj
                });
                
                if (response.ok) {
                    alert('Application submitted successfully! We\'ll be in touch soon.');
                    expertForm.reset();
                    techStackValues = [];
                    techStackPills.innerHTML = '';
                    if (fileUploadText) fileUploadText.textContent = 'No file chosen';
                } else {
                    throw new Error('Failed to submit form');
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('Sorry, there was an error submitting your application. Please try again.');
            }
        } else {
            // Regular JSON submission without files
            try {
                const response = await fetch('YOUR_WEBHOOK_URL_HERE', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });
                
                if (response.ok) {
                    alert('Application submitted successfully! We\'ll be in touch soon.');
                    expertForm.reset();
                    techStackValues = [];
                    techStackPills.innerHTML = '';
                } else {
                    throw new Error('Failed to submit form');
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('Sorry, there was an error submitting your application. Please try again.');
            }
        }
    });
}

