
// 1. 초기값 불러오기(localStorage → 기본값)
let categoryList = JSON.parse(localStorage.getItem('categoryList')) || ['nav', 'footer', 'slide'];

function renderCategoryOptions() {
  const select = document.getElementById('categorySelect');
  select.innerHTML = '<option value="">카테고리 선택</option>';
  categoryList.forEach(cat => {
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
  catInputBox.style.display = "flex"; 
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
  catInputBox.style.display = "none";
};

// 카테고리 삭제
catDelBtn.onclick = () => {
  if (catDeleteList.style.display === "block") {
    catDeleteList.style.display = "none";
    return;
  }
  catDeleteList.innerHTML = "";
  categoryList.forEach(cat => {
    const item = document.createElement('div');
    item.className = "cat-del-item";
    item.textContent = cat;
    item.onclick = () => {
      // ★ 삭제/저장
      categoryList = categoryList.filter(c => c !== cat);
      localStorage.setItem('categoryList', JSON.stringify(categoryList)); // 추가/저장
      renderCategoryOptions();
      catDeleteList.style.display = "none";
      if (categorySelect.value === cat) categorySelect.value = '';
    };
    catDeleteList.appendChild(item);
  });
  catDeleteList.style.display = "block";
};


const imgBox = document.getElementById('imgBox');
const imgInput = imgBox.querySelector('input[type="file"]');
const imgPreview = document.getElementById('imgPreview');

// 업로드 버튼 클릭시 파일 선택창 열기
imgBox.addEventListener('click', () => {
  imgInput.click();
});

// 파일 선택시 미리보기
imgInput.addEventListener('change', function() {
  const file = this.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = e => {
    imgPreview.innerHTML = '';
    const img = document.createElement('img');
    img.src = e.target.result;
    imgPreview.appendChild(img);
  }
  reader.readAsDataURL(file);
});


// 태그등록
const tagInput = document.getElementById('tagInput');
const tagList = document.getElementById('tagList');

tagInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    e.preventDefault();

    const val = tagInput.value.trim();
    if (!val) return;

    // 태그 개수 제한
    if (tagList.querySelectorAll('.tag-chip').length >= 5) {
      alert('태그는 최대 5개까지 입력할 수 있습니다.');
      tagInput.value = '';
      return;
    }

    const chip = document.createElement('div');
    chip.className = 'tag-chip';
    chip.textContent = '#' + val;

    const delBtn = document.createElement('span');
    delBtn.className = 'del';
    delBtn.textContent = '×';
    delBtn.onclick = () => chip.remove();

    chip.appendChild(delBtn);
    tagList.appendChild(chip);

    tagInput.value = '';
  }
});

// catInput에서 Enter로 폼 제출 막기
catInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    e.preventDefault(); // 🚫 새로고침 차단
  }
});