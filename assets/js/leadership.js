document.addEventListener('DOMContentLoaded',()=>{
  const grid=document.querySelector('[data-leadership-grid]');
  if(!grid||!window.KCC_LEADERSHIP)return;
  grid.innerHTML=window.KCC_LEADERSHIP.map(person=>`<article class="team-card"><div class="leader-photo"><img src="${person.image}" alt="Portrait of ${person.name}"></div><div class="team-card-content"><p class="role">${person.role}</p><h3>${person.name}</h3><p>${person.summary}</p><a href="${person.link}">Read profile →</a></div></article>`).join('');
});
