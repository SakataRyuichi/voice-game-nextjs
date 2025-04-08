import { useEffect, useRef } from 'react';

interface VideoOptimizationProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  src: string;
  autoplay?: boolean;
  preload?: 'auto' | 'metadata' | 'none';
}

export function useVideoOptimization({ videoRef, src, autoplay = true, preload = 'auto' }: VideoOptimizationProps) {
  // Chrome特化のハードウェアアクセラレーション設定
  useEffect(() => {
    if (!videoRef.current || !src) return;
    
    const video = videoRef.current;
    
    // ソース設定
    video.src = src;
    
    // Mac Chrome特化の設定
    // 1. requestVideoFrameCallback: Chromeのみの機能で、フレーム描画タイミングの最適化
    if ('requestVideoFrameCallback' in HTMLVideoElement.prototype) {
      (video as any).requestVideoFrameCallback(() => {
        console.log('Video frame callback available - optimized rendering');
      });
    }
    
    // 2. Mac特化の再生調整
    video.playsInline = true; // iOSから移植されたMac Safari互換性
    
    // 3. Chrome特化のハードウェアアクセラレーション
    video.style.transform = 'translateZ(0)'; // GPUアクセラレーション強制
    
    // 4. Chrome特化の再生設定
    if (autoplay) {
      // Chromeポリシー対応: ミュート状態での自動再生
      video.muted = true;
      video.autoplay = true;
      
      // Chromeの自動再生ポリシー対策
      const attemptPlay = () => {
        video.play().catch(error => {
          console.warn('Autoplay prevented:', error);
        });
      };
      
      // ユーザーインタラクション後に再生
      document.addEventListener('click', attemptPlay, { once: true });
    }
    
    // Chrome特化のプリロード
    if (preload === 'auto') {
      video.preload = 'auto';
      video.load(); // 明示的なロード開始
    }
  }, [videoRef, src, autoplay, preload]);
}