// ===== 0. Intro animation =====
const intro = document.getElementById('intro');
if (intro && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.body.classList.add('intro-active');
  window.scrollTo(0, 0);
  setTimeout(() => {
    intro.remove();
    document.body.classList.remove('intro-active');
  }, 2400);
} else if (intro) {
  intro.remove();
}

// ===== 1. Mobile menu =====
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  menuToggle.classList.toggle('open');
});

// Menu ke bahar click karne par band ho jaye
document.addEventListener('click', e => {
  if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
    navLinks.classList.remove('open');
    menuToggle.classList.remove('open');
  }
});

// Link click hone par menu band ho jaye
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.classList.remove('open');
  });
});

// ===== 2. Navbar shadow + active link on scroll =====
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const menuItems = document.querySelectorAll('.nav-links a:not(.btn)');

const progress = document.getElementById('scrollProgress');
const backTop = document.getElementById('backTop');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);

  // Upar progress line aur back-to-top button
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  backTop.classList.toggle('show', window.scrollY > 600);

  let current = 'home';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  menuItems.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
});

// ===== 3. Typing effect =====
const words = ['custom software.', 'business websites.', 'management systems.', 'AI product videos.'];
const typed = document.getElementById('typed');
let wordIndex = 0, charIndex = 0, deleting = false;

function typeLoop() {
  const word = words[wordIndex];
  typed.textContent = word.substring(0, charIndex);

  if (!deleting && charIndex < word.length) {
    charIndex++;
    setTimeout(typeLoop, 80);
  } else if (deleting && charIndex > 0) {
    charIndex--;
    setTimeout(typeLoop, 40);
  } else {
    deleting = !deleting;
    if (!deleting) wordIndex = (wordIndex + 1) % words.length;
    setTimeout(typeLoop, deleting ? 1600 : 300);
  }
}
typeLoop();

// ===== 4. Scroll reveal + skill bars + counters =====
// Number 1 se shuru ho kar target tak smooth tareeqe se barhe
function countUp(counter) {
  const target = +counter.dataset.count;
  const duration = 1800;
  const start = performance.now();
  counter.textContent = 1;
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);          // aakhir mein aahista
    counter.textContent = Math.max(1, Math.round(1 + (target - 1) * eased));
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    el.classList.add('visible');

    // Skill bar fill
    const fill = el.querySelector('.fill');
    if (fill) fill.style.width = fill.dataset.width + '%';

    // Number counters
    // Intro chal raha ho to us ke khatam hone ke baad ginti shuru ho
    const wait = document.body.classList.contains('intro-active') ? 2000 : 0;
    el.querySelectorAll('[data-count]').forEach(counter => {
      setTimeout(() => countUp(counter), wait);
    });

    observer.unobserve(el);
  });
}, { threshold: 0.15 });

// Grid ke cards ek ke baad ek aayen (stagger)
document.querySelectorAll('.feature-grid, .skills-grid, .process-grid, .services-grid, .projects-grid, .video-grid, .design-grid')
  .forEach(grid => {
    [...grid.children].forEach((card, i) => {
      if (!card.classList.contains('reveal')) return;
      card.style.transitionDelay = (i % 3) * 0.09 + 's';
      // Aane ke baad delay hata do taake hover foran ho
      card.addEventListener('transitionend', () => { card.style.transitionDelay = ''; }, { once: true });
    });
  });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ===== 5. Contact form validation =====
const form = document.getElementById('contactForm');
const statusEl = document.getElementById('formStatus');
const MY_EMAIL = 'mk5208694@gmail.com';

form.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const message = document.getElementById('message');
  let valid = true;

  [name, email, message].forEach(input => {
    const ok = input.value.trim() !== '' &&
      (input.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value));
    input.parentElement.classList.toggle('error', !ok);
    if (!ok) valid = false;
  });

  if (!valid) {
    statusEl.textContent = 'Please fill in all fields correctly.';
    statusEl.className = 'form-status err';
    return;
  }

  // User ke email app mein message khul jayega
  const subject = encodeURIComponent('Project inquiry from ' + name.value);
  const body = encodeURIComponent(message.value + '\n\nFrom: ' + name.value + ' (' + email.value + ')');
  window.location.href = `mailto:${MY_EMAIL}?subject=${subject}&body=${body}`;

  statusEl.textContent = 'Thank you! Your email app is opening...';
  statusEl.className = 'form-status ok';
  form.reset();
});

// ===== 6. Footer year =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== 7. Dark / Light mode =====
const themeToggle = document.getElementById('themeToggle');

function setTheme(mode) {
  document.body.classList.toggle('dark', mode === 'dark');
  try { localStorage.setItem('theme', mode); } catch (e) {}
}

// Pichli dafa jo mode chuna tha wahi khule
let savedTheme = null;
try { savedTheme = localStorage.getItem('theme'); } catch (e) {}
setTheme(savedTheme || 'light');

themeToggle.addEventListener('click', () => {
  setTheme(document.body.classList.contains('dark') ? 'light' : 'dark');
});

// ===== 8. Custom cursor =====
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
const label = document.getElementById('cursorLabel');
const hasMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (hasMouse) {
  document.body.classList.add('has-cursor');

  let mx = -100, my = -100;             // mouse
  let rx = -100, ry = -100;             // ring ki jagah
  let cw = 36, ch = 36, cr = 18;        // ring ka size / gola-pan
  let mode = '';                         // '', 'hover', 'label', 'snap'
  let snapEl = null, snapRadius = 12, pressed = false;

  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx - 3}px, ${my - 3}px)`;
  });

  function setMode(m, el = null, text = '') {
    mode = m; snapEl = el;
    ring.classList.toggle('is-hover', m === 'hover');
    ring.classList.toggle('is-label', m === 'label');
    ring.classList.toggle('is-snap', m === 'snap');
    dot.classList.toggle('is-label', m === 'label');
    dot.classList.toggle('is-snap', m === 'snap');
    label.innerHTML = text;
    if (el) snapRadius = (parseFloat(getComputedStyle(el).borderRadius) || 10) + 5;
  }

  // Har frame par ring smooth tareeqe se apni jagah aur size par jata hai
  function animate() {
    let tx = mx, ty = my, tw = 36, th = 36, tr;
    if (mode === 'snap' && snapEl) {
      const r = snapEl.getBoundingClientRect();
      tx = r.left + r.width / 2; ty = r.top + r.height / 2;
      tw = r.width + 10; th = r.height + 10; tr = snapRadius;
    } else if (mode === 'hover') { tw = th = 56; }
    else if (mode === 'label') { tw = th = 86; }
    if (tr === undefined) tr = tw / 2;

    const k = mode === 'snap' ? 0.26 : 0.18;
    rx += (tx - rx) * k; ry += (ty - ry) * k;
    cw += (tw - cw) * 0.22; ch += (th - ch) * 0.22; cr += (tr - cr) * 0.22;
    const s = pressed ? 0.88 : 1;

    ring.style.width = cw + 'px';
    ring.style.height = ch + 'px';
    ring.style.borderRadius = cr + 'px';
    ring.style.transform = `translate(${rx - cw / 2}px, ${ry - ch / 2}px) scale(${s})`;
    requestAnimationFrame(animate);
  }
  animate();

  const arrow = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M8 7h9v9"/></svg>';
  const play = '<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4v16l13-8z"/></svg>';

  // Project / video cards: "View" ya "Play"
  document.querySelectorAll('.project').forEach(el => {
    const isVideo = el.classList.contains('video-card');
    el.addEventListener('mouseenter', () => setMode('label', null, isVideo ? play + ' Play' : 'View ' + arrow));
    el.addEventListener('mouseleave', () => setMode(''));
  });

  // Buttons, menu links, tabs: ring un ki shakal le leta hai
  document.querySelectorAll('.btn, .theme-toggle, .menu-toggle, .work-tab, .nav-links a, .logo, .contact-item, .back-top').forEach(el => {
    if (el.closest('.project')) return;
    el.addEventListener('mouseenter', () => setMode('snap', el));
    el.addEventListener('mouseleave', () => setMode(''));
  });

  // Baqi links par ring bara ho
  document.querySelectorAll('a, button').forEach(el => {
    if (el.closest('.project') || el.matches('.btn, .theme-toggle, .menu-toggle, .work-tab, .nav-links a, .logo, .contact-item, .back-top')) return;
    el.addEventListener('mouseenter', () => setMode('hover'));
    el.addEventListener('mouseleave', () => setMode(''));
  });

  // Form mein likhte waqt cursor chhup jaye
  document.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => { ring.classList.add('is-hidden'); dot.classList.add('is-hidden'); });
    el.addEventListener('mouseleave', () => { ring.classList.remove('is-hidden'); dot.classList.remove('is-hidden'); });
  });

  // Click par ring halka sa dabta hai
  window.addEventListener('mousedown', () => { pressed = true; });
  window.addEventListener('mouseup', () => { pressed = false; });

  // Mouse window se bahar jaye to cursor chhup jaye
  document.addEventListener('mouseleave', () => { dot.style.opacity = 0; ring.style.opacity = 0; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = ''; ring.style.opacity = ''; });

  // Magnetic buttons: button halka sa mouse ki taraf khinchta hai
  document.querySelectorAll('.btn:not(.btn-block), .theme-toggle').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}

// ===== 9. Work filter tabs =====
const tabs = document.querySelectorAll('.work-tab');
const groups = document.querySelectorAll('.work-group');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const f = tab.dataset.filter;
    groups.forEach(g => {
      const show = f === 'all' || g.dataset.category === f;
      g.classList.toggle('hidden', !show);
      g.classList.toggle('solo', f !== 'all');
      if (show) g.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    });
  });
});

// ===== 10. AI video cards =====
const isTouch = !window.matchMedia('(hover: hover) and (pointer: fine)').matches;

document.querySelectorAll('.video-card').forEach(card => {
  const video = card.querySelector('video');
  const soundBtn = card.querySelector('.sound-btn');

  const play = () => { video.play().then(() => card.classList.add('playing')).catch(() => {}); };
  const pause = () => { video.pause(); card.classList.remove('playing'); };

  if (!isTouch) {
    // Computer: mouse upar aaye to chale, hatne par ruk jaye
    card.addEventListener('mouseenter', play);
    card.addEventListener('mouseleave', () => {
      pause(); video.muted = true; soundBtn.classList.remove('unmuted');
    });
  }

  // Click / tap: chalao ya roko
  card.querySelector('.video-box').addEventListener('click', e => {
    if (soundBtn.contains(e.target)) return;
    video.paused ? play() : pause();
  });

  // Awaz on/off
  soundBtn.addEventListener('click', e => {
    e.stopPropagation();
    video.muted = !video.muted;
    soundBtn.classList.toggle('unmuted', !video.muted);
  });
});

// Mobile / tablet: screen par aane par khud chale (bina awaz), bahar jane par ruk jaye
if (isTouch) {
  const vObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const card = entry.target;
      const video = card.querySelector('video');
      if (entry.isIntersecting) {
        video.play().then(() => card.classList.add('playing')).catch(() => {});
      } else {
        video.pause(); card.classList.remove('playing');
      }
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('.video-card').forEach(c => vObserver.observe(c));
}

// ===== 11. AI neural network background =====
(function () {
  const canvas = document.getElementById('aiCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch = !window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  let w, h, dpr, nodes = [], linkDist;
  const mouse = { x: -9999, y: -9999 };

  function setup() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Screen ke size ke hisaab se nodes (mobile par kam)
    const count = Math.min(touch ? 38 : 85, Math.round((w * h) / (touch ? 16000 : 15000)));
    linkDist = w < 600 ? 110 : 150;
    nodes = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - .5) * .35,
      vy: (Math.random() - .5) * .35,
      r: Math.random() * 1.4 + 1,
      hub: i % 7 === 0,            // kuch nodes bare aur chamakdar
      phase: Math.random() * Math.PI * 2
    }));
  }

  function draw(t) {
    const dark = document.body.classList.contains('dark');
    const lineRGB = dark ? '96,165,250' : '79,70,229';
    const dotRGB = dark ? '147,197,253' : '37,99,235';
    const lineA = dark ? .22 : .16;
    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      if (!reduced) {
        a.x += a.vx; a.y += a.vy;
        if (a.x < -20) a.x = w + 20; if (a.x > w + 20) a.x = -20;
        if (a.y < -20) a.y = h + 20; if (a.y > h + 20) a.y = -20;
      }
      // Nodes ke darmiyan lines
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < linkDist) {
          ctx.strokeStyle = `rgba(${lineRGB},${lineA * (1 - d / linkDist)})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      // Mouse ke qareeb nodes se line juray
      const mx = a.x - mouse.x, my = a.y - mouse.y;
      const md = Math.sqrt(mx * mx + my * my);
      if (md < 180) {
        ctx.strokeStyle = `rgba(${lineRGB},${(dark ? .45 : .32) * (1 - md / 180)})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      }
    }

    // Nodes (dots)
    for (const n of nodes) {
      if (n.hub) {
        const pulse = reduced ? 1 : (Math.sin(t / 900 + n.phase) + 1) / 2;
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 10 + pulse * 6);
        g.addColorStop(0, `rgba(${dark ? '167,139,250' : '124,58,237'},${.35 + pulse * .2})`);
        g.addColorStop(1, 'rgba(124,58,237,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(n.x, n.y, 16, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = `rgba(${n.hub ? (dark ? '196,181,253' : '109,91,240') : dotRGB},${dark ? .8 : .55})`;
      ctx.beginPath(); ctx.arc(n.x, n.y, n.hub ? n.r + 1 : n.r, 0, Math.PI * 2); ctx.fill();
    }
  }

  let running = true;
  function loop(t) {
    if (running) draw(t);
    if (!reduced) requestAnimationFrame(loop);
  }

  setup();
  if (reduced) draw(0); else requestAnimationFrame(loop);

  let rt;
  window.addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => { setup(); if (reduced) draw(0); }, 200);
  });
  if (!touch) {
    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    document.addEventListener('mouseleave', () => { mouse.x = mouse.y = -9999; });
  }
  // Tab chhupa ho to animation ruk jaye (battery bachaye)
  document.addEventListener('visibilitychange', () => { running = !document.hidden; });
})();

// ===== 12. Chatbot (Smart FAQ assistant) =====
(function () {
  const bot = document.getElementById('chatbot');
  if (!bot) return;
  const panel = document.getElementById('chatPanel');
  const body = document.getElementById('chatBody');
  const quick = document.getElementById('chatQuick');
  const form = document.getElementById('chatForm');
  const input = document.getElementById('chatText');
  const launcher = document.getElementById('chatLauncher');
  const badge = document.getElementById('chatBadge');
  const teaser = document.getElementById('chatTeaser');

  const WA = 'https://wa.me/923141356104?text=' + encodeURIComponent("Hi Mudasir, I came from your portfolio and I'd like to discuss a project.");
  const waBtn = `<a class="wa" href="${WA}" target="_blank" rel="noopener">WhatsApp Mudasir</a>`;
  const go = (id, text) => `<a href="#${id}" data-close>${text}</a>`;

  // ---- Jawab (aap yahan text badal sakte hain) ----
  const intents = [
    { id: 'greet', words: ['hi', 'hello', 'hey', 'salam', 'assalam', 'aoa', 'slam', 'hy', 'good morning', 'good evening'],
      reply: `Hello, and welcome! I'm Mudasir's assistant. I can tell you about his <strong>services, products, past work</strong> and how to start a project. What would you like to know?` },

    { id: 'price', words: ['price', 'pricing', 'cost', 'charges', 'rate', 'rates', 'budget', 'fee', 'fees', 'kitne', 'kitna', 'paisay', 'paise', 'qeemat', 'how much', 'package'],
      reply: `Every project is different, so Mudasir gives a <strong>fixed, clear quote</strong> after a free consultation. No hidden charges. Share what you need on WhatsApp and you'll usually get a plan and price the <strong>same day</strong>.`,
      actions: () => waBtn },

    { id: 'services', words: ['service', 'services', 'offer', 'what do you do', 'kya karte', 'kaam kya', 'help me', 'provide'],
      reply: `Through <strong>Horizonium Tech</strong>, Mudasir offers:<ul><li><strong>Web Development</strong>: business websites, WordPress, WooCommerce</li><li><strong>Custom Software</strong>: management systems</li><li><strong>AI Solutions</strong>: chatbots, AI phone receptionist, automation</li><li><strong>Digital Services</strong>: SEO, social media design, Etsy SEO</li><li><strong>AI Videos &amp; Graphic Design</strong></li><li><strong>Custom E-books</strong></li></ul>`,
      actions: () => go('services', 'See all services') },

    { id: 'web', words: ['website', 'web site', 'wordpress', 'woocommerce', 'elementor', 'online store', 'ecommerce', 'e-commerce', 'landing page', 'site'],
      reply: `Yes! Mudasir builds <strong>fast, mobile-friendly websites</strong>: business sites, WordPress &amp; Elementor sites and WooCommerce online stores. Examples: the <strong>Al Ufuq Travel &amp; Tours</strong> website and <strong>horizoniumtech.com</strong>.`,
      actions: () => go('projects', 'View websites') + waBtn },

    { id: 'software', words: ['software', 'system', 'management', 'school', 'madrasa', 'madrassa', 'travel agency', 'housing', 'society', 'erp', 'crm', 'portal', 'dashboard', 'attendance', 'biometric', 'fingerprint'],
      reply: `Mudasir builds <strong>custom management software</strong> that fits how your team works. Ready-made systems are also available and can be customised:<ul><li>Travel Agency System (bookings, clients, accounts)</li><li>School &amp; Madrasa System (fees, attendance, results)</li><li>Housing Society System (plots, charges, expenses)</li><li>Biometric Attendance (staff time, salary sheets)</li></ul>`,
      actions: () => go('projects', 'See software work') + waBtn },

    { id: 'ai', words: ['ai', 'chatbot', 'chat bot', 'bot', 'automation', 'automate', 'receptionist', 'gpt', 'artificial'],
      reply: `<strong>AI Solutions</strong> include:<ul><li>AI chatbots for your website &amp; WhatsApp</li><li>AI phone receptionist that answers calls</li><li>Workflow automation to save staff time</li></ul>Mudasir also makes <strong>AI product videos</strong> for ads and reels.`,
      actions: () => waBtn },

    { id: 'video', words: ['video', 'videos', 'reel', 'reels', 'commercial', 'ad', 'ads', 'advert', 'tiktok', 'animation'],
      reply: `Mudasir creates <strong>AI product videos</strong>: cinematic product commercials and vertical 9:16 reels for Instagram &amp; TikTok. You can watch samples in the <strong>AI Videos</strong> tab.`,
      actions: () => go('projects', 'Watch AI videos') },

    { id: 'design', words: ['design', 'graphic', 'poster', 'logo', 'social media', 'post', 'banner', 'flyer', 'canva'],
      reply: `Yes, <strong>graphic design</strong> too: product posters, social media creatives and ad designs that match your brand. See samples in the <strong>Graphic Design</strong> tab.`,
      actions: () => go('projects', 'View designs') },

    { id: 'digital', words: ['seo', 'google business', 'google', 'ranking', 'etsy', 'marketing', 'digital'],
      reply: `<strong>Digital Services</strong>: SEO and Google Business Profile setup, social media design, and Etsy SEO &amp; listing design to help customers find you.`,
      actions: () => waBtn },

    { id: 'ebook', words: ['ebook', 'e-book', 'book', 'books', 'guide', 'lead magnet', 'course'],
      reply: `Horizonium Tech creates <strong>custom branded e-books</strong>: lead magnets, guides and course material for businesses, coaches, schools and creators.`,
      actions: () => waBtn },

    { id: 'time', words: ['time', 'how long', 'days', 'deadline', 'delivery', 'kab tak', 'kitne din', 'duration', 'fast'],
      reply: `It depends on the project. A simple website can be ready in a few days, while custom software takes longer. You'll get a <strong>clear timeline</strong> with the quote, plus regular updates while the work is in progress.` },

    { id: 'process', words: ['process', 'how do you work', 'steps', 'start', 'begin', 'shuru', 'kaise'],
      reply: `It's simple:<ul><li><strong>1. Discover</strong>: we talk about your needs</li><li><strong>2. Design</strong>: you approve the look first</li><li><strong>3. Develop</strong>: with regular updates</li><li><strong>4. Launch &amp; Support</strong>: live, training and support</li></ul>`,
      actions: () => go('process', 'See the process') + waBtn },

    { id: 'work', words: ['portfolio', 'projects', 'project', 'work', 'examples', 'samples', 'previous', 'clients', 'experience'],
      reply: `Some recent work:<ul><li>Travel Agency Software (booking &amp; accounts)</li><li>School Attendance Software (fingerprint, Urdu UI)</li><li>Al Ufuq Travel &amp; Tours website</li><li>Horizonium Tech website</li><li>AI product videos &amp; graphic designs</li></ul>Mudasir has <strong>100+ projects</strong> and <strong>100+ happy clients</strong>.`,
      actions: () => go('projects', 'View all work') },

    { id: 'about', words: ['who', 'about', 'mudassir', 'founder', 'ceo', 'owner', 'horizonium', 'company', 'aap kaun'],
      reply: `<strong>Muhammad Mudasir</strong> is a software developer and the <strong>Founder &amp; CEO of Horizonium Tech</strong>, a digital company building websites, custom software, AI tools and digital services for businesses, schools and agencies.`,
      actions: () => go('about', 'Read more') + `<a href="https://horizoniumtech.com/" target="_blank" rel="noopener">horizoniumtech.com</a>` },

    { id: 'contact', words: ['contact', 'whatsapp', 'phone', 'number', 'call', 'email', 'mail', 'reach', 'hire', 'talk', 'baat', 'raabta', 'rabta'],
      reply: `You can reach Mudasir directly:<ul><li>WhatsApp / Phone: <strong>+92 314 1356104</strong></li><li>Email: <strong>mk5208694@gmail.com</strong></li></ul>WhatsApp is the fastest way to get a reply.`,
      actions: () => waBtn + `<a href="mailto:mk5208694@gmail.com">Send email</a>` },

    { id: 'support', words: ['support', 'maintenance', 'hosting', 'server', 'backup', 'update', 'after'],
      reply: `Yes, support continues <strong>after launch</strong>: secure cloud hosting, backups, updates and quick help on WhatsApp so your system never stops.`,
      actions: () => waBtn },

    { id: 'urdu', words: ['urdu', 'language', 'arabic', 'hijri'],
      reply: `Software can be made in <strong>Urdu, English or both</strong>, so your staff can use it easily. Hijri and Gregorian dates are supported too.` },

    { id: 'thanks', words: ['thanks', 'thank you', 'thx', 'shukriya', 'shukria', 'jazakallah', 'jazak', 'ok', 'okay', 'great', 'nice'],
      reply: `You're welcome! If you have a project in mind, Mudasir would be happy to help.`,
      actions: () => waBtn },

    { id: 'bye', words: ['bye', 'goodbye', 'allah hafiz', 'khuda hafiz', 'see you'],
      reply: `Allah Hafiz! Feel free to come back anytime.` }
  ];

  const fallback = {
    reply: `I'm not sure about that one. Mudasir can answer it personally. Message him on WhatsApp, or pick a topic below.`,
    actions: () => waBtn
  };

  const chips = ['Services', 'Prices', 'Past work', 'AI solutions', 'Contact'];

  // ---- Helpers ----
  const esc = t => t.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function findIntent(text) {
    const t = ' ' + text.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ') + ' ';
    let best = null, score = 0;
    intents.forEach(it => {
      let s = 0;
      it.words.forEach(w => { if (t.includes(' ' + w + ' ') || (w.length > 4 && t.includes(w))) s += w.split(' ').length; });
      if (s > score) { score = s; best = it; }
    });
    return best || fallback;
  }

  function addMsg(html, who) {
    const el = document.createElement('div');
    el.className = 'msg ' + who;
    el.innerHTML = html;
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
    return el;
  }

  function botReply(intent) {
    const typing = addMsg('<span class="typing"><span></span><span></span><span></span></span>', 'bot');
    typing.style.padding = '0';
    setTimeout(() => {
      typing.remove();
      const extra = intent.actions ? `<div class="msg-actions">${intent.actions()}</div>` : '';
      addMsg(intent.reply + extra, 'bot');
    }, 650 + Math.random() * 450);
  }

  function send(text) {
    text = text.trim();
    if (!text) return;
    addMsg(esc(text), 'user');
    botReply(findIntent(text));
  }

  function renderChips() {
    quick.innerHTML = chips.map(c => `<button type="button">${c}</button>`).join('');
    quick.querySelectorAll('button').forEach(b => b.addEventListener('click', () => send(b.textContent)));
  }

  // ---- Open / close ----
  let started = false;
  function open() {
    bot.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    badge.classList.add('hide');
    teaser.classList.remove('show');
    if (!started) {
      started = true;
      renderChips();
      botReply({ reply: `Assalam o Alaikum! 👋 I'm <strong>Mudasir's assistant</strong>. Ask me about services, prices, past work or how to start a project.` });
    }
    if (window.matchMedia('(hover: hover)').matches) setTimeout(() => input.focus(), 300);
  }
  function close() {
    bot.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
  }

  launcher.addEventListener('click', () => bot.classList.contains('open') ? close() : open());
  document.getElementById('chatClose').addEventListener('click', close);
  document.getElementById('teaserClose').addEventListener('click', e => { e.stopPropagation(); teaser.classList.remove('show'); });
  teaser.addEventListener('click', open);
  form.addEventListener('submit', e => { e.preventDefault(); send(input.value); input.value = ''; });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  // Chat ke andar section link dabane par chat band ho jaye
  body.addEventListener('click', e => { if (e.target.closest('[data-close]') && window.innerWidth < 600) close(); });

  // 8 second baad chhota sa "Hi there" bubble
  setTimeout(() => { if (!started) teaser.classList.add('show'); }, 8000);
})();

// ===== 13. AI Agents: rangeen cursors page ko "build" karte hain =====
// Agents asal mouse cursor se ek ke peeche ek (line mein) nikalte hain, kaam karte hain,
// aur kaam khatam hone par wapas line bana kar cursor ke andar ghus kar ghayab ho jate hain.
(function () {
  const status = document.getElementById('agStatus');
  if (!status || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const textEl = document.getElementById('agText');
  const dotsEl = document.getElementById('agDots');
  const replayBtn = document.getElementById('agReplay');
  const toggleBtn = document.getElementById('agToggle');

  const isSmall = window.innerWidth < 768;
  const hasMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const COUNT = isSmall ? 6 : 12;
  const COLORS = ['#2563eb', '#7c3aed', '#db2777', '#f59e0b', '#16a34a', '#0891b2',
                  '#ef4444', '#6366f1', '#ea580c', '#0d9488', '#65a30d', '#c026d3'];
  const NAMES = ['Layout', 'Copy', 'Design', 'Motion', 'QA', 'SEO',
                 'Grid', 'Type', 'Color', 'A11y', 'Perf', 'Polish'];
  const TARGETS = 'h1, .role, .lead, .status-badge, .hero-buttons .btn, .stat, .avatar-wrap, ' +
    '.section-tag, h2.section-title, .section-sub, .founder-card, .product-strip, .feature, .skill, ' +
    '.step, .work-tabs, .projects-grid > .project, .video-card, .design-card, .service, .cta-card, ' +
    '.contact-item, .contact-form, .footer-brand';

  let enabled = true;
  try { enabled = localStorage.getItem('agents') !== 'off'; } catch (e) {}

  // ---- Layer + agents ----
  const layer = document.createElement('div');
  layer.className = 'ag-layer' + (isSmall ? ' hide-labels' : '');
  document.body.appendChild(layer);

  const arrow = '<svg viewBox="0 0 24 24"><path d="M4 2.5l15.5 9-6.8 1.6-3.6 6.4z"/></svg>';
  const agents = [];
  for (let i = 0; i < COUNT; i++) {
    const el = document.createElement('div');
    el.className = 'agent';
    el.style.setProperty('--c', COLORS[i]);
    el.innerHTML = arrow + `<span>${NAMES[i]}</span>`;
    layer.appendChild(el);
    agents.push({ el, color: COLORS[i], x: -60, y: -60, tx: -60, ty: -60, s: 0, ts: 0, busy: false, speed: .14, hidden: true });
  }
  dotsEl.innerHTML = COLORS.slice(0, 5).map(c => `<b style="background:${c}"></b>`).join('');

  function sizeLayer() { layer.style.height = document.documentElement.scrollHeight + 'px'; }
  sizeLayer();
  new ResizeObserver(sizeLayer).observe(document.body);

  // ---- Asal cursor ki jagah (mobile par status bar ke dots) ----
  let mouse = null;
  window.addEventListener('mousemove', e => { mouse = { x: e.clientX, y: e.clientY }; });
  function home() {
    if (hasMouse && mouse) return { x: mouse.x + scrollX, y: mouse.y + scrollY };
    const r = dotsEl.getBoundingClientRect();
    if (r.width) return { x: r.left + 8 + scrollX, y: r.top + 4 + scrollY };
    return { x: -40, y: scrollY + innerHeight * .4 };
  }

  // mode: 'away' (cursor ke andar) | 'enter' (line mein nikal rahe) | 'work' | 'return' (wapas ja rahe)
  let mode = 'away', modeAt = 0, idleSince = 0;

  // ---- Movement loop (har computer par ek jaisi raftaar) ----
  let lastT = performance.now();
  function loop() {
    const now = performance.now();
    const dt = Math.min(4, (now - lastT) / 16.67); lastT = now;
    const h = home();

    if (mode === 'enter') {
      // Leader pehle kaam ki taraf, baqi ek ke peeche ek
      const first = queue[0] ? pageRect(queue[0].el) : { x: innerWidth / 2, y: scrollY + innerHeight / 2 };
      agents.forEach((a, i) => {
        a.speed = i === 0 ? .07 : .22;
        if (i === 0) { a.tx = first.x - 4; a.ty = first.y - 4; }
        else { a.tx = agents[i - 1].x - 14; a.ty = agents[i - 1].y - 10; }
        // ek ke baad ek nikle
        if (now - modeAt > i * 70) { a.hidden = false; a.ts = 1; }
      });
      if (now - modeAt > 900 + COUNT * 70) { mode = 'work'; modeAt = now; }
    }

    if (mode === 'return') {
      // Leader cursor ki taraf, baqi peeche peeche, aur cursor mein ghus kar ghayab
      agents.forEach((a, i) => {
        a.speed = i === 0 ? .16 : .3;
        const prev = agents[i - 1];
        const tgt = i === 0 || prev.hidden ? h : { x: prev.x, y: prev.y };
        a.tx = tgt.x; a.ty = tgt.y;
        const late = now - modeAt > 2600;          // hifazat: zyada der na lage
        if (!a.hidden && (Math.hypot(a.x - h.x, a.y - h.y) < 22 || late)) { a.hidden = true; a.ts = 0; pulseCursor(a.color); }
      });
      if (agents.every(a => a.hidden && a.s < .05)) { mode = 'away'; }
    }

    if (mode === 'away') {
      agents.forEach(a => { a.tx = a.x = h.x; a.ty = a.y = h.y; a.ts = 0; a.hidden = true; });
    }

    for (const a of agents) {
      const k = 1 - Math.pow(1 - a.speed, dt);
      a.x += (a.tx - a.x) * k;
      a.y += (a.ty - a.y) * k;
      a.s += (a.ts - a.s) * (1 - Math.pow(.8, dt));
      a.el.style.transform = `translate(${a.x}px, ${a.y}px) scale(${a.s.toFixed(3)})`;
      a.el.style.opacity = a.s.toFixed(3);
    }
    requestAnimationFrame(loop);
  }

  // Cursor par halki si chamak jab agent andar jaye
  const ring = document.getElementById('cursorRing');
  let pulseT;
  function pulseCursor(color) {
    if (!ring || !hasMouse) return;
    ring.style.boxShadow = `0 0 0 6px ${color}55, 0 0 18px ${color}`;
    ring.style.borderColor = color;
    clearTimeout(pulseT);
    pulseT = setTimeout(() => { ring.style.boxShadow = ''; ring.style.borderColor = ''; }, 220);
  }

  const sleep = ms => new Promise(r => setTimeout(r, ms));
  function arrive(a, max = 900) {
    return new Promise(res => {
      const t0 = performance.now();
      (function check() {
        if (Math.hypot(a.tx - a.x, a.ty - a.y) < 6 || performance.now() - t0 > max) res();
        else requestAnimationFrame(check);
      })();
    });
  }
  function pageRect(el) {
    const r = el.getBoundingClientRect();
    return { x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height, vTop: r.top, vBottom: r.bottom };
  }
  function label(el) {
    const tag = el.tagName.toLowerCase();
    const cls = [...el.classList].find(c => !/^(reveal|visible|ag-pending|ag-reveal)$/.test(c)) || '';
    const r = el.getBoundingClientRect();
    return `${tag}${cls ? '.' + cls : ''} · ${Math.round(r.width)}×${Math.round(r.height)}`;
  }

  // ---- Build queue ----
  const queue = [];
  const built = new WeakSet();
  let startAt = performance.now() + (document.getElementById('intro') ? 2300 : 300);
  let buildStart = 0, buildCount = 0, active = 0;

  function unpend(el) {
    if (!el.classList.contains('ag-pending')) return;
    el.classList.add('ag-reveal');
    el.classList.remove('ag-pending');
    setTimeout(() => el.classList.remove('ag-reveal'), 650);
  }

  async function runTask(a, task) {
    a.busy = true; active++;
    const el = task.el;
    let r = pageRect(el);
    // Bohat door ho (fast scroll) to bas dikha do
    if (r.vBottom < -innerHeight || r.vTop > innerHeight * 2 || r.w === 0) {
      unpend(el); buildCount++; a.busy = false; active--; return;
    }
    a.speed = .16;
    a.tx = r.x - 4; a.ty = r.y - 4;
    await arrive(a);
    r = pageRect(el);

    const box = document.createElement('div');
    box.className = 'ag-box';
    box.style.cssText = `--c:${a.color};left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px`;
    box.innerHTML = `<i></i><i></i><i></i><i></i><span class="ag-tag">${label(el)}</span>`;
    if (r.y - scrollY < 90) box.querySelector('.ag-tag').style.top = '4px';
    layer.appendChild(box);
    requestAnimationFrame(() => box.classList.add('draw'));

    // Kona kheench kar box banaye
    a.speed = .09;
    a.tx = r.x + r.w - 6; a.ty = r.y + r.h - 6;
    await sleep(480);
    unpend(el); buildCount++;
    await sleep(380);
    box.classList.add('out');
    setTimeout(() => box.remove(), 400);
    a.speed = .14;
    // Thora sa side par hat jaye
    a.tx += (Math.random() - .5) * 120; a.ty += (Math.random() - .5) * 80;
    a.busy = false; active--;
  }

  function sectionName(el) {
    const s = el.closest('section, footer');
    if (!s) return 'page';
    if (s.id === 'home') return 'hero';
    return s.id || (s.classList.contains('footer') ? 'footer' : 'section');
  }

  let lastSection = '';
  function updateStatus() {
    if (!enabled) return;
    if (mode === 'enter' || queue.length || active) {
      textEl.innerHTML = `<strong>${COUNT} agents</strong> building ${lastSection || 'page'}…`;
    } else if (mode === 'return') {
      textEl.innerHTML = `Agents returning to your cursor…`;
    } else if (buildCount) {
      const secs = ((performance.now() - buildStart) / 1000).toFixed(1);
      textEl.innerHTML = `Built by <strong>${COUNT} agents</strong> · ${buildCount} blocks in ${secs}s`;
    }
  }

  // ---- Dispatcher ----
  setInterval(() => {
    const now = performance.now();
    if (!enabled || now < startAt) return;

    if (queue.length && (mode === 'away' || mode === 'return')) {
      // Cursor se line bana kar nikle (ya wapas jaate jaate mud jayen)
      if (mode === 'away') {
        const h = home();
        agents.forEach(a => { a.x = a.tx = h.x; a.y = a.ty = h.y; a.s = 0; });
      }
      if (!buildStart || mode === 'away') { buildStart = now; buildCount = 0; }
      lastSection = sectionName(queue[0].el);
      mode = 'enter'; modeAt = now;
    }

    if (mode === 'work') {
      for (const a of agents) {
        if (a.busy || !queue.length) continue;
        const task = queue.shift();
        lastSection = sectionName(task.el);
        runTask(a, task);
      }
      // Sab kaam khatam: thori der ruk kar wapas cursor mein
      if (!queue.length && !active) {
        if (!idleSince) idleSince = now;
        if (now - idleSince > 900) { mode = 'return'; modeAt = now; idleSince = 0; }
      } else idleSince = 0;
    }
    updateStatus();
  }, 70);

  function enqueue(el) {
    if (built.has(el)) return;
    built.add(el);
    el.classList.add('ag-pending');
    queue.push({ el });
    setTimeout(() => unpend(el), 8000);     // hifazat: kabhi chhupa na rahe
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting || !enabled) return;
      if (e.target.offsetParent === null) return;
      enqueue(e.target);
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px 15% 0px' });

  function observeAll() { document.querySelectorAll(TARGETS).forEach(el => io.observe(el)); }
  document.querySelectorAll('.work-tab').forEach(t => t.addEventListener('click', () => setTimeout(observeAll, 50)));

  // ---- On / Off / Replay ----
  function setEnabled(on) {
    enabled = on;
    try { localStorage.setItem('agents', on ? 'on' : 'off'); } catch (e) {}
    layer.style.display = on ? '' : 'none';
    status.classList.toggle('off', !on);
    toggleBtn.setAttribute('aria-label', on ? 'Turn agents off' : 'Turn agents on');
    toggleBtn.innerHTML = on
      ? '<svg class="i" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>'
      : 'Turn on';
    if (!on) {
      queue.length = 0;
      mode = 'away';
      document.querySelectorAll('.ag-pending').forEach(unpend);
      textEl.textContent = 'AI agents off';
    } else {
      textEl.textContent = 'Agents getting ready…';
      observeAll();
    }
  }
  toggleBtn.addEventListener('click', () => setEnabled(!enabled));

  replayBtn.addEventListener('click', () => {
    queue.length = 0;
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    document.documentElement.style.scrollBehavior = '';
    document.querySelectorAll(TARGETS).forEach(el => built.delete(el));
    mode = 'away'; buildStart = 0;
    startAt = performance.now() + 300;
    setTimeout(observeAll, 60);
  });

  requestAnimationFrame(loop);
  setEnabled(enabled);
})();
