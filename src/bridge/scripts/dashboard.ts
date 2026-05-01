import { sharedScript } from './shared'

export function dashboardScript() {
  return `
${sharedScript()}
const data=window.__STITCH_DATA__;
const escape=window.__stitchEscape;
const balanceNode=document.getElementById('total-expense-main');
const incomeNode=document.getElementById('total-income');
const expenseNode=document.getElementById('total-expense-small');
const budgetNode=document.getElementById('monthly-budget');
const dashboardCard=balanceNode&&balanceNode.closest('.relative.z-10');
const budgetWrap=budgetNode&&budgetNode.parentElement;
const comparisonWrap=dashboardCard&&dashboardCard.querySelector('.mt-6.flex.justify-between.items-end > div:last-child');
const comparisonIcon=comparisonWrap&&comparisonWrap.querySelector('.material-symbols-outlined');
const comparisonText=comparisonWrap&&comparisonWrap.querySelector('span:last-child');

const greetingNode=document.getElementById('greeting-text');
const categoryBreakdownList=document.getElementById('category-breakdown-list');

if(balanceNode){
  balanceNode.textContent=data.summary?.expenses || '₹0';
  const currencyPrefix=balanceNode.previousElementSibling;
  if(currencyPrefix && currencyPrefix.tagName==='SPAN'){
    currencyPrefix.remove();
  }
}
if(incomeNode) incomeNode.textContent=data.summary?.income || '₹0';
if(expenseNode) expenseNode.textContent=data.summary?.expenses || '₹0';
if(budgetNode) budgetNode.textContent=data.summary?.budget || '';
if(budgetWrap){
  budgetWrap.style.display=data.summary?.budget ? '' : 'none';
}
if(comparisonWrap){
  const change=data.expenseChange;
  if(!change){
    comparisonWrap.style.display='none';
  } else {
    comparisonWrap.style.display='flex';
    if(comparisonText) comparisonText.textContent=change.label;
    if(comparisonIcon){
      comparisonIcon.textContent=change.direction==='up' ? 'trending_up' : change.direction==='down' ? 'trending_down' : 'trending_flat';
      comparisonIcon.classList.remove('text-secondary-fixed','text-error-container');
      comparisonIcon.classList.add(change.direction==='up' ? 'text-error-container' : 'text-secondary-fixed');
    }
    if(comparisonText){
      comparisonText.classList.remove('text-secondary-fixed','text-error-container');
      comparisonText.classList.add(change.direction==='up' ? 'text-error-container' : 'text-secondary-fixed');
    }
  }
}

if(greetingNode) greetingNode.textContent='Welcome!';

if(categoryBreakdownList){
  if((data.categories||[]).length===0){
    categoryBreakdownList.innerHTML=\`
      <div class="col-span-2 rounded-2xl border border-dashed border-outline-variant bg-surface-container-low p-4 text-center">
        <p class="font-body-base text-body-base text-on-surface">No category breakdown yet</p>
        <p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Add transactions to see where your money is going.</p>
      </div>\`;
  } else {
    categoryBreakdownList.innerHTML=data.categories.map((item)=>\`
      <div class="rounded-2xl bg-surface-container-low p-3 border border-outline-variant/20">
        <div class="flex items-start gap-2 mb-3">
          <span class="material-symbols-outlined p-2 rounded-full text-[15px] shrink-0" style="background-color:\${item.background};color:\${item.foreground};">\${escape(item.icon)}</span>
          <div class="min-w-0 flex-1">
            <p class="text-[13px] leading-4 font-semibold text-on-surface truncate">\${escape(item.name)}</p>
            <p class="mt-1 text-[12px] font-medium text-on-surface truncate">\${escape(item.amount)}</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-full bg-surface-variant rounded-full h-2 overflow-hidden">
            <div class="h-2 rounded-full" style="width:\${item.percent}%;background-color:\${item.foreground};"></div>
          </div>
          <span class="text-[10px] font-semibold text-on-surface-variant shrink-0">\${item.percent}%</span>
        </div>
      </div>\`).join('');
  }
}

const recentList=document.getElementById('recent-transactions-list');
if(recentList){
  if((data.recentTransactions||[]).length===0){
    recentList.classList.add('text-center', 'py-6', 'bg-surface-container-low/50', 'border', 'border-dashed', 'border-outline-variant', 'rounded-xl');
    recentList.innerHTML=\`
      <div class="w-14 h-14 mx-auto rounded-full bg-surface-container flex items-center justify-center text-outline mb-4">
        <span class="material-symbols-outlined">receipt_long</span>
      </div>
      <p class="font-body-base text-body-base text-on-surface">No transactions yet</p>
      <p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Your recent activity will appear here after you log your first entry.</p>\`;
  } else {
    recentList.classList.remove('text-center', 'py-6', 'bg-surface-container-low/50', 'border', 'border-dashed', 'border-outline-variant', 'rounded-xl');
    recentList.innerHTML=data.recentTransactions.map((item)=>\`
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style="background-color:\${item.background};color:\${item.foreground};">
            <span class="material-symbols-outlined">\${escape(item.icon)}</span>
          </div>
          <div>
            <p class="font-body-base text-body-base font-medium text-on-background">\${escape(item.title)}</p>
            <p class="font-label-sm text-label-sm text-on-surface-variant">\${escape(item.subtitle)}</p>
          </div>
        </div>
        <p class="font-body-base text-body-base font-semibold \${item.kind==='expense'?'text-error':'text-secondary'}">\${escape(item.amount)}</p>
      </div>\`).join('');
  }
}

document.getElementById('show-all-history')?.addEventListener('click', () => {
  window.__stitchPost({ type: 'navigate', route: 'transactions' });
});
`
}
