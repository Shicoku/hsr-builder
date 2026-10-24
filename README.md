# 崩壊：スターレイル ビルドカード生成器

ゲーム内で公開されているプロフィールからキャラクター情報と遺物を取得し、ビルドカードを作成する非公式 Web アプリです。遺物スコアの確認や、遺物の強化結果を試すシミュレーターも利用できます。

## 主な機能

- UID から公開プロフィールとサポートキャラクターを取得
- キャラクターのビルドカードを表示し、PNG でダウンロード
- 遺物のステータス、伸び率、スコアを確認
- キャラクターごとのステータス重要度を表示
- 遺物の振り直しシミュレーター
- スマートフォンでのビルドカード・遺物表示

## 使い方

1. ゲーム内プロフィールで、表示したいキャラクターをサポートキャラまたは星海同伴に設定します。
2. 設定が反映されるまで 5〜10 分ほど待ちます。
3. アプリで UID を入力し、表示されたキャラクターを選択します。
4. ビルドカードを確認し、必要に応じて PNG 画像として保存します。

詳細はアプリ内の[使い方](https://hsr-builder.shicoku.workers.dev/use)と[利用規約](https://hsr-builder.shicoku.workers.dev/terms)をご覧ください。プロフィールが非公開の場合や、ゲーム内の設定変更直後は情報を取得できないことがあります。

## 開発環境

- [Bun](https://bun.sh/) 1.4.4
- Node.js 20 以上（Next.js 16 の実行要件）

このリポジトリでは Bun を使って依存関係を管理します。

```bash
bun install
bun dev
```

## 技術構成

- Next.js 16 (App Router) / React 19 / TypeScript
- CSS Modules、Tailwind CSS 4、MDX
- プロフィール情報: [MiHoMo API](https://march7th.xyz/en/api/)
- キャラクター・遺物画像: [StarRailRes](https://github.com/Mar-7th/StarRailRes)
- スコア係数: [StarRailScore](https://github.com/Mar-7th/StarRailScore)
- デプロイ: [OpenNext for Cloudflare](https://opennext.js.org/cloudflare)

## ライセンスと権利について

このアプリは HoYoverse および『崩壊：スターレイル』の公式サービスではなく、HoYoverse とは関係ありません。  
ゲーム内の名称・画像・データ等の権利は各権利者に帰属します。  
データの利用条件については、アプリ内の[利用規約](https://hsr-builder.shicoku.workers.dev/terms)をご確認ください。
