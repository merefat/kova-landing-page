/**
 * KOVA LANDING PAGE - INTERACTIVE LOGIC
 * Handles micro-interactions, working switches, mode selectors, audio wave, and header dynamics.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header scroll effect
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Interactive Automation Toggle Switches
  const automationSwitches = document.querySelectorAll('.switch-control input[type="checkbox"]');
  automationSwitches.forEach(sw => {
    sw.addEventListener('change', (e) => {
      const card = e.target.closest('.automation-item-card');
      if (e.target.checked) {
        card.style.borderColor = 'rgba(56, 189, 248, 0.4)';
        card.style.background = 'rgba(14, 25, 46, 0.85)';
      } else {
        card.style.borderColor = 'rgba(255, 255, 255, 0.07)';
        card.style.background = 'rgba(10, 15, 26, 0.7)';
      }
    });
  });

  // 3. Interactive Rhythm Pills (Morning, Evening, Night)
  const rhythmPills = document.querySelectorAll('.rhythm-pill');
  const rhythmBackdrop = document.querySelector('.rhythm-card-backdrop');

  const rhythmGradients = {
    'Morning': 'linear-gradient(135deg, #1e293b 0%, #0369a1 40%, #fbbf24 100%)',
    'Evening': 'linear-gradient(135deg, #1e1b4b 0%, #7c2d12 50%, #f97316 100%)',
    'Night': 'linear-gradient(135deg, #090d16 0%, #1e1b4b 60%, #31103f 100%)'
  };

  rhythmPills.forEach(pill => {
    pill.addEventListener('click', () => {
      rhythmPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const modeName = pill.dataset.mode;
      if (rhythmBackdrop && rhythmGradients[modeName]) {
        rhythmBackdrop.style.background = rhythmGradients[modeName];
      }
    });
  });

  // 4. Equalizer Wave Random Jitter for Sage Assistant
  const soundwaveBars = document.querySelectorAll('.soundwave-bar');
  if (soundwaveBars.length > 0) {
    setInterval(() => {
      soundwaveBars.forEach(bar => {
        const randomHeight = Math.floor(Math.random() * 28) + 10;
        bar.style.height = `${randomHeight}px`;
      });
    }, 350);
  }

  // 5. Watch Demo Modal / Prompt
  const watchDemoBtn = document.getElementById('btnWatchDemo');
  if (watchDemoBtn) {
    watchDemoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Kova Interactive Demo: Booting local virtual environment (KOVA_DEMO=1) with 28 virtual devices...');
    });
  }

  // 6. Smooth Scroll for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // 7. Mobile Navigation Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      if (navMenu.style.display === 'flex') {
        navMenu.style.display = 'none';
      } else {
        navMenu.style.display = 'flex';
        navMenu.style.flexDirection = 'column';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '80px';
        navMenu.style.left = '0';
        navMenu.style.right = '0';
        navMenu.style.background = '#0a0e17';
        navMenu.style.padding = '20px';
        navMenu.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
      }
    });
  }
});
