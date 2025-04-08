import { useEffect, useState, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { useAudioLevel } from '../hooks/useAudioLevel';
import { useVideoOptimization } from '../hooks/useVideoOptimization';
import { determineResult } from '../lib/utils/lottery';
import AudioVisualizer from './AudioVisualizer';
import { motion } from 'framer-motion';

// 結果IDと動画ファイル名のマッピング
const RESULT_VIDEOS = {
  1: 'result1.mp4',
  2: 'result2.mp4',
  3: 'result3.mp4',
  4: 'result4.mp4',
  5: 'result5.mp4',
  6: 'result6.mp4',
  7: 'result7.mp4',
  8: 'result8.mp4',
  9: 'result9.mp4',
  10: 'result10.mp4',
  11: 'result11.mp4',
  12: 'result12.mp4',
  13: 'result13.mp4',
  14: 'result14.mp4',
  15: 'result15.mp4',
  16: 'result16.mp4',
  17: 'result17.mp4',
  18: 'result18.mp4',
  19: 'result19.mp4',
  20: 'result20.mp4',
};

export default function Game() {
  const { gameState, countdown, result, startGame, setGameState, setResult, resetGame } = useGameStore();
  const { audioLevel, isAboveThreshold, startListening, stopListening } = useAudioLevel(-40); // -40dBの閾値
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Chrome特化の動画最適化
  const videoPath = currentVideo ? `/videos/${currentVideo}` : '';
  useVideoOptimization({ 
    videoRef, 
    src: videoPath,
    autoplay: gameState === 'result'
  });
  
  // ゲーム状態に応じた処理
  useEffect(() => {
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
  }, [gameState, isAboveThreshold, startListening, stopListening, setGameState, setResult, resetGame]);

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
          <video
            ref={videoRef}
            className="w-full h-full rounded-lg object-cover"
            playsInline
            onEnded={() => resetGame()}
          />
          
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