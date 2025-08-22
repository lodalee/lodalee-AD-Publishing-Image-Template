// <!------------------------------------------------------------------- 템플릿 등록 팝업 ------------------------------------------------------------------->
export function initRegisterPopup({ dialogSelector = '#popup-wrap' } = {}) {
  const popup = document.querySelector(dialogSelector);
  if (!popup || popup.dataset.inited === 'true') return; // 중복 방지
  const $ = (sel) => popup.querySelector(sel);

  // 1) 팝업 열기 버튼은 mount에서 처리 (공통 트리거 클래스 사용)

  // 2) 팝업 내부 바인딩 함수 (동적 주입 후 실행)
  // 팝업 닫기 버튼
  const closeBtn = $('#popup-wrap-close-btn');
  const form = $('#templateForm');
  const resultEl = $('#result');

  // 닫기 버튼
  closeBtn?.addEventListener('click', () => {
    popup.classList.remove('open');
  });

  // 배경 클릭 시 닫기 (내용 영역 제외)
  popup.addEventListener('click', (e) => {
    if (!e.target.closest('.template-box')) {
      popup.classList.remove('open');
    }
  });

  // ESC 닫기 (한 번만 등록)
  const onEsc = (e) => {
    if (e.key === 'Escape' && popup.classList.contains('open')) {
      popup.classList.remove('open');
    }
  };
  document.addEventListener('keydown', onEsc, { once: false });

  // <!------------------------------------------------------------------- 템플릿 등록 api ------------------------------------------------------------------->
  form?.addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    try {
      const res = await fetch('/api/template', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        // 등록 성공 시 새로고침!
        window.location.reload();
      } else {
        const err = await res.text();
        if (resultEl) resultEl.innerText = '서버 에러: ' + err;
      }
    } catch (err) {
      if (resultEl) resultEl.innerText = '에러: ' + err;
    }
  });

  // <!------------------------------------------------------------------- 카테고리/태그/이미지 바인딩 ------------------------------------------------------------------->

  // 1. 초기값 불러오기(localStorage → 기본값)
  let categoryList = JSON.parse(localStorage.getItem('categoryList')) || [
    '관심 고객 등록',
    '기획',
    '동영상',
    '풀영상',
    '메인 페이지',
    '섹션 전환 표지',
    '스크롤',
    '슬라이드섹션-1개',
    '슬라이드섹션-걸치기',
    '슬라이드섹션-카드형',
    '유니트',
    '유니트-강조',
    '유니트-카드형',
    '인트로',
    '카드섹션',
    '카드섹션-왜가리',
    '카드섹션-이미지 카드',
    '텍스트 카드 섹션',
    '팝업',
    '푸터',
    '현장&모델하우스위치',
  ];

  function renderCategoryOptions() {
    const select = $('#categorySelect');
    if (!select) return;
    select.innerHTML = '<option value="">카테고리 선택</option>';
    categoryList.forEach((cat) => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat;
      select.appendChild(opt);
    });
  }
  renderCategoryOptions();

  // === 추가되는 변수, 요소 선택 (한 번만 해도 됨)
  const catAddBtn = $('#catAddBtn');
  const catInputBox = $('#catInputBox');
  const catInput = $('#catInput');
  const catInputOk = $('#catInputOk');
  const categorySelect = $('#categorySelect');
  const catDelBtn = $('#catDelBtn');
  const catDeleteList = $('#catDeleteList');

  // === [1] "카테고리 추가" 버튼 클릭시 input박스 show
  catAddBtn?.addEventListener('click', () => {
    if (!catInputBox) return;
    catInputBox.style.display = 'flex';
    catInput?.focus();
  });

  // === [2] 카테고리 input 입력 후 추가 + 저장
  catInputOk?.addEventListener('click', () => {
    if (!catInput || !categorySelect) return;
    const val = catInput.value.trim();
    if (!val) return;
    if (!categoryList.includes(val)) {
      categoryList.push(val);
      localStorage.setItem('categoryList', JSON.stringify(categoryList)); // ★ 추가/저장
      renderCategoryOptions();
      categorySelect.value = val;
    }
    catInput.value = '';
    if (catInputBox) catInputBox.style.display = 'none';
  });

  // catInput에서 Enter로 폼 제출 막기
  catInput?.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation(); 
    }
  });

  // 카테고리 삭제
  const ADMIN_PASSWORD = 'ad0501'; // 원하는 비밀번호만 수정

  catDelBtn?.addEventListener('click', () => {
    if (!catDeleteList) return;
    if (catDeleteList.style.display === 'block') {
      catDeleteList.style.display = 'none';
      return;
    }
    catDeleteList.innerHTML = '';
    showPasswordInput();
    catDeleteList.style.display = 'block';
  });

  function showPasswordInput() {
    if (!catDeleteList) return;
    catDeleteList.innerHTML = `
      <div class="cat-pw-wrap">
        <input type="password" class="cat-pw-input" placeholder="관리자 비밀번호" autofocus />
        <button class="cat-pw-btn">확인</button>
      </div>
    `;
    const pwInput = catDeleteList.querySelector('.cat-pw-input');
    const pwBtn = catDeleteList.querySelector('.cat-pw-btn');

    pwBtn?.addEventListener('click', () => {
      if (pwInput && pwInput.value === ADMIN_PASSWORD) {
        renderCatDeleteList();
      } else if (pwInput) {
        pwInput.value = '';
        pwInput.focus();
        pwInput.classList.add('cat-pw-error');
        setTimeout(() => pwInput.classList.remove('cat-pw-error'), 800);
      }
    });
  }

  function renderCatDeleteList() {
    if (!catDeleteList) return;
    catDeleteList.innerHTML = categoryList
      .map((cat) => `<div class="cat-del-item">${cat}</div>`)
      .join('');
    Array.from(catDeleteList.children).forEach((item, i) => {
      item.addEventListener('click', () => {
        const cat = categoryList[i];
        categoryList = categoryList.filter((c) => c !== cat);
        localStorage.setItem('categoryList', JSON.stringify(categoryList));
        renderCategoryOptions();
        catDeleteList.style.display = 'none';
        if (categorySelect?.value === cat) categorySelect.value = '';
      });
    });
  }

  // 이미지 업로드/미리보기
  const imgBox = $('#imgBox');
  const imgInput = imgBox?.querySelector('input[type="file"]');
  const imgPreview = $('#imgPreview');

  // 업로드 버튼 클릭시 파일 선택창 열기
  imgBox?.addEventListener('click', () => {
    imgInput?.click();
  });

  // 파일 선택시 미리보기
  imgInput?.addEventListener('change', function () {
    const file = this.files?.[0];
    if (!file || !imgPreview) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      imgPreview.innerHTML = '';
      const img = document.createElement('img');
      img.src = e.target?.result ?? '';
      imgPreview.appendChild(img);
    };
    reader.readAsDataURL(file);
  });

  // 태그등록
  const tagInput = $('#tagInput');
  const tagList = $('#tagList');
  const hiddenTags = $('#hiddenTags');

  // 태그 칩 생성 (변경 없음)
  tagInput?.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = tagInput.value.trim();
      if (!val || !tagList) return;

      if (tagList.querySelectorAll('.tag-chip').length >= 5) {
        alert('태그는 최대 5개까지 입력할 수 있습니다.');
        tagInput.value = '';
        return;
      }
      if ([...tagList.children].some((chip) => chip.dataset.tag === val)) {
        alert('이미 추가한 태그입니다.');
        tagInput.value = '';
        return;
      }
      const chip = document.createElement('div');
      chip.className = 'tag-chip';
      chip.textContent = '#' + val;
      chip.dataset.tag = val;

      const delBtn = document.createElement('span');
      delBtn.className = 'del';
      delBtn.textContent = '×';
      delBtn.addEventListener('click', () => {
        e.stopPropagation();
        chip.remove();
        updateHiddenTags();
      });

      chip.appendChild(delBtn);
      tagList.appendChild(chip);
      tagInput.value = '';
      updateHiddenTags();
    }
  });

  // 칩 배열을 쉼표 문자열로 변환
  function updateHiddenTags() {
    if (!tagList || !hiddenTags) return;
    const tags = [...tagList.querySelectorAll('.tag-chip')].map(
      (chip) => chip.dataset.tag,
    );
    hiddenTags.value = tags.join(',');
  }

  // 중복 바인딩 방지 플래그
  popup.dataset.inited = 'true';
}
