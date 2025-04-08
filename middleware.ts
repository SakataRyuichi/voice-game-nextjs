import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// このミドルウェアはNext.jsのルートで実行され、すべてのリクエストに対して処理を行います
export function middleware(request: NextRequest) {
  // 既存の応答を修正して返す
  const response = NextResponse.next();
  
  // Content Security Policyヘッダーを追加して、特定のブラウザAPIの警告を防止
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; media-src 'self' blob:; img-src 'self' data:;"
  );
  
  return response;
}

// 以下のパスに対してのみミドルウェアを実行（パスを指定しない場合はすべてのルートに適用）
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
