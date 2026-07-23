// This file is the single source of truth for the navbar and footer.
// Every page includes this script and has two empty placeholder elements
// (#navbar and #footer) — this script builds the markup once and injects
// it everywhere, so the nav/footer are never hand-copied across pages.

const NAV_LINKS = [
  { label: 'Home', href: 'index.html', page: 'home' },
  { label: 'Projects', href: 'projects.html', page: 'projects' },
  { label: 'About', href: 'about.html', page: 'about' },
  { label: 'Contact', href: 'contact.html', page: 'contact' }
];

function renderNavbar() {
  const nav = document.querySelector('#navbar');
  if (!nav) return;

  const currentPage = document.body.dataset.page;

  const linksHTML = NAV_LINKS.map(function (link) {
    const activeClass = link.page === currentPage ? ' is-active' : '';
    return `<a href="${link.href}" class="navbar__link${activeClass}">${link.label}</a>`;
  }).join('');

  nav.innerHTML = `
    <div class="navbar__inner">
      <a href="index.html" class="navbar__brand">Malaika Fatima</a>
      <button class="navbar__toggle" id="navbar-toggle" aria-label="Toggle menu">☰</button>
      <div class="navbar__links" id="navbar-links">${linksHTML}</div>
    </div>
  `;

  const toggle = document.querySelector('#navbar-toggle');
  const links = document.querySelector('#navbar-links');
  toggle.addEventListener('click', function () {
    links.classList.toggle('is-open');
  });
}

function renderFooter() {
  const footer = document.querySelector('#footer');
  if (!footer) return;

  const year = new Date().getFullYear();

  footer.innerHTML = `
    <div class="footer__inner">
      <p>&copy; ${year} Malaika Fatima. Built with HTML, CSS &amp; JS.</p>
      <div class="footer__links">
        <a href="https://github.com/MalaikaFatima" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="https://www.linkedin.com/in/malaika-fatima-88101b374/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
      </div>
    </div>
  `;
}

renderNavbar();
renderFooter();
