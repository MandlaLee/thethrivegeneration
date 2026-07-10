(() => {
  const cards = document.querySelectorAll('.ministry-feature-card');
  if (!('IntersectionObserver' in window) || !cards.length) return;
  cards.forEach(card => card.classList.add('reveal-ready'));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  cards.forEach(card => observer.observe(card));
})();
