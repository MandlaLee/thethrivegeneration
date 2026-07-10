(() => {
  const data = window.KCC_MEDIA || [];
  const featured = document.getElementById('featuredMedia');
  const grid = document.getElementById('mediaGrid');
  const search = document.getElementById('mediaSearch');
  const category = document.getElementById('mediaCategory');
  const empty = document.getElementById('mediaEmpty');

  if (featured && data.length) {
    const item = data.find(entry => entry.featured) || data[0];
    featured.innerHTML = `
      <img src="${item.image}" alt="${item.title}">
      <div class="featured-copy">
        <p class="eyebrow">${item.category}</p>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <a class="btn btn-primary" href="${item.url}" ${item.external ? 'target="_blank" rel="noopener"' : ''}>${item.action}</a>
      </div>`;
  }

  function render() {
    if (!grid) return;
    const term = (search?.value || '').toLowerCase().trim();
    const selected = category?.value || 'all';
    const filtered = data.filter(item => {
      const matchTerm = `${item.title} ${item.description} ${item.category}`.toLowerCase().includes(term);
      const matchCategory = selected === 'all' || item.category === selected;
      return matchTerm && matchCategory;
    });
    grid.innerHTML = filtered.map(item => `
      <article class="media-card">
        <img src="${item.image}" alt="${item.title}">
        <div class="media-card-body">
          <div class="media-meta"><span>${item.category}</span><span>${item.date}</span></div>
          <h3>${item.title}</h3>
          <p>${item.description}</p>
          <a href="${item.url}" ${item.external ? 'target="_blank" rel="noopener"' : ''}>${item.action}</a>
        </div>
      </article>`).join('');
    if (empty) empty.hidden = filtered.length !== 0;
  }

  search?.addEventListener('input', render);
  category?.addEventListener('change', render);
  render();
})();
