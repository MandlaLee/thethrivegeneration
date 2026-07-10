(() => {
  const givingCards = document.getElementById('givingCards');
  if (givingCards && window.KCC_PARTNERSHIP_OPTIONS) {
    givingCards.innerHTML = window.KCC_PARTNERSHIP_OPTIONS.giving.map(item => `
      <article class="giving-card">
        <span class="tag">${item.tag}</span>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <a href="${item.link}">${item.action}</a>
      </article>`).join('');
  }

  const openHandsCards = document.getElementById('openHandsCards');
  if (openHandsCards && window.KCC_OPEN_HANDS_PROGRAMMES) {
    openHandsCards.innerHTML = window.KCC_OPEN_HANDS_PROGRAMMES.map(item => `
      <article class="programme-card">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <small>${item.status}</small>
      </article>`).join('');
  }

  const openHandsForm = document.getElementById('openHandsForm');
  if (openHandsForm) {
    openHandsForm.addEventListener('submit', event => {
      event.preventDefault();
      const status = document.getElementById('openHandsStatus');
      status.textContent = 'Thank you. This placeholder form is ready to connect to Google Sheets later.';
      openHandsForm.reset();
    });
  }
})();
