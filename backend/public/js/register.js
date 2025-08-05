document
  .getElementById('templateForm')
  .addEventListener('submit', async function (e) {
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
        document.getElementById('result').innerText = '서버 에러: ' + err;
      }
    } catch (err) {
      document.getElementById('result').innerText = '에러: ' + err;
    }
  });
