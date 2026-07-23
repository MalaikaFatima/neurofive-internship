// builds one card per project in PROJECTS (from projects-data.js)
// using real DOM creation, not a hardcoded HTML block per project.

const grid = document.querySelector('#projects-grid');

function createProjectCard(project) {
  const card = document.createElement('article');
  card.className = 'project-card';

  const title = document.createElement('h3');
  title.textContent = project.title;

  const desc = document.createElement('p');
  desc.className = 'project-card__desc';
  desc.textContent = project.description;

  const tagList = document.createElement('div');
  tagList.className = 'project-card__tags';
  project.tags.forEach(function (tag) {
    const tagEl = document.createElement('span');
    tagEl.className = 'tag';
    tagEl.textContent = tag;
    tagList.appendChild(tagEl);
  });

  const link = document.createElement('a');
  link.href = project.link;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.className = 'project-card__link';
  link.textContent = 'View on GitHub →';

  card.appendChild(title);
  card.appendChild(desc);
  card.appendChild(tagList);
  card.appendChild(link);

  return card;
}

PROJECTS.forEach(function (project) {
  grid.appendChild(createProjectCard(project));
});
