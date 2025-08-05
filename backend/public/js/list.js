window.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('templateList');
  container.innerHTML = '로딩 중...';

  try {
    const res = await fetch('/api/template');
    const data = await res.json();

    if (!data.length) {
      container.innerHTML = '<p>등록된 템플릿이 없습니다.</p>';
      return;
    }

    // 원하는 순서로 정렬
    const categoryOrder = [
      '인트로',
      '메인 페이지',
      '동영상',
      '풀영상',
      '기획',
      '팝업',
      '스크롤',
      '섹션 전환 표지',
      '슬라이드섹션-1개',
      '슬라이드섹션-걸치기',
      '슬라이드섹션-카드형',
      '유니트',
      '유니트-강조',
      '유니트-카드형',
      '카드섹션',
      '카드섹션-왜가리',
      '카드섹션-이미지 카드',
      '텍스트 카드 섹션',
      '현장&모델하우스 위치',
      '관심 고객 등록',
      '푸터',
    ];

    data.sort((a, b) => {
      const idxA = categoryOrder.indexOf(a.category);
      const idxB = categoryOrder.indexOf(b.category);
      return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
    });

    let html = '';
    data.forEach((group) => {
      html += `
        <section class="category-section">
          <h3>${group.category}</h3>
          <ul>
            ${group.items
              .map(
                (item, idx) => `
                <li class="img-card" data-index="${group.category}-${idx}">
                  <img src="${item.imageUrl}" alt="" draggable="true">
                  <div class="img-overlay">
                    <h4>${item.title || ''}</h4>
                    <p>${item.content || ''}</p>
                    ${
                      item.tags && item.tags.trim()
                        ? `<div class="tags">${item.tags
                            .split(',')
                            .map(
                              (tag) => `<span class="tag">${tag.trim()}</span>`,
                            )
                            .join('')}</div>`
                        : ''
                    }
                  </div>
                </li>
              `,
              )
              .join('')}
          </ul>
        </section>
      `;
    });

    container.innerHTML = html;
  } catch (e) {
    container.innerHTML = '<p>에러가 발생했습니다.</p>';
  }
});
