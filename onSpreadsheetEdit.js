/**
 * 2. 【トリガー用】スプレッドシートが編集された時に自動で動く
 */
function onSpreadsheetEdit(e) {
  // 編集された範囲の開始行番号を取得
  const rowNum = e.range.getRow();
  
  // ヘッダー行（1行目）の編集は無視する
  if (rowNum <= 1) return;
  
  // 本体処理を呼び出す
  sendRowToDiscord(rowNum);
}
