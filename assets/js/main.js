(function () {
  'use strict';

  // ─── Helpers ──────────────────────────────────────────────
  /** Safely query a single element */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  /** Safely query all elements */
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // ─── EmailJS Init ──────────────────────────────────────────
  if (typeof emailjs !== 'undefined') {
    emailjs.init('wvtop_nt2tONpxD-8');
  }

  // ─── AOS Init ─────────────────────────────────────────────
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60,
    });
  }

  // ─── Footer Year ──────────────────────────────────────────
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ─── Typing Effect ────────────────────────────────────────
  const phrases = [
    'Fullstack Web Developer',
    'PHP & Laravel Enthusiast',
    'Back End Developer',
    'Tech Enthusiast',
    'Problem Solver',
  ];

  const typedEl = $('#typed-text');
  if (typedEl) {
    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingTimer = null;

    function runTyping() {
      const current = phrases[phraseIdx];
      if (isDeleting) {
        typedEl.textContent = current.substring(0, charIdx--);
        if (charIdx < 0) {
          isDeleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
          typingTimer = setTimeout(runTyping, 500);
          return;
        }
        typingTimer = setTimeout(runTyping, 40);
      } else {
        typedEl.textContent = current.substring(0, charIdx++);
        if (charIdx > current.length) {
          isDeleting = true;
          typingTimer = setTimeout(runTyping, 1800);
          return;
        }
        typingTimer = setTimeout(runTyping, 80);
      }
    }

    typingTimer = setTimeout(runTyping, 800);
  }

  // ─── Navbar Scroll & Active Link ──────────────────────────
  const navbar = $('#navbar');
  const allSections = $$('section[id]');
  const allNavLinks = $$('.nav-link');

  function highlightNav() {
    let current = '';
    allSections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    allNavLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  function onScroll() {
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    }
    highlightNav();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  // Run once on load
  onScroll();

  // ─── Hamburger Menu ────────────────────────────────────────
  const hamburger  = $('#hamburger');
  const mobileMenu = $('#mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      const icon = hamburger.querySelector('i');
      if (icon) {
        icon.className = isOpen ? 'fa fa-times' : 'fa fa-bars';
        icon.style.fontSize = '1.1rem';
      }
    });

    // Tutup menu saat klik link
    $$('.mobile-nav-link', mobileMenu).forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        const icon = hamburger.querySelector('i');
        if (icon) {
          icon.className = 'fa fa-bars';
          icon.style.fontSize = '1.1rem';
        }
      });
    });

    // Tutup menu saat klik di luar
    document.addEventListener('click', (e) => {
      if (!navbar?.contains(e.target)) {
        mobileMenu.classList.remove('open');
        const icon = hamburger.querySelector('i');
        if (icon) {
          icon.className = 'fa fa-bars';
          icon.style.fontSize = '1.1rem';
        }
      }
    });
  }

  // ─── Smooth Scroll ────────────────────────────────────────
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = $(href);
      if (target) {
        e.preventDefault();
        // Offset untuk navbar fixed
        const navH = navbar ? navbar.offsetHeight : 64;
        const top = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ─── Progress Bars (Intersection Observer) ────────────────
  const skillsSection = $('#skills');
  if (skillsSection) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            $$('.progress-fill', entry.target).forEach(bar => {
              const w = parseFloat(bar.dataset.width) || 0;
              bar.style.transform = `scaleX(${w / 100})`;
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(skillsSection);
  }

  // ─── Dark / Light Mode ────────────────────────────────────
  function applyTheme(mode) {
    const isLight = mode === 'light';
    document.body.classList.toggle('light-mode', isLight);

    $$('.theme-icon').forEach(icon => {
      icon.className = isLight ? 'theme-icon fa fa-moon' : 'theme-icon fa fa-sun';
    });

    try {
      localStorage.setItem('dp-theme', mode);
    } catch (_) {
    }
  }

  // Load saved theme (dengan fallback jika localStorage error)
  let savedTheme = 'dark';
  try {
    savedTheme = localStorage.getItem('dp-theme') || 'dark';
  } catch (_) {}
  applyTheme(savedTheme);

  $$('.theme-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const isLight = document.body.classList.contains('light-mode');
      applyTheme(isLight ? 'dark' : 'light');
    });
  });

  // ─── Contact Form (EmailJS) ───────────────────────────────
  const submitBtn = $('#submit-btn');
  const fSuccess  = $('#form-success');
  const fError    = $('#form-error');
  const fLoading  = $('#form-loading');
  const feedbacks = [fSuccess, fError, fLoading].filter(Boolean);

  function showFeedback(el) {
    feedbacks.forEach(e => e.classList.remove('show'));
    if (el) el.classList.add('show');
  }

  function clearFeedback() {
    feedbacks.forEach(e => e.classList.remove('show'));
  }

  function setSubmitLoading(loading) {
    if (!submitBtn) return;
    submitBtn.disabled = loading;
  }

  function submitForm() {
    const nameEl    = $('#contact-name');
    const emailEl   = $('#contact-email');
    const subjectEl = $('#contact-subject');
    const messageEl = $('#contact-message');

    const name    = nameEl?.value?.trim()    || '';
    const email   = emailEl?.value?.trim()   || '';
    const subject = subjectEl?.value?.trim() || '';
    const message = messageEl?.value?.trim() || '';

    // Validasi
    if (!name || !email || !message) {
      const errSpan = fError?.querySelector('span');
      if (errSpan) errSpan.textContent = 'Mohon isi Nama, Email, dan Pesan.';
      showFeedback(fError);
      setTimeout(clearFeedback, 4000);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const errSpan = fError?.querySelector('span');
      if (errSpan) errSpan.textContent = 'Format email tidak valid.';
      showFeedback(fError);
      setTimeout(clearFeedback, 4000);
      return;
    }

    if (typeof emailjs === 'undefined') {
      const errSpan = fError?.querySelector('span');
      if (errSpan) errSpan.textContent = 'Layanan email belum siap, coba refresh halaman.';
      showFeedback(fError);
      return;
    }

    showFeedback(fLoading);
    setSubmitLoading(true);

    const params = {
      from_name:  name,
      from_email: email,
      subject:    subject || '(Tidak ada subjek)',
      message:    message,
      to_name:    'Dimas Dwi Prasetiyo',
    };

    emailjs
      .send('service_a2rmuqt', 'template_ztwshfq', params)
      .then(() => {
        showFeedback(fSuccess);
        // Clear form
        [nameEl, emailEl, subjectEl, messageEl].forEach(el => {
          if (el) el.value = '';
        });
        setTimeout(clearFeedback, 6000);
      })
      .catch(err => {
        console.error('EmailJS error:', err);
        const errSpan = fError?.querySelector('span');
        if (errSpan) errSpan.textContent = 'Gagal mengirim. Coba lagi atau hubungi via email langsung.';
        showFeedback(fError);
        setTimeout(clearFeedback, 6000);
      })
      .finally(() => {
        setSubmitLoading(false);
      });
  }

  // Expose ke global untuk onclick di HTML
  window.submitForm = submitForm;

})();