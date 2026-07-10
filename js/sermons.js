(() => {
  const data = window.KCC_SERMONS || [];
  const featured = document.getElementById('featuredSermon');
  const grid = document.getElementById('sermonGrid');
  const search = document.getElementById('sermonSearch');
  const topic = document.getElementById('sermonTopic');

  if (featured && data.length) {
    const item = data.find(entry => entry.featured) || data[0];
    featured.innerHTML = `
      <img src="${item.image}" alt="${item.title}">
      <div class="featured-copy">
        <p class="eyebrow">${item.topic}</p>
        <h3>${item.title}</h3>
        <p><strong>${item.speaker}</strong> · ${item.date}</p>
        <p>${item.description}</p>
        <a class="btn btn-primary" href="${item.url}" target="_blank" rel="noopener">Watch Message</a>
      </div>`;
  }

  function render() {
    const term = (search?.value || '').toLowerCase().trim();
    const selected = topic?.value || 'all';
    const filtered = data.filter(item => {
      const searchable = `${item.title} ${item.speaker} ${item.topic} ${item.description}`.toLowerCase();
      return searchable.includes(term) && (selected === 'all' || item.topic === selected);
    });
    grid.innerHTML = filtered.map(item => `
      <article class="media-card">
        <img src="${item.image}" alt="${item.title}">
        <div class="media-card-body">
          <div class="media-meta"><span>${item.topic}</span><span>${item.date}</span></div>
          <h3>${item.title}</h3>
          <p>${item.speaker}</p>
          <p>${item.description}</p>
          <a href="${item.url}" target="_blank" rel="noopener">Watch message</a>
        </div>
      </article>`).join('');
  }

  search?.addEventListener('input', render);
  topic?.addEventListener('change', render);
  render();
})();
