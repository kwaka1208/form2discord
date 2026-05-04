/**
 * 1. 【本体処理】指定された行のデータをDiscordに送信する
 */
function sendRowToDiscord(rowNum) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // 1行目（ヘッダー）と指定した行のデータを取得
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const rowData = sheet.getRange(rowNum, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  let messageBody = `🔔 **行番号 #${rowNum} のデータが更新されました**\n\n`;
  
  // ヘッダーとデータを組み合わせてメッセージを作成
  headers.forEach((header, index) => {
    let value = rowData[index];
    // 日付型の場合は読みやすく変換
    if (value instanceof Date) {
      value = Utilities.formatDate(value, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
    }
    messageBody += `**【${header}】**\n${value || "(空欄)"}\n\n`;
  });

  const payload = { content: messageBody };
  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload)
  };

  try {
    UrlFetchApp.fetch(DISCORD_WEBHOOK_URL, options);
    console.log(`行 ${rowNum} を送信しました。`);
  } catch(error) {
    console.error("送信エラー: ", error);
  }
}
