
const courses = [
  {
    id: 1,
    title: 'Introduction to Computer Science',
    desc: 'Fundamentals of programming, algorithms, and data structures.',
    category: 'Computer Science',
    level: 'Beginner',
    banner: 'banner-cs',
    emoji: '🖥️',
    instructor: 'Dr. Sarah Mitchell',
    initials: 'SM',
    color: '#2c3e50',
    enrollment: 'Open',
    students: 342,
    weeks: 12,
    enrolled: true
  },
  {
    id: 2,
    title: 'Calculus II',
    desc: 'Integral calculus, sequences, series, and multivariable calculus.',
    category: 'Mathematics',
    level: 'Intermediate',
    banner: 'banner-math',
    emoji: '📐',
    instructor: 'Prof. James Chen',
    initials: 'JC',
    color: '#3498db',
    enrollment: 'Open',
    students: 189,
    weeks: 11,
    enrolled: true
  },
  {
    id: 3,
    title: 'UI/UX Design Fundamentals',
    desc: 'Learn design thinking, wireframing, and prototyping for digital products.',
    category: 'Design',
    level: 'Beginner',
    banner: 'banner-design',
    emoji: '🎨',
    instructor: 'Ms. Priya Sharma',
    initials: 'PS',
    color: '#e74c3c',
    enrollment: 'Open',
    students: 271,
    weeks: 10,
    enrolled: true
  },
  {
    id: 4,
    title: 'Cell Biology',
    desc: 'Explore cellular structure, function, organelles, and molecular mechanisms.',
    category: 'Biology',
    level: 'Intermediate',
    banner: 'banner-bio',
    emoji: '🧬',
    instructor: 'Dr. Ananya Roy',
    initials: 'AR',
    color: '#27ae60',
    enrollment: 'Closed',
    students: 98,
    weeks: 9,
    enrolled: true
  },
  {
    id: 5,
    title: 'Modern World Literature',
    desc: 'An exploration of 20th century literary movements and their global impact.',
    category: 'Literature',
    level: 'Beginner',
    banner: 'banner-lit',
    emoji: '📖',
    instructor: 'Prof. Lisa Fernandez',
    initials: 'LF',
    color: '#9b59b6',
    enrollment: 'Open',
    students: 156,
    weeks: 14,
    enrolled: false
  },
  {
    id: 6,
    title: 'Data Science & Machine Learning',
    desc: 'Python-based data analysis, visualization, and intro to ML algorithms.',
    category: 'Data Science',
    level: 'Advanced',
    banner: 'banner-data',
    emoji: '🤖',
    instructor: 'Dr. Ravi Kumar',
    initials: 'RK',
    color: '#f39c12',
    enrollment: 'Open',
    students: 412,
    weeks: 16,
    enrolled: false
  }
];


function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));

  document.getElementById('page-' + name).classList.add('active');

  const navEl = document.getElementById('nav-' + name);
  if (navEl) navEl.classList.add('active');

  window.scrollTo(0, 0);

  if (name === 'home')    renderHomeGrid(courses);
  if (name === 'courses') renderCoursesGrid(courses);
}

function renderCard(c) {
  return `
    <div class="course-card fade-up">
      <div class="course-banner ${c.banner}">
        <span style="position:relative;z-index:1;font-size:52px">${c.emoji}</span>
      </div>
      <div class="course-body">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
          <span class="course-tag ${c.enrollment === 'Open' ? 'tag-open' : 'tag-closed'}">${c.enrollment}</span>
          <span style="font-size:11px;color:var(--muted);font-weight:500">${c.level}</span>
          ${c.enrolled ? '<span class="enrolled-badge">Enrolled</span>' : ''}
        </div>
        <h3>${c.title}</h3>
        <p>${c.desc}</p>
        <div class="course-meta">
          <span class="meta-item">👥 ${c.students} students</span>
          <span class="meta-item">📅 ${c.weeks} weeks</span>
          <span class="meta-item">🏷️ ${c.category}</span>
        </div>
        <div class="course-footer">
          <div class="instructor-mini">
            <div class="avatar-mini" style="background:${c.color}">${c.initials}</div>
            <span class="avatar-mini-name">${c.instructor}</span>
          </div>
          ${
            c.enrollment === 'Open' && !c.enrolled
              ? `<button class="btn btn-sage btn-sm" onclick="enrollCourse(${c.id}, event)">Enroll Now</button>`
              : c.enrolled
              ? `<button class="btn btn-outline btn-sm" onclick="showPage('progress')">Continue →</button>`
              : `<button class="btn btn-outline btn-sm" disabled style="opacity:0.5;cursor:not-allowed">Closed</button>`
          }
        </div>
      </div>
    </div>
  `;
}

function renderHomeGrid(list) {
  const el = document.getElementById('home-courses-grid');
  if (!el) return;
  const featured = list.slice(0, 3);
  el.innerHTML = featured.length
    ? featured.map(c => renderCard(c)).join('')
    : '<p style="color:var(--muted);grid-column:1/-1;text-align:center;padding:40px">No courses match your search.</p>';
}

function renderCoursesGrid(list) {
  const el    = document.getElementById('courses-grid');
  const count = document.getElementById('courses-count');
  if (!el) return;
  el.innerHTML = list.length
    ? list.map(c => renderCard(c)).join('')
    : '<p style="color:var(--muted);grid-column:1/-1;text-align:center;padding:40px">No courses match your filters.</p>';
  if (count) count.textContent = `${list.length} Course${list.length !== 1 ? 's' : ''}`;
}

function filterHomeSearch() {
  const q      = document.getElementById('home-search').value.toLowerCase();
  const cat    = document.getElementById('filter-category').value;
  const lvl    = document.getElementById('filter-level').value;
  const open   = document.getElementById('check-open').checked;
  const closed = document.getElementById('check-closed').checked;

  const filtered = courses.filter(c => {
    if (q && !c.title.toLowerCase().includes(q) && !c.desc.toLowerCase().includes(q)) return false;
    if (cat && c.category !== cat) return false;
    if (lvl && c.level !== lvl) return false;
    if (!open   && c.enrollment === 'Open')   return false;
    if (!closed && c.enrollment === 'Closed') return false;
    return true;
  });

  renderHomeGrid(filtered);
}

function filterCoursesPage() {
  const q      = document.getElementById('courses-search').value.toLowerCase();
  const cat    = document.getElementById('cp-category').value;
  const lvl    = document.getElementById('cp-level').value;
  const open   = document.getElementById('cp-open').checked;
  const closed = document.getElementById('cp-closed').checked;

  const filtered = courses.filter(c => {
    if (q && !c.title.toLowerCase().includes(q) && !c.desc.toLowerCase().includes(q)) return false;
    if (cat && c.category !== cat) return false;
    if (lvl && c.level !== lvl) return false;
    if (!open   && c.enrollment === 'Open')   return false;
    if (!closed && c.enrollment === 'Closed') return false;
    return true;
  });

  renderCoursesGrid(filtered);
}

function enrollCourse(id, e) {
  e.stopPropagation();
  const c = courses.find(x => x.id === id);
  if (c) {
    c.enrolled = true;
    c.students++;
    renderCoursesGrid(courses);
    renderHomeGrid(courses);
    showToast(`🎉 Enrolled in "${c.title}"!`);
  }
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3200);
}


function toggleFaq(el) {
  el.classList.toggle('open');
}

renderHomeGrid(courses);