import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Buscamos el token en la bóveda del navegador
  const token = localStorage.getItem('wasipet_token'); // Asegúrate de que este nombre coincida con cómo lo guardaste en tu auth.service

  // Si hay token, clonamos la petición y le pegamos el encabezado de Autorización
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(clonedRequest);
  }

  // Si no hay token (ej. al hacer login), la dejamos pasar normal
  return next(req);
};
