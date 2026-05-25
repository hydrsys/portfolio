/** Terminal loader animation **/

function initTerminalLoader() {
  const loader = document.getElementById('loading-text');
  const content = document.getElementById('content');
  if (!loader || !content) return;
  // Projects page uses its own loader
  if (loader._projectsLoaderActive) return;

  const lines = [
    '> Initializing connection...',
    '> Decrypting secure layers...',
    '> Access granted to user : user_b',
    '> Loading profile data...',
    '> Try with password : bravo...'
  ];

  let lineIdx = 0;

  function typeLog() {
    if (lineIdx < lines.length) {
      const p = document.createElement('div');
      p.innerHTML = lines[lineIdx];
      loader.appendChild(p);
      lineIdx++;
      setTimeout(typeLog, 400);
    } else {
      setTimeout(() => {
        loader.style.display = 'none';
        content.style.display = 'block';
      }, 300);
    }
  }

  typeLog();
}

/** Language toggle (EN / FR) **/

function initLangSwitch() {
  const langBtn = document.getElementById('lang-switch');
  if (!langBtn) return;

  langBtn.addEventListener('click', () => {
    document.body.classList.toggle('fr-mode');
    const isFR = document.body.classList.contains('fr-mode');
    langBtn.innerText = isFR ? '[ EN ]' : '[ FR ]';

    // About page: swap CV link href depending on language
    const cvLink = document.getElementById('cv-link');
    if (cvLink) {
      cvLink.href = isFR
        ? '../storage/CV - 2026.pdf'
        : '../storage/CV - 2026 - EN.pdf';
    }
  });
}

/** Passion tags — click to reveal description **/

function initPassionTags() {
  const tags = document.querySelectorAll('.passion-tag');
  const descriptionBox = document.getElementById('passion-description');
  if (!tags.length || !descriptionBox) return;

  tags.forEach(tag => {
    tag.addEventListener('click', () => {
      tags.forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
      descriptionBox.style.display = 'block';
      descriptionBox.innerHTML = tag.getAttribute('data-info');
    });
  });
}

/** Index page — countdown timer **/

function initTimer() {
  const timerEl = document.getElementById('timer');
  if (!timerEl) return;

  const startTime = Date.now();
  const duration = 12 * 60 * 1000;

  function updateTimer() {
    const diff = duration - (Date.now() - startTime);
    const isNegative = diff < 0;
    const abs = Math.abs(diff);
    const h  = Math.floor(abs / 3_600_000);
    const m  = Math.floor((abs % 3_600_000) / 60_000);
    const s  = Math.floor((abs % 60_000) / 1_000);
    const ms = Math.floor((abs % 1_000) / 10);

    timerEl.innerText =
      (isNegative ? '-' : '') +
      String(h).padStart(2, '0') + ':' +
      String(m).padStart(2, '0') + ':' +
      String(s).padStart(2, '0') + ':' +
      String(ms).padStart(2, '0');
  }

  setInterval(updateTimer, 10);
}

/** Index page — bottom-right date + ISP/city via ipapi **/

function initDateDisplay() {
  const dateEl = document.getElementById('date');
  if (!dateEl) return;

  const today = new Date().toLocaleDateString('fr-FR');

  fetch('https://ipapi.co/json/')
    .then(res => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then(data => {
      if (data.network && data.city) {
        dateEl.innerText = `${today} | ${data.network.toUpperCase()} - ${data.city.toUpperCase()}`;
      } else {
        dateEl.innerText = `${today} | ERROR`;
      }
    })
    .catch(() => {
      dateEl.innerText = `${today} | ERROR`;
    });
}

/** Projects page — custom terminal loader with project-specific lines **/

function initProjectsLoader() {
  const loader = document.getElementById('loading-text');
  const content = document.getElementById('content');
  if (!loader || !content) return;
  // Only run if we're on the projects page (check for projects-grid)
  if (!document.querySelector('.projects-grid')) return;

  // Override the generic lines with project-specific ones
  loader.innerHTML = '';

  const lines = [
    '> Accessing secure repository...',
    '> Fetching project_manifest.json...',
    '> Verifying checksums...',
    '> Projects found. Rendering...'
  ];

  let lineIdx = 0;

  function typeLog() {
    if (lineIdx < lines.length) {
      const p = document.createElement('div');
      p.innerHTML = lines[lineIdx];
      loader.appendChild(p);
      lineIdx++;
      setTimeout(typeLog, 400);
    } else {
      setTimeout(() => {
        loader.style.display = 'none';
        content.style.display = 'block';
      }, 300);
    }
  }

  // Prevent the generic loader from also running on this page
  loader._projectsLoaderActive = true;
  typeLog();
}

/** Projects page — "Capture Me" CTF button **/

function initCtfButton() {
  const btn = document.getElementById('ctf-button');
  const flagDisplay = document.getElementById('flag-display');
  if (!btn || !flagDisplay) return;

  let clicksNeeded = Math.floor(Math.random() * (30 - 10 + 1)) + 10;
  let currentClicks = 0;

  btn.addEventListener('click', () => {
    currentClicks++;

    if (currentClicks < clicksNeeded) {
      const x = Math.random() * (window.innerWidth  - btn.offsetWidth  - 100);
      const y = Math.random() * (window.innerHeight - btn.offsetHeight - 100);
      btn.style.position = 'fixed';
      btn.style.left = x + 'px';
      btn.style.top  = y + 'px';
      btn.innerText = 'ACCESS_DENIED';
      setTimeout(() => { btn.innerText = 'Try Again'; }, 500);
    } else {
      btn.style.display = 'none';
      flagDisplay.style.display = 'block';
      console.log('Well played, hacker!');
    }
  });
}

/** Bethesavior page - Credential **/

function initLoginPage() {
  const loginBtn = document.querySelector('.login-btn');

  if (!loginBtn) return;

  function checkLogin() {
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;
    const err = document.getElementById('error-msg');

    const hashU = CryptoJS.SHA256(u).toString();
    const hashP = CryptoJS.SHA256(p).toString();

    console.log(hashU);
    console.log(hashP);

    if (
      hashU === '449d911a5a57c56b9eb31294052d9d85385f033902f80f3b1d2156153445fdad' &&
      hashP === 'f144a6907dc4284d1f9fe6a7d9b9ff53c02c1d07ba68f24d413d7ff7f757a782'
    ) {
      alert('ACCESS GRANTED.');
      window.location.href = '/404/systemsaved.html';
    } else {
      err.style.display = 'block';

      setTimeout(() => {
        err.style.display = 'none';
      }, 2000);
    }
  }

  loginBtn.addEventListener('click', checkLogin);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      checkLogin();
    }
  });
}

/** Index page — hint button **/

function initHintButton() {
  const btn   = document.getElementById('hint-btn');
  const popup = document.getElementById('hint-popup');
  const close = document.getElementById('hint-close');
  if (!btn || !popup || !close) return;

  const isMulti = popup.getAttribute('data-multi') === 'true';

  if (isMulti) {
    const next    = document.getElementById('hint-next');
    const textEl  = document.getElementById('hint-text');
    const counter = document.getElementById('hint-counter');

    const hints = [
      "When you are tired, you want to go... home?",
      "The flag is hidden in plain sight... Have you tried reading what's the eyes cannot see at the first time?",
      "Sometimes, flags are in pages we don't suspect... did you try some different pages that don't exist?"
    ];

    let current = 0;

    function showHint(idx) {
      textEl.innerText  = hints[idx];
      counter.innerText = `${idx + 1} / ${hints.length}`;
      next.style.opacity      = idx === hints.length - 1 ? '0.2' : '1';
      next.style.pointerEvents = idx === hints.length - 1 ? 'none' : 'auto';
    }

    btn.addEventListener('click', () => {
      popup.classList.toggle('visible');
      if (popup.classList.contains('visible')) {
        current = 0;
        showHint(current);
      }
    });

    next.addEventListener('click', (e) => {
      e.stopPropagation();
      if (current < hints.length - 1) {
        current++;
        showHint(current);
      }
    });

  } else {
    btn.addEventListener('click', () => {
      popup.classList.toggle('visible');
    });
  }

  close.addEventListener('click', (e) => {
    e.stopPropagation();
    popup.classList.remove('visible');
  });

  document.addEventListener('click', (e) => {
    if (!popup.contains(e.target) && e.target !== btn) {
      popup.classList.remove('visible');
    }
  });
}
/** Projects page — animated solar system **/
 
function initSolarSystem() {
  const canvas = document.getElementById('solar-canvas');
  const panel  = document.getElementById('project-panel');
  if (!canvas || !panel) return;
 
  const ctx = canvas.getContext('2d');
  let lang  = document.body.classList.contains('fr-mode') ? 'fr' : 'en';
  let activePlanet = null;
  let animId = null;
 
  /* ── CATEGORY COLOURS ── */
  const CAT_COLORS = {
    redteam:  '#e05555',
    sysadmin: '#5599e0',
    code:     '#55e0a0',
    ctf:      '#e0c455',
  };
 
  /* ── PROJECTS DATA ── */
  const PROJECTS = [
    {
      id: 0, cat: 'redteam',
      name: { en: 'Vuln Exploitation', fr: 'Exploitation' },
      status: { en: 'COMPLETED', fr: 'TERMINÉ' },
      title:  { en: 'Vulnerability Exploitation', fr: 'Exploitation de Vulnérabilités' },
      desc:   { en: 'Intrusion simulations with Metasploit, Nmap & Pivoting techniques.', fr: 'Simulations d\'intrusions via Metasploit, Nmap et Pivotement.' },
      tags:   ['Metasploit', 'Pentest', 'Nmap'],
      link:   { label: '> EXPLOIT_LOGS', href: '../storage/metasploit.pdf', blank: true },
    },
    {
      id: 1, cat: 'redteam',
      name: { en: 'Linux Intrusion', fr: 'Intrusion Linux' },
      status: { en: 'COMPLETED', fr: 'TERMINÉ' },
      title:  { en: 'Linux Intrusion Test', fr: 'Test d\'intrusion Linux' },
      desc:   { en: 'Boot-to-Root: research & exploitation of a vulnerable machine.', fr: 'Boot-to-Root : exploitation d\'une machine vulnérable.' },
      tags:   ['Intrusion', 'Boot-to-Root', 'Linux'],
      link:   { label: '> VIEW_REPORT', href: '../storage/intrusion.pdf', blank: true },
    },
    {
      id: 2, cat: 'sysadmin',
      name: { en: 'Active Directory', fr: 'Active Directory' },
      status: { en: 'COMPLETED', fr: 'TERMINÉ' },
      title:  { en: 'Active Directory — ValorElec', fr: 'Active Directory — ValorElec' },
      desc:   { en: 'Windows Server infra, PowerShell automation, restrictive GPOs.', fr: 'Infra Windows Server, automatisation PowerShell, GPO restrictives.' },
      tags:   ['Active Directory', 'PowerShell', 'GPO'],
      link:   { label: '> CASE_FILE', href: '../storage/ValorElec.pdf', blank: true },
    },
    {
      id: 3, cat: 'sysadmin',
      name: { en: 'Linux Hardening', fr: 'Hardening Linux' },
      status: { en: 'COMPLETED', fr: 'TERMINÉ' },
      title:  { en: 'Linux Hardening', fr: 'Hardening Linux' },
      desc:   { en: 'SSH keys only, IPTables/UFW firewall, CIS Benchmark compliance.', fr: 'SSH clés uniquement, pare-feu UFW, CIS Benchmark.' },
      tags:   ['Linux', 'Hardening', 'SSH Security'],
      link:   { label: '> SECURITY_POLICIES', href: '../storage/hardening.pdf', blank: true },
    },
    {
      id: 4, cat: 'code',
      name: { en: 'ACB Website', fr: 'Site ACB' },
      status: { en: 'LIVE', fr: 'EN COURS' },
      title:  { en: 'Client Website — ACB', fr: 'Site Web Client — ACB' },
      desc:   { en: 'Full front-end website for a client, hosted on GitHub Pages.', fr: 'Site front-end complet pour un client, hébergé sur GitHub Pages.' },
      tags:   ['HTML', 'CSS', 'JavaScript', 'GitHub'],
      link:   { label: '> VIEW_LIVE_SITE', href: 'https://monpolar.github.io/acb/', blank: true },
    },
    {
      id: 5, cat: 'ctf',
      name: { en: 'CTF Training', fr: 'CTF Training' },
      status: { en: 'LIVE', fr: 'EN COURS' },
      title:  { en: 'CTF Training', fr: 'Entraînement CTF' },
      desc:   { en: 'Root-Me & TryHackMe. Focus on Web exploitation and Privilege Escalation.', fr: 'Root-Me & TryHackMe. Focus : Web & Escalade de Privilèges.' },
      tags:   ['CTF', 'PrivEsc', 'Cyber-Training'],
      link:   { label: '> VIEW_BADGES', href: '#', blank: false },
    },
  ];
 
  /* ── ORBIT SETUP ──
     One orbit per category. Projects in same category are equidistant on that orbit.
     Speed varies per orbit for natural feel.
  */
  const ORBIT_DEFS = [
    { cat: 'redteam',  radiusFactor: 0.18, speed: 0.00025, color: CAT_COLORS.redteam  },
    { cat: 'sysadmin', radiusFactor: 0.27, speed: 0.00016, color: CAT_COLORS.sysadmin },
    { cat: 'code',     radiusFactor: 0.34, speed: 0.00010, color: CAT_COLORS.code     },
    { cat: 'ctf',      radiusFactor: 0.41, speed: 0.00007, color: CAT_COLORS.ctf      },
  ];
 
  /* Assign initial angles — equidistant within orbit */
  const orbitAngleOffset = {}; // keyed by orbitDef.cat
  ORBIT_DEFS.forEach(od => { orbitAngleOffset[od.cat] = 0; });
 
  // Compute per-planet starting angle so they're evenly spread
  ORBIT_DEFS.forEach(od => {
    const planets = PROJECTS.filter(p => p.cat === od.cat);
    const step = (2 * Math.PI) / planets.length;
    planets.forEach((p, i) => { p._angleOffset = step * i; });
  });
 
  /* ── RESIZE ── */
  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);
 
  function cx() { return canvas.width  * 0.5; }
  function cy() { return canvas.height * 0.5; }
 
  /* ── DRAW ── */
  let lastTime = 0;
  const elapsedAngle = {}; // per category cumulative angle
  ORBIT_DEFS.forEach(od => { elapsedAngle[od.cat] = 0; });
 
  function draw(ts) {
    const dt = ts - lastTime;
    lastTime = ts;
 
    ctx.clearRect(0, 0, canvas.width, canvas.height);
 
    const CX = cx(), CY = cy();
    const minDim = Math.min(canvas.width, canvas.height);
 
    /* Stars */
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (!draw._stars) {
      draw._stars = Array.from({ length: 120 }, () => ({
        x: Math.random(), y: Math.random(),
        r: Math.random() * 1.2 + 0.2,
        a: Math.random() * 0.6 + 0.2,
      }));
    }
    draw._stars.forEach(s => {
      ctx.beginPath();
      ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${s.a})`;
      ctx.fill();
    });
 
    /* Sun */
    const sunR = minDim * 0.055;
    const grad = ctx.createRadialGradient(CX, CY, 0, CX, CY, sunR * 1.8);
    grad.addColorStop(0,   'rgba(255,255,255,0.95)');
    grad.addColorStop(0.3, 'rgba(207,122,255,0.7)');
    grad.addColorStop(1,   'rgba(207,122,255,0)');
    ctx.beginPath();
    ctx.arc(CX, CY, sunR * 1.8, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(CX, CY, sunR, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.shadowColor = '#CF7AFF';
    ctx.shadowBlur  = 30;
    ctx.fill();
    ctx.shadowBlur = 0;
 
    /* Orbits + planets */
    ORBIT_DEFS.forEach(od => {
      elapsedAngle[od.cat] += od.speed * dt;
      const R = minDim * od.radiusFactor;
 
      /* Orbit ring */
      ctx.beginPath();
      ctx.arc(CX, CY, R, 0, Math.PI * 2);
      ctx.strokeStyle = od.color + '33';
      ctx.lineWidth   = 1;
      ctx.stroke();
 
      /* Planets */
      const planets = PROJECTS.filter(p => p.cat === od.cat);
      planets.forEach(p => {
        const angle = elapsedAngle[od.cat] + p._angleOffset;
        const px = CX + R * Math.cos(angle);
        const py = CY + R * Math.sin(angle);
        p._px = px; p._py = py; // store for hit detection
 
        const pR     = minDim * 0.028;
        const isActive = activePlanet && activePlanet.id === p.id;
 
        /* Glow when active */
        if (isActive) {
          ctx.beginPath();
          ctx.arc(px, py, pR * 2.2, 0, Math.PI * 2);
          const glow = ctx.createRadialGradient(px, py, 0, px, py, pR * 2.2);
          glow.addColorStop(0, od.color + '66');
          glow.addColorStop(1, 'transparent');
          ctx.fillStyle = glow;
          ctx.fill();
        }
 
        /* Planet body */
        ctx.beginPath();
        ctx.arc(px, py, pR, 0, Math.PI * 2);
        ctx.fillStyle   = isActive ? od.color : od.color + 'aa';
        ctx.shadowColor = od.color;
        ctx.shadowBlur  = isActive ? 18 : 8;
        ctx.fill();
        ctx.shadowBlur  = 0;
 
        /* Floating label above planet */
        ctx.font      = `bold ${Math.max(9, minDim * 0.022)}px 'Courier New', monospace`;
        ctx.fillStyle = isActive ? '#fff' : od.color + 'cc';
        ctx.textAlign = 'center';
        ctx.fillText(p.name[lang], px, py - pR - 7);
      });
    });
 
    animId = requestAnimationFrame(draw);
  }
 
  animId = requestAnimationFrame(draw);
 
  /* ── HIT DETECTION ── */
  canvas.addEventListener('click', e => {
    const rect  = canvas.getBoundingClientRect();
    const mx    = e.clientX - rect.left;
    const my    = e.clientY - rect.top;
    const minDim = Math.min(canvas.width, canvas.height);
    const hitR  = minDim * 0.028 + 6;
 
    let hit = null;
    PROJECTS.forEach(p => {
      if (p._px === undefined) return;
      const dx = mx - p._px, dy = my - p._py;
      if (Math.sqrt(dx * dx + dy * dy) <= hitR) hit = p;
    });
 
    if (!hit) return;
    if (activePlanet && activePlanet.id === hit.id) {
      activePlanet = null;
      panel.classList.remove('visible');
    } else {
      activePlanet = hit;
      renderPanel(hit, lang);
      panel.classList.add('visible');
    }
  });
 
  /* Cursor change on hover */
  canvas.addEventListener('mousemove', e => {
    const rect   = canvas.getBoundingClientRect();
    const mx     = e.clientX - rect.left;
    const my     = e.clientY - rect.top;
    const minDim = Math.min(canvas.width, canvas.height);
    const hitR   = minDim * 0.028 + 6;
    let over = false;
    PROJECTS.forEach(p => {
      if (p._px === undefined) return;
      const dx = mx - p._px, dy = my - p._py;
      if (Math.sqrt(dx * dx + dy * dy) <= hitR) over = true;
    });
    canvas.style.cursor = over ? 'pointer' : 'default';
  });
 
  /* ── PANEL ── */
  function renderPanel(proj, l) {
    const color = CAT_COLORS[proj.cat];
    const tags  = proj.tags.map(t => `<span class="sp-tag" style="color:${color};background:${color}22;">${t}</span>`).join('');
    const blank = proj.link.blank ? 'target="_blank"' : '';
    panel.style.borderColor = color;
    panel.style.boxShadow   = `0 0 20px ${color}33`;
    panel.innerHTML = `
      <div class="sp-status" style="color:${color}">[ ${proj.status[l]} ] — ${proj.cat.toUpperCase()}</div>
      <div class="sp-title">${proj.title[l]}</div>
      <div class="sp-desc">${proj.desc[l]}</div>
      <div class="sp-tags">${tags}</div>
      <a href="${proj.link.href}" ${blank} class="sp-link" style="color:${color};border-color:${color}44;">${proj.link.label}</a>
      <div class="sp-close" id="sp-close">✕</div>
    `;
    document.getElementById('sp-close').addEventListener('click', () => {
      activePlanet = null;
      panel.classList.remove('visible');
    });
  }
 
  /* ── LANGUAGE SWITCH ── */
  const langBtn = document.getElementById('lang-switch');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      lang = document.body.classList.contains('fr-mode') ? 'fr' : 'en';
      if (activePlanet) renderPanel(activePlanet, lang);
    });
  }
}
 
/** INIT **/
 
document.addEventListener('DOMContentLoaded', () => {
  initLangSwitch();
  initProjectsLoader();
  initTerminalLoader();
  initPassionTags();
  initTimer();
  initDateDisplay();
  initCtfButton();
  initLoginPage();
  initHintButton();
  initSolarSystem();
});
  const svg  = document.getElementById('connector-svg');
  if (!wrap || !svg) return;
 
  let activeCat = null;
  let lang = document.body.classList.contains('fr-mode') ? 'fr' : 'en';
 
  const CATEGORIES = [
    { id: 'redteam',  label: { en: 'RED<br>TEAM', fr: 'RED<br>TEAM' } },
    { id: 'sysadmin', label: { en: 'SYSADMIN',    fr: 'SYSADMIN'    } },
    { id: 'code',     label: { en: 'CODE',         fr: 'CODE'        } },
    { id: 'ctf',      label: { en: 'CTF',          fr: 'CTF'         } },
  ];
 
  const CAT_POS = [
    { rx: 0.22, ry: 0.22 },
    { rx: 0.78, ry: 0.22 },
    { rx: 0.22, ry: 0.78 },
    { rx: 0.78, ry: 0.78 },
  ];
 
  const PROJECTS = [
    {
      cat: 'redteam',
      status: { en: 'COMPLETED', fr: 'TERMINÉ' },
      title:  { en: 'Vulnerability Exploitation', fr: 'Exploitation de Vulnérabilités' },
      desc:   { en: 'Intrusion simulations with Metasploit, Nmap & Pivoting.', fr: 'Simulations d\'intrusions via Metasploit, Nmap et Pivotement.' },
      tags:   ['Metasploit', 'Pentest', 'Nmap'],
      link:   { label: '> EXPLOIT_LOGS', href: '../storage/metasploit.pdf', blank: true },
    },
    {
      cat: 'redteam',
      status: { en: 'COMPLETED', fr: 'TERMINÉ' },
      title:  { en: 'Linux Intrusion Test', fr: 'Test d\'intrusion Linux' },
      desc:   { en: 'Boot-to-Root: research & exploitation of a vulnerable machine.', fr: 'Boot-to-Root : exploitation d\'une machine vulnérable.' },
      tags:   ['Intrusion', 'Boot-to-Root', 'Linux'],
      link:   { label: '> VIEW_REPORT', href: '../storage/intrusion.pdf', blank: true },
    },
    {
      cat: 'sysadmin',
      status: { en: 'COMPLETED', fr: 'TERMINÉ' },
      title:  { en: 'Active Directory — ValorElec', fr: 'Active Directory — ValorElec' },
      desc:   { en: 'Windows Server infra, PowerShell automation, restrictive GPOs.', fr: 'Infra Windows Server, automatisation PowerShell, GPO restrictives.' },
      tags:   ['Active Directory', 'PowerShell', 'GPO'],
      link:   { label: '> CASE_FILE', href: '../storage/ValorElec.pdf', blank: true },
    },
    {
      cat: 'sysadmin',
      status: { en: 'COMPLETED', fr: 'TERMINÉ' },
      title:  { en: 'Linux Hardening', fr: 'Hardening Linux' },
      desc:   { en: 'SSH keys only, IPTables/UFW firewall, CIS Benchmark.', fr: 'SSH clés uniquement, pare-feu UFW, CIS Benchmark.' },
      tags:   ['Linux', 'Hardening', 'SSH Security'],
      link:   { label: '> SECURITY_POLICIES', href: '../storage/hardening.pdf', blank: true },
    },
    {
      cat: 'code',
      status: { en: 'LIVE', fr: 'EN COURS' },
      title:  { en: 'Client Website — ACB', fr: 'Site Web Client — ACB' },
      desc:   { en: 'Full front-end website for a client, hosted on GitHub Pages.', fr: 'Site front-end complet pour un client, hébergé sur GitHub Pages.' },
      tags:   ['HTML', 'CSS', 'JavaScript', 'GitHub'],
      link:   { label: '> VIEW_LIVE_SITE', href: 'https://monpolar.github.io/acb/', blank: true },
    },
    {
      cat: 'ctf',
      status: { en: 'LIVE', fr: 'EN COURS' },
      title:  { en: 'CTF Training', fr: 'Entraînement CTF' },
      desc:   { en: 'Root-Me & TryHackMe. Focus: Web & Privilege Escalation.', fr: 'Root-Me & TryHackMe. Focus : Web & PrivEsc.' },
      tags:   ['CTF', 'PrivEsc', 'Cyber-Training'],
      link:   { label: '> VIEW_BADGES', href: '#', blank: false },
    },
  ];
 
  function W() { return wrap.offsetWidth; }
  function H() { return wrap.offsetHeight; }
 
  function buildProjHTML(proj, l) {
    const tags  = proj.tags.map(t => `<span class="proj-tag">${t}</span>`).join('');
    const blank = proj.link.blank ? 'target="_blank"' : '';
    return `
      <div class="proj-status">[ ${proj.status[l]} ]</div>
      <div class="proj-title">${proj.title[l]}</div>
      <div class="proj-desc">${proj.desc[l]}</div>
      <div class="proj-tags">${tags}</div>
      <a href="${proj.link.href}" ${blank} class="proj-link">${proj.link.label}</a>
    `;
  }
 
  /* Build nodes */
  CATEGORIES.forEach((cat, i) => {
    const el = document.createElement('div');
    el.className   = 'cat-node';
    el.id          = 'cat-' + cat.id;
    el.dataset.cat = cat.id;
    el.innerHTML   = cat.label[lang];
    el.style.left  = (CAT_POS[i].rx * 100) + '%';
    el.style.top   = (CAT_POS[i].ry * 100) + '%';
    el.addEventListener('click', () => toggleCategory(cat.id, i));
    wrap.appendChild(el);
  });
 
  PROJECTS.forEach((proj, i) => {
    const el = document.createElement('div');
    el.className   = 'proj-node';
    el.id          = 'proj-' + i;
    el.dataset.cat = proj.cat;
    el.innerHTML   = buildProjHTML(proj, lang);
    wrap.appendChild(el);
  });
 
  PROJECTS.forEach((_, i) => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.classList.add('connector-line');
    line.id = 'line-' + i;
    svg.appendChild(line);
  });
 
  function orbitPositions(catIdx, total) {
    const cx = CAT_POS[catIdx].rx * W();
    const cy = CAT_POS[catIdx].ry * H();
    const R  = Math.min(W(), H()) * 0.26;
    const baseDeg    = [225, 315, 135, 45];
    const base       = (baseDeg[catIdx] * Math.PI) / 180;
    const spread     = total > 1 ? (Math.PI * 0.65) / (total - 1) : 0;
    const startAngle = base - (spread * (total - 1)) / 2;
    const r = 98;
    return Array.from({ length: total }, (_, k) => {
      const angle = startAngle + spread * k;
      let px = cx + R * Math.cos(angle);
      let py = cy + R * Math.sin(angle);
      px = Math.min(Math.max(px, r), W() - r);
      py = Math.min(Math.max(py, r), H() - r);
      return { px, py, cx, cy };
    });
  }
 
  function toggleCategory(catId, catIdx) {
    if (activeCat === catId) { closeAll(); return; }
    closeAll(false);
    activeCat = catId;
    document.getElementById('cat-' + catId).classList.add('active');
    const projs     = PROJECTS.map((p, i) => ({ p, i })).filter(({ p }) => p.cat === catId);
    const positions = orbitPositions(catIdx, projs.length);
    projs.forEach(({ i }, k) => {
      const { px, py, cx, cy } = positions[k];
      const projEl = document.getElementById('proj-' + i);
      projEl.style.left = px + 'px';
      projEl.style.top  = py + 'px';
      const line = document.getElementById('line-' + i);
      line.setAttribute('x1', cx); line.setAttribute('y1', cy);
      line.setAttribute('x2', px); line.setAttribute('y2', py);
      setTimeout(() => {
        projEl.classList.add('visible');
        line.classList.add('visible');
      }, k * 70);
    });
  }
 
  function closeAll(resetActive = true) {
    if (resetActive) activeCat = null;
    document.querySelectorAll('.cat-node').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.proj-node').forEach(el => el.classList.remove('visible'));
    document.querySelectorAll('.connector-line').forEach(el => el.classList.remove('visible'));
  }
 
  /* Language switch hook */
  const langBtn = document.getElementById('lang-switch');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      const l = document.body.classList.contains('fr-mode') ? 'fr' : 'en';
      lang = l;
      CATEGORIES.forEach(cat => {
        const el = document.getElementById('cat-' + cat.id);
        if (el) el.innerHTML = cat.label[l];
      });
      PROJECTS.forEach((proj, i) => {
        const el = document.getElementById('proj-' + i);
        if (el) el.innerHTML = buildProjHTML(proj, l);
      });
    });
  }
 
  /* Resize */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (activeCat) {
        const tmp    = activeCat;
        const tmpIdx = CATEGORIES.findIndex(c => c.id === tmp);
        closeAll();
        setTimeout(() => toggleCategory(tmp, tmpIdx), 30);
      }
    }, 100);
  });
}
 
/** INIT **/
 
document.addEventListener('DOMContentLoaded', () => {
  initLangSwitch();
  initProjectsLoader();
  initTerminalLoader();
  initPassionTags();
  initTimer();
  initDateDisplay();
  initCtfButton();
  initLoginPage();
  initHintButton();
  initSolarSystem();
});
