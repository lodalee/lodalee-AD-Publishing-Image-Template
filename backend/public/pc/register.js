//<!---------------------------------------------------------------------------- 팝업 로더 ---------------------------------------------------------------------------->
export async function mountRegisterPopup({
  trigger = '.template-list .nav button',
  dialog = '#popup-wrap',
  container = '#popup-inner',
  url = '/pc/register.html',
} = {}) {
  const dlg = document.querySelector(dialog);
  const host = document.querySelector(container);

  if (!dlg || !host) return;

  document.addEventListener('click', async (e) => {
    if (!e.target.closest(trigger)) return;
    e.preventDefault();

    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`불러오기 실패: ${res.status}`);
      host.innerHTML = await res.text();

      dlg.showModal();
      initRegisterPopup(dlg, host); // ✅ 불러온 뒤 초기화 실행
    } catch (err) {
      console.error('팝업 로딩 실패:', err);
    }
  });
}


//<!------------------------------------------------------------------- 팝업 초기화 (폼 관련 기능) ------------------------------------------------------------------->
function initRegisterPopup(dlg, host) {
  const itemsContainer = host.querySelector("#items");
  const addItemBtn = host.querySelector("#addItemBtn");
  const form = host.querySelector("#templateForm");
  const closeBtn = host.querySelector("#popup-wrap-close-btn");

  let itemIndex = 0;


//<!------------------------------------------------------------------------ 카테고리, 컬러칩 ------------------------------------------------------------------------>
  const categoryOptions = `
    <option value="인트로">인트로</option>
    <option value="메인 페이지">메인 페이지</option>
    <option value="동영상">동영상</option>
    <option value="풀영상">풀영상</option>
    <option value="기획">기획</option>
    <option value="팝업">팝업</option>
    <option value="스크롤">스크롤</option>
    <option value="섹션 전환 표지">섹션 전환 표지</option>
    <option value="슬라이드섹션-1개">슬라이드섹션-1개</option>
    <option value="슬라이드섹션-걸치기">슬라이드섹션-걸치기</option>
    <option value="슬라이드섹션-카드형">슬라이드섹션-카드형</option>
    <option value="유니트">유니트</option>
    <option value="유니트-강조">유니트-강조</option>
    <option value="유니트-카드형">유니트-카드형</option>
    <option value="카드섹션">카드섹션</option>
    <option value="카드섹션-왜가리">카드섹션-왜가리</option>
    <option value="카드섹션-이미지 카드">카드섹션-이미지 카드</option>
    <option value="텍스트 카드 섹션">텍스트 카드 섹션</option>
    <option value="현장&모델하우스 위치">현장&모델하우스 위치</option>
    <option value="관심 고객 등록">관심 고객 등록</option>
    <option value="푸터">푸터</option>
  `;

  const colorChips = [
    { value: "RED", color: "red" },
    { value: "ORANGE", color: "orange" },
    { value: "YELLOW", color: "yellow" },
    { value: "GREEN", color: "green" },
    { value: "BLUE", color: "blue" },
    { value: "INDIGO", color: "indigo" },
    { value: "VIOLET", color: "violet" },
    { value: "BLACK", color: "black" },
    { value: "WHITE", color: "white", border: true },
    { value: "GRAY", color: "gray" }
  ];

  //<!---------------------------------------------------------------------- 유틸 함수 (렌더링) ---------------------------------------------------------------------->
  function renderColorChips(index) {
    return colorChips.map(
      chip => `
        <label>
          <input type="checkbox" name="items[${index}].colorChip" value="${chip.value}">
          <span class="color-circle" style="background-color:${chip.color};${chip.border ? 'border:1px solid #ccc;' : ''}"></span>
        </label>
      `
    ).join('');
  }

  function addItemForm() {
    const wrapper = document.createElement("div");
    wrapper.classList.add("item");
    wrapper.innerHTML = `
      <h4>아이템 ${itemIndex + 1}</h4>
      <label>이미지 URL: </label>
      <input type="text" name="items[${itemIndex}].imageUrl"><br>
      <label>설명: </label>
      <input type="text" name="items[${itemIndex}].description"><br>
      <label>카테고리: </label>
      <select name="items[${itemIndex}].category" required>
        ${categoryOptions}
      </select><br>
      <div>
        <label>컬러칩:</label>
        <div class="color-chip-group">
          ${renderColorChips(itemIndex)}
        </div>
      </div>
    `;
    itemsContainer.appendChild(wrapper);
    itemIndex++;
  }

  //<!------------------------------------------------------------------- 이벤트 바인딩 ------------------------------------------------------------------->
  addItemBtn.addEventListener("click", addItemForm);
  addItemForm(); // 기본 1개 추가

  //<!------------------------------------------------------------------- 폼 제출 이벤트 ------------------------------------------------------------------->
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const items = [];
    for (let i = 0; i < itemIndex; i++) {
      const chips = [];
      host.querySelectorAll(`input[name="items[${i}].colorChip"]:checked`)
        .forEach(chk => chips.push(chk.value));

      items.push({
        imageUrl: formData.get(`items[${i}].imageUrl`),
        description: formData.get(`items[${i}].description`),
        category: formData.get(`items[${i}].category`),
        colorChip: chips
      });
    }

    const payload = {
      title: formData.get("title"),
      creator: formData.get("creator"),
      producedDate: formData.get("producedDate"),
      type: formData.get("type"),
      items
    };

    try {
      const res = await fetch("/api/pc/template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json();
        alert("등록 실패: " + (err.message || "알 수 없는 오류"));
        return;
      }

      const result = await res.json();
      console.log("응답:", result);
      alert("등록 완료!");

      // 초기화
      e.target.reset();
      itemsContainer.innerHTML = "";
      itemIndex = 0;
      addItemForm();
    } catch (error) {
      console.error(error);
      alert("네트워크 오류로 등록 실패!");
    }
  });

  //<!------------------------------------------------------------------- 닫기 버튼 ------------------------------------------------------------------->
  if (closeBtn) {
    closeBtn.addEventListener("click", () => dlg.close());
  }
}
