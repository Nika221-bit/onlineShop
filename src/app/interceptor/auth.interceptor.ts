import { HttpInterceptorFn } from '@angular/common/http';

const API_ORIGIN = 'https://api.everrest.educata.dev';
const PUBLIC_AUTH_PATHS = ['/auth/sign_in', '/auth/sign_up', '/auth/verify_email'];

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
  const isApiRequest = request.url.startsWith(API_ORIGIN);
  const isPublicAuthRequest = PUBLIC_AUTH_PATHS.some((path) => request.url.includes(path));

  if (!token || !isApiRequest || isPublicAuthRequest) {
    return next(request);
  }

  return next(
    request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    }),
  );
};
