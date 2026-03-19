// ── STATE ──
const SKILL_CATS = ['Languages','Web Technologies','Tools','Database','Concepts'];
const S = {
  skillCats: Object.fromEntries(SKILL_CATS.map(c=>([c,[]]))), // { 'Languages': [{name,pct},...], ... }
  projects:[], experience:[], education:[],
  font:'Cormorant Garamond', fontType:'serif', resumeB64:''
};
let prC=0, exC=0, edC=0;

function handleResume(input){
  const file = input.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    S.resumeB64 = e.target.result;
    document.getElementById('resume-status').style.display='block';
  };
  reader.readAsDataURL(file);
}

function showBuilder(){
  document.getElementById('landing').style.display='none';
  document.getElementById('builder').style.display='block';
  buildThemes(); buildSkillCats(); addProj(); addExp(); addEdu();
  window.addEventListener('scroll', updateProgress);
}

function updateProgress(){
  const pct = (window.scrollY/(document.body.scrollHeight-window.innerHeight))*100;
  document.getElementById('pbar').style.width = Math.min(pct,100)+'%';
}

function tog(id){
  const el = document.getElementById(id);
  el.classList.toggle('open');
}

function upd(){}

// ── THEMES ──
const themes=[
  {n:'Gold',bg:'#07070a',ac:'#c8a96e',tx:'#e8e6de',cd:'#0e0e14'},
  {n:'Violet',bg:'#08080f',ac:'#9b87f5',tx:'#e8e6ff',cd:'#10101c'},
  {n:'Ocean',bg:'#060e1a',ac:'#38bdf8',tx:'#e0f2fe',cd:'#0a1628'},
  {n:'Forest',bg:'#060f0a',ac:'#34d399',tx:'#e0fdf4',cd:'#0a1a10'},
  {n:'Rose',bg:'#0f080b',ac:'#fb7185',tx:'#ffe4e6',cd:'#1a0d10'},
  {n:'Paper',bg:'#f7f5f0',ac:'#92400e',tx:'#1c1917',cd:'#ede9e1'},
];
function buildThemes(){
  document.getElementById('tgrid').innerHTML = themes.map((t,i)=>`
    <div class="tpreset${i===0?' on':''}" onclick="applyTheme(this,${i})">
      <div class="sw" style="background:linear-gradient(135deg,${t.bg} 40%,${t.ac})"></div>
      <span>${t.n}</span>
    </div>`).join('');
}
function applyTheme(el,i){
  document.querySelectorAll('.tpreset').forEach(t=>t.classList.remove('on'));
  el.classList.add('on');
  const t=themes[i];
  document.getElementById('c-bg').value=t.bg;
  document.getElementById('c-ac').value=t.ac;
  document.getElementById('c-tx').value=t.tx;
  document.getElementById('c-cd').value=t.cd;
}
function selFont(el,f,ft){
  document.querySelectorAll('.fopt').forEach(x=>x.classList.remove('on'));
  el.classList.add('on'); S.font=f; S.fontType=ft;
}

// ── SKILL CATEGORIES (fixed) ──
function buildSkillCats(){
  const container = document.getElementById('skill-groups');
  container.innerHTML = '';
  SKILL_CATS.forEach(cat => {
    const safeId = 'scat-' + cat.replace(/\s+/g,'-').toLowerCase();
    const el = document.createElement('div');
    el.className = 'ditem';
    el.innerHTML = `
      <div class="ditem-head" style="margin-bottom:10px;">
        <span class="ditem-lbl">${cat}</span>
      </div>
      <div class="skill-row">
        <input class="sg-inp" placeholder="Add skill (e.g. ${_catPlaceholder(cat)})" onkeydown="if(event.key==='Enter')addSkillCat('${cat}')">
        <input class="pct-input sg-pct" placeholder="%" title="Proficiency 0-100 (optional)">
        <button class="skill-add" onclick="addSkillCat('${cat}')">Add</button>
      </div>
      <div class="pills" id="pills-${safeId}"></div>`;
    container.appendChild(el);
  });
}
function _catPlaceholder(cat){
  return {
    'Languages':'Python, JavaScript',
    'Web Technologies':'React, Node.js, CSS',
    'Tools':'Git, Docker, VS Code',
    'Database':'MySQL, MongoDB',
    'Concepts':'REST API, OOP, Agile'
  }[cat] || 'Add skill';
}
function addSkillCat(cat){
  const safeId = 'scat-' + cat.replace(/\s+/g,'-').toLowerCase();
  const container = document.querySelector(`#pills-${safeId}`).parentElement;
  const inp = container.querySelector('.sg-inp');
  const pct = container.querySelector('.sg-pct');
  const name = inp.value.trim();
  if(!name) return;
  const p = parseInt(pct.value)||0;
  S.skillCats[cat].push({name, pct:Math.min(100,Math.max(0,p))});
  inp.value=''; pct.value='';
  renderCatPills(cat);
}
function rmSkillCat(cat, i){
  S.skillCats[cat].splice(i,1);
  renderCatPills(cat);
}
function renderCatPills(cat){
  const safeId = 'scat-' + cat.replace(/\s+/g,'-').toLowerCase();
  document.getElementById('pills-'+safeId).innerHTML = S.skillCats[cat].map((s,i)=>`
    <span class="pill">${s.name}${s.pct?`<span class="pill-pct">${s.pct}%</span>`:''}<button class="pill-rm" onclick="rmSkillCat('${cat}',${i})">&times;</button></span>`).join('');
}

// ── PROJECTS ──
function addProj(){
  const id='pr'+(++prC);
  S.projects.push({id,title:'',desc:'',tech:'',live:'',repo:'',featured:false});
  const el=document.createElement('div');
  el.className='ditem'; el.id=id;
  el.innerHTML=`
    <div class="ditem-head">
      <span class="ditem-lbl">Project ${prC}</span>
      <button class="ditem-rm" onclick="rmProj('${id}')">Remove</button>
    </div>
    <div class="frow c2">
      <div class="field"><label>Project Name *</label><input placeholder="e.g. TaskFlow App" oninput="setP('${id}','title',this.value)"></div>
      <div class="field"><label>Tech Stack</label><input placeholder="React, Node.js, MongoDB" oninput="setP('${id}','tech',this.value)"></div>
    </div>
    <div class="frow c1">
      <div class="field"><label>Description *</label><textarea placeholder="What it does, the problem it solves, key highlights..." oninput="setP('${id}','desc',this.value)"></textarea></div>
    </div>
    <div class="frow c2">
      <div class="field"><label>Live URL</label><input placeholder="https://yourproject.com" oninput="setP('${id}','live',this.value)"></div>
      <div class="field"><label>GitHub / Repo URL</label><input placeholder="https://github.com/you/project" oninput="setP('${id}','repo',this.value)"></div>
    </div>`;
  document.getElementById('proj-list').appendChild(el);
}
function rmProj(id){ S.projects=S.projects.filter(p=>p.id!==id); document.getElementById(id).remove(); }
function setP(id,k,v){ const p=S.projects.find(p=>p.id===id); if(p) p[k]=v; }

// ── EXPERIENCE ──
function addExp(){
  const id='ex'+(++exC);
  S.experience.push({id,co:'',role:'',dur:'',desc:''});
  const el=document.createElement('div');
  el.className='ditem'; el.id=id;
  el.innerHTML=`
    <div class="ditem-head">
      <span class="ditem-lbl">Experience ${exC}</span>
      <button class="ditem-rm" onclick="rmExp('${id}')">Remove</button>
    </div>
    <div class="frow c3">
      <div class="field"><label>Company *</label><input placeholder="e.g. Google" oninput="setE('${id}','co',this.value)"></div>
      <div class="field"><label>Your Role *</label><input placeholder="e.g. Software Engineer" oninput="setE('${id}','role',this.value)"></div>
      <div class="field"><label>Duration</label><input placeholder="e.g. Jan 2022 – Present" oninput="setE('${id}','dur',this.value)"></div>
    </div>
    <div class="frow c1">
      <div class="field"><label>Description</label><textarea placeholder="Key responsibilities and achievements..." oninput="setE('${id}','desc',this.value)"></textarea></div>
    </div>`;
  document.getElementById('exp-list').appendChild(el);
}
function rmExp(id){ S.experience=S.experience.filter(e=>e.id!==id); document.getElementById(id).remove(); }
function setE(id,k,v){ const e=S.experience.find(e=>e.id===id); if(e) e[k]=v; }

// ── EDUCATION ──
function addEdu(){
  const id='ed'+(++edC);
  S.education.push({id,degree:'',school:'',year:'',grade:'',status:''});
  const el=document.createElement('div');
  el.className='ditem'; el.id=id;
  el.innerHTML=`
    <div class="ditem-head">
      <span class="ditem-lbl">Education ${edC}</span>
      <button class="ditem-rm" onclick="rmEdu('${id}')">Remove</button>
    </div>
    <div class="frow c2">
      <div class="field"><label>Degree / Course *</label><input placeholder="example: Course Name" oninput="setEd('${id}','degree',this.value)"></div>
      <div class="field"><label>School / College *</label><input placeholder="example: College Name" oninput="setEd('${id}','school',this.value)"></div>
    </div>
    <div class="frow c3">
      <div class="field"><label>Year / Duration</label><input placeholder="example: 2021 - 2025" oninput="setEd('${id}','year',this.value)"></div>
      <div class="field"><label>Grade / Percentage</label><input placeholder="example: 92% or 9.2 CGPA" oninput="setEd('${id}','grade',this.value)"></div>
      <div class="field"><label>Status</label><input placeholder="example: Pursuing or Completed" oninput="setEd('${id}','status',this.value)"></div>
    </div>`;
  document.getElementById('edu-list').appendChild(el);
}
function rmEdu(id){ S.education=S.education.filter(e=>e.id!==id); document.getElementById(id).remove(); }
function setEd(id,k,v){ const e=S.education.find(e=>e.id===id); if(e) e[k]=v; }

// ── TOAST ──
function toast(msg){
  const t=document.getElementById('toast');
  t.textContent=msg; t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),3500);
}

// ═══════════════════════════════
// ── GENERATE PORTFOLIO HTML ──
// ═══════════════════════════════
function generate(){
  const name   = (document.getElementById('p-name').value||'Your Name').trim();
  const title  = (document.getElementById('p-title').value||'Developer').trim();
  const bio    = (document.getElementById('p-bio').value||'').trim();
  const about  = (document.getElementById('p-about').value||'').trim();
  const loc    = document.getElementById('p-loc').value.trim();
  const email  = document.getElementById('p-email').value.trim();
  const ghUrl  = document.getElementById('p-gh').value.trim().replace(/^https?:\/\//,'').replace(/\/$/,'');
  const liUrl  = document.getElementById('p-li').value.trim().replace(/^https?:\/\//,'').replace(/\/$/,'');
  const ghU        = '';
  const codolioU   = '';
  const statQ      = document.getElementById('stat-questions').value.trim();
  const statD      = document.getElementById('stat-days').value.trim();
  const statC      = document.getElementById('stat-contests').value.trim();
  const statB      = document.getElementById('stat-badges').value.trim();
  const codolioUrl = document.getElementById('codolio-url').value.trim();
  const ctTag    = document.getElementById('ct-tag').value.trim() || "I'd love to hear from you";
  const ctEmail  = document.getElementById('ct-email-show').value.trim();
  const ctLI     = document.getElementById('ct-li-user').value.trim();
  const ctGH     = document.getElementById('ct-gh-user').value.trim();
  const ctTW     = document.getElementById('ct-tw-user').value.trim();
  const resumeB64= S.resumeB64;
  const resumeLbl= document.getElementById('ct-resume-label').value.trim() || 'Download Resume';
  const bg     = document.getElementById('c-bg').value;
  const ac     = document.getElementById('c-ac').value;
  const tx     = document.getElementById('c-tx').value;
  const cd     = document.getElementById('c-cd').value;
  const font   = S.font;
  const fontT  = S.fontType;

  const hasAb  = about.length > 0;
  const hasSk  = SKILL_CATS.some(c=>S.skillCats[c].length>0);
  const hasPr  = S.projects.some(p=>p.title);
  const hasEx  = S.experience.some(e=>e.co);
  const hasEd  = S.education.some(e=>e.degree);
  const hasCD  = statQ || statD || statC || statB || codolioUrl;
  const hasResume = !!resumeB64;

  let _sn = 0;
  const snum = () => String(++_sn).padStart(2,'0');

  const acD  = ac+'1a';
  const acB  = ac+'33';
  const acH  = ac+'0d';

  const fontImport = {
    'Cormorant Garamond': `<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Syne:wght@400;500;600;700&family=DM+Mono:wght@300;400&display=swap" rel="stylesheet">`,
    'Playfair Display': `<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;500;600;700&family=DM+Mono:wght@300;400&display=swap" rel="stylesheet">`,
    'DM Sans': `<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=DM+Mono:wght@300;400&display=swap" rel="stylesheet">`,
    'Lora': `<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Syne:wght@400;500;600;700&family=DM+Mono:wght@300;400&display=swap" rel="stylesheet">`,
    'Space Grotesk': `<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;700&family=DM+Mono:wght@300;400&display=swap" rel="stylesheet">`,
    'Courier New': ``,
  }[font]||'';

  // SVG ICONS (inline, no font dependency)
  const ghSVG  = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.744 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>';
  const liSVG  = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>';
  const mailSVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>';

  // SOCIALS footer links
  const socials = [
    ghUrl && '<a href="https://' + ghUrl + '" target="_blank" rel="noopener noreferrer" class="s-link">' + ghSVG + ' GitHub</a>',
    liUrl && '<a href="https://' + liUrl + '" target="_blank" rel="noopener noreferrer" class="s-link">' + liSVG + ' LinkedIn</a>',
  ].filter(Boolean).join('\n');

  // Hero social icon buttons
  const socialIcons = ''
    + (ghUrl ? '<a href="https://' + ghUrl + '" target="_blank" rel="noopener noreferrer" class="h-social-icon" title="GitHub">' + ghSVG + '</a>' : '')
    + (liUrl ? '<a href="https://' + liUrl + '" target="_blank" rel="noopener noreferrer" class="h-social-icon" title="LinkedIn">' + liSVG + '</a>' : '')
    + (email ? '<a href="mailto:' + email + '" class="h-social-icon" title="Email">' + mailSVG + '</a>' : '');

  // SKILLS — fixed categories, only render non-empty ones
  const skillsHTML = SKILL_CATS.filter(c=>S.skillCats[c].length>0).map(c=>`
  <div class="sk-group">
    <div class="sk-group-title">${c}</div>
    <div class="sk-list">
      ${S.skillCats[c].map(s=>`
      <div class="sk-item">
        <div class="sk-top"><span class="sk-name">${s.name}</span>${s.pct?`<span class="sk-pct">${s.pct}%</span>`:''}</div>
        ${s.pct?`<div class="sk-track"><div class="sk-fill" data-w="${s.pct}" style="width:0%"></div></div>`:''}
      </div>`).join('')}
    </div>
  </div>`).join('');

  // PROJECTS
  const projsHTML = S.projects.filter(p=>p.title).map((p,i)=>`
  <div class="pr-card reveal d${(i%3)+1}">
    <span class="pr-num">0${i+1}</span>
    <h3 class="pr-title">${p.title}</h3>
    <p class="pr-desc">${p.desc}</p>
    <div class="pr-tags">${p.tech.split(',').map(t=>t.trim()).filter(Boolean).map(t=>`<span class="pr-tag">${t}</span>`).join('')}</div>
    <div class="pr-links">
      ${p.live?`<a href="${p.live}" target="_blank" class="pr-link">Live demo →</a>`:''}
      ${p.repo?`<a href="${p.repo}" target="_blank" class="pr-link">Source →</a>`:''}
    </div>
  </div>`).join('');

  // EXPERIENCE
  const expHTML = S.experience.filter(e=>e.co).map((e,i)=>`
  <div class="ex-item reveal d${(i%3)+1}">
    <div class="ex-left">
      <span class="ex-dur">${e.dur}</span>
      <div class="ex-dot"></div>
    </div>
    <div class="ex-right">
      <h3 class="ex-role">${e.role}</h3>
      <div class="ex-co">${e.co}</div>
      <p class="ex-desc">${e.desc}</p>
    </div>
  </div>`).join('');

  // CODING STATS CARD — matches screenshot exactly, horizontal layout
  const codingCards = hasCD
    ? '<div class="cd-stats-card">'
      + '<div class="cd-stats-head"><span class="cd-stats-icon">&lt;/&gt;</span><span class="cd-stats-title">Coding Stats</span></div>'
      + '<div class="cd-stats-row">'
      + (statQ ? '<div class="cd-stat-item"><div class="cd-stat-icon-box cd-iq">&#10067;</div><div class="cd-stat-body"><span class="cd-stat-num">' + statQ + '</span><div class="cd-stat-lbl">TOTAL QUESTIONS</div></div></div>' : '')
      + (statD ? '<div class="cd-stat-item"><div class="cd-stat-icon-box cd-id">&#128197;</div><div class="cd-stat-body"><span class="cd-stat-num">' + statD + '</span><div class="cd-stat-lbl">ACTIVE DAYS</div></div></div>' : '')
      + (statC ? '<div class="cd-stat-item"><div class="cd-stat-icon-box cd-ic">&#127942;</div><div class="cd-stat-body"><span class="cd-stat-num">' + statC + '</span><div class="cd-stat-lbl">TOTAL CONTESTS</div></div></div>' : '')
      + (statB ? '<div class="cd-stat-item"><div class="cd-stat-icon-box cd-ib">H</div><div class="cd-stat-body"><span class="cd-stat-num">' + statB + '</span><div class="cd-stat-lbl">HACKERRANK BADGES</div></div></div>' : '')
      + '</div>'
      + (codolioUrl ? '<a href="' + codolioUrl + '" target="_blank" rel="noopener noreferrer" class="cd-view-more">&#x1F517;&nbsp; View More</a>' : '')
      + '</div>'
    : '';

  // EDUCATION HTML
  const eduHTML = S.education.filter(e=>e.degree).map(e =>
    '<div class="edu-item">'
    + '<div class="edu-dot-col"><div class="edu-dot"></div><div class="edu-line"></div></div>'
    + '<div class="edu-content">'
    + '<div class="edu-degree">' + e.degree + '</div>'
    + '<div class="edu-school">' + e.school + '</div>'
    + '<div class="edu-meta">'
    + (e.year ? '<span class="edu-year">' + e.year + '</span>' : '')
    + (e.grade ? '<span class="edu-grade">' + e.grade + '</span>' : '')
    + (e.status ? '<span class="edu-status">' + e.status + '</span>' : '')
    + '</div>'
    + '</div>'
    + '</div>'
  ).join('');

  // ── CONTACT CARDS ──
  const contactCards = [
    ctEmail && '<a href="mailto:' + ctEmail + '" class="ct-card">'
      + '<div class="ct-card-icon ct-email">' + mailSVG + '</div>'
      + '<div class="ct-card-info"><span class="ct-card-lbl">EMAIL</span><span class="ct-card-val">' + ctEmail + '</span></div>'
      + '<span class="ct-card-arr">\u2197</span></a>',
    ctLI && '<a href="https://www.linkedin.com/in/' + ctLI + '" target="_blank" rel="noopener noreferrer" class="ct-card">'
      + '<div class="ct-card-icon ct-li">' + liSVG + '</div>'
      + '<div class="ct-card-info"><span class="ct-card-lbl">LINKEDIN</span><span class="ct-card-val">' + ctLI + '</span></div>'
      + '<span class="ct-card-arr">\u2197</span></a>',
    ctGH && '<a href="https://github.com/' + ctGH + '" target="_blank" rel="noopener noreferrer" class="ct-card">'
      + '<div class="ct-card-icon ct-gh">' + ghSVG + '</div>'
      + '<div class="ct-card-info"><span class="ct-card-lbl">GITHUB</span><span class="ct-card-val">' + ctGH + '</span></div>'
      + '<span class="ct-card-arr">\u2197</span></a>',
    ctTW && '<a href="https://twitter.com/' + ctTW + '" target="_blank" rel="noopener noreferrer" class="ct-card">'
      + '<div class="ct-card-icon ct-tw"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.632 5.905-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></div>'
      + '<div class="ct-card-info"><span class="ct-card-lbl">TWITTER / X</span><span class="ct-card-val">' + ctTW + '</span></div>'
      + '<span class="ct-card-arr">\u2197</span></a>',
  ].filter(Boolean).join('\n');

  const resumeBtn = hasResume
    ? `<a href="${resumeB64}" download="resume.pdf" class="ct-resume-btn">⬇ &nbsp;${resumeLbl}</a>`
    : '';

  const _scriptBlocks = '';

  const _viewWork  = hasPr  ? '<a href="#projects" class="btn-p">Explore My Work</a>' : '';
  const _abLoc     = loc    ? '<div class="ab-loc">' + loc + '</div>' : '';

  // Inline coding stats inside About section
  const _abCodingStats = hasCD
    ? '<div class="ab-coding-card">'
      + '<div class="ab-card-title">&lt;/&gt; Coding Stats</div>'
      + '<div class="ab-stats-grid">'
      + (statQ ? '<div class="ab-stat"><span class="ab-stat-num">' + statQ + '</span><span class="ab-stat-lbl">Questions</span></div>' : '')
      + (statD ? '<div class="ab-stat"><span class="ab-stat-num">' + statD + '</span><span class="ab-stat-lbl">Active Days</span></div>' : '')
      + (statC ? '<div class="ab-stat"><span class="ab-stat-num">' + statC + '</span><span class="ab-stat-lbl">Contests</span></div>' : '')
      + (statB ? '<div class="ab-stat"><span class="ab-stat-num">' + statB + '</span><span class="ab-stat-lbl">Badges</span></div>' : '')
      + '</div>'
      + (codolioUrl ? '<a href="' + codolioUrl + '" target="_blank" rel="noopener noreferrer" class="ab-view-more">\uD83D\uDD17&nbsp; View More</a>' : '')
      + '</div>'
    : '';

  // Resume download inside About section
  const _abResume = hasResume
    ? '<div class="ab-resume-card">'
      + '<div class="ab-card-title">\uD83D\uDCC4 Resume</div>'
      + '<p class="ab-resume-desc">Download my latest resume</p>'
      + '<a href="' + resumeB64 + '" download="resume.pdf" class="ab-resume-btn">\u2B07 ' + resumeLbl + '</a>'
      + '</div>'
    : '';

  // Education inside About section
  const _abEdu = hasEd
    ? '<div class="ab-edu-card">'
      + '<div class="ab-card-title">\uD83C\uDF93 Education</div>'
      + '<div class="edu-timeline">' + eduHTML + '</div>'
      + '</div>'
    : '';

  const _secAbout = !hasAb ? '' : '<section id="about" class="sec">'
    + '<div class="sec-lbl reveal"><span class="sec-n">' + snum() + '</span><div class="sec-ln"></div><span class="sec-t">About me</span></div>'
    + '<h2 class="sec-title reveal">About <em>Me</em></h2>'
    + '<div class="ab-main reveal d1"><div class="ab-text">' + about + '</div>' + _abLoc + '</div>'
    + (_abCodingStats ? '<div class="ab-block reveal d2">' + _abCodingStats + '</div>' : '')
    + (_abResume ? '<div class="ab-block reveal d2">' + _abResume + '</div>' : '')
    + (_abEdu ? '<div class="ab-block reveal d3">' + _abEdu + '</div>' : '')
    + '</section>';

  const _secSkills = !hasSk ? '' : '<section id="skills" class="sec">'
    + '<div class="sec-lbl reveal"><span class="sec-n">' + snum() + '</span><div class="sec-ln"></div><span class="sec-t">Skills &amp; Tools</span></div>'
    + '<h2 class="sec-title reveal">What I <em>work with</em></h2>'
    + '<div class="sk-grid reveal d1">' + skillsHTML + '</div>'
    + '</section>';

  const _secProjects = !hasPr ? '' : '<section id="projects" class="sec">'
    + '<div class="sec-lbl reveal"><span class="sec-n">' + snum() + '</span><div class="sec-ln"></div><span class="sec-t">Selected Work</span></div>'
    + '<h2 class="sec-title reveal">Recent <em>projects</em></h2>'
    + '<div class="pr-grid">' + projsHTML + '</div>'
    + '</section>';

  const _secExp = !hasEx ? '' : '<section id="experience" class="sec">'
    + '<div class="sec-lbl reveal"><span class="sec-n">' + snum() + '</span><div class="sec-ln"></div><span class="sec-t">Work Experience</span></div>'
    + '<h2 class="sec-title reveal">Where I\'ve <em>worked</em></h2>'
    + '<div class="ex-timeline">' + expHTML + '</div>'
    + '</section>';

  const _navAbout  = hasAb ? '<a href="#about">About</a>' : '';
  const _navSkills = hasSk ? '<a href="#skills">Skills</a>' : '';
  const _navProjs  = hasPr ? '<a href="#projects">Work</a>' : '';
  const _navExp    = hasEx ? '<a href="#experience">Experience</a>' : '';


  const _portfolioScript = [
    '<scr'+'ipt>',
    '// -- REVEAL --',
    'const rvs=document.querySelectorAll(".reveal");',
    'const io=new IntersectionObserver(en=>{en.forEach(e=>{if(e.isIntersecting){e.target.classList.add("vis");io.unobserve(e.target);}});},{threshold:.1});',
    'rvs.forEach(e=>io.observe(e));',
    '// -- SKILL BARS --',
    'const sio=new IntersectionObserver(en=>{en.forEach(e=>{if(e.isIntersecting){e.target.style.width=e.target.dataset.w+"%";sio.unobserve(e.target);}});},{threshold:.2});',
    'document.querySelectorAll(".sk-fill").forEach(el=>sio.observe(el));',
    '// -- ACTIVE NAV --',
    'const secs=document.querySelectorAll("section[id]");',
    'const nLinks=document.querySelectorAll(".nav-links a:not(.nav-resume)");',
    'window.addEventListener("scroll",()=>{let cur="";secs.forEach(s=>{if(window.scrollY>=s.offsetTop-80)cur=s.id;});nLinks.forEach(a=>{a.classList.toggle("active",a.getAttribute("href")==="#"+cur);});});',
    _scriptBlocks,
    '</scr'+'ipt>'
  ].join('\n');

  const navLinks = [_navAbout,_navSkills,_navProjs,_navExp,'<a href="#contact">Contact</a>'].filter(Boolean).join('\n    ');
  const yr = new Date().getFullYear();
  const contactSnum = snum();
  const socialDiv = socials ? '<div class="s-links reveal">' + socials + '</div>' : '';

  const cssVars = ':root{'
    + '--bg:' + bg + ';'
    + '--bg2:' + cd + ';'
    + '--bg3:' + cd + 'cc;'
    + '--tx:' + tx + ';'
    + '--mu:' + tx + '99;'
    + '--ac:' + ac + ';'
    + '--bd:' + acB + ';'
    + '--bd2:' + acD + ';'
    + '--bdh:' + acH + ';'
    + "--fd:'" + font + "'," + fontT + ';'
    + "--fu:'Inter','Segoe UI',sans-serif;"
    + "--fm:'Fira Code','Courier New',monospace;"
    + '}';

  const cssStatic = [
    '*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}',
    'html{scroll-behavior:smooth;}',
    'body{background:var(--bg);color:var(--tx);font-family:var(--fu);-webkit-font-smoothing:antialiased;overflow-x:hidden;}',
    'a{color:inherit;text-decoration:none;}',
    '::-webkit-scrollbar{width:6px;}::-webkit-scrollbar-track{background:var(--bg);}::-webkit-scrollbar-thumb{background:var(--bd);border-radius:3px;}',

    // NAV
    'nav{position:fixed;top:0;left:0;right:0;z-index:500;padding:0 48px;height:64px;display:flex;align-items:center;justify-content:space-between;background:var(--bg);border-bottom:1px solid var(--bd2);}',
    '.nav-logo{font-family:var(--fu);font-size:18px;font-weight:700;color:var(--tx);letter-spacing:-.01em;}',
    '.nav-logo span{color:var(--ac);}',
    '.nav-links{display:flex;align-items:center;gap:8px;}',
    '.nav-links a{font-family:var(--fu);font-size:13px;font-weight:500;letter-spacing:.04em;color:var(--mu);padding:6px 14px;border-radius:4px;transition:color .2s,background .2s;}',
    '.nav-links a:hover{color:var(--tx);background:var(--bd2);}',
    '.nav-links a.active{color:var(--tx);}',
    '.nav-resume{background:var(--tx) !important;color:var(--bg) !important;font-weight:700 !important;border-radius:6px !important;padding:7px 18px !important;}',
    '.nav-resume:hover{opacity:.88 !important;background:var(--tx) !important;}',

    // HERO
    '#hero{min-height:100vh;display:flex;align-items:center;padding:100px 48px 60px;position:relative;gap:48px;}',
    '.h-left{flex:1;max-width:560px;}',
    '.h-greet{font-family:var(--fu);font-size:1.1rem;font-weight:500;color:var(--mu);margin-bottom:10px;display:flex;align-items:center;gap:8px;}',
    '.h-name{font-family:var(--fu);font-size:clamp(2.2rem,4vw,3.4rem);font-weight:800;line-height:1.1;letter-spacing:-.02em;color:var(--tx);margin-bottom:10px;}',
    '.h-role{font-family:var(--fu);font-size:1.25rem;font-weight:600;color:var(--ac);margin-bottom:22px;display:flex;align-items:center;gap:6px;}',
    '.h-cursor{display:inline-block;width:2px;height:1.1em;background:var(--ac);margin-left:2px;animation:blink .8s step-end infinite;vertical-align:text-bottom;}',
    '@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}',
    '.h-bio{font-family:var(--fu);font-size:1rem;font-weight:400;line-height:1.75;color:var(--mu);max-width:480px;margin-bottom:32px;}',
    '.h-cta{display:flex;gap:12px;flex-wrap:wrap;}',
    '.btn-p{display:inline-flex;align-items:center;gap:8px;padding:11px 26px;background:var(--tx);color:var(--bg);font-family:var(--fu);font-size:14px;font-weight:700;border-radius:8px;transition:opacity .2s,transform .15s;border:none;cursor:pointer;}',
    '.btn-p:hover{opacity:.88;transform:translateY(-2px);}',
    '.btn-o{display:inline-flex;align-items:center;gap:8px;padding:11px 26px;border:1.5px solid var(--bd);color:var(--tx);font-family:var(--fu);font-size:14px;font-weight:600;border-radius:8px;transition:border-color .2s,background .2s,transform .15s;}',
    '.btn-o:hover{border-color:var(--ac);background:var(--bdh);transform:translateY(-2px);}',

    // CODE PANEL
    '.h-right{flex:1;max-width:560px;display:flex;justify-content:center;}',
    '.code-panel{background:#1e1e2e;border:1px solid rgba(255,255,255,.08);border-radius:14px;overflow:hidden;width:100%;box-shadow:0 24px 64px rgba(0,0,0,.45);}',
    '.code-bar{display:flex;align-items:center;gap:6px;padding:12px 16px;background:#18182a;border-bottom:1px solid rgba(255,255,255,.06);}',
    '.dot{width:12px;height:12px;border-radius:50%;}',
    '.dot-r{background:#ff5f57;}.dot-y{background:#febc2e;}.dot-g{background:#28c840;}',
    '.code-body{padding:24px 28px;font-family:var(--fm);font-size:14px;line-height:1.85;}',
    '.c-kw{color:#ff79c6;}.c-fn{color:#8be9fd;}.c-cl{color:#50fa7b;}.c-st{color:#f1fa8c;}.c-cm{color:#6272a4;}.c-br{color:#bd93f9;}.c-tx{color:#f8f8f2;}',
    '.code-line{display:block;white-space:pre;}',

    // SOCIALS ROW
    '.h-socials{display:flex;gap:14px;margin-top:28px;}',
    '.h-social-icon{width:40px;height:40px;border:1.5px solid var(--bd);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:18px;color:var(--mu);transition:border-color .2s,color .2s,transform .15s;}',
    '.h-social-icon:hover{border-color:var(--ac);color:var(--ac);transform:translateY(-2px);}',

    // SECTIONS
    '.sec{padding:60px 48px;border-top:1px solid var(--bd2);}',
    '.sec-header{margin-bottom:36px;}',
    '.sec-label{font-family:var(--fm);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--ac);margin-bottom:8px;display:flex;align-items:center;gap:10px;}',
    '.sec-label::before{content:"";width:28px;height:1px;background:var(--ac);}',
    '.sec-title-lg{font-family:var(--fu);font-size:clamp(1.6rem,3vw,2.4rem);font-weight:800;color:var(--tx);line-height:1.15;letter-spacing:-.02em;}',
    '.sec-title-lg span{color:var(--ac);}',

    // OLD compat aliases (keep working)
    '.sec-lbl{display:flex;align-items:center;gap:14px;margin-bottom:16px;}',
    '.sec-n{font-family:var(--fm);font-size:11px;color:var(--ac);}',
    '.sec-ln{width:28px;height:1px;background:var(--bd2);}',
    '.sec-t{font-family:var(--fm);font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:var(--mu);}',
    '.sec-title{font-family:var(--fu);font-size:clamp(1.6rem,3vw,2.4rem);font-weight:800;color:var(--tx);line-height:1.15;letter-spacing:-.02em;margin-bottom:32px;}',
    '.sec-title em{font-style:normal;color:var(--ac);}',

    // REVEAL
    '.reveal{opacity:0;transform:translateY(24px);transition:opacity .6s ease,transform .6s ease;}',
    '.reveal.vis{opacity:1;transform:translateY(0);}',
    '.d1{transition-delay:.06s;}.d2{transition-delay:.14s;}.d3{transition-delay:.22s;}.d4{transition-delay:.3s;}',

    // ABOUT
    '.ab-main{margin-bottom:20px;}',
    '.ab-block{margin-bottom:12px;display:flex;gap:12px;flex-wrap:wrap;}',
    '.ab-block > *{flex:1;min-width:200px;}',
    '.ab-text{font-size:.95rem;font-weight:400;line-height:1.8;color:var(--mu);margin-bottom:10px;}',
    '.ab-loc{display:inline-flex;align-items:center;gap:5px;font-size:12px;color:var(--mu);margin-top:6px;padding:4px 10px;background:var(--bg2);border:1px solid var(--bd2);border-radius:20px;}',
    '.ab-edu-card{background:var(--bg2);border:1px solid var(--bd2);border-radius:10px;padding:14px 16px;width:100%;}',
    '.ab-cards{display:grid;grid-template-columns:1fr 1fr;gap:10px;}',
    '.ab-card{background:var(--bg2);border:1px solid var(--bd2);border-radius:10px;padding:20px;transition:border-color .25s,transform .25s;}',
    '.ab-card:hover{border-color:var(--bd);transform:translateY(-3px);}',
    '.ab-card .cn{font-family:var(--fu);font-size:2rem;font-weight:800;color:var(--ac);line-height:1;display:block;margin-bottom:4px;}',
    '.ab-card .cl{font-size:12px;color:var(--mu);letter-spacing:.06em;}',

    // SKILLS
    '.sk-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:24px;}',
    '.sk-group-title{font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:var(--ac);margin-bottom:14px;font-family:var(--fm);}',
    '.sk-list{display:flex;flex-direction:column;gap:10px;}',
    '.sk-item{display:flex;flex-direction:column;gap:4px;}',
    '.sk-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;}',
    '.sk-name{font-size:13px;font-weight:600;color:var(--tx);}',
    '.sk-pct{font-family:var(--fm);font-size:11px;color:var(--ac);}',
    '.sk-track{height:4px;background:var(--bd2);border-radius:4px;overflow:hidden;}',
    '.sk-fill{height:100%;background:var(--ac);border-radius:4px;transition:width 1.2s cubic-bezier(.4,0,.2,1);}',

    // PROJECTS
    '.pr-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px;}',
    '.pr-card{background:var(--bg2);border:1.5px solid var(--bd2);padding:28px;border-radius:12px;position:relative;overflow:hidden;transition:border-color .25s,transform .25s;}',
    '.pr-card:hover{border-color:var(--ac);transform:translateY(-4px);}',
    '.pr-num{font-family:var(--fm);font-size:11px;color:var(--ac);display:block;margin-bottom:14px;}',
    '.pr-title{font-size:1.2rem;font-weight:700;color:var(--tx);margin-bottom:8px;line-height:1.3;}',
    '.pr-desc{font-size:.9rem;line-height:1.7;color:var(--mu);margin-bottom:14px;}',
    '.pr-tags{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:14px;}',
    '.pr-tag{font-family:var(--fm);font-size:11px;padding:3px 10px;background:var(--bdh);border:1px solid var(--bd2);border-radius:20px;color:var(--ac);}',
    '.pr-links{display:flex;gap:12px;}',
    '.pr-link{font-size:12px;font-weight:600;color:var(--mu);border-bottom:1px solid var(--bd2);padding-bottom:1px;transition:color .2s,border-color .2s;}',
    '.pr-link:hover{color:var(--ac);border-color:var(--ac);}',

    // EXPERIENCE
    '.ex-timeline{display:flex;flex-direction:column;gap:0;}',
    '.ex-item{display:grid;grid-template-columns:160px 1fr;gap:24px;padding:24px 0;border-bottom:1px solid var(--bd2);}',
    '.ex-item:last-child{border-bottom:none;}',
    '.ex-left{display:flex;flex-direction:column;align-items:flex-end;gap:6px;padding-top:2px;}',
    '.ex-right{flex:1;}',
    '.ex-dur{font-family:var(--fm);font-size:11px;color:var(--mu);text-align:right;line-height:1.5;}',
    '.ex-dot{width:8px;height:8px;border-radius:50%;background:var(--ac);margin-left:auto;}',
    '.ex-role{font-size:1.05rem;font-weight:700;color:var(--tx);margin-bottom:2px;}',
    '.ex-co{font-family:var(--fm);font-size:12px;color:var(--ac);margin-bottom:8px;letter-spacing:.06em;}',
    '.ex-desc{font-size:.9rem;line-height:1.7;color:var(--mu);}',

    // EDUCATION
    '.edu-timeline{display:flex;flex-direction:column;gap:0;}',
    '.edu-item{display:flex;gap:12px;padding:14px 0;position:relative;}',
    '.edu-item:last-child{padding-bottom:0;}',
    '.edu-dot-col{display:flex;flex-direction:column;align-items:center;flex-shrink:0;}',
    '.edu-dot{width:10px;height:10px;border-radius:50%;background:var(--ac);flex-shrink:0;margin-top:4px;z-index:1;}',
    '.edu-line{width:2px;flex:1;background:var(--bd2);margin-top:3px;}',
    '.edu-item:last-child .edu-line{display:none;}',
    '.edu-content{flex:1;padding-bottom:10px;}',
    '.edu-degree{font-size:.9rem;font-weight:700;color:var(--tx);margin-bottom:5px;}',
    '.edu-school{font-size:11px;color:var(--mu);margin-bottom:6px;}',
    '.edu-meta{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}',
    '.edu-year{font-size:11px;color:var(--mu);}',
    '.edu-grade{font-size:11px;font-weight:700;color:var(--ac);}',
    '.edu-status{font-size:11px;font-weight:700;color:var(--ac);}',

    // CODING STATS CARD — horizontal layout matching screenshot
    '.cd-stats-card{background:var(--bg2);border:1.5px solid var(--bd2);border-radius:14px;padding:24px 28px;}',
    '.cd-stats-head{display:flex;align-items:center;gap:8px;margin-bottom:20px;}',
    '.cd-stats-icon{font-size:14px;color:var(--ac);font-weight:700;}',
    '.cd-stats-title{font-size:14px;font-weight:700;color:var(--tx);}',
    '.cd-stats-row{display:flex;align-items:center;gap:32px;flex-wrap:wrap;margin-bottom:20px;}',
    '.cd-stat-item{display:flex;align-items:center;gap:12px;}',
    '.cd-stat-icon-box{width:40px;height:40px;border-radius:8px;background:var(--bg3);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;}',
    '.cd-iq{background:#1a2a1a;color:#4ade80;}',
    '.cd-id{background:#1a1f2a;color:#60a5fa;}',
    '.cd-ic{background:#2a1a1a;color:#4ade80;}',
    '.cd-ib{background:#1a2a1a;color:#4ade80;font-weight:800;font-size:14px;}',
    '.cd-stat-body{display:flex;flex-direction:column;gap:2px;}',
    '.cd-stat-num{font-size:1.5rem;font-weight:800;color:var(--ac);line-height:1;}',
    '.cd-stat-lbl{font-size:10px;color:var(--mu);letter-spacing:.1em;text-transform:uppercase;}',
    '.cd-view-more{display:inline-flex;align-items:center;gap:8px;padding:10px 20px;background:transparent;border:1.5px solid var(--bd);border-radius:8px;font-size:13px;font-weight:600;color:var(--tx);text-decoration:none;transition:border-color .2s,color .2s;}',
    '.cd-view-more:hover{border-color:var(--ac);color:var(--ac);}',

    // ABOUT RIGHT CARDS
    '.ab-cards{display:flex;flex-direction:column;gap:14px;}',
    '.ab-coding-card{display:inline-block;background:var(--bg2);border:1px solid var(--bd2);border-radius:10px;padding:14px 16px;transition:border-color .25s;width:100%;}',
    '.ab-coding-card:hover{border-color:var(--ac);}',
    '.ab-card-title{font-size:12px;font-weight:700;color:var(--ac);margin-bottom:10px;display:flex;align-items:center;gap:5px;letter-spacing:.06em;text-transform:uppercase;}',
    '.ab-stats-grid{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px;}',
    '.ab-stat{background:var(--bg3);border-radius:6px;padding:8px 10px;min-width:60px;}',
    '.ab-stat-num{font-size:1rem;font-weight:800;color:var(--ac);display:block;line-height:1;margin-bottom:2px;}',
    '.ab-stat-lbl{font-size:9px;color:var(--mu);letter-spacing:.07em;text-transform:uppercase;}',
    '.ab-resume-card{display:inline-block;background:var(--bg2);border:1px solid var(--bd2);border-radius:10px;padding:12px 16px;transition:border-color .25s;width:100%;}',
    '.ab-resume-card:hover{border-color:var(--ac);}',
    '.ab-resume-desc{font-size:11px;color:var(--mu);margin-bottom:10px;line-height:1.4;}',
    '.ab-resume-btn{display:inline-flex;align-items:center;gap:5px;padding:7px 14px;background:var(--ac);color:var(--bg);font-size:12px;font-weight:700;border-radius:6px;text-decoration:none;transition:opacity .2s;}',
    '.ab-resume-btn:hover{opacity:.85;}',
    '.ab-view-more{display:inline-flex;align-items:center;gap:5px;padding:6px 12px;background:var(--bg3);border:1px solid var(--bd2);border-radius:6px;font-size:11px;font-weight:600;color:var(--mu);text-decoration:none;transition:border-color .2s,color .2s;}',
    '.ab-view-more:hover{border-color:var(--ac);color:var(--ac);}',
    '.cd-bar{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:14px;}',
    '.cd-card{background:var(--bg2);border:1.5px solid var(--bd2);border-radius:12px;padding:20px;transition:border-color .25s,transform .25s;}',
    '.cd-card:hover{border-color:var(--ac);transform:translateY(-3px);}',
    '.cd-codolio{grid-column:1/-1;}',
    '.cd-pname{font-family:var(--fm);font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--ac);margin-bottom:12px;}',
    '.cd-stats{display:flex;flex-direction:column;gap:6px;}',
    '.cd-row{display:flex;justify-content:space-between;align-items:center;}',
    '.cd-lbl{font-size:12px;color:var(--mu);}',
    '.cd-val{font-size:1.1rem;font-weight:700;color:var(--tx);}',
    '.cd-ld{font-family:var(--fm);font-size:11px;color:var(--mu);animation:pu 1.4s ease-in-out infinite;}',
    '@keyframes pu{0%,100%{opacity:1}50%{opacity:.2}}',
    '.cd-badge{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;background:var(--bdh);border:1px solid var(--bd2);border-radius:20px;font-size:11px;color:var(--ac);margin-top:6px;}',
    '.cd-rank{font-size:11px;padding:2px 8px;border-radius:4px;display:inline-block;}',

    // CONTACT
    '#contact .sec-title{text-align:center;}',
    '.ct-intro{font-size:1rem;color:var(--mu);max-width:460px;margin:0 auto 32px;line-height:1.75;text-align:center;}',
    '.ct-wrapper{max-width:520px;margin:0 auto 24px;background:var(--bg2);border:1.5px solid var(--bd2);border-radius:16px;padding:24px 20px;}',
    '.ct-wrapper-title{font-size:16px;font-weight:700;color:var(--tx);margin-bottom:14px;}',
    '.ct-cards{display:flex;flex-direction:column;gap:8px;}',
    '.ct-card{display:flex;align-items:center;gap:14px;background:var(--bg3);border:1px solid var(--bd2);border-radius:10px;padding:12px 16px;transition:border-color .25s,transform .2s;text-decoration:none;color:var(--tx);}',
    '.ct-card:hover{border-color:var(--ac);transform:translateX(4px);}',
    '.ct-card-icon{width:38px;height:38px;border-radius:8px;background:rgba(255,255,255,.05);border:1px solid var(--bd2);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--ac);}',
    '.ct-email{background:rgba(200,169,110,.12);border-color:rgba(200,169,110,.25);color:var(--ac);}',
    '.ct-li{background:#0a66c218;border-color:#0a66c230;color:#0a66c2;}',
    '.ct-gh{background:#f0f6fc10;border-color:#f0f6fc18;color:#f0f6fc;}',
    '.ct-tw{background:#1d9bf010;border-color:#1d9bf018;color:#1d9bf0;}',
    '.ct-card-info{display:flex;flex-direction:column;gap:2px;flex:1;}',
    '.ct-card-lbl{font-size:10px;letter-spacing:.14em;color:var(--mu);font-family:var(--fm);}',
    '.ct-card-val{font-size:13px;font-weight:600;color:var(--tx);}',
    '.ct-card-arr{font-size:15px;color:var(--mu);transition:color .2s,transform .2s;}',
    '.ct-card:hover .ct-card-arr{color:var(--ac);transform:translate(2px,-2px);}',
    '.ct-resume-btn{display:flex;align-items:center;justify-content:center;gap:8px;max-width:520px;margin:0 auto;padding:12px 28px;background:var(--ac);color:var(--bg);font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;border-radius:8px;text-decoration:none;transition:opacity .2s,transform .2s;}',
    '.ct-resume-btn:hover{opacity:.85;transform:translateY(-2px);}',
    '.s-links{display:flex;justify-content:center;gap:20px;flex-wrap:wrap;margin-top:32px;}',
    '.s-link{font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--mu);transition:color .2s;display:flex;align-items:center;gap:6px;text-decoration:none;}',
    '.s-link svg{flex-shrink:0;}',
    '.s-link:hover{color:var(--ac);}',
    '.h-social-icon svg{pointer-events:none;}',

    // FOOTER
    'footer{padding:20px 48px;border-top:1px solid var(--bd2);display:flex;justify-content:space-between;align-items:center;}',
    '.f-c{font-size:12px;color:var(--mu);}',
    '.f-b{font-size:12px;color:var(--mu);transition:color .2s;}',
    '.f-b:hover{color:var(--ac);}',
    '.f-socials{display:flex;align-items:center;gap:12px;}',
    '.f-social-icon{width:34px;height:34px;border:1px solid var(--bd2);border-radius:8px;display:flex;align-items:center;justify-content:center;color:var(--mu);transition:border-color .2s,color .2s;text-decoration:none;}',
    '.f-social-icon:hover{border-color:var(--ac);color:var(--ac);}',

    // RESPONSIVE
    '@media(max-width:900px){nav{padding:0 20px;}#hero{padding:90px 20px 50px;flex-direction:column;gap:32px;}.h-right{width:100%;}.sec{padding:48px 20px;}footer{padding:16px 20px;}.ab-grid{grid-template-columns:1fr;gap:28px;}.pr-grid{grid-template-columns:1fr;}.ex-item{grid-template-columns:1fr;gap:4px;}.ex-left{align-items:flex-start;flex-direction:row;gap:10px;}.cd-bar{grid-template-columns:1fr 1fr;}}',
    '@media(max-width:600px){.nav-links a:not(.nav-resume){display:none;}.h-name{font-size:2rem;}.h-cta{flex-direction:column;}.ab-cards{grid-template-columns:1fr;}.cd-bar{grid-template-columns:1fr;}}',
  ].join('\n');

  // Build code panel using user's actual data
  const codePanel = ''
    + '<div class="h-right">'
    + '<div class="code-panel">'
    + '<div class="code-bar"><div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div></div>'
    + '<div class="code-body">'
    + '<span class="code-line"><span class="c-kw">from</span> <span class="c-tx">future</span> <span class="c-kw">import</span> <span class="c-cl">Intelligence</span></span>'
    + '<span class="code-line">&nbsp;</span>'
    + '<span class="code-line"><span class="c-kw">class</span> <span class="c-cl">Developer</span><span class="c-tx">:</span></span>'
    + '<span class="code-line">    <span class="c-kw">def</span> <span class="c-fn">__init__</span><span class="c-tx">(</span><span class="c-br">self</span><span class="c-tx">):</span></span>'
    + '<span class="code-line">        <span class="c-br">self</span><span class="c-tx">.name = </span><span class="c-st">"' + name + '"</span></span>'
    + '<span class="code-line">        <span class="c-br">self</span><span class="c-tx">.role = </span><span class="c-st">"' + title + '"</span></span>'
    + (loc ? '<span class="code-line">        <span class="c-br">self</span><span class="c-tx">.location = </span><span class="c-st">"' + loc + '"</span></span>' : '')
    + '<span class="code-line">&nbsp;</span>'
    + '<span class="code-line">    <span class="c-kw">def</span> <span class="c-fn">innovate</span><span class="c-tx">(</span><span class="c-br">self</span><span class="c-tx">):</span></span>'
    + '<span class="code-line">        <span class="c-kw">while</span> <span class="c-cl">True</span><span class="c-tx">:</span></span>'
    + '<span class="code-line">            <span class="c-br">self</span><span class="c-fn">.build()</span></span>'
    + '<span class="code-line">            <span class="c-br">self</span><span class="c-fn">.learn()</span></span>'
    + '</div></div></div>';

  // Build social icons row — already built above with SVGs

  const out = '<!DOCTYPE html>\n<html lang="en">\n<head>\n'
    + '<meta charset="UTF-8">\n'
    + '<meta name="viewport" content="width=device-width,initial-scale=1">\n'
    + '<title>' + name + ' \u2014 Portfolio</title>\n'
    + '<meta name="description" content="' + bio.slice(0,160) + '">\n'
    + '<link rel="preconnect" href="https://fonts.googleapis.com">\n'
    + '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">\n'
    + '<style>\n' + cssVars + '\n' + cssStatic + '\n</style>\n'
    + '</head>\n<body>\n'
    + '<nav>\n'
    + '  <a href="#hero" class="nav-logo">' + name + '<span>.</span></a>\n'
    + '  <div class="nav-links">\n    ' + navLinks
    + (hasResume ? '\n    <a href="' + resumeB64 + '" download="resume.pdf" class="nav-resume">RESUME</a>' : '')
    + '\n  </div>\n</nav>\n'
    + '<section id="hero">\n'
    + '  <div class="h-left">\n'
    + '    <div class="h-greet">&#128075; Hi there, I\'m</div>\n'
    + '    <h1 class="h-name">' + name + '</h1>\n'
    + '    <div class="h-role">I\'m a <span id="typed-role">' + title + '</span><span class="h-cursor"></span></div>\n'
    + '    <p class="h-bio">' + bio + '</p>\n'
    + '    <div class="h-cta">\n      ' + _viewWork + '\n      <a href="#contact" class="btn-o">Get in Touch</a>\n    </div>\n'
    + (socialIcons ? '    <div class="h-socials">' + socialIcons + '</div>\n' : '')
    + '  </div>\n'
    + codePanel + '\n'
    + '</section>\n'
    + [_secAbout,_secSkills,_secProjects,_secExp].filter(Boolean).join('\n')
    + '\n<section id="contact" class="sec">\n'
    + '  <div class="sec-lbl reveal" style="justify-content:center;"><span class="sec-n">' + contactSnum + '</span><div class="sec-ln" style="max-width:28px;"></div><span class="sec-t">Contact</span></div>\n'
    + '  <h2 class="sec-title reveal" style="text-align:center;">Let\'s <em>Connect</em></h2>\n'
    + '  <p class="ct-intro reveal d1">' + ctTag + '</p>\n'
    + '  <div class="ct-wrapper reveal d2">\n'
    + '    <div class="ct-wrapper-title">Get in Touch</div>\n'
    + '    <div class="ct-cards">' + contactCards + '</div>\n'
    + '  </div>\n'
    + '  ' + socialDiv + '\n'
    + '</section>\n'
    + '<footer>\n'
    + '  <span class="f-c">&copy; ' + yr + ' ' + name + '. Built with PortfolioForge.</span>\n'
    + '  <div class="f-socials">'
    + (ghUrl ? '<a href="https://' + ghUrl + '" target="_blank" rel="noopener noreferrer" class="f-social-icon" title="GitHub">' + ghSVG + '</a>' : '')
    + (liUrl ? '<a href="https://' + liUrl + '" target="_blank" rel="noopener noreferrer" class="f-social-icon" title="LinkedIn">' + liSVG + '</a>' : '')
    + (email ? '<a href="mailto:' + email + '" class="f-social-icon" title="Email">' + mailSVG + '</a>' : '')
    + '</div>\n'
    + '</footer>\n'
    + _portfolioScript + '\n'
    + '</body>\n</html>';

  const blob=new Blob([out],{type:'text/html'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download=(name.toLowerCase().replace(/\s+/g,'-'))+'-portfolio.html';
  a.click();
  toast('✦  Portfolio downloaded successfully!');
}
