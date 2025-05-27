import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  const isPublicAsset = request.nextUrl.pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js)$/);
  
  // Se o usuário estiver acessando um recurso público (imagens, css, js), permite o acesso
  if (isPublicAsset) {
    return NextResponse.next();
  }
  
  // Se o usuário não estiver autenticado e não estiver em uma página de autenticação,
  // redireciona para a página de login
  if (!token && !isAuthPage) {
    // Armazena a URL original para redirecionar de volta após o login
    const url = new URL('/auth/login', request.url);
    
    // Se não for a raiz, adiciona o caminho original como parâmetro para redirecionamento pós-login
    if (request.nextUrl.pathname !== '/') {
      url.searchParams.set('redirect', request.nextUrl.pathname);
    }
    
    return NextResponse.redirect(url);
  }

  // Se o usuário estiver autenticado e tentar acessar uma página de autenticação,
  // redireciona para a página de tarefas
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/tarefas', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 