(function(){
  const grid=document.querySelector('[data-choir-grid]'); const filter=document.querySelector('[data-choir-filter]');
  const members=window.KINGSHIP_CHOIR_MEMBERS||[]; if(!grid)return;
  const groups=['All',...new Set(members.map(m=>m.group))];
  function draw(group='All'){grid.innerHTML=members.filter(m=>group==='All'||m.group===group).map(m=>`<article class="member-card"><img src="${m.image}" alt="Portrait of ${m.name}"><div><span>${m.group}</span><h3>${m.name}</h3><p class="member-role">${m.role}</p><p>${m.bio}</p></div></article>`).join('');}
  if(filter){filter.innerHTML=groups.map((g,i)=>`<button type="button" class="${i===0?'active':''}" data-group="${g}">${g}</button>`).join('');filter.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;filter.querySelectorAll('button').forEach(x=>x.classList.remove('active'));b.classList.add('active');draw(b.dataset.group);});}
  draw();
})();
