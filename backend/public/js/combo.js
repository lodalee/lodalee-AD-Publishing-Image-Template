const comboList = document.getElementById('comboList');
const comboCount = document.getElementById('comboCount');
const candidateList = document.getElementById("candidateList");

/**
 * [기능] 템플릿 이미지 클릭 시, 후보 영역에 해당 카테고리 그룹을 만들거나 찾아서
 *        썸네일(wrapper + 삭제버튼 포함)을 추가한다.
 * [입력] .img-card 내부 <img> 클릭(버블링으로 document가 받음)
 * [출력/부수효과] #candidateList 하위에 .candidate-group / .candidate-images에 썸네일 노드 추가
 * [주의] 기존 레이아웃/스타일은 CSS에서 관리, 이 로직은 DOM만 생성/삽입
 */
document.addEventListener("click", (e) => {
  const li = e.target.closest(".img-card");
  if (!li) return;

  const imgTag = li.querySelector("img");
  if (!imgTag) return;

  const imageUrl = imgTag.src;
  const category = li.closest("section")?.querySelector("h3")?.innerText || "기타";

  // 카테고리 그룹 존재 확인(없으면 생성)
  let group = document.querySelector(`.candidate-group[data-category="${category}"]`);
  if (!group) {
    group = document.createElement("div");
    group.className = "candidate-group";
    group.dataset.category = category;
    group.innerHTML = `
      <h3 class="candidate-title">${category}</h3>
      <div class="candidate-box" role="region" aria-label="${category}">
        <div class="candidate-images"></div>
      </div>
    `;
    document.getElementById("candidateList").appendChild(group);
  }

  const imagesWrap = group.querySelector(".candidate-images");

  // 후보 썸네일(삭제 버튼 포함) 추가
  const wrapper = document.createElement("div");
  wrapper.className = "candidate-thumb-wrapper";
  wrapper.innerHTML = `
    <span class="item-remove candidate-remove">ㅡ</span>
    <img src="${imageUrl}" class="candidate-thumb" draggable="true" />
  `;
  imagesWrap.appendChild(wrapper);
});

/**
 * [기능](옵션) 후보 박스에서 세로 휠을 가로 스크롤로 변환
 * [입력] #candidateList 하위에서 wheel 이벤트
 * [출력/부수효과] 사용자 휠 동작이 가로 스크롤로 작동 (CSS로 스크롤 숨기면 자연히 영향 없음)
 */
document.getElementById("candidateList")?.addEventListener(
  "wheel",
  (e) => {
    const box = e.target.closest(".candidate-box");
    if (!box) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      box.scrollLeft += e.deltaY;
      e.preventDefault();
    }
  },
  { passive: false }
);

/**
 * [기능] 후보 썸네일을 클릭하면(삭제버튼 말고 이미지 자체) 콤보리스트에 아이템 추가
 * [입력] .candidate-thumb 클릭
 * [출력/부수효과] #comboList에 .combo-item 노드 추가, 카운트 업데이트
 */
document.addEventListener("click", (e) => {
  if (!e.target.classList.contains("candidate-thumb")) return;

  const imageUrl = e.target.src;
  const category = e.target.closest(".candidate-group")?.dataset.category || "";

  const item = document.createElement("div");
  item.className = "combo-item";
  item.draggable = true;
  item.innerHTML = `
    <div class="combo-img-wrapper">
      <!-- 콤보 삭제 버튼: 후보와 동일한 'ㅡ' + 공통 클래스(.item-remove) 사용 -->
      <span class="item-remove combo-remove">ㅡ</span>
      <img src="${imageUrl}" alt="조합 이미지">
      <span class="combo-category">${category}</span>
    </div>
  `;
  document.getElementById("comboList").appendChild(item);
  updateCount?.();
});

/**
 * [기능] 콤보리스트에서 드래그로 순서 변경
 * [입력] dragstart/dragover/dragend (대상: .combo-item)
 * [출력/부수효과] DOM 순서 변경으로 시각적 순서가 바뀜
 */
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

/**
 * [기능] 공통 삭제 핸들러 (후보/콤보 둘 다)
 * [입력] .item-remove 클릭
 * [출력/부수효과]
 *   - 콤보: .combo-item 제거 + 카운트 업데이트
 *   - 후보: .candidate-thumb-wrapper 제거
 * [이점] 삭제 로직을 하나로 통합해 코드 중복 최소화
 */
document.addEventListener('click', (e) => {
  if (!e.target.classList.contains('item-remove')) return;

  // 콤보 아이템 삭제
  const comboItem = e.target.closest('.combo-item');
  if (comboItem) {
    comboItem.remove();
    updateCount?.();
    return;
  }

  // 후보 썸네일 삭제
  const candidateThumb = e.target.closest('.candidate-thumb-wrapper');
  if (candidateThumb) {
    candidateThumb.remove();
    return;
  }
});

/**
 * [기능] 콤보리스트 선택 개수 표시를 업데이트
 * [입력] 없음(내부에서 DOM 조회)
 * [출력/부수효과] #comboCount 텍스트/색상 업데이트 (6개 이상일 때 경고색)
 */
function updateCount() {
  const count = comboList.querySelectorAll('.combo-item').length;
  comboCount.textContent = `${count}개 선택`;

  if (count >= 6) {
    comboCount.style.color = '#ff4343ff';
  } else {
    comboCount.style.color = '#222222ff';
  }
}

/**
 * [기능] 콤보리스트 이미지를 세로로 이어붙여 하나의 WebP 이미지로 합성 후 다운로드
 * [입력] #mergeBtn 클릭
 * [출력/부수효과] 브라우저에서 'my-photo.webp' 다운로드 트리거
 * [참고] 첫 이미지의 원본 크기를 기준으로 합성 캔버스 크기 결정
 */
document.getElementById("mergeBtn").addEventListener("click", async () => {
  const comboList = document.getElementById("comboList");
  const images = comboList.querySelectorAll("img");

  if (images.length === 0) {
    alert("선택된 이미지가 없습니다.");
    return;
  }

  // 첫 이미지 기준 사이즈
  const firstImg = images[0];
  const imgWidth = firstImg.naturalWidth || 200;
  const imgHeight = firstImg.naturalHeight || 200;

  // 화면에 보이지 않는 캔버스 생성
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = imgWidth;
  canvas.height = imgHeight * images.length;

  // 이미지 위에서 아래로 그림
  for (let i = 0; i < images.length; i++) {
    const img = await loadImage(images[i].src);
    ctx.drawImage(img, 0, i * imgHeight, imgWidth, imgHeight);
  }

  // 다운로드
  const imageData = canvas.toDataURL("image/webp");
  const link = document.createElement("a");
  link.href = imageData;
  link.download = "my-photo.webp";
  link.click();
});

/**
 * [유틸] 이미지 로드가 완료된 후 resolve되는 Promise 반환
 * [입력] src(URL)
 * [출력] HTMLImageElement (onload 시 resolve)
 * [용도] 캔버스에 그리기 전 안전한 로드 보장
 */
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
