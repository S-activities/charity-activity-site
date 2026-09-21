// ========================================
// 活動報名狀態
// ========================================

const API_URL =
  "https://script.google.com/macros/s/AKfycbwxH5Zw8EMWbxERh0GBVWXmUMyeafUesotUrvOsb756vQlJhqvUZ8n-KRa402P9BfMq/exec";


// 找到活動頁上的名額文字與報名表
const spotsElement = document.querySelector(".spots");
const tallyEmbed = document.querySelector(".tally-embed");


// 如果頁面沒有名額區塊，就不執行
if (spotsElement) {

  fetch(API_URL)
    .then(response => response.json())
    .then(data => {

      // 確認 API 回傳成功
      if (!data.success) {
        throw new Error("無法取得報名資料");
      }

      const remaining = data.remaining;

      // ========================================
      // 名額顯示
      // ========================================

      if (remaining > 0) {

        spotsElement.textContent =
          `還有 ${remaining} 個位置`;

        // 有名額 → 顯示報名表
        if (tallyEmbed) {
          tallyEmbed.style.display = "";
        }

      } else {

        spotsElement.textContent =
          "目前名額已額滿";

        // ========================================
        // 額滿 → 隱藏 Tally
        // ========================================

        if (tallyEmbed) {
          tallyEmbed.style.display = "none";
        }

      }

    })
    .catch(error => {

      console.error("報名狀態取得失敗：", error);

      // API 暫時讀不到時
      spotsElement.textContent =
        "名額資訊載入中";

    });

}
