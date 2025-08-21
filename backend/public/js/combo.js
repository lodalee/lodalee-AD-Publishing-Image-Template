const comboList = document.getElementById('comboList');
const comboCount = document.getElementById('comboCount');
const candidateList = document.getElementById("candidateList");


//<!------------------------------------------------------------------- 후보 목록 사진 추가 ------------------------------------------------------------------->
document.addEventListener("click", (e) => {
  const li = e.target.closest(".img-card");
  if (!li) return;

  const imgTag = li.querySelector("img");
  if (!imgTag) return;

  const imageUrl = imgTag.src;
  const category = li.closest("section")?.querySelector("h3")?.innerText || "기타";

  // 중복 방지
  if (isDuplicateInCandidates(imageUrl)) {
    alert("같은 사진을 추가했습니다.");
    return;
  }

  // 그룹 확보 및 카운트 확인
  const group = ensureCategoryGroup(category);
  const imagesWrap = group.querySelector(".candidate-images");
  const count = imagesWrap.querySelectorAll(".candidate-thumb-wrapper").length;
  if (count >= 6) {
    alert("6개까지만 선택 가능합니다.");
    return;
  }

  // 후보 썸네일(삭제 버튼 포함) 추가
  const wrapper = document.createElement("div");
  wrapper.className = "candidate-thumb-wrapper";
  wrapper.innerHTML = `
    <span class="item-remove candidate-remove">x</span>
    <img src="${imageUrl}" class="candidate-thumb" draggable="true" />
  `;
  imagesWrap.appendChild(wrapper);

  updateCandidateCount(group);
});

//<!------------------------------------------------------------------- 조합 영역 사진 추가 ------------------------------------------------------------------->
document.addEventListener("click", (e) => {
  if (!e.target.classList.contains("candidate-thumb")) return;

  const imageUrl = e.target.src;
  const category = e.target.closest(".candidate-group")?.dataset.category?.trim() || "";

  const replaceModeEl = document.getElementById("replaceMode");
  const isReplaceMode = !!(replaceModeEl && replaceModeEl.checked);

  if (isReplaceMode) {
    // ✅ 리플레이스 모드 → 같은 카테고리 있으면 교체
    const existing = Array.from(comboList.querySelectorAll(".combo-item"))
      .find(item => item.querySelector(".combo-category")?.textContent.trim() === category);

    if (existing) {
      existing.querySelector("img").src = imageUrl;
      return;
    }
  }

  // ✅ 기본 모드 or 같은 카테고리 없음 → 새로 추가
  const item = document.createElement("div");
  item.className = "combo-item";
  item.draggable = true;
  item.innerHTML = `
    <div class="combo-img-wrapper">
      <span class="item-remove combo-remove">ㅡ</span>
      <img src="${imageUrl}" alt="조합 이미지">
      <span class="combo-category">${category}</span>
    </div>
  `;
  comboList.appendChild(item);
  updateCount?.();
});


//<!--------------------------------------------------------------- 조합 영역 드래그로 순서 변경 ---------------------------------------------------------------->
let currentDragging = null;

comboList.addEventListener('dragstart', (e) => {
  const item = e.target.closest('.combo-item');
  if (item) {
    currentDragging = item;
    item.classList.add('dragging');
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

  if (offset > midpoint) target.after(currentDragging);
  else target.before(currentDragging);
});

comboList.addEventListener('dragend', () => {
  if (currentDragging) {
    currentDragging.classList.remove('dragging');
    currentDragging = null;
  }
});


//<!--------------------------------------------------- 콤보리스트 이미지를 세로로 이어붙여 WebP로 다운로드 ------------------------------------------------------->
document.getElementById("mergeBtn").addEventListener("click", async () => {
  const images = comboList.querySelectorAll("img");
  if (images.length === 0) {
    alert("선택된 이미지가 없습니다.");
    return;
  }

  const firstImg = images[0];
  const imgWidth = firstImg.naturalWidth || 200;
  const imgHeight = firstImg.naturalHeight || 200;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = imgWidth;
  canvas.height = imgHeight * images.length;

  for (let i = 0; i < images.length; i++) {
    const img = await loadImage(images[i].src);
    ctx.drawImage(img, 0, i * imgHeight, imgWidth, imgHeight);
  }

  // 현재 날짜와 시간 포맷
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  const formattedDate = `${year}.${month}.${day}_${hours}h${minutes}m`;

  const imageData = canvas.toDataURL("image/webp");
  const link = document.createElement("a");
  link.href = imageData;
  link.download = `${formattedDate}_image.webp`;
  link.click();
});


//<!-------------------------------------------------------- [후보목록/조합영역] 이미지 공통 삭제 핸들러 --------------------------------------------------------->
document.addEventListener('click', (e) => {
  if (!e.target.classList.contains('item-remove')) return;

  // 콤보에서 삭제
  const comboItem = e.target.closest('.combo-item');
  if (comboItem) {
    comboItem.remove();
    updateCount?.();
    return;
  }

  // 후보에서 삭제
  const candidateThumb = e.target.closest('.candidate-thumb-wrapper');
  if (candidateThumb) {
    const group = candidateThumb.closest('.candidate-group');
    candidateThumb.remove();
    if (group) updateCandidateCount(group);
    return;
  }
});

/** 선택 개수 표시 갱신 */
function updateCount() {
  const count = comboList.querySelectorAll('.combo-item').length;
  comboCount.textContent = `${count}개 선택`;
  comboCount.style.color = count >= 6 ? '#ff4343ff' : '#222222ff';
}

//<!------------------------------------------------------------------- 유틸 ------------------------------------------------------------------->

/** [후보목록] 카테고리 그룹을 찾아오거나(없으면 생성) 반환 */
function ensureCategoryGroup(category) {
  let group = document.querySelector(`.candidate-group[data-category="${category}"]`);
  if (group) return group;

  group = document.createElement("div");
  group.className = "candidate-group";
  group.dataset.category = category;
  group.innerHTML = `
    <h3 class="candidate-title">
      ${category}
      <span class="candidate-count">(0/6)</span>
    </h3>
    <div class="candidate-box" role="region" aria-label="${category}">
      <div class="candidate-images"></div>
    </div>
  `;
  candidateList.appendChild(group);
  return group;
}

/** [후보목록] 해당 그룹의 (선택/최대) 카운트 텍스트 갱신 */
function updateCandidateCount(group) {
  const imagesWrap = group.querySelector(".candidate-images");
  const countEl = group.querySelector(".candidate-count");
  const count = imagesWrap.querySelectorAll(".candidate-thumb-wrapper").length;
  if (countEl) countEl.textContent = `(${count}/6)`;
}

/** [후보목록] 전체에서 동일 src 이미지가 이미 존재하는지 검사 (중복 방지) */
function isDuplicateInCandidates(src) {
  const all = candidateList.querySelectorAll(".candidate-thumb");
  for (const img of all) {
    if (img.src === src) return true;
  }
  return false;
}

/** 이미지 로드 보장 */
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}