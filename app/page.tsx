'use client';

import Game from './components/Game';
import ClientOnly from './components/ClientOnly';

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <ClientOnly>
        <Game />
      </ClientOnly>
    </main>
  );
}