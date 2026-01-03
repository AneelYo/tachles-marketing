// ===== TACHLES MARKETING - MAIN JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initSmoothScroll();
    initCarousel();
    initSectorTabs();
    initBlueprintBuilder();
    initROICalculator();
    initScrollAnimations();
});

// ===== NAVIGATION =====
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    navToggle?.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle?.classList.remove('active');
        });
    });

    // Navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    });

    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== CAROUSEL =====
function initCarousel() {
    const track = document.querySelector('.carousel-track');
    const cards = document.querySelectorAll('.case-card');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const dotsContainer = document.querySelector('.carousel-dots');

    if (!track || !cards.length) return;

    let currentIndex = 0;
    const cardWidth = cards[0].offsetWidth + 32; // Including gap
    const maxIndex = Math.max(0, cards.length - 2);

    // Create dots
    for (let i = 0; i <= maxIndex; i++) {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer?.appendChild(dot);
    }

    function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

        // Update dots
        document.querySelectorAll('.carousel-dots .dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    function goToSlide(index) {
        currentIndex = Math.max(0, Math.min(index, maxIndex));
        updateCarousel();
    }

    prevBtn?.addEventListener('click', () => {
        goToSlide(currentIndex - 1);
    });

    nextBtn?.addEventListener('click', () => {
        goToSlide(currentIndex + 1);
    });

    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                goToSlide(currentIndex + 1);
            } else {
                goToSlide(currentIndex - 1);
            }
        }
    }

    // Auto-resize handler
    window.addEventListener('resize', () => {
        updateCarousel();
    });
}

// ===== SECTOR TABS =====
function initSectorTabs() {
    const tabs = document.querySelectorAll('.sector-tab');
    const panels = document.querySelectorAll('.sector-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const sector = tab.dataset.sector;

            // Update tabs
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update panels
            panels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === `panel-${sector}`) {
                    panel.classList.add('active');
                }
            });
        });
    });
}

// ===== BLUEPRINT BUILDER =====
function initBlueprintBuilder() {
    const touchpoints = document.querySelectorAll('.touchpoint');
    const dropzones = document.querySelectorAll('.stage-dropzone');
    const clearBtn = document.getElementById('clear-blueprint');
    const exportBtn = document.getElementById('export-blueprint');

    let draggedItem = null;

    // Touchpoint drag handlers
    touchpoints.forEach(touchpoint => {
        touchpoint.addEventListener('dragstart', e => {
            draggedItem = touchpoint;
            touchpoint.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        });

        touchpoint.addEventListener('dragend', () => {
            draggedItem = null;
            touchpoint.classList.remove('dragging');
            document.querySelectorAll('.stage-column').forEach(col => {
                col.classList.remove('drag-over');
            });
        });
    });

    // Dropzone handlers
    dropzones.forEach(dropzone => {
        dropzone.addEventListener('dragover', e => {
            e.preventDefault();
            dropzone.closest('.stage-column').classList.add('drag-over');
        });

        dropzone.addEventListener('dragleave', e => {
            dropzone.closest('.stage-column').classList.remove('drag-over');
        });

        dropzone.addEventListener('drop', e => {
            e.preventDefault();
            dropzone.closest('.stage-column').classList.remove('drag-over');

            if (draggedItem) {
                const clone = draggedItem.cloneNode(true);
                clone.classList.add('in-stage');
                clone.classList.remove('dragging');
                clone.draggable = false;

                // Add remove functionality
                clone.addEventListener('click', () => {
                    clone.remove();
                });

                dropzone.appendChild(clone);
            }
        });
    });

    // Clear all
    clearBtn?.addEventListener('click', () => {
        dropzones.forEach(dropzone => {
            dropzone.innerHTML = '';
        });
    });

    // Export blueprint
    exportBtn?.addEventListener('click', () => {
        const blueprint = {};

        document.querySelectorAll('.stage-column').forEach(column => {
            const stage = column.dataset.stage;
            const items = column.querySelectorAll('.touchpoint.in-stage');
            blueprint[stage] = Array.from(items).map(item => item.textContent.trim());
        });

        // Create downloadable JSON
        const dataStr = JSON.stringify(blueprint, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'service-blueprint.json';
        link.click();

        URL.revokeObjectURL(url);

        // Show confirmation
        showToast('Blueprint exported successfully!');
    });
}

// ===== ROI CALCULATOR =====
function initROICalculator() {
    const marketingSpend = document.getElementById('marketing-spend');
    const revenueGenerated = document.getElementById('revenue-generated');
    const cogs = document.getElementById('cogs');
    const includeVat = document.getElementById('include-vat');

    const roiPercent = document.getElementById('roi-percent');
    const grossProfit = document.getElementById('gross-profit');
    const netProfit = document.getElementById('net-profit');
    const returnPerShekel = document.getElementById('return-per-shekel');

    const benchmarkFill = document.querySelector('.benchmark-fill');
    const yourRoiMarker = document.querySelector('.benchmark-marker.your-roi');

    function calculateROI() {
        const spend = parseFloat(marketingSpend?.value) || 0;
        const revenue = parseFloat(revenueGenerated?.value) || 0;
        const cogsPercent = parseFloat(cogs?.value) || 0;
        const withVat = includeVat?.checked || false;

        // Calculate gross profit
        const cogsAmount = revenue * (cogsPercent / 100);
        const gross = revenue - cogsAmount - spend;

        // Calculate net (after VAT if applicable)
        const vatRate = withVat ? 0.17 : 0;
        const vatAmount = gross * vatRate;
        const net = gross - vatAmount;

        // Calculate ROI percentage
        const roi = spend > 0 ? ((gross / spend) * 100) : 0;

        // Calculate return per shekel
        const returnPer = spend > 0 ? (revenue / spend) : 0;

        // Update display
        if (roiPercent) roiPercent.textContent = `${roi.toFixed(0)}%`;
        if (grossProfit) grossProfit.textContent = formatCurrency(gross);
        if (netProfit) netProfit.textContent = formatCurrency(net);
        if (returnPerShekel) returnPerShekel.textContent = formatCurrency(returnPer);

        // Update benchmark visualization
        const roiForBenchmark = Math.min(roi, 400);
        const fillPercentage = (roiForBenchmark / 400) * 100;

        if (benchmarkFill) {
            benchmarkFill.style.width = `${fillPercentage}%`;
        }

        if (yourRoiMarker) {
            yourRoiMarker.style.left = `${fillPercentage}%`;
        }
    }

    function formatCurrency(value) {
        if (Math.abs(value) >= 1000000) {
            return `₪${(value / 1000000).toFixed(1)}M`;
        } else if (Math.abs(value) >= 1000) {
            return `₪${(value / 1000).toFixed(1)}K`;
        } else {
            return `₪${value.toFixed(2)}`;
        }
    }

    // Add event listeners
    [marketingSpend, revenueGenerated, cogs, includeVat].forEach(input => {
        input?.addEventListener('input', calculateROI);
        input?.addEventListener('change', calculateROI);
    });

    // Initial calculation
    calculateROI();
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.p-card, .case-card, .tool-card, .sector-panel').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add animate-in styles
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Stagger animation for grid items
    document.querySelectorAll('.ps-grid .p-card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
}

// ===== UTILITY: TOAST NOTIFICATION =====
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;

    // Add styles
    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '16px 24px',
        background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
        color: 'white',
        borderRadius: '12px',
        fontWeight: '600',
        fontSize: '14px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
        zIndex: '9999',
        animation: 'slideInUp 0.3s ease'
    });

    document.body.appendChild(toast);

    // Add animation keyframes
    if (!document.querySelector('#toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            @keyframes slideInUp {
                from { transform: translateY(100px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            @keyframes slideOutDown {
                from { transform: translateY(0); opacity: 1; }
                to { transform: translateY(100px); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    // Remove after delay
    setTimeout(() => {
        toast.style.animation = 'slideOutDown 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ===== 7Ps CARD HOVER EFFECTS =====
document.querySelectorAll('.p-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-8px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// ===== PARALLAX EFFECT FOR HERO =====
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero-content');
    const scrolled = window.pageYOffset;

    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
        hero.style.opacity = 1 - (scrolled / (window.innerHeight * 0.8));
    }
});

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (e) => {
    // Carousel keyboard navigation
    if (e.key === 'ArrowLeft') {
        document.querySelector('.carousel-btn.prev')?.click();
    } else if (e.key === 'ArrowRight') {
        document.querySelector('.carousel-btn.next')?.click();
    }
});

// ===== FORM VALIDATION FOR ROI CALCULATOR =====
document.querySelectorAll('#roi-tool input[type="number"]').forEach(input => {
    input.addEventListener('blur', function () {
        if (this.value < 0) {
            this.value = 0;
            this.style.borderColor = '#EF4444';
            setTimeout(() => {
                this.style.borderColor = '';
            }, 2000);
        }
    });
});

// ===== LAZY LOADING SIMULATION =====
// This simulates loading states - in production, this would be real data fetching
function simulateDataLoad() {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.add('loaded');
    });
}

// Load on page ready
window.addEventListener('load', simulateDataLoad);
