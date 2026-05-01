import { sharedScript } from './shared'

export function personalInfoScript() {
  return `
${sharedScript()}
const data = window.__STITCH_DATA__ || {};
const fullNameInput = document.getElementById('full-name-input');
const emailInput = document.getElementById('email-input');
const phoneInput = document.getElementById('phone-input');
const dobDisplay = document.getElementById('dob-display');

// Initialize basic fields
if (fullNameInput) fullNameInput.value = data.fullName || '';
if (emailInput) emailInput.value = data.email || '';
if (phoneInput) phoneInput.value = data.phoneNumber || '';

// Date Picker State
let selectedDate = data.dob ? new Date(data.dob) : new Date();
let currentViewDate = new Date(selectedDate);
let confirmedDate = data.dob ? new Date(data.dob) : null;
let viewMode = 'days'; // 'days' | 'years'

const updateDateDisplay = () => {
  if (dobDisplay) {
    dobDisplay.value = confirmedDate ? confirmedDate.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }) : 'Select Date';
  }
};

const renderCalendar = () => {
  const container = document.getElementById('calendar-grid');
  const headerText = document.getElementById('calendar-month-year');
  if (!container || !headerText) return;

  container.innerHTML = '';
  const month = currentViewDate.getMonth();
  const year = currentViewDate.getFullYear();

  headerText.innerText = currentViewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Day Headers
  ['S', 'M', 'T', 'W', 'T', 'F', 'S'].forEach(day => {
    const el = document.createElement('div');
    el.className = 'text-center text-[10px] font-bold text-on-surface-variant pb-2';
    el.innerText = day;
    container.appendChild(el);
  });

  // Empty slots
  for (let i = 0; i < firstDay; i++) {
    container.appendChild(document.createElement('div'));
  }

  // Days
  for (let d = 1; d <= daysInMonth; d++) {
    const btn = document.createElement('button');
    const isSelected = selectedDate.getDate() === d && 
                      selectedDate.getMonth() === month && 
                      selectedDate.getFullYear() === year;
    
    btn.className = 'h-10 w-10 flex items-center justify-center rounded-full text-sm transition-all ' + 
                    (isSelected ? 'bg-primary text-white shadow-md scale-110 font-bold' : 'text-on-surface hover:bg-surface-container-high');
    btn.innerText = d;
    btn.onclick = (e) => {
      e.preventDefault();
      selectedDate = new Date(year, month, d);
      renderCalendar();
    };
    container.appendChild(btn);
  }
};

const renderYearPicker = () => {
  const container = document.getElementById('calendar-grid');
  const headerText = document.getElementById('calendar-month-year');
  if (!container || !headerText) return;

  container.innerHTML = '';
  const currentYear = new Date().getFullYear();
  headerText.innerText = 'Select Year';

  const scrollContainer = document.createElement('div');
  scrollContainer.className = 'grid grid-cols-3 gap-2 col-span-7 max-h-[240px] overflow-y-auto p-2 w-full';
  
  for (let y = currentYear; y >= currentYear - 100; y--) {
    const btn = document.createElement('button');
    const isSelected = selectedDate.getFullYear() === y;
    btn.className = 'py-3 rounded-xl transition-all text-sm font-medium ' + 
                    (isSelected ? 'bg-primary text-white shadow-md' : 'text-on-surface hover:bg-surface-container-high');
    btn.innerText = y;
    btn.onclick = (e) => {
      e.preventDefault();
      currentViewDate.setFullYear(y);
      viewMode = 'days';
      renderCalendar();
    };
    scrollContainer.appendChild(btn);
  }
  container.appendChild(scrollContainer);
};

const toggleView = () => {
  if (viewMode === 'days') {
    renderCalendar();
  } else {
    renderYearPicker();
  }
};

const openDatePicker = () => {
  const modal = document.getElementById('date-picker-modal');
  const modalContent = document.getElementById('date-picker-content');
  if (!modal || !modalContent) return;

  modal.classList.remove('hidden');
  viewMode = 'days';
  currentViewDate = new Date(selectedDate);
  toggleView();

  requestAnimationFrame(() => {
    modal.classList.remove('opacity-0');
    modalContent.classList.remove('scale-95');
    modalContent.classList.add('scale-100');
  });
};

const closeDatePicker = () => {
  const modal = document.getElementById('date-picker-modal');
  const modalContent = document.getElementById('date-picker-content');
  if (!modal || !modalContent) return;

  modal.classList.add('opacity-0');
  modalContent.classList.remove('scale-100');
  modalContent.classList.add('scale-95');

  setTimeout(() => {
    modal.classList.add('hidden');
  }, 200);
};

// Event Listeners for Date Picker
const dateTrigger = document.getElementById('date-trigger');
if (dateTrigger) dateTrigger.onclick = openDatePicker;

const headerTrigger = document.getElementById('calendar-month-year');
if (headerTrigger) headerTrigger.onclick = () => {
  viewMode = viewMode === 'days' ? 'years' : 'days';
  toggleView();
};

const closeBtn = document.getElementById('close-date-picker');
if (closeBtn) closeBtn.onclick = closeDatePicker;

const modalOverlay = document.getElementById('date-picker-modal');
if (modalOverlay) {
  modalOverlay.addEventListener('click', (event) => {
    if (event.target === modalOverlay) {
      closeDatePicker();
    }
  });
}

const okBtn = document.getElementById('ok-btn');
if (okBtn) okBtn.onclick = () => {
  confirmedDate = new Date(selectedDate);
  updateDateDisplay();
  closeDatePicker();
};

const prevMonth = document.getElementById('prev-month');
if (prevMonth) prevMonth.onclick = (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (viewMode === 'days') {
    currentViewDate.setMonth(currentViewDate.getMonth() - 1);
    renderCalendar();
  }
};

const nextMonth = document.getElementById('next-month');
if (nextMonth) nextMonth.onclick = (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (viewMode === 'days') {
    currentViewDate.setMonth(currentViewDate.getMonth() + 1);
    renderCalendar();
  }
};

// Handle Save
const save = [...document.querySelectorAll('button')].find((node) => window.__stitchText(node) === 'Save Changes');
if (save) {
  save.addEventListener('click', () => {
    window.__stitchPost({
      type: 'settings.profile.save',
      fullName: fullNameInput && fullNameInput.value || '',
      email: emailInput && emailInput.value || '',
      phoneNumber: phoneInput && phoneInput.value || '',
      dob: confirmedDate ? confirmedDate.toISOString() : ''
    });
  });
}

const back = document.querySelector('header button');
if (back) {
  back.addEventListener('click', () => window.__stitchPost({ type: 'back' }));
}

// Initial UI state
updateDateDisplay();
`
}

export function budgetScript() {
  return `
${sharedScript()}
const data=window.__STITCH_DATA__||{};
let categoryBudgets = data.categoryBudgets || [];
let selectedCategoryId = null;

// Delete Modal Implementation
function showDeleteModal(id) {
  const modal = document.getElementById('delete-cb-modal');
  const modalContent = modal?.querySelector('.relative');
  if (!modal || !modalContent) return;
  
  modal.setAttribute('data-pending-id', id);
  modal.classList.remove('hidden');
  setTimeout(() => {
    modal.classList.remove('opacity-0');
    modalContent.classList.remove('scale-95');
    modalContent.classList.add('scale-100');
  }, 10);
}

function hideDeleteModal() {
  const modal = document.getElementById('delete-cb-modal');
  const modalContent = modal?.querySelector('.relative');
  if (!modal || !modalContent) return;

  modal.classList.add('opacity-0');
  modalContent.classList.remove('scale-100');
  modalContent.classList.add('scale-95');
  setTimeout(() => {
    modal.classList.add('hidden');
    modal.removeAttribute('data-pending-id');
  }, 200);
}

const modalHtml = \`
<div id="delete-cb-modal" class="fixed inset-0 z-[110] flex items-center justify-center p-4 hidden opacity-0 transition-opacity duration-200">
    <div class="absolute inset-0 bg-black/60 backdrop-blur-md"></div>
    <div class="relative w-full max-w-sm bg-surface-container-lowest rounded-[32px] p-6 shadow-2xl transform scale-95 transition-transform duration-200">
        <div class="flex flex-col items-center text-center">
            <div class="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mb-4">
                <span class="material-symbols-outlined text-error text-3xl">warning</span>
            </div>
            <h2 class="text-xl font-bold text-on-surface mb-2">Delete Budget</h2>
            <p class="text-[14px] leading-relaxed text-on-surface-variant mb-8 px-4">Remove this category budget? This will stop tracking limits for this category.</p>
            
            <div class="flex flex-col w-full gap-3">
                <button id="confirm-cb-delete-btn" class="w-full h-14 bg-error text-white rounded-2xl font-bold shadow-lg active:scale-95 active:bg-red-700 transition-all">Yes, Delete</button>
                <button id="cancel-cb-delete-btn" class="w-full h-14 border border-outline-variant text-on-surface-variant rounded-2xl font-bold active:bg-surface-container transition-all">Cancel</button>
            </div>
        </div>
    </div>
</div>\`;

document.body.insertAdjacentHTML('beforeend', modalHtml);

const confirmCbDeleteBtn = document.getElementById('confirm-cb-delete-btn');
const cancelCbDeleteBtn = document.getElementById('cancel-cb-delete-btn');

if (confirmCbDeleteBtn) {
  confirmCbDeleteBtn.onclick = () => {
    const modal = document.getElementById('delete-cb-modal');
    const id = modal.getAttribute('data-pending-id');
    if (id) {
      categoryBudgets = categoryBudgets.filter(cb => cb.categoryId !== id);
      renderCategoryBudgets();
      hideDeleteModal();
    }
  };
}
if (cancelCbDeleteBtn) cancelCbDeleteBtn.onclick = hideDeleteModal;

const range=document.getElementById('budget-slider');
const valueNode=document.getElementById('budget-value');
const manualInput = document.getElementById('manual-budget-input');

const renderBudget=()=>{
  if(valueNode && range){
    const value=Number(range.value||0);
    valueNode.textContent='\\u20B9'+new Intl.NumberFormat('en-IN').format(value);
  }
};

const updateSliderBackground=()=>{
  if(range){
    const min=Number(range.min||0);
    const max=Number(range.max||1000000);
    const val=Number(range.value);
    const percentage=((val-min)/(max-min))*100;
    range.style.background='linear-gradient(to right, #000666 0%, #000666 ' + percentage + '%, #e2e2e2 ' + percentage + '%, #e2e2e2 100%)';
  }
};

const renderCategoryPicker = () => {
  const grid = document.getElementById('category-picker-grid');
  if (!grid) return;
  const categories = (data.categories || []).filter(c => c.type === 'expense');
  if (categories.length === 0) {
    grid.innerHTML = '<div class="col-span-4 p-8 text-center text-on-surface-variant/60 text-xs italic bg-surface-container-low rounded-2xl border border-dashed border-outline-variant/50">No categories found. Add some in Category Settings first.</div>';
    return;
  }
  
  grid.innerHTML = categories.map(c => {
    const isSelected = selectedCategoryId === c.id;
    return '<button class="category-item flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ' + (isSelected ? 'bg-primary/15 border-primary shadow-sm scale-105' : 'bg-surface-container-low border-transparent hover:bg-surface-container-high active:scale-95') + ' border-2" data-id="' + c.id + '">' +
      '<div class="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-sm pointer-events-none" style="background-color: ' + c.color + '20; color: ' + c.color + '">' +
        '<span class="material-symbols-outlined font-icon-lg">' + c.icon + '</span>' +
      '</div>' +
      '<span class="text-[11px] font-semibold text-on-surface truncate w-full text-center pointer-events-none">' + c.name + '</span>' +
    '</button>';
  }).join('');

  grid.querySelectorAll('.category-item').forEach(btn => {
    btn.onclick = () => {
      selectedCategoryId = btn.dataset.id;
      renderCategoryPicker();
    };
  });
};

const renderCategoryBudgets = () => {
  const list = document.getElementById('category-budgets-list');
  if (!list) return;
  if (categoryBudgets.length === 0) {
    list.innerHTML = '<div class="bg-surface-container-lowest rounded-xl p-card-padding shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-dashed border-outline-variant text-center py-8">' +
        '<p class="font-body-base text-body-base text-on-surface">No category budgets yet</p>' +
        '<p class="font-label-sm text-label-sm text-on-surface-variant mt-1 px-4">Allocate your overall budget to specific categories for better tracking.</p>' +
      '</div>';
    return;
  }

  list.innerHTML = categoryBudgets.map(cb => {
    const category = data.categories.find(c => c.id === cb.categoryId) || { name: 'Unknown', icon: 'help', color: '#888' };
    return '<div class="relative overflow-hidden rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.04)]">' +
        '<!-- Actions Layer -->' +
        '<div class="absolute inset-0 bg-indigo-900 flex items-center justify-end rounded-xl z-0">' +
          '<div class="flex h-full">' +
            '<button class="h-full px-5 text-white flex flex-col items-center justify-center gap-1 active:bg-indigo-700 transition-colors edit-cb-trigger relative z-20" data-id="' + cb.categoryId + '" data-amount="' + cb.amount + '">' +
              '<span class="material-symbols-outlined text-lg">edit</span>' +
              '<span class="text-[10px] font-bold">Edit</span>' +
            '</button>' +
            '<button class="h-full px-5 bg-error text-white flex flex-col items-center justify-center gap-1 active:bg-red-700 transition-colors delete-trigger relative z-20" data-id="' + cb.categoryId + '">' +
              '<span class="material-symbols-outlined text-lg">delete</span>' +
              '<span class="text-[10px] font-bold">Delete</span>' +
            '</button>' +
          '</div>' +
        '</div>' +
        '<!-- Card Layer -->' +
        '<div class="relative bg-surface-container-lowest rounded-xl p-card-padding flex items-center gap-4 touch-manipulation transition-transform duration-200 swipe-row z-10 border border-surface-container-highest" data-id="' + cb.categoryId + '" style="transform: translateX(0px);">' +
          '<div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style="background-color: ' + category.color + '20; color: ' + category.color + '">' +
            '<span class="material-symbols-outlined">' + category.icon + '</span>' +
          '</div>' +
          '<div class="flex-1 min-w-0 pointer-events-none">' +
            '<div class="flex justify-between items-baseline mb-0.5">' +
              '<span class="font-body-base text-body-base font-semibold text-on-surface truncate pr-2">' + category.name + '</span>' +
              '<span class="font-label-sm text-label-sm text-on-surface-variant shrink-0">Limit: \\u20B9' + new Intl.NumberFormat('en-IN').format(cb.amount) + '</span>' +
            '</div>' +
            '<div class="w-full bg-surface-variant rounded-full h-1"></div>' +
          '</div>' +
        '</div>' +
      '</div>';
  }).join('');

  // Swipe Logic Initialization
  let startX = 0;
  let currentX = 0;
  let activeRow = null;

  list.querySelectorAll('.swipe-row').forEach(row => {
    row.addEventListener('touchstart', (e) => {
      if(activeRow && activeRow !== row) {
        activeRow.style.transition = 'transform 0.2s ease-out';
        activeRow.style.transform = 'translateX(0px)';
      }
      startX = e.touches[0].clientX;
      row.style.transition = 'none';
      activeRow = null;
    });

    row.addEventListener('touchmove', (e) => {
      const diff = e.touches[0].clientX - startX;
      if(diff < 0 && diff > -180) { // Increased range for 2 buttons
        row.style.transform = 'translateX(' + diff + 'px)';
        currentX = diff;
      }
    });

    row.addEventListener('touchend', () => {
      row.style.transition = 'transform 0.2s ease-out';
      if(currentX < -60) {
        row.style.transform = 'translateX(-140px)'; // Shows both buttons
        activeRow = row;
      } else {
        row.style.transform = 'translateX(0px)';
        activeRow = null;
      }
      currentX = 0;
    });
  });

  list.querySelectorAll('.delete-trigger').forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute('data-id');
      showDeleteModal(id);
    };
  });

  list.querySelectorAll('.edit-cb-trigger').forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute('data-id');
      const amount = btn.getAttribute('data-amount');
      selectedCategoryId = id;
      const modal = document.getElementById('category-modal');
      const amountInput = document.getElementById('modal-category-amount');
      if (modal && amountInput) {
        amountInput.value = amount;
        renderCategoryPicker();
        modal.classList.remove('hidden');
        // Reset swipe
        if (activeRow) {
          activeRow.style.transform = 'translateX(0px)';
          activeRow = null;
        }
      }
    };
  });
};

if(range){
  range.min='0';
  range.max='1000000';
  range.value=String(data.budgetConfigured ? (data.monthlyBudget || 0) : 0);
  range.addEventListener('input',()=>{
    renderBudget();
    updateSliderBackground();
  });
  renderBudget();
  updateSliderBackground();
}

// Manual Input Logic
const trigger = document.getElementById('manual-budget-trigger');
const sliderView = document.getElementById('slider-view');
const manualView = document.getElementById('manual-view');
const manualCancel = document.getElementById('manual-cancel');
const manualSave = document.getElementById('manual-save');

if (trigger && sliderView && manualView && manualInput) {
  trigger.onclick = () => {
    sliderView.classList.add('hidden');
    manualView.classList.remove('hidden');
    manualInput.value = range.value;
    manualInput.focus();
  };
}

if (manualCancel && sliderView && manualView) {
  manualCancel.onclick = () => {
    manualView.classList.add('hidden');
    sliderView.classList.remove('hidden');
  };
}

if (manualSave && manualInput && range && sliderView && manualView) {
  manualSave.onclick = () => {
    const val = Number(manualInput.value);
    if (!isNaN(val) && val >= 0 && val <= 1000000) {
      range.value = String(val);
      renderBudget();
      updateSliderBackground();
      manualView.classList.add('hidden');
      sliderView.classList.remove('hidden');
    }
  };
}

// Category Modal Logic
const addCategoryBtn = document.getElementById('add-category-budget-btn');
const categoryModal = document.getElementById('category-modal');
const modalCancelBtn = document.getElementById('modal-cancel-btn');
const modalSaveBtn = document.getElementById('modal-save-btn');
const modalAmountInput = document.getElementById('modal-category-amount');

if (addCategoryBtn && categoryModal) {
  addCategoryBtn.onclick = () => {
    selectedCategoryId = null;
    modalAmountInput.value = '';
    renderCategoryPicker();
    categoryModal.classList.remove('hidden');
  };
}

if (modalCancelBtn && categoryModal) {
  modalCancelBtn.onclick = () => {
    categoryModal.classList.add('hidden');
  };
}

if (modalSaveBtn && categoryModal && modalAmountInput) {
  modalSaveBtn.onclick = () => {
    const amount = Number(modalAmountInput.value);
    if (selectedCategoryId && !isNaN(amount) && amount > 0) {
      // Upsert
      const existingIdx = categoryBudgets.findIndex(cb => cb.categoryId === selectedCategoryId);
      if (existingIdx >= 0) {
        categoryBudgets[existingIdx].amount = amount;
      } else {
        categoryBudgets.push({ categoryId: selectedCategoryId, amount });
      }
      renderCategoryBudgets();
      categoryModal.classList.add('hidden');
    }
  };
}

// Initial category budgets render
renderCategoryBudgets();

const mainSave = document.getElementById('main-save-budget-btn');
if (mainSave && range) {
  mainSave.onclick = () => {
    window.__stitchPost({
      type: 'settings.budget.save',
      monthlyBudget: Number(range.value || 0),
      categoryBudgets: categoryBudgets
    });
  };
}

const back=document.querySelector('header button');
if(back){
  back.addEventListener('click',()=>window.__stitchPost({type:'back'}));
}
`
}

export function notificationsScript() {
  return `
${sharedScript()}
const data=window.__STITCH_DATA__||{};
const toggle1=document.getElementById('toggle1');
const toggle2=document.getElementById('toggle2');
if(toggle1) toggle1.checked=!!data.billReminders;
if(toggle2) toggle2.checked=!!data.weeklyDigest;
const save=[...document.querySelectorAll('button')].find((node)=>window.__stitchText(node)==='Save Preferences');
if(save){
  save.addEventListener('click',()=>window.__stitchPost({
    type:'settings.notifications.save',
    billReminders:!!(toggle1&&toggle1.checked),
    weeklyDigest:!!(toggle2&&toggle2.checked),
    unusualSpendAlerts:!!data.unusualSpendAlerts
  }));
}
const back=document.querySelector('header button');
if(back){
  back.addEventListener('click',()=>window.__stitchPost({type:'back'}));
}
`
}

export function helpSupportScript() {
  return `
${sharedScript()}
const data=window.__STITCH_DATA__||{};
const emailNode=document.getElementById('help-user-email');
if(emailNode){
  emailNode.textContent=data.email || 'your signed-in account';
}

const items=[...document.querySelectorAll('[data-help-item]')];
items.forEach((item, index)=>{
  const toggle=item.querySelector('[data-help-toggle]');
  const answer=item.querySelector('[data-help-answer]');
  const icon=item.querySelector('[data-help-icon]');
  if(!toggle || !answer || !icon) return;

  if(index===0){
    answer.classList.remove('hidden');
    icon.textContent='remove';
  }

  toggle.addEventListener('click',()=>{
    const isOpen=!answer.classList.contains('hidden');
    items.forEach((entry)=>{
      const entryAnswer=entry.querySelector('[data-help-answer]');
      const entryIcon=entry.querySelector('[data-help-icon]');
      if(entryAnswer) entryAnswer.classList.add('hidden');
      if(entryIcon) entryIcon.textContent='add';
    });

    if(!isOpen){
      answer.classList.remove('hidden');
      icon.textContent='remove';
    }
  });
});

const back=document.querySelector('header button');
if(back){
  back.addEventListener('click',()=>window.__stitchPost({type:'back'}));
}
`
}
