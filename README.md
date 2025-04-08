# Voice Game - 音声入力インタラクティブゲーム

音声入力を使った抽選ゲームアプリケーションです。ユーザーの声を検出して動画再生による結果表示を行います。

## 特徴

- 🎮 スタートボタンからゲーム開始
- ⏱️ カウントダウン表示
- 🎙️ リアルタイム音声入力レベル検出
- 📊 リアルタイム音声可視化
- 🎦 シームレスな動画再生
- 🎲 確率ベースの抽選アルゴリズム
- 🏆 20種類の結果パターン

## 技術スタック

- **フレームワーク**: Next.js (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **状態管理**: Zustand
- **アニメーション**: Framer Motion
- **音声処理**: Web Audio API
- **最適化**: Chrome/Mac環境特化

## 開発環境

- Node.js 20.x
- npm 10.x
- Chrome ブラウザ
- macOS

## セットアップ

```bash
# リポジトリのクローン
git clone https://github.com/SakataRyuichi/voice-game-nextjs.git
cd voice-game-nextjs

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

## 動画ファイルの準備

1. 20種類の結果に対応する動画ファイルを用意します
2. `public/videos/` ディレクトリに `result1.mp4` から `result20.mp4` の命名規則で配置します

## デプロイ

### ローカル環境向けビルド

```bash
npm run build:local
```

### Amplifyデプロイ向けビルド

```bash
npm run build:amplify
```

## Chromeとmacに最適化

このアプリケーションはChrome/Mac環境に特化して最適化されています。以下の機能により、パフォーマンスと体験が向上します：

- Chrome Web Audio API の最適化設定
- macOSのGPUアクセラレーション活用
- Chrome向け動画再生の最適化
- Retina/高DPIディスプレイへの対応
- macOSネイティブフォントの活用

## ライセンス

MIT