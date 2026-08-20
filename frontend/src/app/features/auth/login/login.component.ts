import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  selectedRole = signal<UserRole>('admin');
  isLoading = signal(false);
  loginError = signal<string | null>(null);

  loginForm: FormGroup = this.fb.group({
    email: ['admin@vexa.com', [Validators.required, Validators.email]],
    password: ['admin123', [Validators.required, Validators.minLength(4)]]
  });

  ngOnInit(): void {
    // Read query params for targetRole
    this.route.queryParams.subscribe(params => {
      if (params['targetRole'] === 'doctor') {
        this.selectRole('doctor');
      } else if (params['targetRole'] === 'admin') {
        this.selectRole('admin');
      }
    });

    // If already logged in, redirect to respective dashboard
    if (this.authService.isLoggedIn()) {
      if (this.authService.isDoctor()) {
        this.router.navigate(['/doctor-portal']);
      } else {
        this.router.navigate(['/admin']);
      }
    }
  }

  selectRole(role: UserRole): void {
    this.selectedRole.set(role);
    this.loginError.set(null);

    if (role === 'doctor') {
      this.loginForm.patchValue({
        email: 'doctor@vexa.com',
        password: 'doctor123'
      });
    } else {
      this.loginForm.patchValue({
        email: 'admin@vexa.com',
        password: 'admin123'
      });
    }
  }

  quickDemoAdmin(): void {
    this.selectRole('admin');
    this.onSubmit();
  }

  quickDemoDoctor(): void {
    this.selectRole('doctor');
    this.onSubmit();
  }

  onSubmit(): void {
    if (this.loginForm.invalid || this.isLoading()) return;

    this.isLoading.set(true);
    this.loginError.set(null);

    const val = this.loginForm.value;

    this.authService.login({
      email: val.email,
      password: val.password,
      role: this.selectedRole()
    }).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.success && res.data) {
          const user = res.data.user;
          if (user.role === 'doctor') {
            this.router.navigate(['/doctor-portal']);
          } else {
            this.router.navigate(['/admin']);
          }
        } else {
          this.loginError.set('Invalid credentials. Please check your email and password.');
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.loginError.set('Unable to authenticate. Please try again.');
      }
    });
  }
}
