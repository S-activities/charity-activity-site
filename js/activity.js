// ========================================
// 活動報名狀態
// ========================================

const API_URL =
  "https://script.google.com/macros/s/AKfycbwxH5Zw8EMWbxERh0GBVWXmUMyeafUesotUrvOsb756vQlJhqvUZ8n-KRa402P9BfMq/exec";


// ========================================
// 🧪 測試模式
// ========================================

// 測試完成、正式上線前 → 改成 false
const TEST_MODE = true;

// 🧪 測試時使用的「現在時間」
// 可以修改這裡來模擬不同日期
const TEST_NOW = "2026-11-06T21:00:00+08:00";


// ========================================
// 找到報名區域
// ========================================

const spotsElement =
  document.querySelector(".registration-status .spots");

const tallyEmbed =
  document.querySelector(".tally-embed");


// ========================================
// 取得活動設定
// ========================================

const eventEnd =
  document.body.dataset.eventEnd;

const registrationDeadline =
  document.body.dataset.registrationDeadline;


// ========================================
// 取得目前時間
// ========================================

const now =
  TEST_MODE
    ? new Date(TEST_NOW)
    : new Date();

const deadline =
  new Date(registrationDeadline);

const eventEndTime =
  new Date(eventEnd);


// ========================================
// 如果頁面沒有報名狀態，就不執行
// ========================================

if (spotsElement) {


  // ========================================
  // 🔴 活動已結束
  // ========================================

  if (now >= eventEndTime) {

    spotsElement.textContent =
      "活動已結束";


    if (tallyEmbed) {
      tallyEmbed.style.display = "none";
    }

  }


  // ========================================
  // 🟠 報名已截止
  // ========================================

  else if (now >= deadline) {

    spotsElement.textContent =
      "報名已截止";


    if (tallyEmbed) {
      tallyEmbed.style.display = "none";
    }

  }


  // ========================================
  // 🟢 招募中
  // ========================================

  else {

    fetch(API_URL)

      .then(response => {

        if (!response.ok) {
          throw new Error("API 回應失敗");
        }

        return response.json();

      })

      .then(data => {

        // 確認 API 回傳成功
        if (!data.success) {
          throw new Error("無法取得報名資料");
        }


        const remaining =
          Number(data.remaining);


        // ========================================
        // 有剩餘名額
        // ========================================

        if (remaining > 0) {

          spotsElement.textContent =
            `還有 ${remaining} 個位置`;


          // 有名額 → 顯示 Tally

          if (tallyEmbed) {
            tallyEmbed.style.display = "";
          }

        }


        // ========================================
        // 額滿
        // ========================================

        else {

          spotsElement.textContent =
            "目前名額已額滿";


          // 額滿 → 隱藏 Tally

          if (tallyEmbed) {
            tallyEmbed.style.display = "none";
          }

        }

      })


      // ========================================
      // API 讀取失敗
      // ========================================

      .catch(error => {

        console.error(
          "報名狀態取得失敗：",
          error
        );


        // 不要因為 API 暫時失敗
        // 就錯誤地顯示「額滿」

        spotsElement.textContent =
          "名額資訊暫時無法取得";


        // API 失敗時保留 Tally
        // 避免誤把活動判定為額滿

        if (tallyEmbed) {
          tallyEmbed.style.display = "";
        }

      });

  }

}
