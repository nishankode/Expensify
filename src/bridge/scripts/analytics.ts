import { sharedScript } from './shared'

export function analyticsScript() {
  return `
${sharedScript()}
const data=window.__STITCH_DATA__||{};
const escape=window.__stitchEscape;
const views=data.views||{};
const expenseNode=document.getElementById('total-expense');
const comparisonNode=document.getElementById('comparison-text');
const periodChip=document.getElementById('period-chip');
const heroNetNode=document.getElementById('hero-net');
const heroBudgetNode=document.getElementById('hero-budget');
const metricIncomeNode=document.getElementById('metric-income');
const metricNetNode=document.getElementById('metric-net');
const metricNetCaptionNode=document.getElementById('metric-net-caption');
const metricBudgetNode=document.getElementById('metric-budget');
const metricBudgetCaptionNode=document.getElementById('metric-budget-caption');
const metricAverageNode=document.getElementById('metric-average');
const metricAverageCaptionNode=document.getElementById('metric-average-caption');
const categoryBudgetStatusSection=document.getElementById('category-budget-status-section');
const categoryBudgetStatusList=document.getElementById('category-budget-status-list');
const signalTopNameNode=document.getElementById('signal-top-name');
const signalTopAmountNode=document.getElementById('signal-top-amount');
const signalTopCaptionNode=document.getElementById('signal-top-caption');
const signalLargestNameNode=document.getElementById('signal-largest-name');
const signalLargestAmountNode=document.getElementById('signal-largest-amount');
const signalLargestCaptionNode=document.getElementById('signal-largest-caption');
const insightList=document.getElementById('insight-list');
const toggleButtons=[...document.querySelectorAll('.analytics-toggle')];

const setActiveToggle=(viewName)=>{
  toggleButtons.forEach((button)=>{
    const active=button.getAttribute('data-view')===viewName;
    button.className='analytics-toggle flex-1 text-center py-2 rounded-full font-label-sm text-label-sm transition-colors';
    if(active){
      button.classList.add('bg-primary','text-on-primary','shadow-sm');
    }else{
      button.classList.add('text-on-surface-variant','hover:bg-surface-container-high');
    }
  });
};

const findPeakItem=(items)=>{
  return (items||[]).reduce((best,current)=>{
    if(!best) return current;
    return Number(current.rawAmount||0)>Number(best.rawAmount||0) ? current : best;
  },null);
};

const findLatestActiveItem=(items)=>{
  const activeItems=(items||[]).filter((item)=>Number(item.rawAmount||0)>0);
  return activeItems[activeItems.length-1]||null;
};

const renderCategoryBudgetStatuses=(view,viewName)=>{
  if(!categoryBudgetStatusSection || !categoryBudgetStatusList) return;
  if(viewName!=='monthly'){
    categoryBudgetStatusSection.classList.add('hidden');
    return;
  }

  categoryBudgetStatusSection.classList.remove('hidden');
  const items=view.categoryBudgetStatuses||[];
  if(items.length===0){
    categoryBudgetStatusList.innerHTML='<div class="rounded-2xl border border-dashed border-outline-variant bg-surface-container-low p-4 text-center"><p class="text-sm font-semibold text-on-surface">No category budgets yet</p><p class="mt-1 text-[11px] leading-4 text-on-surface-variant">Set category budgets from Budget Settings to track them here.</p></div>';
    return;
  }

  const toneClasses={
    good:'bg-secondary-container text-on-secondary-container',
    warning:'bg-primary-fixed text-primary',
    over:'bg-error-container text-on-error-container',
  };

  categoryBudgetStatusList.innerHTML=items.map((item)=>\`
    <div class="rounded-2xl bg-surface-container-low p-4">
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-center gap-3 min-w-0">
          <span class="material-symbols-outlined p-2 rounded-full text-[16px] shrink-0" style="background-color:\${item.background};color:\${item.foreground};">\${escape(item.icon)}</span>
          <div class="min-w-0">
            <p class="text-sm font-semibold text-on-surface truncate">\${escape(item.categoryName)}</p>
            <p class="text-[11px] leading-4 text-on-surface-variant truncate">\${escape(item.spent)} of \${escape(item.budget)}</p>
          </div>
        </div>
        <span class="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] \${toneClasses[item.statusKey]||toneClasses.good}">\${escape(item.statusLabel)}</span>
      </div>
      <div class="mt-3 flex items-center gap-3">
        <div class="w-full bg-surface-variant rounded-full h-2 overflow-hidden">
          <div class="h-2 rounded-full" style="width:\${item.progress}%;background-color:\${item.barColor};"></div>
        </div>
        <span class="text-[11px] font-semibold text-on-surface-variant shrink-0">\${escape(item.progressText)}</span>
      </div>
    </div>\`).join('');
};

const renderInsights=(view)=>{
  if(!insightList) return;
  const items=view.trend||[];
  const activeItems=items.filter((item)=>Number(item.rawAmount||0)>0);
  if(activeItems.length===0){
    insightList.innerHTML='<div class="rounded-2xl border border-dashed border-outline-variant bg-surface-container-low p-4 text-center"><p class="text-sm font-semibold text-on-surface">No insights yet</p><p class="mt-1 text-[11px] leading-4 text-on-surface-variant">Add a few expenses and this view will start to summarize your patterns.</p></div>';
    return;
  }

  const peakItem=findPeakItem(activeItems);
  const latestItem=findLatestActiveItem(items);
  const activeLabel=view.periodLabel==='Week' ? 'days' : 'periods';
  const insightCards=[
    {
      icon:'local_fire_department',
      label:'Peak Spend',
      value:peakItem?.amount||'\\u20B90',
      caption:peakItem?.detailLabel||peakItem?.label||'No peak yet',
    },
    {
      icon:'insights',
      label:'Active ' + activeLabel,
      value:String(activeItems.length),
      caption:'Out of ' + String(items.length) + ' tracked in this view',
    },
    {
      icon:'schedule',
      label:'Latest Spend',
      value:latestItem?.amount||'\\u20B90',
      caption:latestItem?.detailLabel||latestItem?.label||'No recent activity',
    },
  ];

  insightList.innerHTML=insightCards.map((item)=>\`
    <div class="flex items-center justify-between gap-3 rounded-2xl bg-surface-container-low px-4 py-3">
      <div class="flex items-center gap-3 min-w-0">
        <div class="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary shrink-0">
          <span class="material-symbols-outlined text-[18px]">\${escape(item.icon)}</span>
        </div>
        <div class="min-w-0">
          <p class="text-sm font-semibold text-on-surface">\${escape(item.label)}</p>
          <p class="text-[11px] leading-4 text-on-surface-variant truncate">\${escape(item.caption)}</p>
        </div>
      </div>
      <p class="text-base font-semibold text-on-surface text-right shrink-0">\${escape(item.value)}</p>
    </div>\`).join('');
};

const renderView=(viewName)=>{
  const fallbackView=views.monthly||views.weekly||{};
  const view=views[viewName]||fallbackView;
  setActiveToggle(viewName);
  if(expenseNode) expenseNode.textContent=(view.summary?.expenses||'\\u20B90').replace(/^\\D+/,'');
  if(comparisonNode) comparisonNode.textContent=view.comparisonText||'';
  if(periodChip) periodChip.textContent=viewName==='weekly' ? 'This Week' : 'This Month';
  if(heroNetNode) heroNetNode.textContent=view.metrics?.net||'\\u20B90';
  if(heroBudgetNode) heroBudgetNode.textContent=view.metrics?.budget||'Not set';
  if(metricIncomeNode) metricIncomeNode.textContent=view.metrics?.income||'\\u20B90';
  if(metricNetNode) metricNetNode.textContent=view.metrics?.net||'\\u20B90';
  if(metricNetCaptionNode) metricNetCaptionNode.textContent=view.metrics?.netCaption||'';
  if(metricBudgetNode) metricBudgetNode.textContent=view.metrics?.budget||'Not set';
  if(metricBudgetCaptionNode) metricBudgetCaptionNode.textContent=view.metrics?.budgetCaption||'';
  if(metricAverageNode) metricAverageNode.textContent=view.metrics?.average||'\\u20B90';
  if(metricAverageCaptionNode) metricAverageCaptionNode.textContent=view.metrics?.averageCaption||'';
  if(signalTopNameNode) signalTopNameNode.textContent=view.signals?.topCategoryName||'No category data';
  if(signalTopAmountNode) signalTopAmountNode.textContent=view.signals?.topCategoryAmount||'\\u20B90';
  if(signalTopCaptionNode) signalTopCaptionNode.textContent=view.signals?.topCategoryCaption||'';
  if(signalLargestNameNode) signalLargestNameNode.textContent=view.signals?.largestExpenseName||'No expense recorded';
  if(signalLargestAmountNode) signalLargestAmountNode.textContent=view.signals?.largestExpenseAmount||'\\u20B90';
  if(signalLargestCaptionNode) signalLargestCaptionNode.textContent=view.signals?.largestExpenseCaption||'';

  renderCategoryBudgetStatuses(view,viewName);
  renderInsights(view);
};

toggleButtons.forEach((button)=>{
  button.addEventListener('click',()=>{
    renderView(button.getAttribute('data-view')||'monthly');
  });
});

renderView(data.defaultView||'monthly');
`
}
