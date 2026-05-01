import { sharedScript } from './shared'

export function transactionsScript() {
  return `
${sharedScript()}
// Custom Modal Implementation Helpers
function showModal(id) {
  const modal = document.getElementById('delete-modal');
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

function hideModal() {
  const modal = document.getElementById('delete-modal');
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
<div id="delete-modal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 hidden opacity-0 transition-opacity duration-200">
    <div class="absolute inset-0 bg-black/60 backdrop-blur-md"></div>
    <div class="relative w-full max-w-sm bg-surface-container-lowest rounded-[32px] p-6 shadow-2xl transform scale-95 transition-transform duration-200">
        <div class="flex flex-col items-center text-center">
            <div class="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mb-4">
                <span class="material-symbols-outlined text-error text-3xl">warning</span>
            </div>
            <h2 class="text-xl font-bold text-on-surface mb-2">Delete Transaction</h2>
            <p class="text-[14px] leading-relaxed text-on-surface-variant mb-8 px-4">Are you sure you want to delete this transaction record? This action cannot be undone.</p>
            
            <div class="flex flex-col w-full gap-3">
                <button id="confirm-delete-btn" class="w-full h-14 bg-error text-white rounded-2xl font-bold shadow-lg active:scale-95 active:bg-red-700 transition-all">Yes, Proceed</button>
                <button id="cancel-delete-btn" class="w-full h-14 border border-outline-variant text-on-surface-variant rounded-2xl font-bold active:bg-surface-container transition-all">Cancel</button>
            </div>
        </div>
    </div>
</div>\`;

// Ensure modal exists
if (!document.getElementById('delete-modal')) {
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

// Always re-bind handlers to latest execution context
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
const cancelDeleteBtn = document.getElementById('cancel-delete-btn');

if (confirmDeleteBtn) {
  confirmDeleteBtn.onclick = () => {
    const modal = document.getElementById('delete-modal');
    const id = modal.getAttribute('data-pending-id');
    if (id) {
      window.__stitchPost({ type: 'transaction.delete', id });
      hideModal();
    }
  };
}

if (cancelDeleteBtn) cancelDeleteBtn.onclick = hideModal;

const data=window.__STITCH_DATA__;
const escape=window.__stitchEscape;
let search='';
let filter='All';
let selectedDate = null; // YYYY-MM-DD

// --- Calendar State ---
let viewDate = new Date();
let currentYear = viewDate.getFullYear();
let currentMonth = viewDate.getMonth();

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const renderChips=()=>{
  const container=document.getElementById('filter-chips-container');
  if(!container) return;
  
  const chips = [
    { id: 'All', label: 'All' },
    { id: 'Expenses', label: 'Expenses' },
    { id: 'Income', label: 'Income' },
    ...(data.categories || []).map(c => ({ id: c.id, label: c.name }))
  ];

  container.innerHTML = chips.map(chip => {
    const isActive = filter === chip.id;
    const activeClasses = 'bg-primary text-white font-bold shadow-sm';
    const inactiveClasses = 'bg-surface-container text-on-surface-variant font-semibold border border-outline-variant';
    
    return \`
      <button 
        onclick="setFilter('\${chip.id}')"
        class="whitespace-nowrap px-4 py-2 rounded-full transition-all active:scale-95 font-label-sm text-label-sm \${isActive ? activeClasses : inactiveClasses}"
      >
        \${escape(chip.label)}
      </button>
    \`;
  }).join('');
};

window.setFilter = (newFilter) => {
  filter = newFilter;
  renderChips();
  render();
};

const render=()=>{
  const groups=data.groups.map((group)=>({
    ...group,
    items:group.items.filter((item)=>{
      const matchesSearch=(item.title+' '+item.subtitle).toLowerCase().includes(search.toLowerCase());
      const matchesFilter=filter==='All' || item.filter===filter || item.categoryId===filter;
      
      let matchesDate = true;
      if (selectedDate) {
        matchesDate = item.date.startsWith(selectedDate);
      }
      
      return matchesSearch && matchesFilter && matchesDate;
    })
  })).filter((group)=>group.items.length>0);
  
  const container=document.getElementById('transactions-list-container');
  if(!container) return;
  
  if (groups.length === 0) {
    container.innerHTML = \`
      <div class="text-center py-20 bg-surface-container-lowest rounded-[24px] border border-dashed border-outline-variant">
          <div class="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="material-symbols-outlined text-outline text-3xl">receipt_long</span>
          </div>
          <p class="text-on-surface-variant font-medium">No transactions found.</p>
          <p class="text-xs text-outline mt-1">Your spending history will appear here.</p>
      </div>\`;
    return;
  }
  
  container.innerHTML=groups.map((group)=>\`
    <div>
      <h2 class="font-label-sm text-label-sm text-outline mb-3 uppercase tracking-wider">\${group.label}</h2>
      <div class="space-y-3">
        \${group.items.map((item)=>\`
          <div class="relative overflow-hidden rounded-xl mb-3">
            <!-- Delete Layer -->
            <div class="absolute inset-0 bg-error flex items-center justify-end rounded-xl z-0">
              <button class="h-full px-6 text-white flex flex-col items-center justify-center gap-1 active:bg-red-700 transition-colors delete-trigger relative z-20" data-id="\${item.id}">
                <span class="material-symbols-outlined">delete</span>
                <span class="text-[10px] font-bold">Delete</span>
              </button>
            </div>
            <!-- Card Layer -->
            <div class="relative bg-surface-container-lowest rounded-xl p-card-padding shadow-[0_4px_12px_rgba(0,0,0,0.04)] flex items-center justify-between group touch-manipulation transition-transform duration-200 swipe-row z-10 border border-surface-container-highest" data-id="\${item.id}" style="transform: translateX(0px);">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-full flex items-center justify-center" style="background-color:\${item.background};color:\${item.foreground};">
                  <span class="material-symbols-outlined">\${escape(item.icon)}</span>
                </div>
                <div>
                  <h3 class="font-title-lg text-[16px] text-on-surface">\${escape(item.title)}</h3>
                  <p class="font-label-sm text-label-sm text-on-surface-variant">\${escape(item.subtitle)}</p>
                </div>
              </div>
              <div class="text-right">
                <span class="font-title-lg text-[16px] \${item.kind==='expense'?'text-error':'text-secondary'} font-medium">\${escape(item.amount)}</span>
              </div>
            </div>
          </div>\`).join('')}
      </div>
    </div>\`).join('');

  // Swipe Logic Implementation
  let startX = 0;
  let currentX = 0;
  let activeRow = null;

  document.querySelectorAll('.swipe-row').forEach(row => {
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
      if(diff < 0 && diff > -100) {
        row.style.transform = \`translateX(\${diff}px)\`;
        currentX = diff;
      }
    });

    row.addEventListener('touchend', () => {
      row.style.transition = 'transform 0.2s ease-out';
      if(currentX < -50) {
        row.style.transform = 'translateX(-80px)';
        activeRow = row;
      } else {
        row.style.transform = 'translateX(0px)';
        activeRow = null;
      }
      currentX = 0;
    });
  });

  // Delete Action Handlers
  document.querySelectorAll('.delete-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      showModal(id);
    });
  });
}

// --- Calendar Implementation ---
const renderCalendar = () => {
  const monthYearLabel = document.getElementById('calendar-month-year');
  const daysContainer = document.getElementById('calendar-days');
  if (!monthYearLabel || !daysContainer) return;

  monthYearLabel.innerText = \`\${MONTHS[currentMonth]} \${currentYear}\`;

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  let daysHtml = '';
  // Padding for start of month
  for (let i = 0; i < firstDay; i++) {
    daysHtml += '<div class="h-10"></div>';
  }

  const todayStr = new Date().toISOString().split('T')[0];

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = \`\${currentYear}-\${String(currentMonth + 1).padStart(2, '0')}-\${String(day).padStart(2, '0')}\`;
    const isSelected = selectedDate === dateStr;
    const isToday = todayStr === dateStr;

    const baseClasses = 'h-10 flex items-center justify-center rounded-xl text-sm font-medium transition-all active:scale-90 cursor-pointer';
    const activeClasses = isSelected ? 'bg-primary text-white shadow-md' : (isToday ? 'bg-primary/10 text-primary' : 'hover:bg-surface-container-high text-on-surface');

    daysHtml += \`
      <div 
        onclick="selectDate('\${dateStr}')" 
        class="\${baseClasses} \${activeClasses}"
      >
        \${day}
      </div>
    \`;
  }

  daysContainer.innerHTML = daysHtml;
};

window.selectDate = (date) => {
  selectedDate = date;
  const clearDateBtn = document.getElementById('clear-date-btn');
  if (clearDateBtn) clearDateBtn.classList.remove('hidden');
  renderCalendar();
};

const openDatePicker = () => {
  const modal = document.getElementById('date-picker-modal');
  const content = document.getElementById('date-picker-content');
  if (!modal || !content) return;

  modal.classList.remove('hidden');
  setTimeout(() => {
    modal.classList.replace('opacity-0', 'opacity-100');
    content.classList.replace('scale-95', 'scale-100');
  }, 10);
  renderCalendar();
};

const closeDatePicker = () => {
  const modal = document.getElementById('date-picker-modal');
  const content = document.getElementById('date-picker-content');
  if (!modal || !content) return;

  modal.classList.replace('opacity-100', 'opacity-0');
  content.classList.replace('scale-100', 'scale-95');
  setTimeout(() => {
    modal.classList.add('hidden');
  }, 300);
};

// --- Listeners ---
const searchInput=document.querySelector('input[type="text"]');
if(searchInput){
  searchInput.addEventListener('input',(event)=>{
    search=event.target.value||'';
    render();
  });
}

document.getElementById('date-filter-btn')?.addEventListener('click', openDatePicker);
document.getElementById('close-date-picker')?.addEventListener('click', closeDatePicker);
document.getElementById('prev-month')?.addEventListener('click', () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar();
});
document.getElementById('next-month')?.addEventListener('click', () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar();
});
document.getElementById('ok-btn')?.addEventListener('click', () => {
  closeDatePicker();
  render();
});

document.getElementById('clear-date-btn')?.addEventListener('click', function() {
  selectedDate = null;
  this.classList.add('hidden');
  render();
});

renderChips();
render();
`;
}
