import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { User, LoginRequest, AuthResponse } from '../models/user.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly router = inject(Router);

  // Signal State
  currentUser = signal<User | null>(this.getStoredUser());

  // Computed Roles
  isLoggedIn = computed(() => !!this.currentUser());
  isAdmin = computed(() => this.currentUser()?.role === 'admin');
  isDoctor = computed(() => this.currentUser()?.role === 'doctor');

  private getStoredUser(): User | null {
    try {
      const stored = localStorage.getItem('vexa_user');
      return stored ? (JSON.parse(stored) as User) : null;
    } catch {
      return null;
    }
  }

  login(credentials: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    const email = credentials.email.toLowerCase().trim();
    const role = credentials.role || (email.includes('doctor') ? 'doctor' : 'admin');

    let mockUser: User;

    if (role === 'doctor' || email.includes('doctor')) {
      mockUser = {
        id: 'usr-doc-1',
        email: credentials.email,
        name: 'Dr. Sarah Mansour',
        role: 'doctor',
        organizationId: 'org-1',
        doctorId: 'doc-1',
        avatarUrl: '👨‍⚕️'
      };
    } else {
      mockUser = {
        id: 'usr-admin-1',
        email: credentials.email,
        name: 'El Shorouk Hospital Admin',
        role: 'admin',
        organizationId: 'org-1',
        avatarUrl: '🏥'
      };
    }

    const authResp: AuthResponse = {
      token: `vexa_jwt_token_${Date.now()}`,
      user: mockUser
    };

    localStorage.setItem('vexa_token', authResp.token);
    localStorage.setItem('vexa_user', JSON.stringify(mockUser));
    this.currentUser.set(mockUser);

    return of({
      success: true,
      message: 'Logged in successfully',
      data: authResp,
      timestamp: new Date().toISOString()
    });
  }

  logout(): void {
    localStorage.removeItem('vexa_token');
    localStorage.removeItem('vexa_user');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }
}
