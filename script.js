// scroll-triggered reveal for the features section,
// using Intersection Observer instead of a scroll event listener
// (better performance — no manual scroll-position math)

const revealCards = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // animate in once, then stop watching
      }
    });
  },
  {
    threshold: 0.2 // fire when ~20% of the card is visible
  }
);

revealCards.forEach(function (card) {
  observer.observe(card);
});
