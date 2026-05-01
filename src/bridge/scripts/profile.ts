import { sharedScript } from './shared'

export function profileScript() {
  return `
${sharedScript()}
const data=window.__STITCH_DATA__||{};
try {
  const nameNode=document.getElementById('user-name');
  const emailNode=document.getElementById('user-email');
  if(nameNode) nameNode.textContent=data.fullName || '';
  if(emailNode) emailNode.textContent=data.email || '';
} catch(e) { console.error('Error updating text nodes', e); }

try {
  const avatarUrl=String(data.avatarUrl||'').trim();
  if(avatarUrl){
    document.querySelectorAll('img[alt*="User"], img[alt*="Avatar"], img[alt*="Profile"]').forEach((img)=>{
      img.setAttribute('src',avatarUrl);
      img.style.display='block';
    });
  }
} catch(e) { console.error('Error updating avatars', e); }

try {
  const badges=document.querySelectorAll('section:first-of-type .w-full.bg-surface-container-low');
  badges.forEach((node)=>node.remove());
} catch(e) { console.error('Error removing badges', e); }

try {
  const editPhoto=document.querySelector('button[aria-label="Edit Photo"]');
  if(editPhoto){
    editPhoto.style.zIndex='10';
    editPhoto.style.width='40px';
    editPhoto.style.height='40px';
    const triggerPhotoPicker=(event)=>{
      event.preventDefault();
      event.stopPropagation();
      window.__stitchPost({type:'profile.avatar.pick'});
    };
    editPhoto.onclick = triggerPhotoPicker;
  }
} catch(e) { console.error('Error setting up photo picker', e); }

`
}
