document
  .getElementById('templateForm')
  .addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(this);

    try {
      const res = await fetch('/api/template', {
        method: 'POST',
        body: formData, // Content-Type 자동 세팅됨
      });
      // const json = await res.json();
      // document.getElementById('result').innerText =
      //   '서버 응답: ' + JSON.stringify(json);
    } catch (err) {
      document.getElementById('result').innerText = '에러: ' + err;
    }
  });
