import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn() && authService.isAdmin()) {
    return true;
  }

  router.navigate(['/login'], { queryParams: { returnUrl: '/admin', targetRole: 'admin' } });
  return false;
};

export const doctorGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn() && authService.isDoctor()) {
    return true;
  }

  router.navigate(['/login'], { queryParams: { returnUrl: '/doctor-portal', targetRole: 'doctor' } });
  return false;
};
