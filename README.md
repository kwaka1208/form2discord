# form2discord

Googleスプレッドシートの行データをDiscord Webhookで通知するGoogle Apps Script（GAS）ツールです。

スプレッドシートが編集されると、その行のヘッダーとデータをDiscordチャンネルに自動送信します。

## 動作イメージ

スプレッドシートの任意の行が編集されると、Discordに以下のようなメッセージが投稿されます。

```
🔔 行番号 #2 のデータが更新されました

【名前】
山田 太郎

【メールアドレス】
taro@example.com

【メッセージ】
お問い合わせ内容...
```

## ファイル構成

| ファイル | 説明 |
|---|---|
| `variables.js.example` | Discord Webhook URLの設定 `variables.js` にリネームして使用 |
| `sendRowToDiscord.js` | 指定行のデータをDiscordに送信するコア処理 |
| `onSpreadsheetEdit.js` | スプレッドシート編集時に自動実行されるトリガー |
| `manualSend.js` | 手動で送信テストを行う関数 |
| `appsscript.json` | GASプロジェクトの設定ファイル |
| `.clasp copy.json.example` | clasp（GASデプロイツール）の設定 `.clasp.json` にリネームして使用 |

## セットアップ

### 前提条件

- [Node.js](https://nodejs.org/) がインストール済みであること
- [clasp](https://github.com/google/clasp) がインストール済みであること（`npm install -g @google/clasp`）
- Googleアカウントでclaspにログイン済みであること（`clasp login`）

### 手順

#### 1. Discord Webhook URLを取得する

1. 通知を送りたいDiscordサーバーのチャンネル設定を開く
2. **連携サービス** > **ウェブフック** > **新しいウェブフック** を作成
3. 表示されたWebhook URLをコピーする

#### 2. GASプロジェクトを用意する

Googleスプレッドシートを開き、**拡張機能** > **Apps Script** からGASプロジェクトを作成します。
URLの `https://script.google.com/home/projects/<スクリプトID>/edit` の `<スクリプトID>` 部分をメモしておきます。

#### 3. 設定ファイルを作成する

```bash
# variables.js を作成してWebhook URLを設定
cp variables.js.example variables.js
```

`variables.js` を開き、取得したDiscord Webhook URLを貼り付けます。

```js
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/...";
```

```bash
# .clasp.json を作成してスクリプトIDを設定
cp ".clasp copy.json.example" .clasp.json
```

`.clasp.json` を開き、GASプロジェクトのスクリプトIDを入力します。

```json
{
  "scriptId": "YOUR_SCRIPT_ID_HERE",
  ...
}
```

#### 4. GASにデプロイする

```bash
clasp push
```

#### 5. トリガーを設定する

GASエディタ（`clasp open` で開けます）で以下の手順でトリガーを設定します。

1. 左サイドバーの **時計アイコン（トリガー）** をクリック
2. **トリガーを追加** をクリック
3. 以下のように設定する

| 項目 | 値 |
|---|---|
| 実行する関数 | `onSpreadsheetEdit` |
| イベントのソース | スプレッドシートから |
| イベントの種類 | 編集時 |

4. **保存** をクリック

これで、スプレッドシートを編集するたびにDiscordへ通知が送信されます。

## 手動テスト

`manualSend.js` の `rowNum` に送信したい行番号を指定し、GASエディタから `manualSend` 関数を直接実行することで動作確認できます。

```js
function manualSend() {
  const rowNum = 2  // 送信したい行番号を指定
  sendRowToDiscord(rowNum)
}
```

## 注意事項

- `variables.js` と `.clasp.json` はシークレット情報を含むため `.gitignore` で管理対象外にしてGitにコミットしないよう注意してください。
- スプレッドシートの1行目はヘッダー行として扱われ、編集しても通知は送信されません。
