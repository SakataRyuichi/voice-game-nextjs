import { useState, useEffect, useCallback } from 'react';
import { config } from '../config/environment';

export function useAudioLevel(threshold = -40) {
  const [audioLevel, setAudioLevel] = useState(0);
  const [isAboveThreshold, setIsAboveThreshold] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [microphone, setMicrophone] = useState<MediaStreamAudioSourceNode | null>(null);
  
  // クライアントサイドでのみ実行されるようにする
  const isBrowser = typeof window !== 'undefined';
  
  const startListening = useCallback(async () => {
    // サーバーサイドでは実行しない
    if (!isBrowser) return;
    
    try {
      // Chrome特化のAudioContext設定
      const context = new (window.AudioContext || (window as any).webkitAudioContext)(
        config.audioContextOptions as AudioContextOptions
      );
      
      // Chrome特化のAnalyserNode設定
      const analyserNode = context.createAnalyser();
      analyserNode.fftSize = 1024; // より精度の高いFFTサイズ (Chromeで効率的)
      analyserNode.smoothingTimeConstant = 0.8; // 平滑化 (Macでの視覚的安定性向上)
      
      // Chrome特化のメディアストリーム設定
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: false, // より精度の高いdB測定のため
        } 
      });
      
      const source = context.createMediaStreamSource(stream);
      source.connect(analyserNode);
      
      setAudioContext(context);
      setAnalyser(analyserNode);
      setMicrophone(source);
      
      // Chrome最適化: Float32Array使用でより高精度な計算
      const dataArray = new Float32Array(analyserNode.frequencyBinCount);
      
      const checkAudioLevel = () => {
        // Chrome特化: getFloatTimeDomainDataで時間領域データを取得
        analyserNode.getFloatTimeDomainData(dataArray);
        
        // RMS (二乗平均平方根) 計算でより正確なレベル測定
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i] * dataArray[i];
        }
        const rms = Math.sqrt(sum / dataArray.length);
        
        // dB変換 (20 * log10(x))
        // ChromeのWeb Audio APIで一般的な参照レベル 1.0 を使用
        const dB = 20 * Math.log10(Math.max(rms, 0.0000001));
        
        setAudioLevel(dB);
        setIsAboveThreshold(dB > threshold);
        
        // Chrome特化: requestAnimationFrame最適化
        requestAnimationFrame(checkAudioLevel);
      };
      
      checkAudioLevel();
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  }, [threshold, isBrowser]);
  
  const stopListening = useCallback(() => {
    if (!isBrowser) return;
    
    if (microphone && audioContext) {
      microphone.disconnect();
      audioContext.close();
      setMicrophone(null);
      setAudioContext(null);
      setAnalyser(null);
    }
  }, [microphone, audioContext, isBrowser]);
  
  useEffect(() => {
    if (!isBrowser) return;
    
    return () => {
      stopListening();
    };
  }, [stopListening, isBrowser]);
  
  return { audioLevel, isAboveThreshold, startListening, stopListening };
}