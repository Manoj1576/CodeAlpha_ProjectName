// --- TAB LOGIC ---
function filterSelection(brand) {
    // 1. Hide all sections
    const sections = document.querySelectorAll('.brand-section');
    sections.forEach(sec => {
        sec.style.display = 'none';
        sec.classList.remove('active-section');
    });

    // 2. Show selected section
    const selected = document.getElementById(brand);
    if (selected) {
        selected.style.display = 'block';
        // Trigger small animation by removing/adding class (optional, handled by CSS animation on element load)
    }

    // 3. Update active button state
    const btns = document.querySelectorAll('.filter-btn');
    btns.forEach(btn => btn.classList.remove('active'));

    // Find the button that was clicked (using event bubbling or just matching text)
    // Actually, since we pass 'brand' string, let's find the button that calls this function.
    // Simpler: event.currentTarget would work if passed, but let's just loop.

    // For simplicity, we can just rely on the click event handling in HTML 
    // passing the event, or just iterate to find match.
    // Let's fix the HTML onclick to pass 'this' or handle it here via text match.

    // Quick fix: loop through buttons and check their onclick attribute or text
    btns.forEach(btn => {
        if (btn.textContent.toLowerCase().includes(brand)) {
            btn.classList.add('active');
        }
    });

    // Update Logo Color dynamically
    const highlight = document.querySelector('.logo .highlight');
    if (brand === 'tvs') highlight.style.color = 'var(--accent-tvs)';
    if (brand === 'pulsar') highlight.style.color = 'var(--accent-pulsar)';
    if (brand === 'yamaha') highlight.style.color = 'var(--accent-yamaha)';
}

// Ensure first tab is active on load
document.addEventListener('DOMContentLoaded', () => {
    filterSelection('tvs');
});


// --- LIGHTBOX LOGIC ---
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lbName = document.getElementById('lb-name');
const lbEngine = document.getElementById('lb-engine');
const lbDesc = document.getElementById('lb-desc');

function openLightbox(imgElement) {
    lightbox.style.display = "flex";

    // Set Image
    lightboxImg.src = imgElement.src;

    // Set Details from Data Attributes
    lbName.textContent = imgElement.getAttribute('data-name');
    lbEngine.textContent = imgElement.getAttribute('data-engine');
    lbDesc.textContent = imgElement.getAttribute('data-desc');

    // Dynamic Accent Color for Details
    const activeBtn = document.querySelector('.filter-btn.active');
    const detailsPanel = document.querySelector('.lightbox-details h4');

    // Default fallback
    let color = 'var(--text-color)';
    if (activeBtn.innerText.includes('TVS')) color = 'var(--accent-tvs)';
    if (activeBtn.innerText.includes('PULSAR')) color = 'var(--accent-pulsar)';
    if (activeBtn.innerText.includes('YAMAHA')) color = 'var(--accent-yamaha)';

    detailsPanel.style.color = color;
}

function closeLightbox() {
    lightbox.style.display = "none";
}

// Close on outside click
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Navigation with Keys
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
});
