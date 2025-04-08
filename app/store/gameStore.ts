import { create } from 'zustand';

type GameState = 'idle' | 'countdown' | 'listening' | 'processing' | 'result';

interface GameStore {
  gameState: GameState;
  countdown: number;
  result: number | null;
  setGameState: (state: GameState) => void;
  setCountdown: (count: number) => void;
  setResult: (result: number | null) => void;
  startGame: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  gameState: 'idle',
  countdown: 3,
  result: null,
  
  setGameState: (state) => set({ gameState: state }),
  setCountdown: (count) => set({ countdown: count }),
  setResult: (result) => set({ result }),
  
  startGame: () => {
    set({ gameState: 'countdown', countdown: 3, result: null });
    
    // カウントダウン処理
    const interval = setInterval(() => {
      set((state) => {
        const newCount = state.countdown - 1;
        
        if (newCount <= 0) {
          clearInterval(interval);
          return { countdown: 0, gameState: 'listening' };
        }
        
        return { countdown: newCount };
      });
    }, 1000);
  },
  
  resetGame: () => set({ gameState: 'idle', countdown: 3, result: null }),
}));