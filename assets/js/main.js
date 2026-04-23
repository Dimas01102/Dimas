// ─── EmailJS Init ─────────────────────────────────────────
emailjs.init('wvtop_nt2tONpxD-8');

// ─── AOS ──────────────────────────────────────────────────
AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true, offset: 60 });

// ─── Footer Year ──────────────────────────────────────────
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ─── Typing Effect ────────────────────────────────────────
const phrases = [
  'Fullstack Web Developer',
  'PHP & Laravel Enthusiast',
  'Back End Developer',
  'Tech Enthusiast',
  'Problem Solver',
];
let phraseIdx = 0, charIdx = 0, isDeleting = false;
const typedEl = document.getElementById('typed-text');

function runTyping() {
  if (!typedEl) return;
  const current = phrases[phraseIdx];
  if (isDeleting) {
    typedEl.textContent = current.substring(0, charIdx--);
    if (charIdx < 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      setTimeout(runTyping, 500);
      return;
    }
    setTimeout(runTyping, 40);
  } else {
    typedEl.textContent = current.substring(0, charIdx++);
    if (charIdx > current.length) {
      isDeleting = true;
      setTimeout(runTyping, 1800);
      return;
    }
    setTimeout(runTyping, 80);
  }
}
setTimeout(runTyping, 800);

// ─── Navbar Scroll ────────────────────────────────────────
const navbar = document.getElementById('navbar');

function onScroll() {
  if (!navbar) return;
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  highlightNav();
}
window.addEventListener('scroll', onScroll, { passive: true });

// ─── Active Nav Highlight ─────────────────────────────────
const allSections = document.querySelectorAll('section[id]');
const allNavLinks = document.querySelectorAll('.nav-link');

function highlightNav() {
  let current = '';
  allSections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  allNavLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });
}

// ─── Hamburger ────────────────────────────────────────────
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.innerHTML = isOpen
      ? '<i class="fa fa-times" style="font-size:1.1rem"></i>'
      : '<i class="fa fa-bars"  style="font-size:1.1rem"></i>';
  });
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.innerHTML = '<i class="fa fa-bars" style="font-size:1.1rem"></i>';
    });
  });
}

// ─── Smooth Scroll ────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ─── Progress Bars ────────────────────────────────────────
const skillsSection = document.getElementById('skills');
if (skillsSection) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.progress-fill').forEach(bar => {
          bar.style.transform = `scaleX(${parseFloat(bar.dataset.width) / 100})`;
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  observer.observe(skillsSection);
}

// ─── Dark / Light Mode ────────────────────────────────────
function applyTheme(mode) {
  if (mode === 'light') {
    document.body.classList.add('light-mode');

    document.querySelectorAll('.theme-icon').forEach(icon => {
      icon.className = 'theme-icon fa fa-moon';
    });
  } else {
    document.body.classList.remove('light-mode');
    document.querySelectorAll('.theme-icon').forEach(icon => {
      icon.className = 'theme-icon fa fa-sun';
    });
  }
  localStorage.setItem('dp-theme', mode);
}

// Load saved theme
applyTheme(localStorage.getItem('dp-theme') || 'dark');

// FIX: pasang event listener ke SEMUA tombol theme (bukan hanya getElementById yg pertama)
document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const isLight = document.body.classList.contains('light-mode');
    applyTheme(isLight ? 'dark' : 'light');
  });
});

// ─── Contact Form (EmailJS) ───────────────────────────────
const submitBtn   = document.getElementById('submit-btn');
const fSuccess    = document.getElementById('form-success');
const fError      = document.getElementById('form-error');
const fLoading    = document.getElementById('form-loading');

function showFeedback(el) {
  [fSuccess, fError, fLoading].forEach(e => { if (e) e.classList.remove('show'); });
  if (el) el.classList.add('show');
}
function clearFeedback() {
  [fSuccess, fError, fLoading].forEach(e => { if (e) e.classList.remove('show'); });
}

function submitForm() {
  const name    = (document.getElementById('contact-name')?.value    || '').trim();
  const email   = (document.getElementById('contact-email')?.value   || '').trim();
  const subject = (document.getElementById('contact-subject')?.value || '').trim();
  const message = (document.getElementById('contact-message')?.value || '').trim();

  if (!name || !email || !message) {
    showFeedback(fError);
    const errSpan = fError?.querySelector('span');
    if (errSpan) errSpan.textContent = 'Mohon isi Nama, Email, dan Pesan.';
    setTimeout(clearFeedback, 4000);
    return;
  }
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) {
    showFeedback(fError);
    const errSpan = fError?.querySelector('span');
    if (errSpan) errSpan.textContent = 'Format email tidak valid.';
    setTimeout(clearFeedback, 4000);
    return;
  }

  showFeedback(fLoading);
  if (submitBtn) submitBtn.disabled = true;

  const params = {
    from_name:  name,
    from_email: email,
    subject:    subject || '(Tidak ada subjek)',
    message:    message,
    to_name:    'Dimas Dwi Prasetiyo',
  };

  emailjs.send('service_a2rmuqt', 'template_ztwshfq', params)
    .then(() => {
      showFeedback(fSuccess);
      ['contact-name','contact-email','contact-subject','contact-message'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
      setTimeout(clearFeedback, 6000);
    })
    .catch(err => {
      console.error('EmailJS error:', err);
      showFeedback(fError);
      const errSpan = fError?.querySelector('span');
      if (errSpan) errSpan.textContent = 'Gagal mengirim. Coba lagi atau hubungi via email langsung.';
      setTimeout(clearFeedback, 6000);
    })
    .finally(() => {
      if (submitBtn) submitBtn.disabled = false;
    });
}

window.submitForm = submitForm;
