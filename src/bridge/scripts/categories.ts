import { sharedScript } from './shared'

export function categoriesScript() {
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
            <h2 class="text-xl font-bold text-on-surface mb-2">Delete Category</h2>
            <p class="text-[14px] leading-relaxed text-on-surface-variant mb-8 px-4">Are you sure you want to delete this category? This action cannot be undone.</p>
            
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
const modal = document.getElementById('delete-modal');
const confirmBtn = document.getElementById('confirm-delete-btn');
const cancelBtn = document.getElementById('cancel-delete-btn');

if (confirmBtn) {
  confirmBtn.onclick = () => {
    const id = modal.getAttribute('data-pending-id');
    if (id) {
      window.__stitchPost({ type: 'category.delete', id });
      hideModal();
    }
  };
}

if (cancelBtn) cancelBtn.onclick = hideModal;

const data=window.__STITCH_DATA__;
const escape=window.__stitchEscape;
const cards=document.getElementById('categories-list-container')
  || [...document.querySelectorAll('main > div')].find((node)=>node.classList.contains('flex')&&node.classList.contains('flex-col')&&node.classList.contains('gap-4'));

if(cards){
  if((data.categories||[]).length===0){
    cards.innerHTML=\`
      <div class="bg-surface-container-lowest rounded-xl p-card-padding shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-dashed border-outline-variant text-center">
        <div class="w-14 h-14 mx-auto rounded-full bg-surface-container flex items-center justify-center text-outline mb-4">
          <span class="material-symbols-outlined">category</span>
        </div>
        <h3 class="font-title-lg text-title-lg text-on-surface">No categories yet</h3>
        <p class="font-body-base text-body-base text-on-surface-variant mt-2">Create your first category to start classifying your expenses and income.</p>
      </div>\`;
  } else {
    cards.innerHTML=data.categories.map((item)=>\`
      <div class="relative overflow-hidden rounded-xl mb-3">
        <!-- Delete Layer -->
        <div class="absolute inset-0 bg-error flex items-center justify-end rounded-xl z-0">
          <button class="h-full px-6 text-white flex flex-col items-center justify-center gap-1 active:bg-red-700 transition-colors delete-trigger relative z-20" data-id="\${item.id}">
            <span class="material-symbols-outlined">delete</span>
            <span class="text-[10px] font-bold">Delete</span>
          </button>
        </div>
        <!-- Card Layer -->
        <div class="relative bg-surface-container-lowest rounded-xl p-card-padding shadow-[0_4px_12px_rgba(0,0,0,0.04)] flex items-center justify-between group touch-manipulation transition-transform duration-200 swipe-row z-10" data-id="\${item.id}" style="transform: translateX(0px);">
          <div class="flex items-center gap-4">
            <button class="text-outline hover:text-on-background cursor-grab active:cursor-grabbing p-1 drag-handle"><span class="material-symbols-outlined">drag_indicator</span></button>
            <div class="w-10 h-10 rounded-full flex items-center justify-center" style="background-color:\${item.background};color:\${item.foreground};">
              <span class="material-symbols-outlined">\${escape(item.icon)}</span>
            </div>
            <div>
              <h3 class="font-title-lg text-title-lg !text-[16px] !leading-[24px] text-on-surface">\${escape(item.name)}</h3>
              <p class="font-label-sm text-label-sm \${item.type==='Income'?'text-secondary':'text-on-surface-variant'}">\${escape(item.type)}</p>
            </div>
          </div>
          <button class="text-outline-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container edit-trigger" data-id="\${item.id}">
            <span class="material-symbols-outlined">edit</span>
          </button>
        </div>
      </div>\`).join('');

    // Swipe Logic
    let startX = 0;
    let currentX = 0;
    let activeRow = null;

    document.querySelectorAll('.swipe-row').forEach(row => {
      row.addEventListener('touchstart', (e) => {
        if(activeRow && activeRow !== row) activeRow.style.transform = 'translateX(0px)';
        startX = e.touches[0].clientX;
        row.style.transition = 'none';
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

    // Edit Action
    document.querySelectorAll('.edit-trigger').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        window.__stitchPost({ type: 'navigate', route: 'editCategory', id });
      });
    });

    // Reorder Action (SortableJS)
    if (window.Sortable) {
      new window.Sortable(cards, {
        handle: '.drag-handle',
        animation: 150,
        ghostClass: 'opacity-50',
        onEnd: function() {
          const ids = [...cards.querySelectorAll('.swipe-row')].map(el => el.getAttribute('data-id'));
          window.__stitchPost({ type: 'category.reorder', ids });
        }
      });
    }

    // Delete Action
    document.querySelectorAll('.delete-trigger').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        showModal(id);
      });
    });
  }
}

const addButton=[...document.querySelectorAll('button')].find((node)=>window.__stitchText(node).includes('Add New Category'));
if(addButton){
  addButton.addEventListener('click',()=>window.__stitchPost({type:'navigate',route:'addCategory'}));
}
`
}
