const body = document.body;
const topbar = document.querySelector('.topbar');
const menuButton = document.querySelector('[data-menu-button]');
const drawer = document.querySelector('[data-drawer]');
const overlay = document.querySelector('[data-overlay]');
const drawerClose = document.querySelector('[data-drawer-close]');

function setHeaderState() {
  if (!topbar) return;
  topbar.classList.toggle('scrolled', window.scrollY > 10);
}

function openDrawer() {
  if (!drawer || !overlay) return;
  drawer.classList.add('show');
  overlay.classList.add('show');
  body.classList.add('menu-open');
}

function closeDrawer() {
  if (!drawer || !overlay) return;
  drawer.classList.remove('show');
  overlay.classList.remove('show');
  body.classList.remove('menu-open');
}

menuButton?.addEventListener('click', openDrawer);
drawerClose?.addEventListener('click', closeDrawer);
overlay?.addEventListener('click', closeDrawer);

document.querySelectorAll('[data-drawer-link]').forEach((link) => {
  link.addEventListener('click', closeDrawer);
});

window.addEventListener('scroll', setHeaderState);
setHeaderState();

const revealItems = document.querySelectorAll('.reveal');
if (revealItems.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function initSlider(root) {
  const overlayEl = root.querySelector('[data-slider-overlay]');
  const handleEl = root.querySelector('[data-slider-handle]');
  if (!overlayEl || !handleEl) return;

  let dragging = false;

  const move = (clientX) => {
    const rect = root.getBoundingClientRect();
    let position = ((clientX - rect.left) / rect.width) * 100;
    position = Math.max(0, Math.min(100, position));
    overlayEl.style.width = `${position}%`;
    handleEl.style.left = `${position}%`;
  };

  const start = (event) => {
    dragging = true;
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    move(clientX);
  };

  const update = (event) => {
    if (!dragging) return;
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    move(clientX);
  };

  const end = () => {
    dragging = false;
  };

  root.addEventListener('mousedown', start);
  root.addEventListener('touchstart', start, { passive: true });
  window.addEventListener('mousemove', update);
  window.addEventListener('touchmove', update, { passive: true });
  window.addEventListener('mouseup', end);
  window.addEventListener('touchend', end);
}

document.querySelectorAll('[data-before-after]').forEach(initSlider);

document.querySelectorAll('.faq-item').forEach((item) => {
  const btn = item.querySelector('.faq-question');
  btn?.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach((openItem) => {
      if (openItem !== item) openItem.classList.remove('open');
    });
    item.classList.toggle('open', !isOpen);
  });
});

const copyButtons = document.querySelectorAll('[data-copy]');
copyButtons.forEach((btn) => {
  btn.addEventListener('click', async () => {
    const value = btn.getAttribute('data-copy');
    try {
      await navigator.clipboard.writeText(value);
      const original = btn.innerHTML;
      btn.innerHTML = '<span class="material-symbols-outlined">check</span> تم النسخ';
      setTimeout(() => {
        btn.innerHTML = original;
      }, 1800);
    } catch (error) {
      alert('تعذر النسخ تلقائياً، برجاء نسخ الرقم يدوياً: ' + value);
    }
  });
});

const forms = document.querySelectorAll('[data-demo-form]');
forms.forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      const oldLabel = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="material-symbols-outlined">check_circle</span> تم الإرسال';
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = oldLabel;
        form.reset();
      }, 1800);
    }
  });
});

const testimonialTracks = document.querySelectorAll('[data-testimonial-track]');

testimonialTracks.forEach((track) => {
  const container = track.closest('.testimonial-wrap');
  const prevBtn = container?.querySelector('[data-testimonial-prev]');
  const nextBtn = container?.querySelector('[data-testimonial-next]');
  const step = () => Math.max(track.clientWidth * 0.82, 280);

  prevBtn?.addEventListener('click', () => {
    track.scrollBy({ left: step(), behavior: 'smooth' });
  });

  nextBtn?.addEventListener('click', () => {
    track.scrollBy({ left: -step(), behavior: 'smooth' });
  });
});
