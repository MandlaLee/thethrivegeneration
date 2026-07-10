(() => {
  const paths = document.getElementById('partnershipPathCards');
  if (paths && window.KCC_PARTNERSHIP_OPTIONS) {
    paths.innerHTML = window.KCC_PARTNERSHIP_OPTIONS.partnership.map(item => `
      <article class="compact-card"><h3>${item.title}</h3><p>${item.description}</p></article>
    `).join('');
  }

  const form = document.getElementById('partnershipForm');
  if (!form) return;
  form.addEventListener('submit', event => {
    event.preventDefault();
    const status = document.getElementById('partnerStatus');
    status.textContent = 'Thank you. Your placeholder enquiry has been validated. Connect this form to Google Apps Script before launch.';
    form.reset();
  });
})();
