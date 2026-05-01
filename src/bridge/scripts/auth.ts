import { sharedScript } from './shared'

export function authScript(mode: 'signin' | 'signup') {
  const nextMode = mode === 'signin' ? 'signup' : 'signin'
  const switchLabel = mode === 'signin' ? 'Sign Up' : 'Sign In'
  const switchPrefix = mode === 'signin' ? 'Need an account? ' : 'Already have an account? '

  return `
${sharedScript()}
const authMode=${JSON.stringify(mode)};
const form=document.querySelector('form');
const title=document.querySelector('h1');
const subtitle=[...document.querySelectorAll('p')].find((node)=>window.__stitchText(node).includes('Join FinTrack AI'));
const googleButton=[...document.querySelectorAll('button')].find((node)=>window.__stitchText(node).includes('Google'));
const submitButton=form&&form.querySelector('button[type="submit"]');
const inputs=form?[...form.querySelectorAll('input')]:[];
if(title){
  title.textContent=authMode==='signin'?'Sign-In to your account':'Create your account';
}
if(subtitle){
  subtitle.textContent=authMode==='signin'
    ? 'Continue with your Google account to access FinTrack AI.'
    : 'Use Google to create your FinTrack AI account.';
}
inputs.forEach((input)=>{
  input.disabled=true;
  input.value='';
  input.setAttribute('aria-disabled','true');
  input.style.opacity='0.65';
});
if(submitButton){
  submitButton.textContent='Continue with Google';
}
const helper=document.createElement('p');
helper.className='font-label-sm text-label-sm text-on-surface-variant mt-4 text-center';
helper.textContent='Google sign-in only is enabled right now.';
if(form){
  form.appendChild(helper);
}
const switchLink=[...document.querySelectorAll('a')].find((node)=>node.getAttribute('href')==='#');
if(switchLink){
  switchLink.textContent=${JSON.stringify(switchLabel)};
  if(switchLink.previousSibling&&switchLink.previousSibling.nodeType===Node.TEXT_NODE){
    switchLink.previousSibling.textContent=${JSON.stringify(switchPrefix)};
  }
  switchLink.addEventListener('click',(event)=>{
    event.preventDefault();
    window.__stitchPost({type:'auth.switch',mode:${JSON.stringify(nextMode)}});
  });
}
if(form){
  form.addEventListener('submit',(event)=>{
    event.preventDefault();
    window.__stitchPost({type:'auth.google',mode:authMode});
  });
}
if(submitButton){
  submitButton.addEventListener('click',(event)=>{
    event.preventDefault();
    window.__stitchPost({type:'auth.google',mode:authMode});
  });
}
if(googleButton){
  googleButton.addEventListener('click',(event)=>{
    event.preventDefault();
    window.__stitchPost({type:'auth.google',mode:authMode});
  });
}
`
}
