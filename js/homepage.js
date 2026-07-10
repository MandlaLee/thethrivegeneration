(() => {
  const countdown = document.querySelector('[data-countdown]');
  if (!countdown) return;

  const target = new Date(countdown.dataset.target).getTime();
  const fields = {
    days: countdown.querySelector('[data-days]'),
    hours: countdown.querySelector('[data-hours]'),
    minutes: countdown.querySelector('[data-minutes]'),
    seconds: countdown.querySelector('[data-seconds]')
  };

  const pad = (value) => String(Math.max(0, value)).padStart(2, '0');
  const update = () => {
    const remaining = Math.max(0, target - Date.now());
    fields.days.textContent = pad(Math.floor(remaining / 86400000));
    fields.hours.textContent = pad(Math.floor((remaining % 86400000) / 3600000));
    fields.minutes.textContent = pad(Math.floor((remaining % 3600000) / 60000));
    fields.seconds.textContent = pad(Math.floor((remaining % 60000) / 1000));
  };

  update();
  window.setInterval(update, 1000);
})();
