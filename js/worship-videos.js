(function(){
  const videos = window.KINGSHIP_WORSHIP_VIDEOS || [];
  const grid = document.querySelector('[data-video-grid]');
  const filters = document.querySelector('[data-video-filters]');
  if(!grid || !videos.length) return;
  const categories = ['All', ...new Set(videos.map(v=>v.category))];
  function render(filter='All'){
    grid.innerHTML = videos.filter(v=>filter==='All'||v.category===filter).map(v=>`<article class="video-card"><a class="video-thumb" href="${v.url}" aria-label="Open ${v.title}"><img src="${v.thumbnail}" alt="Placeholder thumbnail for ${v.title}"><span class="play-button" aria-hidden="true">▶</span><span class="video-category">${v.category}</span></a><div class="video-copy"><h3>${v.title}</h3><p>${v.description}</p><a href="${v.url}" class="text-link">Watch video <span>→</span></a></div></article>`).join('');
  }
  if(filters){filters.innerHTML=categories.map((c,i)=>`<button class="${i===0?'active':''}" type="button" data-video-filter="${c}">${c}</button>`).join('');filters.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;filters.querySelectorAll('button').forEach(x=>x.classList.remove('active'));b.classList.add('active');render(b.dataset.videoFilter);});}
  render();
})();
