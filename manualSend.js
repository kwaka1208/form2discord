/**
 * 3. 【手動用】実行すると行番号を入力するポップアップが出る
 */
function manualSend() {
  const rowNum = 2
  sendRowToDiscord(rowNum)
  Logger.log(`行 ${rowNum} を送信しました。`)
}