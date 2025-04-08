/**
 * MediaSessionAPIをサポートする環境で初期化を行うヘルパー関数
 */
export function initializeMediaSession() {
  // クライアントサイドでのみ実行
  if (typeof window === 'undefined' || !('mediaSession' in navigator)) return;

  try {
    // メディアセッションの基本情報を設定
    navigator.mediaSession.metadata = new MediaMetadata({
      title: 'Voice Game',
      artist: 'Interactive Voice Application',
      album: 'Voice Game App',
      artwork: [
        { src: '/favicon.ico', sizes: '16x16', type: 'image/x-icon' }
      ]
    });

    // 安全なアクションハンドラー登録
    const safelyRegisterHandler = (action: string, handler: () => void) => {
      try {
        if (navigator.mediaSession && 'setActionHandler' in navigator.mediaSession) {
          // @ts-ignore - アクションタイプの検証を無視
          navigator.mediaSession.setActionHandler(action, handler);
        }
      } catch (error) {
        console.log(`MediaSession action '${action}' is not supported`);
      }
    };

    // サポートされている可能性のあるアクションハンドラーを登録
    safelyRegisterHandler('play', () => {
      console.log('MediaSession: play requested');
    });
    
    safelyRegisterHandler('pause', () => {
      console.log('MediaSession: pause requested');
    });
    
    safelyRegisterHandler('stop', () => {
      console.log('MediaSession: stop requested');
    });
    
    safelyRegisterHandler('seekbackward', () => {
      console.log('MediaSession: seek backward requested');
    });
    
    safelyRegisterHandler('seekforward', () => {
      console.log('MediaSession: seek forward requested');
    });
    
    safelyRegisterHandler('previoustrack', () => {
      console.log('MediaSession: previous track requested');
    });
    
    safelyRegisterHandler('nexttrack', () => {
      console.log('MediaSession: next track requested');
    });
    
  } catch (error) {
    console.log('MediaSession API not fully supported in this browser');
  }
}