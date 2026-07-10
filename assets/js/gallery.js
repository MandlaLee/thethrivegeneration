(() => {
  const items = window.KCC_GALLERY || [];
  const grid = document.getElementById('galleryGrid');
  const category = document.getElementById('galleryCategory');
  const lightbox = document.getElementById('lightbox');
  const image = document.getElementById('lightboxImage');
  const title = document.getElementById('lightboxTitle');
  const caption = document.getElementById('lightboxCaption');

  function render() {
    const selected = category?.value || 'all';
    const filtered = items.filter(item => selected === 'all' || item.category === selected);
    grid.innerHTML = filtered.map((item, index) => `
      <figure class="gallery-item" data-id="${item.id}">
        <img src="${item.image}" alt="${item.title}">
        <figcaption class="gallery-caption"><strong>${item.title}</strong><br><span>${item.category}</span></figcaption>
      </figure>`).join('');
  }

  grid?.addEventListener('click', event => {
    const target = event.target.closest('.gallery-item');
    if (!target) return;
    const item = items.find(entry => entry.id === target.dataset.id);
    if (!item) return;
    image.src = item.image;
    image.alt = item.title;
    title.textContent = item.title;
    caption.textContent = item.caption;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  });

  function close() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
  }

  document.getElementById('lightboxClose')?.addEventListener('click', close);
  lightbox?.addEventListener('click', event => { if (event.target === lightbox) close(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !lightbox.hidden) close(); });
  category?.addEventListener('change', render);
  render();
})();
