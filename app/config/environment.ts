export const isLocalEnvironment = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

// Chrome・Mac特化の設定
export const config = {
  // 動画フォーマット (Chrome/Macで最適な形式)
  preferredVideoFormat: 'mp4', // Chrome/Macでの互換性が高い
  
  // Chrome特化のWeb Audio API設定
  audioContextOptions: {
    // Chromeでの低遅延オプション
    latencyHint: 'interactive',
    sampleRate: 48000, // Macでの標準サンプルレート
  },
  
  // 動画ファイルのベースパス
  videoBasePath: isLocalEnvironment 
    ? '/videos/' 
    : 'https://your-cloudfront-distribution.cloudfront.net/videos/',
};