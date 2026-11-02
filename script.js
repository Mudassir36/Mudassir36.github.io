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

  const WA = 'https://wa.me/923141356104?text=' + encodeURIComponent("Hi Mudassir, I came from your portfolio and I'd like to discuss a project.");
  const waBtn = `<a class="wa" href="${WA}" target="_blank" rel="noopener">WhatsApp Mudassir</a>`;
  const go = (id, text) => `<a href="#${id}" data-close>${text}</a>`;

  // ---- Jawab (aap yahan text badal sakte hain) ----
  const intents = [
    { id: 'greet', words: ['hi', 'hello', 'hey', 'salam', 'assalam', 'aoa', 'slam', 'hy', 'good morning', 'good evening'],
      reply: `Hello, and welcome! I'm Mudassir's assistant. I can tell you about his <strong>services, products, past work</strong> and how to start a project. What would you like to know?` },

    { id: 'price', words: ['price', 'pricing', 'cost', 'charges', 'rate', 'rates', 'budget', 'fee', 'fees', 'kitne', 'kitna', 'paisay', 'paise', 'qeemat', 'how much', 'package'],
      reply: `Every project is different, so Mudassir gives a <strong>fixed, clear quote</strong> after a free consultation. No hidden charges. Share what you need on WhatsApp and you'll usually get a plan and price the <strong>same day</strong>.`,
      actions: () => waBtn },

    { id: 'services', words: ['service', 'services', 'offer', 'what do you do', 'kya karte', 'kaam kya', 'help me', 'provide'],
      reply: `Through <strong>Horizonium Tech</strong>, Mudassir offers:<ul><li><strong>Web Development</strong>: business websites, WordPress, WooCommerce</li><li><strong>Custom Software</strong>: management systems</li><li><strong>AI Solutions</strong>: chatbots, AI phone receptionist, automation</li><li><strong>Digital Services</strong>: SEO, social media design, Etsy SEO</li><li><strong>AI Videos &amp; Graphic Design</strong></li><li><strong>Custom E-books</strong></li></ul>`,
      actions: () => go('services', 'See all services') },

    { id: 'web', words: ['website', 'web site', 'wordpress', 'woocommerce', 'elementor', 'online store', 'ecommerce', 'e-commerce', 'landing page', 'site'],
      reply: `Yes! Mudassir builds <strong>fast, mobile-friendly websites</strong>: business sites, WordPress &amp; Elementor sites and WooCommerce online stores. Examples: the <strong>Al Ufuq Travel &amp; Tours</strong> website and <strong>horizoniumtech.com</strong>.`,
      actions: () => go('projects', 'View websites') + waBtn },

    { id: 'software', words: ['software', 'system', 'management', 'school', 'madrasa', 'madrassa', 'travel agency', 'housing', 'society', 'erp', 'crm', 'portal', 'dashboard', 'attendance', 'biometric', 'fingerprint'],
      reply: `Mudassir builds <strong>custom management software</strong> that fits how your team works. Ready-made systems are also available and can be customised:<ul><li>Travel Agency System (bookings, clients, accounts)</li><li>School &amp; Madrasa System (fees, attendance, results)</li><li>Housing Society System (plots, charges, expenses)</li><li>Biometric Attendance (staff time, salary sheets)</li></ul>`,
      actions: () => go('projects', 'See software work') + waBtn },

    { id: 'ai', words: ['ai', 'chatbot', 'chat bot', 'bot', 'automation', 'automate', 'receptionist', 'gpt', 'artificial'],
      reply: `<strong>AI Solutions</strong> include:<ul><li>AI chatbots for your website &amp; WhatsApp</li><li>AI phone receptionist that answers calls</li><li>Workflow automation to save staff time</li></ul>Mudassir also makes <strong>AI product videos</strong> for ads and reels.`,
      actions: () => waBtn },

    { id: 'video', words: ['video', 'videos', 'reel', 'reels', 'commercial', 'ad', 'ads', 'advert', 'tiktok', 'animation'],
      reply: `Mudassir creates <strong>AI product videos</strong>: cinematic product commercials and vertical 9:16 reels for Instagram &amp; TikTok. You can watch samples in the <strong>AI Videos</strong> tab.`,
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
      reply: `Some recent work:<ul><li>Travel Agency Software (booking &amp; accounts)</li><li>School Attendance Software (fingerprint, Urdu UI)</li><li>Al Ufuq Travel &amp; Tours website</li><li>Horizonium Tech website</li><li>AI product videos &amp; graphic designs</li></ul>Mudassir has <strong>100+ projects</strong> and <strong>100+ happy clients</strong>.`,
      actions: () => go('projects', 'View all work') },

    { id: 'about', words: ['who', 'about', 'mudassir', 'founder', 'ceo', 'owner', 'horizonium', 'company', 'aap kaun'],
      reply: `<strong>Mudassir Khan</strong> is a software developer and the <strong>Founder &amp; CEO of Horizonium Tech</strong>, a digital company building websites, custom software, AI tools and digital services for businesses, schools and agencies.`,
      actions: () => go('about', 'Read more') + `<a href="https://horizoniumtech.com/" target="_blank" rel="noopener">horizoniumtech.com</a>` },

    { id: 'contact', words: ['contact', 'whatsapp', 'phone', 'number', 'call', 'email', 'mail', 'reach', 'hire', 'talk', 'baat', 'raabta', 'rabta'],
      reply: `You can reach Mudassir directly:<ul><li>WhatsApp / Phone: <strong>+92 314 1356104</strong></li><li>Email: <strong>mk5208694@gmail.com</strong></li></ul>WhatsApp is the fastest way to get a reply.`,
      actions: () => waBtn + `<a href="mailto:mk5208694@gmail.com">Send email</a>` },

    { id: 'support', words: ['support', 'maintenance', 'hosting', 'server', 'backup', 'update', 'after'],
      reply: `Yes, support continues <strong>after launch</strong>: secure cloud hosting, backups, updates and quick help on WhatsApp so your system never stops.`,
      actions: () => waBtn },

    { id: 'urdu', words: ['urdu', 'language', 'arabic', 'hijri'],
      reply: `Software can be made in <strong>Urdu, English or both</strong>, so your staff can use it easily. Hijri and Gregorian dates are supported too.` },

    { id: 'thanks', words: ['thanks', 'thank you', 'thx', 'shukriya', 'shukria', 'jazakallah', 'jazak', 'ok', 'okay', 'great', 'nice'],
      reply: `You're welcome! If you have a project in mind, Mudassir would be happy to help.`,
      actions: () => waBtn },

    { id: 'bye', words: ['bye', 'goodbye', 'allah hafiz', 'khuda hafiz', 'see you'],
      reply: `Allah Hafiz! Feel free to come back anytime.` }
  ];

  const fallback = {
    reply: `I'm not sure about that one. Mudassir can answer it personally. Message him on WhatsApp, or pick a topic below.`,
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
      botReply({ reply: `Assalam o Alaikum! 👋 I'm <strong>Mudassir's assistant</strong>. Ask me about services, prices, past work or how to start a project.` });
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
