'use client';

import React, { useState, useEffect } from 'react';

interface ClientOnlyProps {
  children: React.ReactNode;
}

/**
 * クライアントサイドでのみレンダリングするためのラッパーコンポーネント
 * サーバーサイドレンダリング中は何も表示せず、
 * クライアントサイドでのハイドレーション後に子コンポーネントを表示します
 */
export default function ClientOnly({ children }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
}
