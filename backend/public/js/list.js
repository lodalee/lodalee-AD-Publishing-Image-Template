// list.js
window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('templateList');
  const searchBox = document.querySelector('.search-box');

  // 1. 단일 아이템 HTML
  const renderItem = (item, idx, category) => `
    <li class="img-card" data-index="${category}-${idx}" draggable="true">
      <img src="${item.imageUrl}" alt="">
      <div class="img-overlay">
        <h4>${item.title || ''}</h4>
        <p>${item.content || ''}</p>
        ${
          item.tags && item.tags.trim()
            ? `<div class="tags">${item.tags
                .split(',')
                .map(tag => `<span class="tag">${tag.trim()}</span>`)
                .join('')}</div>`
            : ''
        }
      </div>
    </li>
  `;

  // 2. 전체/검색 결과 HTML 렌더링
  const renderTemplates = data => {
    if (!data || !data.length) return '<p>등록된 템플릿이 없습니다.</p>';
    if (data.message) return `<p>${data.message}</p>`;

    let grouped = {};

    // data가 이미 category-items 구조인지 체크
    if (data[0].items) {
      // 전체 조회
      data.forEach(group => {
        grouped[group.category] = group.items;
      });
    } else {
      // 검색 결과 → category별로 그룹핑
      data.forEach(item => {
        if (!grouped[item.category]) grouped[item.category] = [];
        grouped[item.category].push(item);
      });
    }

    // HTML 생성
    let html = '';
    const categoryOrder = [
      '인트로','메인 페이지','동영상','풀영상','기획','팝업','스크롤','섹션 전환 표지',
      '슬라이드섹션-1개','슬라이드섹션-걸치기','슬라이드섹션-카드형','유니트','유니트-강조',
      '유니트-카드형','카드섹션','카드섹션-왜가리','카드섹션-이미지 카드','텍스트 카드 섹션',
      '현장&모델하우스 위치','관심 고객 등록','푸터'
    ];

    Object.entries(grouped)
      .sort((a,b) => {
        const idxA = categoryOrder.indexOf(a[0]);
        const idxB = categoryOrder.indexOf(b[0]);
        return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
      })
      .forEach(([category, items], gIdx) => {
        html += `
          <section class="category-section">
            <div class="category-header">
              <h3>${category}</h3>
              <div class="scroll-buttons">
                <button class="btn-prev" data-section="${gIdx}"><</button>
                <button class="btn-next" data-section="${gIdx}">></button>
              </div>
            </div>
            <div class="category-body">
              <ul id="category-${gIdx}">
                ${items.map((item, idx) => renderItem(item, idx, category)).join('')}
              </ul>
            </div>
          </section>
        `;
      });

    return html;
  };

  // 3. 데이터 로드
  const loadTemplates = async (search = '') => {
    container.innerHTML = '로딩 중...';
    try {
      const res = await fetch(`/api/template${search ? '?search=' + encodeURIComponent(search) : ''}`);
      const data = await res.json();
      container.innerHTML = renderTemplates(data);

      // 4. 스크롤 버튼 동작
      document.querySelectorAll('.category-section').forEach(section => {
        const ul = section.querySelector('ul');
        const items = ul.querySelectorAll('li');
        let currentIndex = 0;

        section.querySelector('.btn-prev').addEventListener('click', () => {
          currentIndex = Math.max(0, currentIndex - 1);
          items[currentIndex].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
        });

        section.querySelector('.btn-next').addEventListener('click', () => {
          currentIndex = Math.min(items.length - 1, currentIndex + 1);
          items[currentIndex].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
        });
      });

    } catch (e) {
      container.innerHTML = '<p>에러가 발생했습니다.</p>';
      console.error(e);
    }
  };

  // 5. 초기 로드
  loadTemplates();

  // 6. 검색 이벤트
  searchBox.addEventListener('keydown', e => {
    if (e.key === 'Enter') loadTemplates(searchBox.value.trim());
  });
});
