// 비정상적 접근 시 접근제한

// import { NextRequest, NextResponse } from 'next/server';

// export function middleware(request: NextRequest) {
//   // 개발 환경 인증검사 제외
//   if (process.env.NODE_ENV === 'development') {
//     return NextResponse.next();
//   }

//   const refreshToken = request.cookies.get('refreshToken')?.value;
//   const authPaths = ['/projects', '/my-calendar', '/mypage']; // 접근불가 페이지
//   const path = request.nextUrl.pathname;

//   if (authPaths.some((p) => path.startsWith(p)) && !refreshToken) {
//     return NextResponse.redirect(new URL('/auth/login', request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|favicon.ico|auth/login|auth/signup|images).*)'],
// };
