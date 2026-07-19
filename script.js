document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const form = document.getElementById('waitlist-form');
  const submitBtn = document.getElementById('btn-submit');
  const successOverlay = document.getElementById('success-overlay');
  const registeredEmailEl = document.getElementById('registered-email');
  const resetBtn = document.getElementById('btn-reset');
  const customAlert = document.getElementById('custom-alert');

  // Dashboard / Modal Elements
  const dashboardModal = document.getElementById('dashboard-modal');
  const closeDashboardBtn = document.getElementById('btn-close-dashboard');
  const adminTrigger = document.getElementById('admin-trigger');
  const logoTrigger = document.getElementById('logo-dashboard-trigger');
  const tableBody = document.getElementById('table-body');
  const searchInput = document.getElementById('search-entries');
  const exportBtn = document.getElementById('btn-export-csv');

  // Countdown Elements
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  // --- Initial Mockup Seed Data ---
  const DEFAULT_ENTRIES = [
    { firstName: 'Amit', lastName: 'Sharma', email: 'amit.sharma@github.io', college: 'IIT Kharagpur', role: 'Developer', date: new Date(Date.now() - 4 * 3600000).toLocaleString() },
    { firstName: 'Priya', lastName: 'Patel', email: 'priya@codecraft.com', college: 'BITS Pilani', role: 'Founder', date: new Date(Date.now() - 12 * 3600000).toLocaleString() },
    { firstName: 'Siddharth', lastName: 'Sen', email: 'siddharth@coder.in', college: 'Delhi Technological University', role: 'Developer', date: new Date(Date.now() - 24 * 3600000).toLocaleString() },
    { firstName: 'Ananya', lastName: 'Rao', email: 'ananya@nextjs.dev', college: 'RV College of Engineering', role: 'Designer', date: new Date(Date.now() - 36 * 3600000).toLocaleString() }
  ];

  // Load entries from localStorage
  let entries = JSON.parse(localStorage.getItem('tbg_waitlist_entries'));
  if (!entries || entries.length === 0) {
    entries = DEFAULT_ENTRIES;
    localStorage.setItem('tbg_waitlist_entries', JSON.stringify(entries));
  }

  // --- 1. Countdown Timer Logic ---
  // Target: August 14, 2026 00:00:00 (IST or Local time)
  const targetDate = new Date("August 14, 2026 00:00:00").getTime();

  const runCountdown = () => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      // Countdown finished
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      clearInterval(countdownInterval);
      return;
    }

    // Time calculations
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Render with leading zeros
    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  };

  runCountdown(); // Run immediately
  const countdownInterval = setInterval(runCountdown, 1000);

  // --- 2. Dynamic Glow Background Mouse Interaction ---
  document.body.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;

    // Pass coordinates to CSS
    document.documentElement.style.setProperty('--mouse-x', `${x}px`);
    document.documentElement.style.setProperty('--mouse-y', `${y}px`);

    // Parallax effect on blur blobs
    const blob3 = document.querySelector('.blob-3');
    if (blob3) {
      const moveX = (x - window.innerWidth / 2) * 0.04;
      const moveY = (y - window.innerHeight / 2) * 0.04;
      blob3.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;
    }
  });

  // --- 3. Form Validation and Submission ---
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const firstNameInput = document.getElementById('firstname');
    const lastNameInput = document.getElementById('lastname');
    const emailInput = document.getElementById('email');
    const collegeInput = document.getElementById('college');
    const roleSelect = document.getElementById('role');
    const newsletterCheck = document.getElementById('newsletter');

    // Validation checks
    if (!firstNameInput.value.trim()) {
      showToast('First Name is required.', 'error');
      firstNameInput.focus();
      return;
    }

    if (!lastNameInput.value.trim()) {
      showToast('Last Name is required.', 'error');
      lastNameInput.focus();
      return;
    }

    if (!validateEmail(emailInput.value)) {
      showToast('Please enter a valid email address.', 'error');
      emailInput.focus();
      return;
    }

    if (!collegeInput.value.trim()) {
      showToast('College or Company name is required.', 'error');
      collegeInput.focus();
      return;
    }

    if (!roleSelect.value) {
      showToast('Please select your professional role.', 'error');
      roleSelect.focus();
      return;
    }

    // Save registration info
    const newEntry = {
      firstName: firstNameInput.value.trim(),
      lastName: lastNameInput.value.trim(),
      email: emailInput.value.trim().toLowerCase(),
      college: collegeInput.value.trim(),
      role: roleSelect.value,
      newsletter: newsletterCheck.checked,
      date: new Date().toLocaleString()
    };

    // Check for duplicate emails
    const emailExists = entries.some(item => item.email === newEntry.email);
    if (emailExists) {
      showToast('This email is already registered on the waitlist!', 'warning');
      return;
    }

    // Submit UI Feedback
    submitBtn.textContent = 'Registering...';
    submitBtn.disabled = true;

    // Send data to endpoint
    fetch('https://thebtechguy.com/api/waitlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName: newEntry.firstName,
        lastName: newEntry.lastName,
        email: newEntry.email,
        college: newEntry.college,
        role: newEntry.role,
        newsletter: newEntry.newsletter
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json().catch(() => ({}));
      })
      .then(() => {
        // Save locally to reflect in the Admin Waitlist Console
        entries.unshift(newEntry);
        localStorage.setItem('tbg_waitlist_entries', JSON.stringify(entries));

        registeredEmailEl.textContent = newEntry.email;
        successOverlay.style.display = 'flex';
        showToast("Welcome to TheBTechGuy. You're officially on the waitlist!", 'success');
      })
      .catch(error => {
        console.error('Error submitting waitlist:', error);
        // Fallback: If connection fails, still allow saving locally so data isn't lost, but alert user
        entries.unshift(newEntry);
        localStorage.setItem('tbg_waitlist_entries', JSON.stringify(entries));

        registeredEmailEl.textContent = newEntry.email;
        successOverlay.style.display = 'flex';
        showToast("Secured locally! Offline copy cached.", 'warning');
      })
      .finally(() => {
        submitBtn.textContent = 'Join Waitlist';
        submitBtn.disabled = false;
      });
  });

  resetBtn.addEventListener('click', () => {
    successOverlay.style.display = 'none';
    form.reset();
  });

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function showToast(message, type = 'success') {
    const alertSpan = customAlert.querySelector('span');
    alertSpan.textContent = message;

    if (type === 'error') {
      customAlert.style.background = '#fff5f5';
      customAlert.style.borderColor = '#c92a2a';
      customAlert.style.color = '#c92a2a';
    } else if (type === 'warning') {
      customAlert.style.background = '#fff9db';
      customAlert.style.borderColor = '#f59f00';
      customAlert.style.color = '#f59f00';
    } else {
      // success
      customAlert.style.background = '#ebfbee';
      customAlert.style.borderColor = '#2b8a3e';
      customAlert.style.color = '#2b8a3e';
    }

    customAlert.classList.add('show');
    setTimeout(() => {
      customAlert.classList.remove('show');
    }, 4000);
  }

  // --- 4. Admin Waitlist Console Modal ---
  const populateTable = (filterText = '') => {
    tableBody.innerHTML = '';
    const query = filterText.toLowerCase().trim();

    const filtered = entries.filter(item =>
      item.firstName.toLowerCase().includes(query) ||
      item.lastName.toLowerCase().includes(query) ||
      item.email.toLowerCase().includes(query) ||
      item.college.toLowerCase().includes(query) ||
      item.role.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" class="empty-state">No waitlist entries match your search query.</td></tr>`;
      return;
    }

    filtered.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${escapeHTML(item.firstName)}</td>
        <td>${escapeHTML(item.lastName)}</td>
        <td>${escapeHTML(item.email)}</td>
        <td>${escapeHTML(item.college)}</td>
        <td><span class="header-badge" style="font-size: 0.7rem; font-weight:600; padding: 0.2rem 0.5rem; text-transform: uppercase;">${escapeHTML(item.role)}</span></td>
        <td>${escapeHTML(item.date)}</td>
      `;
      tableBody.appendChild(tr);
    });
  };

  function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g,
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  const openConsole = () => {
    populateTable();
    dashboardModal.classList.add('show');
  };

  const closeConsole = () => {
    dashboardModal.classList.remove('show');
  };

  // Bind Open/Close Events
  logoTrigger.addEventListener('dblclick', (e) => {
    e.preventDefault();
    openConsole();
  });
  adminTrigger.addEventListener('click', (e) => {
    e.preventDefault();
    openConsole();
  });
  closeDashboardBtn.addEventListener('click', closeConsole);

  dashboardModal.addEventListener('click', (e) => {
    if (e.target === dashboardModal) {
      closeConsole();
    }
  });

  // Table filtering
  searchInput.addEventListener('input', (e) => {
    populateTable(e.target.value);
  });

  // CSV Exporter
  exportBtn.addEventListener('click', () => {
    if (entries.length === 0) return;

    let csv = 'data:text/csv;charset=utf-8,First Name,Last Name,Email,College / Company,Role,SignUp Date,Receive Updates\n';

    entries.forEach(item => {
      const receiveUpdates = item.newsletter ? 'YES' : 'NO';
      const row = `"${item.firstName.replace(/"/g, '""')}","${item.lastName.replace(/"/g, '""')}","${item.email.replace(/"/g, '""')}","${item.college.replace(/"/g, '""')}","${item.role}","${item.date}","${receiveUpdates}"`;
      csv += row + '\n';
    });

    const encoded = encodeURI(csv);
    const link = document.createElement('a');
    link.setAttribute('href', encoded);
    link.setAttribute('download', `thebtechguy_waitlist_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Waitlist entries exported to CSV successfully!');
  });
});



/* ==========================================================================
   TheBTechGuy — Hero interactions
   1. Staggered reveal for [data-reveal] elements
   2. Subtle cursor-follow parallax on the orbit visual
   3. Scroll cue click handler
   All motion respects prefers-reduced-motion.
   ========================================================================== */
/* ==========================================================================
   TheBTechGuy — Hero interactions
   1. Staggered reveal for [data-reveal] elements
   2. Subtle cursor-follow parallax on the orbit visual
   3. Rising ember particle field (randomised, reduced-motion aware)
   4. Scroll cue click handler
   ========================================================================== */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -------------------------------------------------------------------- */
  /* 1. Reveal sequence                                                    */
  /* -------------------------------------------------------------------- */

  var revealEls = document.querySelectorAll('[data-reveal]');

  revealEls.forEach(function (el) {
    var delay = el.getAttribute('data-delay') || 0;
    el.style.setProperty('--d', delay);
  });

  if ('IntersectionObserver' in window && !reduceMotion) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* -------------------------------------------------------------------- */
  /* 2. Cursor parallax on the orbit visual                                */
  /* -------------------------------------------------------------------- */

  var hero = document.getElementById('hero');
  var orbitField = document.getElementById('orbitField');
  var isTouch = window.matchMedia('(hover: none)').matches;
  var rafId = null;
  var targetX = 0, targetY = 0, currentX = 0, currentY = 0;

  if (hero && orbitField && !reduceMotion && !isTouch) {
    hero.addEventListener('mousemove', function (e) {
      var rect = hero.getBoundingClientRect();
      var relX = (e.clientX - rect.left) / rect.width - 0.5;
      var relY = (e.clientY - rect.top) / rect.height - 0.5;

      targetX = relX * 16;
      targetY = relY * 16;

      if (!rafId) {
        rafId = requestAnimationFrame(applyParallax);
      }
    });

    hero.addEventListener('mouseleave', function () {
      targetX = 0;
      targetY = 0;
      if (!rafId) {
        rafId = requestAnimationFrame(applyParallax);
      }
    });
  }

  function applyParallax() {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;

    orbitField.style.transform =
      'translate(' + currentX.toFixed(2) + 'px, ' + currentY.toFixed(2) + 'px)';

    if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
      rafId = requestAnimationFrame(applyParallax);
    } else {
      rafId = null;
    }
  }

  /* -------------------------------------------------------------------- */
  /* 3. Ember particle field                                               */
  /* -------------------------------------------------------------------- */

  var emberContainer = document.getElementById('heroEmbers');

  if (emberContainer && !reduceMotion) {
    var EMBER_COUNT = window.innerWidth < 640 ? 12 : 24;

    for (var i = 0; i < EMBER_COUNT; i++) {
      var ember = document.createElement('span');
      ember.className = 'ember';

      var size = (Math.random() * 2.5 + 1.5).toFixed(1) + 'px';
      var left = (Math.random() * 100).toFixed(2) + '%';
      var duration = (Math.random() * 7 + 7).toFixed(1) + 's';
      var delay = (Math.random() * -14).toFixed(1) + 's';
      var drift = (Math.random() * 60 - 30).toFixed(0) + 'px';

      ember.style.setProperty('--size', size);
      ember.style.setProperty('--dur', duration);
      ember.style.setProperty('--delay', delay);
      ember.style.setProperty('--drift', drift);
      ember.style.left = left;

      emberContainer.appendChild(ember);
    }
  }

  /* -------------------------------------------------------------------- */
  /* 4. Scroll cue                                                         */
  /* -------------------------------------------------------------------- */

  var scrollCue = document.getElementById('scrollCue');

  if (scrollCue) {
    scrollCue.addEventListener('click', function () {
      var next = hero.nextElementSibling;
      var target = next || null;

      if (target) {
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      } else {
        window.scrollTo({
          top: window.innerHeight,
          behavior: reduceMotion ? 'auto' : 'smooth'
        });
      }
    });
  }
})();