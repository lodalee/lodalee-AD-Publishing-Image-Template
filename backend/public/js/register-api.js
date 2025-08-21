
// <!------------------------------------------------------------------- 템플릿 등록 팝업 ------------------------------------------------------------------->
// 팝업 열기
document.querySelectorAll('.template-list .nav button').forEach(function(btn) {
  btn.addEventListener('click', function(e) {
    e.preventDefault(); // form 안에 있을 경우 대비
    document.querySelector('#popup-wrap').classList.add('open');
  });
});

// 팝업 닫기 버튼 클릭 시 닫기
document.querySelector('#popup-wrap-close-btn').addEventListener('click', function() {
  document.querySelector('#popup-wrap').classList.remove('open');
});

// 배경 클릭 시 닫기 (내용 영역 제외)
document.querySelector('#popup-wrap').addEventListener('click', function(e) {
  if (!e.target.closest('.template-box')) {
    this.classList.remove('open');
  }
});

// ESC 키 눌렀을 때 닫기 (open 클래스가 있는 경우에만)
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    const popup = document.querySelector('#popup-wrap');
    if (popup.classList.contains('open')) {
      popup.classList.remove('open');
    }
  }
});


//<!------------------------------------------------------------------- 템플릿 등록 api ------------------------------------------------------------------->
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

