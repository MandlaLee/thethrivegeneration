document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('[data-bio-toggle]').forEach(button=>{
    button.addEventListener('click',()=>{
      const item=button.closest('.bio-item');
      const open=item.classList.toggle('open');
      button.setAttribute('aria-expanded',String(open));
      button.querySelector('span').textContent=open?'−':'+';
    });
  });
});
