(() => {
  const programmeRoot = document.querySelector('#prayer-programmes');
  const eventRoot = document.querySelector('#prayer-events');
  const programmes = window.KINGSHIP_PRAYER_PROGRAMMES || [];
  const events = window.KINGSHIP_PRAYER_EVENTS || [];
  if (programmeRoot) programmeRoot.innerHTML = programmes.map(item => `<article class="prayer-programme-card"><span>${item.number}</span><h3>${item.title}</h3><p>${item.description}</p><small>${item.note}</small></article>`).join('');
  if (eventRoot) eventRoot.innerHTML = events.map(item => `<article class="prayer-event-card"><span>${item.date}</span><div><small>${item.type}</small><h3>${item.title}</h3><p>${item.detail}</p></div></article>`).join('');
  const revealItems = document.querySelectorAll('.prayer-programme-card,.altar-grid,.fasting-grid,.revival-grid,.tour-steps article,.prayer-event-card,.partner-prayer-grid,.prayer-response-card');
  if (!('IntersectionObserver' in window)) return revealItems.forEach(el => el.classList.add('reveal-in'));
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('reveal-in'); observer.unobserve(entry.target); } }), {threshold:.12});
  revealItems.forEach(el => { el.classList.add('reveal-ready'); observer.observe(el); });
})();
