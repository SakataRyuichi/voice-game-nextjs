import { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  audioLevel: number;
}

export default function AudioVisualizer({ audioLevel }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Chrome特化のキャンバスベース可視化
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Chrome最適化: devicePixelRatio対応
    const dpr = window.devicePixelRatio || 1;
    const ctx = canvas.getContext('2d')!;
    
    // Retina対応
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);
    
    // 描画領域のクリア
    const drawVisualization = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      
      // 背景クリア
      ctx.clearRect(0, 0, width, height);
      
      // dB値を0-1の範囲に正規化（-60dB〜0dBの範囲を想定）
      const normalizedLevel = Math.max(0, Math.min(1, (audioLevel + 60) / 60));
      
      // 中央の円
      const centerX = width / 2;
      const centerY = height / 2;
      const maxRadius = Math.min(width, height) * 0.4;
      
      // 外側の静的な円
      ctx.beginPath();
      ctx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // 動的な内側の円
      const dynamicRadius = maxRadius * normalizedLevel;
      ctx.beginPath();
      ctx.arc(centerX, centerY, dynamicRadius, 0, Math.PI * 2);
      
      // グラデーション (Chrome GPUアクセラレーション最適化)
      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, dynamicRadius
      );
      gradient.addColorStop(0, 'rgba(66, 153, 225, 0.8)');
      gradient.addColorStop(1, 'rgba(49, 130, 206, 0.2)');
      
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // dB値表示
      ctx.fillStyle = 'white';
      ctx.font = '14px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${audioLevel.toFixed(1)} dB`, centerX, height - 20);
      
      // Chrome最適化: 次のフレームをリクエスト
      requestAnimationFrame(drawVisualization);
    };
    
    const animationId = requestAnimationFrame(drawVisualization);
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [audioLevel]);
  
  return (
    <div className="relative w-64 h-64">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full" 
        style={{ display: 'block' }}
      />
    </div>
  );
}