import { sharedScript } from './shared'

export function addCategoryScript() {
  return `
${sharedScript()}
const data = window.__STITCH_DATA__ || {};
const isEdit = !!data.category;

let currentType = isEdit ? data.category.type : 'expense';
let selectedIcon = isEdit ? data.category.icon : 'restaurant';
let selectedColor = isEdit ? data.category.color : '#ba1a1a';

const showError = (message) => {
  let toast = document.getElementById('stitch-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'stitch-toast';
    toast.className = 'fixed bottom-8 left-6 right-6 bg-error text-white p-4 rounded-2xl shadow-[0_8px_24px_rgba(186,26,26,0.3)] transform translate-y-24 opacity-0 transition-all duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] flex items-center gap-3 z-[100]';
    toast.innerHTML = \`
      <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
        <span class="material-symbols-outlined text-[20px]">error</span>
      </div>
      <span class="font-semibold text-sm tracking-tight">\${message}</span>
    \`;
    document.body.appendChild(toast);
  }
  
  const nameInput = document.getElementById('name-input');
  if (nameInput) {
    nameInput.classList.add('border-error', 'ring-1', 'ring-error');
    nameInput.classList.remove('border-outline-variant/60');
    nameInput.style.animation = 'shake 0.4s cubic-bezier(.36,.07,.19,.97) both';
    setTimeout(() => nameInput.style.animation = '', 400);
  }

  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-24', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
  });
  
  setTimeout(() => {
    toast.classList.add('translate-y-24', 'opacity-0');
    toast.classList.remove('translate-y-0', 'opacity-100');
  }, 4000);
};

const submitButton = [...document.querySelectorAll('button')].find(btn => ['Create Category', 'Update Category'].includes(window.__stitchText(btn)));
const nameInput = document.getElementById('name-input');
const typeButtons = [...document.querySelectorAll('button')].filter(btn => ['Expense', 'Income'].includes(window.__stitchText(btn)));
const iconButtons = document.querySelectorAll('button[data-icon]');
const colorButtons = document.querySelectorAll('button[data-color]');

const syncTypeButtons = () => {
  typeButtons.forEach(btn => {
    const text = window.__stitchText(btn).toLowerCase();
    const isActive = text === currentType;
    btn.className = 'flex-1 py-2 px-4 rounded-md font-label-sm text-label-sm transition-all duration-200 flex items-center justify-center';
    
    if (isActive) {
      btn.classList.add('shadow-sm', 'font-bold');
      if (currentType === 'expense') {
        btn.classList.add('bg-error', 'text-white', 'ring-1', 'ring-error');
      } else {
        btn.classList.add('bg-secondary', 'text-white');
      }
    } else {
      btn.classList.add('text-on-surface-variant', 'bg-surface-container', 'hover:bg-surface-container-high');
    }
  });
};

const syncIconSelection = () => {
  iconButtons.forEach(btn => {
    const icon = btn.getAttribute('data-icon');
    const isActive = icon === selectedIcon;
    const span = btn.querySelector('.material-symbols-outlined');
    
    if (isActive) {
      btn.className = 'aspect-square rounded-lg flex items-center justify-center bg-primary-fixed text-on-primary-fixed ring-2 ring-primary ring-offset-2 ring-offset-surface-container-lowest transition-all shadow-sm';
      if (span) span.style.fontVariationSettings = '"FILL" 1';
      btn.style.borderColor = selectedColor;
    } else {
      btn.className = 'aspect-square rounded-lg flex items-center justify-center bg-surface-container-low text-on-surface hover:bg-surface-container transition-all';
      if (span) span.style.fontVariationSettings = '"FILL" 0';
      btn.style.borderColor = 'transparent';
    }
  });
};

const syncColorSelection = () => {
  colorButtons.forEach(btn => {
    const color = btn.getAttribute('data-color');
    const isActive = color.toLowerCase() === selectedColor.toLowerCase();
    
    btn.innerHTML = isActive ? '<span class="material-symbols-outlined text-white text-[20px]">check</span>' : '';
    btn.className = 'w-[44px] h-[44px] rounded-full shrink-0 flex items-center justify-center snap-center transition-all m-1';
    
    if (isActive) {
      btn.classList.add('ring-2', 'ring-primary', 'ring-offset-2', 'ring-offset-surface-container-lowest', 'shadow-md', 'scale-110');
    } else {
      btn.classList.add('shadow-sm', 'hover:scale-105');
    }
    btn.style.backgroundColor = color;
  });
};

// Event Listeners
typeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    currentType = window.__stitchText(btn).toLowerCase();
    syncTypeButtons();
  });
});

iconButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    selectedIcon = btn.getAttribute('data-icon') || selectedIcon;
    syncIconSelection();
  });
});

colorButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    selectedColor = btn.getAttribute('data-color') || selectedColor;
    syncColorSelection();
    syncIconSelection(); // Refresh icons if border color depends on it
  });
});

if (submitButton && nameInput) {
  submitButton.addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (!name) {
      showError('Please enter a category name');
      return;
    }
    window.__stitchPost({
      type: isEdit ? 'category.update' : 'category.create',
      id: isEdit ? data.category.id : undefined,
      name,
      icon: selectedIcon,
      color: selectedColor,
      categoryType: currentType
    });
  });
}

const backButton = document.querySelector('header button');
if (backButton) {
  backButton.addEventListener('click', () => window.__stitchPost({ type: 'back' }));
}

// Initialize UI
if(isEdit) {
  const heading = document.querySelector('header h1');
  if(heading) heading.innerText = 'Edit Category';
  if(submitButton) submitButton.innerText = 'Update Category';
  if(nameInput) nameInput.value = data.category.name;
}

syncTypeButtons();
syncIconSelection();
syncColorSelection();
`
}

export function addExpenseScript() {
  return `
${sharedScript()}
const data=window.__STITCH_DATA__||{categories:[]};
const escape=window.__stitchEscape;
let type='expense';
const categoriesByType={
  expense:(data.categories||[]).filter((item)=>item.type==='expense'),
  income:(data.categories||[]).filter((item)=>item.type==='income'),
};
const selectedByType={
  expense:categoriesByType.expense[0]?.name||'',
  income:categoriesByType.income[0]?.name||'',
};

// Calendar Logic
let selectedDate = new Date();
let currentViewDate = new Date(selectedDate);
let confirmedDate = new Date(selectedDate);

const formatDate = (date) => {
  return date.toISOString();
};

const updateDateDisplay = () => {
  const display = document.getElementById('date-display');
  if (display) {
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    display.innerText = confirmedDate.toLocaleDateString(undefined, options);
  }
};

const renderCalendar = () => {
  const monthYearLabel = document.getElementById('calendar-month-year');
  const daysGrid = document.getElementById('calendar-days');
  if (!monthYearLabel || !daysGrid) return;

  const year = currentViewDate.getFullYear();
  const month = currentViewDate.getMonth();
  
  monthYearLabel.innerText = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentViewDate);
  
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  daysGrid.innerHTML = '';
  
  // Empty slots for previous month
  for (let i = 0; i < firstDay; i++) {
    daysGrid.innerHTML += '<div class="h-10"></div>';
  }
  
  const today = new Date();
  
  for (let d = 1; d <= daysInMonth; d++) {
    const isSelected = selectedDate.getDate() === d && 
                       selectedDate.getMonth() === month && 
                       selectedDate.getFullYear() === year;
    const isToday = today.getDate() === d && 
                    today.getMonth() === month && 
                    today.getFullYear() === year;
    
    const btn = document.createElement('button');
    btn.className = \`h-10 w-10 flex items-center justify-center rounded-full transition-all text-sm font-medium \${
      isSelected ? 'bg-primary text-white shadow-md scale-110 z-10' : 
      isToday ? 'text-primary border border-primary/30' : 'text-on-surface hover:bg-surface-container-high'
    }\`;
    btn.innerText = d;
    btn.onclick = () => {
      const now = new Date();
      selectedDate = new Date(year, month, d, now.getHours(), now.getMinutes(), now.getSeconds());
      renderCalendar();
    };
    daysGrid.appendChild(btn);
  }
};

const openDatePicker = () => {
  selectedDate = new Date(confirmedDate);
  currentViewDate = new Date(confirmedDate);
  const modal = document.getElementById('date-picker-modal');
  const content = document.getElementById('date-picker-content');
  if (modal && content) {
    modal.classList.remove('hidden');
    requestAnimationFrame(() => {
      modal.classList.add('opacity-100');
      content.classList.remove('scale-95');
      content.classList.add('scale-100');
    });
  }
  renderCalendar();
};

const closeDatePicker = () => {
  const modal = document.getElementById('date-picker-modal');
  const content = document.getElementById('date-picker-content');
  if (modal && content) {
    modal.classList.remove('opacity-100');
    content.classList.remove('scale-100');
    content.classList.add('scale-95');
    setTimeout(() => modal.classList.add('hidden'), 300);
  }
};

const typeButtons=[...document.querySelectorAll('button')].filter((node)=>['Expense','Income'].includes(window.__stitchText(node)));
const categoryGrid=document.getElementById('expense-category-grid');
const saveButton=[...document.querySelectorAll('button')].find((node)=>['Save Expense','Save Income'].includes(window.__stitchText(node)));

const syncTypeButtons=()=>{
  typeButtons.forEach((button)=>{
    const btnType=window.__stitchText(button).toLowerCase();
    const active=btnType===type;
    button.className = 'flex-1 py-2 px-4 rounded-md font-label-sm text-label-sm transition-colors';
    if(active){
      button.classList.add('shadow-sm');
      if(btnType==='expense'){
        button.classList.add('bg-tertiary-container','text-on-tertiary');
      }else{
        button.classList.add('bg-secondary','text-on-secondary');
      }
    }else{
      button.classList.add('text-on-surface-variant', 'hover:bg-surface-container-high');
    }
  });
  if(saveButton){
    saveButton.textContent=type==='income' ? 'Save Income' : 'Save Expense';
  }
};

const renderCategories=()=>{
  if(!categoryGrid) return;
  const items=categoriesByType[type]||[];
  if(!selectedByType[type] && items[0]){
    selectedByType[type]=items[0].name;
  }
  if(items.length===0){
    categoryGrid.innerHTML='<div class="col-span-full rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest p-4 text-center text-sm text-on-surface-variant">No '+escape(type)+' categories yet.</div>';
    return;
  }
  categoryGrid.innerHTML=items.map((item)=>{
    const selected=item.name===selectedByType[type];
    const classes=selected
      ? 'flex min-h-[90px] w-full min-w-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-xl border-2 px-2 py-2 shadow-sm transition-colors'
      : 'flex min-h-[90px] w-full min-w-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-xl bg-surface-container-lowest border border-surface-container-high px-2 py-2 hover:bg-surface-container-low transition-colors';
    const style=selected
      ? 'background-color:'+item.background+';border-color:'+item.foreground+';'
      : '';
    const iconStyle=selected
      ? 'font-variation-settings: "FILL" 1;color:'+item.foreground+';'
      : 'color:'+item.foreground+';';
    return \`
      <button class="\${classes}" style="\${style}" data-category-name="\${escape(item.name)}">
        <span class="material-symbols-outlined shrink-0 text-[20px] leading-none" style="\${iconStyle}">\${escape(item.icon)}</span>
        <span class="w-full break-all text-center text-[11px] font-medium leading-4 tracking-normal text-on-surface">\${escape(item.name)}</span>
      </button>\`;
  }).join('');
  categoryGrid.querySelectorAll('[data-category-name]').forEach((button)=>{
    button.addEventListener('click',()=>{
      selectedByType[type]=button.getAttribute('data-category-name')||selectedByType[type];
      renderCategories();
    });
  });
};

typeButtons.forEach((button)=>{
  button.addEventListener('click',()=>{
    type=window.__stitchText(button).toLowerCase();
    syncTypeButtons();
    renderCategories();
  });
});

// Initialize UI
syncTypeButtons();
renderCategories();
updateDateDisplay();

const amountInput=document.getElementById('amount-input') || document.querySelector('input[type=\\"number\\"]');
if(amountInput){
  const originalPlaceholder=amountInput.placeholder;
  const clearInput=()=>{
    if(amountInput.value==='0') amountInput.value='';
    amountInput.placeholder='';
  };
  amountInput.addEventListener('focus',clearInput);
  amountInput.addEventListener('blur',()=>amountInput.placeholder=originalPlaceholder);
  if(document.activeElement===amountInput) clearInput();
}

const noteInput=document.getElementById('note-input') || [...document.querySelectorAll('input[type=\\"text\\"]')].pop();

// Event Listeners for Date Picker
const dateTrigger = document.getElementById('date-trigger');
if (dateTrigger) dateTrigger.onclick = openDatePicker;

const closeBtn = document.getElementById('close-date-picker');
if (closeBtn) closeBtn.onclick = closeDatePicker;

const okBtn = document.getElementById('ok-btn');
if (okBtn) okBtn.onclick = () => {
  confirmedDate = new Date(selectedDate);
  updateDateDisplay();
  closeDatePicker();
};

const prevMonth = document.getElementById('prev-month');
if (prevMonth) prevMonth.onclick = () => {
  currentViewDate.setMonth(currentViewDate.getMonth() - 1);
  renderCalendar();
};

const nextMonth = document.getElementById('next-month');
if (nextMonth) nextMonth.onclick = () => {
  currentViewDate.setMonth(currentViewDate.getMonth() + 1);
  renderCalendar();
};

if(saveButton){
  saveButton.addEventListener('click',()=>{
    const activeCategory=selectedByType[type] || categoriesByType[type][0]?.name || '';
    window.__stitchPost({
      type:'transaction.create',
      amount:amountInput&&amountInput.value||'0',
      date:formatDate(confirmedDate),
      note:noteInput&&noteInput.value||'',
      category:activeCategory,
      transactionType:type
    });
  });
}

const backButton=document.querySelector('header button');
if(backButton){
  backButton.addEventListener('click',()=>window.__stitchPost({type:'back'}));
}
`
}
