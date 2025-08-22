// 팝업을 어떤 페이지에서도 재사용할 수 있도록 "마운트"만 담당
import { initRegisterPopup } from '/components/register/register.init.js';

// <!------------------------------------------------------------------- 템플릿 등록 팝업 ------------------------------------------------------------------->
export async function mountRegisterPopup({
  container = '#popup-inner',       // 주입할 곳
  dialog = '#popup-wrap',           // 팝업 다이얼로그
  trigger = '.open-register-popup', // 열기 버튼 (여러 페이지 공통 클래스 추천)
  url = '/components/register/register.html', // HTML 조각 경로
} = {}) {
  const host = document.querySelector(container);
  const dlg  = document.querySelector(dialog);
  if (!host || !dlg) return;

  // 1) 팝업 내용 동적 주입
  const res = await fetch(url, { cache: 'no-store' });
  const html = await res.text();
  host.innerHTML = html;

  // 2) 주입 후 내부 바인딩
  initRegisterPopup({ dialogSelector: dialog });

  // 3) 팝업 열기 버튼(여러 개 가능)
  //    페이지마다 버튼에 .open-register-popup 클래스만 달아주면 됩니다.
  document.addEventListener('click', (e) => {
    const btn = e.target.closest(trigger);
    if (!btn) return;
    e.preventDefault();
    dlg.classList.add('open');
  });
}
