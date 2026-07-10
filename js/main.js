(() => {
  document.querySelectorAll('[data-year]').forEach((node) => {
    node.textContent = new Date().getFullYear();
  });

  const closeButton = document.querySelector('[data-announcement-close]');
  const announcement = document.querySelector('[data-announcement]');
  if (closeButton && announcement) {
    closeButton.addEventListener('click', () => announcement.remove());
  }

  const header = document.querySelector('[data-header]');
  if (header) {
    const setHeaderState = () => header.classList.toggle('scrolled', window.scrollY > 20);
    setHeaderState();
    window.addEventListener('scroll', setHeaderState, { passive: true });
  }
})();
