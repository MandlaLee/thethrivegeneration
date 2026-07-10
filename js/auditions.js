(function(){
 const form=document.querySelector('#kingship-audition-form'); if(!form)return;
 const select=form.querySelector('[name="category"]'); (window.KINGSHIP_AUDITION_CATEGORIES||[]).forEach(c=>{const o=document.createElement('option');o.value=c;o.textContent=c;select.appendChild(o);});
 const file=form.querySelector('#auditionVideo'), link=form.querySelector('#videoLink'), feedback=form.querySelector('[data-form-feedback]');
 form.addEventListener('submit',e=>{
   e.preventDefault();
   feedback.className='form-feedback';
   if(!file.files.length && !link.value.trim()){feedback.textContent='Please upload a short audition video or paste a valid video link.';feedback.classList.add('error');return;}
   if(file.files.length && file.files[0].size > 100*1024*1024){feedback.textContent='This placeholder form accepts files up to 100 MB. Please compress the video or use a Drive, YouTube Unlisted or Dropbox link.';feedback.classList.add('error');return;}
   feedback.textContent='Thank you. This is currently a placeholder form, so your application has not been transmitted yet. The Google Drive and Sheets connection will be added later.';feedback.classList.add('success');
   feedback.focus();
 });
})();
