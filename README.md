# 動的フォーム - Google Forms 風アプリケーション

## 概要

このプロジェクトは、Google Forms と同等の機能とUI/UXを持つ動的フォーム実装です。TypeScriptとGoogle Apps Scriptを使用しており、選択内容によって質問が動的に変化するフォームを作成できます。

## 機能

* **直感的なフォームエディタ** : Google Forms に似た編集インターフェース
* **様々な質問タイプ** :
* テキスト入力
* ラジオボタン（単一選択）
* リスト選択（ドロップダウン）
* **条件分岐** : 選択した回答に基づく条件付き質問表示
* **必須/任意設定** : 質問ごとに設定可能
* **回答データの自動保存** : スプレッドシートでの回答管理
* **レスポンシブデザイン** : PC/モバイル対応

## 技術スタック

* **TypeScript** : 型安全なコードで開発
* **Google Apps Script** : サーバーサイドの実装
* **HTML/CSS/JavaScript** : フロントエンドUI
* **Clasp** : ローカル開発環境との連携
* **Git** : バージョン管理

## セットアップ手順

### 前提条件

* Node.js と npm がインストールされていること
* Google アカウントを持っていること

### インストール

<pre><div class="relative flex flex-col rounded-lg"><div class="text-text-300 absolute pl-3 pt-2.5 text-xs">bash</div><div class="pointer-events-none sticky my-0.5 ml-0.5 flex items-center justify-end px-1.5 py-1 mix-blend-luminosity top-0"><div class="from-bg-300/90 to-bg-300/70 pointer-events-auto rounded-md bg-gradient-to-b p-0.5 backdrop-blur-md"><button class="flex flex-row items-center gap-1 rounded-md p-1 py-0.5 text-xs transition-opacity delay-100 text-text-300 hover:bg-bg-200 opacity-60 hover:opacity-100" data-state="closed"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256" class="text-text-500 mr-px -translate-y-[0.5px]"><path d="M200,32H163.74a47.92,47.92,0,0,0-71.48,0H56A16,16,0,0,0,40,48V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V48A16,16,0,0,0,200,32Zm-72,0a32,32,0,0,1,32,32H96A32,32,0,0,1,128,32Zm72,184H56V48H82.75A47.93,47.93,0,0,0,80,64v8a8,8,0,0,0,8,8h80a8,8,0,0,0,8-8V64a47.93,47.93,0,0,0-2.75-16H200Z"></path></svg><span class="text-text-200 pr-0.5">Copy</span></button></div></div><div><div class="prismjs code-block__code !my-0 !rounded-lg !text-sm !leading-relaxed"><code class="language-bash"><span class=""><span class="token comment"># リポジトリをクローン</span><span class="">
</span></span><span class=""><span class=""></span><span class="token function">git</span><span class=""> clone https://github.com/yourusername/dynamic-form.git
</span></span><span class=""><span class=""></span><span class="token builtin class-name">cd</span><span class=""> dynamic-form
</span></span><span class="">
</span><span class=""><span class=""></span><span class="token comment"># 依存パッケージをインストール</span><span class="">
</span></span><span class=""><span class=""></span><span class="token function">npm</span><span class=""></span><span class="token function">install</span><span class="">
</span></span><span class="">
</span><span class=""><span class=""></span><span class="token comment"># グローバルに clasp をインストール（初回のみ）</span><span class="">
</span></span><span class=""><span class=""></span><span class="token function">npm</span><span class=""></span><span class="token function">install</span><span class=""> -g @google/clasp
</span></span><span class="">
</span><span class=""><span class=""></span><span class="token comment"># Google アカウントでログイン</span><span class="">
</span></span><span class="">clasp login</span></code></div></div></div></pre>

### 新規プロジェクトの作成

<pre><div class="relative flex flex-col rounded-lg"><div class="text-text-300 absolute pl-3 pt-2.5 text-xs">bash</div><div class="pointer-events-none sticky my-0.5 ml-0.5 flex items-center justify-end px-1.5 py-1 mix-blend-luminosity top-0"><div class="from-bg-300/90 to-bg-300/70 pointer-events-auto rounded-md bg-gradient-to-b p-0.5 backdrop-blur-md"><button class="flex flex-row items-center gap-1 rounded-md p-1 py-0.5 text-xs transition-opacity delay-100 text-text-300 hover:bg-bg-200 opacity-60 hover:opacity-100" data-state="closed"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256" class="text-text-500 mr-px -translate-y-[0.5px]"><path d="M200,32H163.74a47.92,47.92,0,0,0-71.48,0H56A16,16,0,0,0,40,48V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V48A16,16,0,0,0,200,32Zm-72,0a32,32,0,0,1,32,32H96A32,32,0,0,1,128,32Zm72,184H56V48H82.75A47.93,47.93,0,0,0,80,64v8a8,8,0,0,0,8,8h80a8,8,0,0,0,8-8V64a47.93,47.93,0,0,0-2.75-16H200Z"></path></svg><span class="text-text-200 pr-0.5">Copy</span></button></div></div><div><div class="prismjs code-block__code !my-0 !rounded-lg !text-sm !leading-relaxed"><code class="language-bash"><span class=""><span class="token comment"># 新しい Google Apps Script プロジェクトを作成</span><span class="">
</span></span><span class=""><span class="">clasp create --title </span><span class="token string">"動的フォーム"</span><span class=""> --rootDir build
</span></span><span class="">
</span><span class=""><span class=""></span><span class="token comment"># または既存のプロジェクトをクローン</span><span class="">
</span></span><span class=""><span class="">clasp clone </span><span class="token string">"YOUR_SCRIPT_ID"</span><span class=""> --rootDir build</span></span></code></div></div></div></pre>

### ディレクトリ構造

<pre><div class="relative flex flex-col rounded-lg"><div class="text-text-300 absolute pl-3 pt-2.5 text-xs"></div><div class="pointer-events-none sticky my-0.5 ml-0.5 flex items-center justify-end px-1.5 py-1 mix-blend-luminosity top-0"><div class="from-bg-300/90 to-bg-300/70 pointer-events-auto rounded-md bg-gradient-to-b p-0.5 backdrop-blur-md"><button class="flex flex-row items-center gap-1 rounded-md p-1 py-0.5 text-xs transition-opacity delay-100 text-text-300 hover:bg-bg-200 opacity-60 hover:opacity-100" data-state="closed"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256" class="text-text-500 mr-px -translate-y-[0.5px]"><path d="M200,32H163.74a47.92,47.92,0,0,0-71.48,0H56A16,16,0,0,0,40,48V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V48A16,16,0,0,0,200,32Zm-72,0a32,32,0,0,1,32,32H96A32,32,0,0,1,128,32Zm72,184H56V48H82.75A47.93,47.93,0,0,0,80,64v8a8,8,0,0,0,8,8h80a8,8,0,0,0,8-8V64a47.93,47.93,0,0,0-2.75-16H200Z"></path></svg><span class="text-text-200 pr-0.5">Copy</span></button></div></div><div><div class="prismjs code-block__code !my-0 !rounded-lg !text-sm !leading-relaxed"><code><span class=""><span class="">project-root/
</span></span><span class="">├── src/                     # ソースコード
</span><span class="">│   ├── Code.ts              # メインのTypeScriptコード
</span><span class="">│   ├── form-editor.html     # フォームエディタUI
</span><span class="">│   └── form-response.html   # フォーム回答画面
</span><span class="">├── build/                   # ビルド出力（自動生成）
</span><span class="">├── node_modules/            # 依存パッケージ（自動生成）
</span><span class="">├── package.json             # npm設定
</span><span class="">├── tsconfig.json            # TypeScript設定
</span><span class="">├── .clasp.json              # Clasp設定
</span><span class="">└── README.md                # このファイル</span></code></div></div></div></pre>

## 開発ワークフロー

### ビルドとデプロイ

<pre><div class="relative flex flex-col rounded-lg"><div class="text-text-300 absolute pl-3 pt-2.5 text-xs">bash</div><div class="pointer-events-none sticky my-0.5 ml-0.5 flex items-center justify-end px-1.5 py-1 mix-blend-luminosity top-0"><div class="from-bg-300/90 to-bg-300/70 pointer-events-auto rounded-md bg-gradient-to-b p-0.5 backdrop-blur-md"><button class="flex flex-row items-center gap-1 rounded-md p-1 py-0.5 text-xs transition-opacity delay-100 text-text-300 hover:bg-bg-200 opacity-60 hover:opacity-100" data-state="closed"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256" class="text-text-500 mr-px -translate-y-[0.5px]"><path d="M200,32H163.74a47.92,47.92,0,0,0-71.48,0H56A16,16,0,0,0,40,48V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V48A16,16,0,0,0,200,32Zm-72,0a32,32,0,0,1,32,32H96A32,32,0,0,1,128,32Zm72,184H56V48H82.75A47.93,47.93,0,0,0,80,64v8a8,8,0,0,0,8,8h80a8,8,0,0,0,8-8V64a47.93,47.93,0,0,0-2.75-16H200Z"></path></svg><span class="text-text-200 pr-0.5">Copy</span></button></div></div><div><div class="prismjs code-block__code !my-0 !rounded-lg !text-sm !leading-relaxed"><code class="language-bash"><span class=""><span class="token comment"># TypeScriptコンパイルとHTMLファイルのコピー</span><span class="">
</span></span><span class=""><span class=""></span><span class="token function">npm</span><span class=""> run build
</span></span><span class="">
</span><span class=""><span class=""></span><span class="token comment"># Google Apps Scriptへのプッシュ</span><span class="">
</span></span><span class=""><span class=""></span><span class="token function">npm</span><span class=""> run push
</span></span><span class="">
</span><span class=""><span class=""></span><span class="token comment"># ビルドとプッシュを一度に実行</span><span class="">
</span></span><span class=""><span class=""></span><span class="token function">npm</span><span class=""> run deploy</span></span></code></div></div></div></pre>

### ライブ開発

<pre><div class="relative flex flex-col rounded-lg"><div class="text-text-300 absolute pl-3 pt-2.5 text-xs">bash</div><div class="pointer-events-none sticky my-0.5 ml-0.5 flex items-center justify-end px-1.5 py-1 mix-blend-luminosity top-0"><div class="from-bg-300/90 to-bg-300/70 pointer-events-auto rounded-md bg-gradient-to-b p-0.5 backdrop-blur-md"><button class="flex flex-row items-center gap-1 rounded-md p-1 py-0.5 text-xs transition-opacity delay-100 text-text-300 hover:bg-bg-200 opacity-60 hover:opacity-100" data-state="closed"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256" class="text-text-500 mr-px -translate-y-[0.5px]"><path d="M200,32H163.74a47.92,47.92,0,0,0-71.48,0H56A16,16,0,0,0,40,48V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V48A16,16,0,0,0,200,32Zm-72,0a32,32,0,0,1,32,32H96A32,32,0,0,1,128,32Zm72,184H56V48H82.75A47.93,47.93,0,0,0,80,64v8a8,8,0,0,0,8,8h80a8,8,0,0,0,8-8V64a47.93,47.93,0,0,0-2.75-16H200Z"></path></svg><span class="text-text-200 pr-0.5">Copy</span></button></div></div><div><div class="prismjs code-block__code !my-0 !rounded-lg !text-sm !leading-relaxed"><code class="language-bash"><span class=""><span class="token comment"># 変更を監視してビルド・プッシュを自動実行</span><span class="">
</span></span><span class=""><span class=""></span><span class="token function">npm</span><span class=""> run start</span></span></code></div></div></div></pre>

## アプリケーションの使用方法

### デプロイ

1. Apps Scriptエディタでプロジェクトを開く:
   <pre><div class="relative flex flex-col rounded-lg"><div class="text-text-300 absolute pl-3 pt-2.5 text-xs">bash</div><div class="pointer-events-none sticky my-0.5 ml-0.5 flex items-center justify-end px-1.5 py-1 mix-blend-luminosity top-0"><div class="from-bg-300/90 to-bg-300/70 pointer-events-auto rounded-md bg-gradient-to-b p-0.5 backdrop-blur-md"><button class="flex flex-row items-center gap-1 rounded-md p-1 py-0.5 text-xs transition-opacity delay-100 text-text-300 hover:bg-bg-200 opacity-60 hover:opacity-100" data-state="closed"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256" class="text-text-500 mr-px -translate-y-[0.5px]"><path d="M200,32H163.74a47.92,47.92,0,0,0-71.48,0H56A16,16,0,0,0,40,48V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V48A16,16,0,0,0,200,32Zm-72,0a32,32,0,0,1,32,32H96A32,32,0,0,1,128,32Zm72,184H56V48H82.75A47.93,47.93,0,0,0,80,64v8a8,8,0,0,0,8,8h80a8,8,0,0,0,8-8V64a47.93,47.93,0,0,0-2.75-16H200Z"></path></svg><span class="text-text-200 pr-0.5">Copy</span></button></div></div><div><div class="prismjs code-block__code !my-0 !rounded-lg !text-sm !leading-relaxed"><code class="language-bash"><span class=""><span class="">clasp </span><span class="token function">open</span></span></code></div></div></div></pre>
2. `startApp` 関数を実行してURLを取得:
   * 「実行」→「関数を実行」→「startApp」を選択
3. ウェブアプリとしてデプロイ:
   * 「デプロイ」→「新しいデプロイ」
   * 「種類の選択」→「ウェブアプリ」
   * 必要な設定を行い「デプロイ」をクリック

### フォームエディタの使用

1. 表示されたURLにアクセス
2. フォームのタイトルと説明を編集
3. 質問を追加・編集
4. 条件付き質問を設定
5. 「保存」ボタンをクリック
6. 表示されるURLでフォームにアクセス

### フォーム回答

1. フォームのURLにアクセス
2. 質問に回答
3. 「送信」ボタンをクリック

## 回答データの管理

回答データは自動的にGoogle スプレッドシートに保存されます:

* フォームごとに専用のスプレッドシートが作成されます
* スプレッドシートの名前は「フォームタイトル (回答)」という形式
* スプレッドシートはフォーム作成者のGoogle ドライブに保存されます

## 注意事項

* **セキュリティ** : デフォルトでは、フォームへのアクセスはGoogle Apps Scriptの設定に依存します
* **制限事項** :
* ファイルアップロード機能はサポートされていません
* 画像の挿入機能はサポートされていません
* **スクリプトプロパティ** : フォームデータはGoogle Apps Script プロパティサービスに保存されます

## トラブルシューティング

* **HTMLが表示されない** :
* HTML ファイルが正しくプッシュされているか確認
* `form-editor.html` と `form-response.html` が存在するか確認
* ビルドプロセスでHTMLファイルがコピーされているか確認
* **型エラー** :
* TypeScriptコンパイラのエラーメッセージを確認
* オプショナルチェイニングなど、GASで使えない機能を避ける
* **権限エラー** :
* スクリプトの実行権限を確認
* 適切な承認を行う

## ライセンス

MIT
