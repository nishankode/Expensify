export function sharedScript() {
  return `
const stitchData=window.__STITCH_DATA__||{};
const post=(payload)=>window.ReactNativeWebView&&window.ReactNativeWebView.postMessage(JSON.stringify(payload));
const textOf=(node)=>((node&&node.textContent)||'').replace(/\\s+/g,' ').trim();
const escapeHtml=(value)=>String(value ?? '').replace(/[&<>"']/g,(char)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const avatarUrl=String(stitchData.avatarUrl||'').trim();
if(avatarUrl){
  document.querySelectorAll('img[alt*="User"], img[alt*="Avatar"], img[alt*="Profile"]').forEach((img)=>{
    img.setAttribute('src',avatarUrl);
    img.style.display='block';
    const parent=img.parentElement;
    if(!parent) return;
    parent.classList.remove('bg-surface-container-high','flex','items-center','justify-center','text-primary');
    parent.querySelectorAll('.material-symbols-outlined').forEach((icon)=>{
      if(icon.textContent==='person'){
        icon.remove();
      }
    });
  });
}
document.querySelectorAll('[data-stitch-event]').forEach((node)=>{
  node.addEventListener('click',(event)=>{
    event.preventDefault();
    event.stopPropagation();
    const eventType=node.getAttribute('data-stitch-event');
    if(eventType){
      post({type:eventType});
    }
  });
});
document.querySelectorAll('[data-stitch-route]').forEach((node)=>{
  node.addEventListener('click',(event)=>{
    event.preventDefault();
    event.stopPropagation();
    const route=node.getAttribute('data-stitch-route');
    if(route){
      post({type:'navigate',route});
    }
  });
});
const legacyNavRoutes={
  home:'dashboard',
  analytics:'analytics',
  add:'addExpense',
  add_circle:'addExpense',
  history:'transactions',
  person:'profile',
};
document.querySelectorAll('nav a[href="#"]:not([data-stitch-route])').forEach((node)=>{
  const iconNode=node.querySelector('.material-symbols-outlined[data-icon]');
  const iconName=(iconNode&&iconNode.getAttribute('data-icon'))||'';
  const route=legacyNavRoutes[iconName];
  if(!route) return;
  node.addEventListener('click',(event)=>{
    event.preventDefault();
    event.stopPropagation();
    post({type:'navigate',route});
  });
});
window.__stitchPost=post;
window.__stitchText=textOf;
window.__stitchEscape=escapeHtml;
`
}
