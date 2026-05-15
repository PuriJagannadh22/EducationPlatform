
/**
 * EduLMS – Application Logic
 * Refactored for performance, security, and maintainability.
 */

// --- DATA ---
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
    enrolled: true,
    longDesc: 'This course provides a comprehensive introduction to the fundamental concepts of computer science. Students will learn about algorithms, data structures, software engineering, and web development. No prior experience is required.',
    source: 'https://github.com/topics/computer-science'
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
    enrolled: true,
    longDesc: 'A continuation of Calculus I, covering integration techniques, applications of integration, sequences, series, and an introduction to multivariable functions.',
    source: 'https://ocw.mit.edu/courses/mathematics/'
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
    enrolled: true,
    longDesc: 'Master the principles of user interface and user experience design. Learn to create intuitive, beautiful, and functional digital products through hands-on projects.',
    source: 'https://www.behance.net/live/ui-ux-design'
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
    enrolled: true,
    longDesc: 'An in-depth study of cellular processes, including metabolism, signaling, and genetic expression. Focus on the molecular mechanisms that govern life at the cellular level.',
    source: 'https://www.nature.com/scitable/topicpage/what-is-a-cell-14023377/'
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
    enrolled: false,
    longDesc: 'Survey of the most influential literary works and movements of the 20th century, exploring themes of identity, globalization, and social change across various cultures.',
    source: 'https://www.gutenberg.org/'
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
    enrolled: false,
    longDesc: 'Comprehensive guide to data science using Python. Learn libraries like Pandas, Scikit-Learn, and Matplotlib to analyze data and build predictive models.',
    source: 'https://www.kaggle.com/learn'
  }
];

// --- APP STATE ---
const App = {
  state: {
    currentPage: 'home',
    toastTimer: null,
    filters: {
      q: '',
      cat: '',
      lvl: '',
      open: true,
      closed: true
    }
  },

  // DOM Cache
  elements: {
    pages: null,
    toast: null,
    grids: {
      home: null,
      courses: null
    },
    detailsView: null,
    navLinksContainer: null
  },

  init() {
    console.log('🚀 EduLMS Initializing...');
    
    // Cache Elements
    this.elements.pages = document.querySelectorAll('.page');
    this.elements.toast = document.getElementById('toast');
    this.elements.grids.home = document.getElementById('home-courses-grid');
    this.elements.grids.courses = document.getElementById('courses-grid');
    this.elements.detailsView = document.getElementById('course-details-view');
    this.elements.navLinksContainer = document.querySelector('.nav-links');

    // Bind Events
    this.bindEvents();

    // Theme Initialization
    this.initTheme();

    // Initial Routing
    const initialPage = window.location.hash.replace('#', '') || 'home';
    this.showPage(initialPage, true);
  },

  initTheme() {
    const savedTheme = localStorage.getItem('edulms-theme') || 'dark';
    this.applyTheme(savedTheme);
    const selector = document.getElementById('theme-selector');
    if (selector) selector.value = savedTheme;
  },

  applyTheme(theme) {
    if (theme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
    localStorage.setItem('edulms-theme', theme);
  },

  bindEvents() {
    // Hash Change
    window.addEventListener('hashchange', () => {
      const pageId = window.location.hash.replace('#', '') || 'home';
      if (pageId !== this.state.currentPage) {
        this.showPage(pageId);
      }
    });

    // Form Handling
    document.addEventListener('submit', (e) => {
      if (e.target.id === 'signinForm') {
        e.preventDefault();
        this.showToast('Successfully signed in!');
        setTimeout(() => this.showPage('dashboard'), 1000);
      }
    });
    
    // Filter Inputs
    const filterInputs = [
      'home-search', 'filter-category', 'filter-level', 'check-open', 'check-closed',
      'courses-search', 'cp-category', 'cp-level', 'cp-open', 'cp-closed'
    ];
    
    filterInputs.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        const eventType = el.tagName === 'INPUT' && el.type === 'text' ? 'input' : 'change';
        el.addEventListener(eventType, () => this.handleFilterChange());
      }
    });

    // Theme Selector
    const themeSelector = document.getElementById('theme-selector');
    if (themeSelector) {
      themeSelector.addEventListener('change', (e) => {
        this.applyTheme(e.target.value);
        this.showToast(`Theme switched to ${e.target.value} mode!`);
      });
    }
  },

  toggleMobileMenu() {
    if (this.elements.navLinksContainer) {
      this.elements.navLinksContainer.classList.toggle('show');
    }
  },

  // --- NAVIGATION ---
  showPage(pageId, isInitial = false) {
    const targetPage = document.getElementById('page-' + pageId);
    if (!targetPage) {
      console.error(`Page "${pageId}" not found.`);
      return;
    }

    this.state.currentPage = pageId;

    // UI Updates
    this.elements.pages.forEach(p => p.classList.remove('active'));
    targetPage.classList.add('active');

    // Close mobile menu on navigation
    if (this.elements.navLinksContainer) {
      this.elements.navLinksContainer.classList.remove('show');
    }

    // Update URL hash safely
    if (window.location.hash !== '#' + pageId) {
      window.history.pushState(null, '', '#' + pageId);
    }

    // Sync Active States for all links
    this.syncActiveLinks(pageId);

    // Scroll to Top
    if (!isInitial) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Render Logic
    if (pageId === 'home') this.renderHomeGrid();
    if (pageId === 'courses') this.renderCoursesGrid();
  },

  syncActiveLinks(pageId) {
    document.querySelectorAll('[onclick*="showPage"]').forEach(el => {
      if (el.getAttribute('onclick').includes(`'${pageId}'`)) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });
  },

  showDetails(id) {
    const c = courses.find(x => x.id === id);
    if (!c) return;

    if (this.elements.detailsView) {
      this.elements.detailsView.innerHTML = `
        <div class="card fade-up">
          <div class="course-banner ${c.banner}" style="height: 200px; border-radius: 12px; margin-bottom: 24px;">
            <span style="font-size: 80px;">${c.emoji}</span>
          </div>
          <h1 class="page-title">${c.title}</h1>
          <div style="display: flex; gap: 12px; margin-bottom: 20px;">
            <span class="course-tag ${c.enrollment === 'Open' ? 'tag-open' : 'tag-closed'}">${c.enrollment}</span>
            <span class="enrolled-badge" style="margin:0">${c.level}</span>
          </div>
          <p style="font-size: 18px; line-height: 1.6; color: var(--ink); margin-bottom: 32px;">${c.longDesc}</p>
          
          <div class="stats-row" style="margin-bottom: 32px;">
             <div class="stat-box">
               <div class="stat-icon icon-sage">👥</div>
               <div class="stat-box-info">
                 <div class="stat-box-num">${c.students}</div>
                 <div class="stat-box-label">Students</div>
               </div>
             </div>
             <div class="stat-box">
               <div class="stat-icon icon-gold">📅</div>
               <div class="stat-box-info">
                 <div class="stat-box-num">${c.weeks}</div>
                 <div class="stat-box-label">Weeks</div>
               </div>
             </div>
          </div>

          <div class="card" style="background: var(--cream); border-color: var(--border);">
            <div class="instructor-mini">
              <div class="avatar-mini" style="width:48px; height:48px; font-size:18px; background:${c.color}">${c.initials}</div>
              <div>
                <div style="font-weight:700; color:var(--ink)">${c.instructor}</div>
                <div style="font-size:13px; color:var(--muted)">Lead Instructor</div>
              </div>
            </div>
          </div>

          <div style="margin-top: 40px; display: flex; gap: 16px; flex-wrap: wrap;">
            ${this.getButtonHTML(c, true)}
            <a href="${c.source}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-lg" onclick="event.stopPropagation()">View Source 🌐</a>
            <button class="btn btn-outline btn-lg" onclick="showToast('Course outline coming soon!')">Download Syllabus</button>
          </div>
        </div>
      `;
    }

    this.showPage('details');
  },

  // --- RENDERING ---
  renderCard(c) {
    return `
      <div class="course-card fade-up" onclick="App.showDetails(${c.id})">
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
            <div style="display:flex; gap:8px;">
              <a href="${c.source}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm" onclick="event.stopPropagation()" title="View Source">Source</a>
              ${this.getButtonHTML(c)}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  getButtonHTML(c, isLarge = false) {
    const btnClass = isLarge ? 'btn-lg' : 'btn-sm';
    if (c.enrolled) {
      return `<button class="btn btn-outline ${btnClass}" onclick="event.stopPropagation(); showPage('progress')">View Progress</button>`;
    }
    if (c.enrollment === 'Closed') {
      return `<button class="btn btn-outline ${btnClass}" disabled style="opacity:0.5;cursor:not-allowed" onclick="event.stopPropagation()">Closed</button>`;
    }
    return `<button class="btn btn-sage ${btnClass}" onclick="event.stopPropagation(); App.enrollCourse(${c.id})">Enroll Now</button>`;
  },

  getFilteredCourses(context) {
    const searchId = context === 'home' ? 'home-search' : 'courses-search';
    const catId = context === 'home' ? 'filter-category' : 'cp-category';
    const lvlId = context === 'home' ? 'filter-level' : 'cp-level';
    const openId = context === 'home' ? 'check-open' : 'cp-open';
    const closedId = context === 'home' ? 'check-closed' : 'cp-closed';

    const q = document.getElementById(searchId)?.value.toLowerCase() || '';
    const cat = document.getElementById(catId)?.value || '';
    const lvl = document.getElementById(lvlId)?.value || '';
    const open = document.getElementById(openId)?.checked ?? true;
    const closed = document.getElementById(closedId)?.checked ?? true;

    return courses.filter(c => {
      const matchSearch = !q || c.title.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q);
      const matchCat = !cat || c.category === cat;
      const matchLvl = !lvl || c.level === lvl;
      const matchStatus = (open && c.enrollment === 'Open') || (closed && c.enrollment === 'Closed');
      return matchSearch && matchCat && matchLvl && matchStatus;
    });
  },

  renderHomeGrid() {
    if (!this.elements.grids.home) return;
    const list = this.getFilteredCourses('home').slice(0, 3);
    this.elements.grids.home.innerHTML = list.length 
      ? list.map(c => this.renderCard(c)).join('')
      : '<p class="empty-msg">No courses match your search.</p>';
  },

  renderCoursesGrid() {
    if (!this.elements.grids.courses) return;
    const list = this.getFilteredCourses('courses');
    this.elements.grids.courses.innerHTML = list.length 
      ? list.map(c => this.renderCard(c)).join('')
      : '<p class="empty-msg">No courses match your filters.</p>';
    
    const countEl = document.getElementById('courses-count');
    if (countEl) countEl.textContent = `${list.length} Course${list.length !== 1 ? 's' : ''}`;
  },

  handleFilterChange() {
    if (this.state.currentPage === 'home') this.renderHomeGrid();
    if (this.state.currentPage === 'courses') this.renderCoursesGrid();
  },

  enrollCourse(id) {
    const c = courses.find(x => x.id === id);
    if (c) {
      c.enrolled = true;
      c.students++;
      this.handleFilterChange();
      this.showToast(`🎉 Enrolled in "${c.title}"!`);
    }
  },

  showToast(msg) {
    if (!this.elements.toast) return;
    this.elements.toast.textContent = msg;
    this.elements.toast.classList.add('show');

    clearTimeout(this.state.toastTimer);
    this.state.toastTimer = setTimeout(() => {
      this.elements.toast.classList.remove('show');
    }, 3200);
  }
};

// Global hooks
window.showPage = (id) => App.showPage(id);
window.enrollCourse = (id) => App.enrollCourse(id);
window.showToast = (msg) => App.showToast(msg);
window.toggleFaq = (el) => el.classList.toggle('open');
window.App = App;

document.addEventListener('DOMContentLoaded', () => App.init());
