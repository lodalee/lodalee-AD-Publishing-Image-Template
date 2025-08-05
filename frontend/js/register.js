document
  .getElementById("registerForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    // FormData로 폼 전체 값 수집 (파일 포함)
    const formData = new FormData(this);

    // fetch로 API 호출 (POST, 멀티파트)
    try {
      const res = await fetch("/api/templates", {
        method: "POST",
        body: formData, // Content-Type 자동 세팅됨
      });
      const json = await res.json();
      document.getElementById("result").innerText =
        "서버 응답: " + JSON.stringify(json);
    } catch (err) {
      document.getElementById("result").innerText = "에러: " + err;
    }
  });
