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
  const select = document.getElementById('categorySelect');
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
const catAddBtn = document.getElementById('catAddBtn');
const catInputBox = document.getElementById('catInputBox');
const catInput = document.getElementById('catInput');
const catInputOk = document.getElementById('catInputOk');
const categorySelect = document.getElementById('categorySelect');

// === [1] "카테고리 추가" 버튼 클릭시 input박스 show
catAddBtn.onclick = () => {
  catInputBox.style.display = 'flex';
  catInput.focus();
};

// === [2] 카테고리 input 입력 후 추가 + 저장
catInputOk.onclick = () => {
  const val = catInput.value.trim();
  if (!val) return;
  if (!categoryList.includes(val)) {
    categoryList.push(val);
    localStorage.setItem('categoryList', JSON.stringify(categoryList)); // ★ 추가/저장
    renderCategoryOptions();
    categorySelect.value = val;
  }
  catInput.value = '';
  catInputBox.style.display = 'none';
};

// 카테고리 삭제
const ADMIN_PASSWORD = 'ad0501'; // 원하는 비밀번호만 수정

catDelBtn.onclick = () => {
  if (catDeleteList.style.display === 'block') {
    catDeleteList.style.display = 'none';
    return;
  }
  catDeleteList.innerHTML = '';
  showPasswordInput();
  catDeleteList.style.display = 'block';
};

function showPasswordInput() {
  catDeleteList.innerHTML = `
    <div class="cat-pw-wrap">
      <input type="password" class="cat-pw-input" placeholder="관리자 비밀번호" autofocus />
      <button class="cat-pw-btn">확인</button>
    </div>
  `;
  const pwInput = catDeleteList.querySelector('.cat-pw-input');
  const pwBtn = catDeleteList.querySelector('.cat-pw-btn');

  pwBtn.onclick = () => {
    if (pwInput.value === ADMIN_PASSWORD) {
      renderCatDeleteList();
    } else {
      pwInput.value = '';
      pwInput.focus();
      pwInput.classList.add('cat-pw-error');
      setTimeout(() => pwInput.classList.remove('cat-pw-error'), 800);
    }
  };
}

function renderCatDeleteList() {
  catDeleteList.innerHTML = categoryList
    .map((cat) => `<div class="cat-del-item">${cat}</div>`)
    .join('');
  Array.from(catDeleteList.children).forEach((item, i) => {
    item.onclick = () => {
      const cat = categoryList[i];
      categoryList = categoryList.filter((c) => c !== cat);
      localStorage.setItem('categoryList', JSON.stringify(categoryList));
      renderCategoryOptions();
      catDeleteList.style.display = 'none';
      if (categorySelect.value === cat) categorySelect.value = '';
    };
  });
}

const imgBox = document.getElementById('imgBox');
const imgInput = imgBox.querySelector('input[type="file"]');
const imgPreview = document.getElementById('imgPreview');

// 업로드 버튼 클릭시 파일 선택창 열기
imgBox.addEventListener('click', () => {
  imgInput.click();
});

// 파일 선택시 미리보기
imgInput.addEventListener('change', function () {
  const file = this.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    imgPreview.innerHTML = '';
    const img = document.createElement('img');
    img.src = e.target.result;
    imgPreview.appendChild(img);
  };
  reader.readAsDataURL(file);
});

//태그등록
const tagInput = document.getElementById('tagInput');
const tagList = document.getElementById('tagList');
const hiddenTags = document.getElementById('hiddenTags');

// 태그 칩 생성 (변경 없음)
tagInput.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    const val = tagInput.value.trim();
    if (!val) return;
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
    delBtn.onclick = () => {
      chip.remove();
      updateHiddenTags();
    };
    chip.appendChild(delBtn);
    tagList.appendChild(chip);
    tagInput.value = '';
    updateHiddenTags();
  }
});

// 칩 배열을 쉼표 문자열로 변환
function updateHiddenTags() {
  const tags = [...tagList.querySelectorAll('.tag-chip')].map(
    (chip) => chip.dataset.tag,
  );
  hiddenTags.value = tags.join(',');
}

// catInput에서 Enter로 폼 제출 막기
catInput.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    e.preventDefault(); // 🚫 새로고침 차단
  }
});
