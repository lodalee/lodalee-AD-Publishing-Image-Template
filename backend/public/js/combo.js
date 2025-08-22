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
    openAlertPopup("같은 사진을 추가했습니다.");
    return;
  }

  // 그룹 확보 및 카운트 확인
  const group = ensureCategoryGroup(category);
  const imagesWrap = group.querySelector(".candidate-images");
  const count = imagesWrap.querySelectorAll(".candidate-thumb-wrapper").length;
  if (count >= 6) {
    openAlertPopup("6개까지만 선택 가능합니다.");
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


//<!---------------------------------------------------------- 조합 영역 combo-item 클릭 → 선택/해제 토글 ------------------------------------------------------------>
let selectedComboItem = null;

document.addEventListener("click", (e) => {
  const comboItem = e.target.closest(".combo-item");
  const candidate = e.target.closest(".candidate-thumb-wrapper");

  if (comboItem) {
    if (selectedComboItem === comboItem) {
      comboItem.classList.remove("selected");
      selectedComboItem = null;
      return;
    }

    document.querySelectorAll(".combo-item.selected").forEach(item => {
      item.classList.remove("selected");
    });

    comboItem.classList.add("selected");
    selectedComboItem = comboItem;
    return;
  }

  if (candidate) return;

  // combo-item 도 candidate도 아닌 바깥 영역 클릭 → 선택 해제
  if (selectedComboItem) {
    selectedComboItem.classList.remove("selected");
    selectedComboItem = null;
  }
});

//<!------------------------------------------------------------------- 조합 영역 이미지 교체/추가 ------------------------------------------------------------------->
// 이미지 교체 기능
document.addEventListener("click", (e) => {
  if (!e.target.classList.contains("candidate-thumb")) return;

  const imageUrl = e.target.src;

  if (selectedComboItem) {
    // 선택된 combo-item이 있으면 교체
    selectedComboItem.querySelector("img").src = imageUrl;
    // 선택 상태 유지 (바깥 클릭하기 전까지 계속 교체 가능)
    return;
  }

  // 선택된 combo-item 없으면 → 새로 추가
  const category = e.target.closest(".candidate-group")?.dataset.category?.trim() || "";

  // 조합영역 중복 방지
  if (isDuplicateInCombo(imageUrl)) {
    openAlertPopup("조합 영역에 이미 있는 사진입니다.");
    return;
  }

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
    openAlertPopup("선택된 이미지가 없습니다.");
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
  link.download = `PC_${formattedDate}_image.webp`;
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

//<!------------------------------------------------------------- [후보목록/조합영역] 전체 초기화  -------------------------------------------------------------->

// 후보목록 전체 초기화
document.getElementById("resetCandidates").addEventListener("click", () => {
  candidateList.innerHTML = "";  // 
});

// 조합영역 전체 초기화
document.getElementById("resetCombo").addEventListener("click", () => {
  comboList.innerHTML = "";      
  updateCount?.();              
  selectedComboItem = null;   
});

//<!-------------------------------------------------------------------------- 유틸 ---------------------------------------------------------------------------->

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
      <button class="group-remove" title="이 카테고리 전체 삭제">삭제</button>
    </h3>
    <div class="candidate-box" role="region" aria-label="${category}">
      <div class="candidate-images"></div>
    </div>
  `;
  candidateList.appendChild(group);
  return group;
}

// 카테고리 박스 자체 삭제 핸들러
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("group-remove")) {
    const group = e.target.closest(".candidate-group");
    if (group) {
      group.remove();  // ✅ 박스 자체 삭제 → 안의 이미지들도 같이 사라짐
    }
  }
});

/** [후보목록] 해당 그룹의 (선택/최대) 카운트 텍스트 갱신 */
function updateCandidateCount(group) {
  const imagesWrap = group.querySelector(".candidate-images");
  const countEl = group.querySelector(".candidate-count");
  const count = imagesWrap.querySelectorAll(".candidate-thumb-wrapper").length;
  if (countEl) countEl.textContent = `(${count}/6)`;
}

/** [후보목록] 이미지 중복 방지 */
function isDuplicateInCandidates(src) {
  const all = candidateList.querySelectorAll(".candidate-thumb");
  for (const img of all) {
    if (img.src === src) return true;
  }
  return false;
}

/** [조합 영역] 이미지 중복 방지 */
function isDuplicateInCombo(src) {
  return Array.from(document.querySelectorAll('#comboList .combo-item img'))
    .some(img => img.src === src);
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

/** 알림 팝업  */
// 열기
function openAlertPopup(message) {
  document.getElementById("alertMessage").textContent = message;
  document.getElementById("alertPopup").classList.add("-on");
}

// 닫기
function closeAlertPopup() {
  document.getElementById("alertPopup").classList.remove("-on");
}

// 키보드 이벤트 (Enter, Esc)
document.addEventListener("keydown", (e) => {
  const popup = document.getElementById("alertPopup");
  if (!popup.classList.contains("-on")) return; // 팝업 열려있을 때만 반응

  if (e.key === "Escape" || e.key === "Esc") {
    closeAlertPopup();
  }
  if (e.key === "Enter") {
    closeAlertPopup();
  }
});

// 버튼 이벤트 연결
document.getElementById("alertOkBtn").addEventListener("click", closeAlertPopup);