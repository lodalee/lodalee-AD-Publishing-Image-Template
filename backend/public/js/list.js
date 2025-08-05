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

    // 원하는 순서 정렬
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
    data.forEach((group, gIdx) => {
      html += `
                <section class="category-section">
                  <div class="category-header">
                    <h3>${group.category}</h3>
                    <div class="scroll-buttons">
                      <button class="btn-prev" data-section="${gIdx}">←</button>
                      <button class="btn-next" data-section="${gIdx}">→</button>
                    </div>
                  </div>
                  <div class="category-body">
                    <ul id="category-${gIdx}">
                      ${group.items
                        .map(
                          (item, idx) => `
                        <li class="img-card" data-index="${group.category}-${idx}" draggable="true">
                          <img src="${item.imageUrl}" alt="">
                          <div class="img-overlay">
                            <h4>${item.title || ''}</h4>
                            <p>${item.content || ''}</p>
                            ${
                              item.tags && item.tags.trim()
                                ? `<div class="tags">${item.tags
                                    .split(',')
                                    .map(
                                      (tag) =>
                                        `<span class="tag">${tag.trim()}</span>`,
                                    )
                                    .join('')}</div>`
                                : ''
                            }
                          </div>
                        </li>`,
                        )
                        .join('')}
                    </ul>
                  </div>
                </section>
              `;
    });

    container.innerHTML = html;

    // 버튼 동작 추가 (li 단위로 이동)
    document.querySelectorAll('.category-section').forEach((section) => {
      const ul = section.querySelector('ul');
      const items = ul.querySelectorAll('li');
      let currentIndex = 0;

      section.querySelector('.btn-prev').addEventListener('click', () => {
        currentIndex = Math.max(0, currentIndex - 1);
        items[currentIndex].scrollIntoView({
          behavior: 'smooth',
          inline: 'start',
          block: 'nearest',
        });
      });

      section.querySelector('.btn-next').addEventListener('click', () => {
        currentIndex = Math.min(items.length - 1, currentIndex + 1);
        items[currentIndex].scrollIntoView({
          behavior: 'smooth',
          inline: 'start',
          block: 'nearest',
        });
      });
    });
  } catch (e) {
    container.innerHTML = '<p>에러가 발생했습니다.</p>';
  }
});
