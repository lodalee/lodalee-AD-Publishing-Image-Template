// list.js

window.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('templateList');
  container.innerHTML = '로딩 중...';

  try {
    // 서버에서 카테고리별 데이터 가져오기 (경로는 네트워크 구조에 따라 수정!)
    const res = await fetch('/api/template'); // 실제 API 엔드포인트로 변경
    const data = await res.json();

    if (!data.length) {
      container.innerHTML = '<p>등록된 템플릿이 없습니다.</p>';
      return;
    }

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
