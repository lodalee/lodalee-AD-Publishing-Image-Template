const comboList = document.getElementById('comboList');
const comboCount = document.getElementById('comboCount');

// 아이템 추가
document.addEventListener('click', (e) => {
  const li = e.target.closest('.img-card');
  if (li) {
    const imgTag = li.querySelector('img');
    if (!imgTag) return;

    const imageUrl = imgTag.getAttribute('src');
    const category =
      li.closest('section')?.querySelector('h3')?.innerText || '';

    const item = document.createElement('div');
    item.className = 'combo-item';
    item.draggable = true;
    item.innerHTML = `
      <div class="combo-img-wrapper">
        <span class="combo-remove">✖</span>
        <img src="${imageUrl}" alt="조합 이미지">
        <span class="combo-category">${category}</span>
      </div>
    `;

    comboList.appendChild(item);
    updateCount();
  }
});

// 2. comboList 안에서 순서 변경
let currentDragging = null;

comboList.addEventListener('dragstart', (e) => {
  const item = e.target.closest('.combo-item');
  if (item) {
    currentDragging = item;
    item.classList.add('dragging'); // 드래그 중 표시
  }
});

comboList.addEventListener('dragover', (e) => {
  e.preventDefault();
  if (!currentDragging) return;

  const target = e.target.closest('.combo-item:not(.dragging)');
  if (!target) return;

  const rect = target.getBoundingClientRect();
  const offset = e.clientY - rect.top;
  const midpoint = rect.height / 2;

  if (offset > midpoint) {
    target.after(currentDragging);
  } else {
    target.before(currentDragging);
  }
});

comboList.addEventListener('dragend', () => {
  if (currentDragging) {
    currentDragging.classList.remove('dragging');
    currentDragging = null;
  }
});

// 아이템 삭제
comboList.addEventListener('click', (e) => {
  if (e.target.classList.contains('combo-remove')) {
    e.target.closest('.combo-item').remove();
    updateCount();
  }
});

// 카운트 업데이트 함수
function updateCount() {
  const count = comboList.querySelectorAll('.combo-item').length;
  comboCount.textContent = `${count}개 선택`;

  if (count >= 6) {
    comboCount.style.color = '#ff4343ff';
  } else {
    comboCount.style.color = '#222222ff';
  }
}
