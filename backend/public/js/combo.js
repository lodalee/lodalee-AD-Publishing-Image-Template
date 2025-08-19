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

//조합
document.getElementById("mergeBtn").addEventListener("click", async () => {
  const comboList = document.getElementById("comboList");
  const canvas = document.getElementById("previewCanvas");
  const ctx = canvas.getContext("2d");

  const images = comboList.querySelectorAll("img");

  if (images.length === 0) {
    alert("선택된 이미지가 없습니다.");
    return;
  }

  // 첫 이미지 기준 사이즈
  const firstImg = images[0];
  const imgWidth = firstImg.naturalWidth || 200;
  const imgHeight = firstImg.naturalHeight || 200;

  // 👉 세로 방향으로 병합: canvas 높이 = 이미지 높이 * 이미지 수
  canvas.width = imgWidth;
  canvas.height = imgHeight * images.length;

  // 캔버스 초기화
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 이미지를 위에서 아래로 하나씩 그림
  for (let i = 0; i < images.length; i++) {
    const img = await loadImage(images[i].src);
    ctx.drawImage(img, 0, i * imgHeight, imgWidth, imgHeight);
  }
});

// 이미지 로드 보장 함수
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // CORS 문제 방지
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

document.getElementById('downloadBtn').addEventListener('click', () => {
const canvas = document.getElementById("previewCanvas");

// WebP 포맷으로 이미지 데이터 생성
const imageData = canvas.toDataURL("image/webp");

// 다운로드 링크 생성
const link = document.createElement("a");
link.href = imageData;
link.download = "my-photo.webp"; // 저장될 파일명
link.click(); // 다운로드 실행

});
