import { useEffect, useState, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { useAudioLevel } from '../hooks/useAudioLevel';
import { useVideoOptimization } from '../hooks/useVideoOptimization';
import { determineResult } from '../lib/utils/lottery';
import { initializeMediaSession } from '../utils/mediaSession';
import AudioVisualizer from './AudioVisualizer';
import { motion } from 'framer-motion';

// 結果IDと動画ファイル名のマッピング
const RESULT_VIDEOS = {
  1: 'result1.mov',
  2: 'result2.mov',
  3: 'result3.mov',
  4: 'result1.mov',
  5: 'result2.mov',
  6: 'result3.mov',
  7: 'result1.mov',
  8: 'result2.mov',
  9: 'result3.mov',
  10: 'result1.mov',
  11: 'result2.mov',
  12: 'result3.mov',
  13: 'result1.mov',
  14: 'result2.mov',
  15: 'result3.mov',
  16: 'result1.mov',
  17: 'result2.mov',
  18: 'result3.mov',
  19: 'result1.mov',
  20: 'result2.mov',
};

export default function Game() {
  const { gameState, countdown, result, startGame, setGameState, setResult, resetGame } = useGameStore();
  const { audioLevel, isAboveThreshold, startListening, stopListening } = useAudioLevel(-40); // -40dBの閾値
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // クライアントサイドでのみ実行されるようにする
  const isBrowser = typeof window !== 'undefined';
  
  // MediaSession APIの初期化
  useEffect(() => {
    if (isBrowser) {
      initializeMediaSession();
    }
  }, [isBrowser]);
  
  // Chrome特化の動画最適化
  const videoPath = currentVideo ? `/videos/${currentVideo}` : '';
  useVideoOptimization({ 
    videoRef, 
    src: videoPath,
    autoplay: gameState === 'result'
  });
  
  // ゲーム状態に応じた処理
  useEffect(() => {
    if (!isBrowser) return; // サーバーサイドでは実行しない
    
    if (gameState === 'listening') {
      startListening();
      
      // 音声検出後の処理
      if (isAboveThreshold) {
        setGameState('processing');
        stopListening();
        
        // 結果決定と動画再生
        const gameResult = determineResult();
        setResult(gameResult);
        
        // 少し遅延をもたせて動画再生（演出のため）
        setTimeout(() => {
          setCurrentVideo(RESULT_VIDEOS[gameResult as keyof typeof RESULT_VIDEOS]);
          setGameState('result');
        }, 1000);
      }
    }
    
    // 結果表示後、一定時間でリセット
    if (gameState === 'result') {
      const timer = setTimeout(() => {
        resetGame();
        setCurrentVideo(null);
      }, 10000); // 10秒後にリセット
      
      return () => clearTimeout(timer);
    }
  }, [gameState, isAboveThreshold, startListening, stopListening, setGameState, setResult, resetGame, isBrowser]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-900 text-white">
      {/* アイドル状態 - スタート画面 */}
      {gameState === 'idle' && (
        <motion.button
          className="px-8 py-4 bg-blue-600 text-white rounded-lg text-xl font-bold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startGame}
        >
          スタート
        </motion.button>
      )}
      
      {/* カウントダウン */}
      {gameState === 'countdown' && (
        <motion.div
          className="text-8xl font-bold"
          key={countdown}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.5, opacity: 0 }}
        >
          {countdown === 0 ? 'スタート！' : countdown}
        </motion.div>
      )}
      
      {/* 音声入力待機中 */}
      {gameState === 'listening' && (
        <div className="flex flex-col items-center">
          <div className="text-2xl mb-4">声を出してください！</div>
          <AudioVisualizer audioLevel={audioLevel} />
        </div>
      )}
      
      {/* 処理中 */}
      {gameState === 'processing' && (
        <motion.div
          className="text-2xl"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          処理中...
        </motion.div>
      )}
      
      {/* 結果表示 */}
      {gameState === 'result' && currentVideo && (
        <div className="w-full max-w-4xl aspect-video relative">
          {isBrowser && (
            <video
              ref={videoRef}
              className="w-full h-full rounded-lg object-cover"
              playsInline
              onEnded={() => resetGame()}
            />
          )}
          
          {result && (
            <motion.div
              className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 px-8 py-4 rounded-lg text-2xl font-bold text-black"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              {result === 1 ? '大当たり！' : `結果: ${result}`}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}