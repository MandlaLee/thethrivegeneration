(() => {
  const form = document.getElementById('unithrive-form');
  if (!form) return;
  const status = form.querySelector('[data-form-status]');
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    status.textContent = 'Thank you. This placeholder form is ready to be connected to Google Sheets or another form service.';
    status.style.color = '#6e5317';
  });
})();
