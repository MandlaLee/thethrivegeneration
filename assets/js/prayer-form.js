(() => {
  const form = document.querySelector('[data-prayer-form]');
  if (!form) return;
  const textarea = form.querySelector('textarea[name="request"]');
  const count = form.querySelector('[data-character-count]');
  const status = form.querySelector('[data-form-status]');
  const updateCount = () => { if (count && textarea) count.textContent = `${textarea.value.length} / 2000`; };
  textarea?.addEventListener('input', updateCount); updateCount();
  form.addEventListener('submit', event => {
    event.preventDefault(); status.className = 'form-status';
    if (!form.checkValidity()) { form.reportValidity(); status.textContent = 'Please complete the required fields before submitting.'; status.classList.add('error'); return; }
    status.textContent = 'Placeholder submission received. Connect this form to Google Apps Script when the church is ready.'; status.classList.add('success');
    form.reset(); updateCount();
  });
})();
