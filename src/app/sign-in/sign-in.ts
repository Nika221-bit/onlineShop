import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.scss',
})
export class SignIn {
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);

  readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  loading = false;
  successMessage = '';
  errorMessage = '';

  submit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.authService.signIn(this.form.getRawValue()).subscribe({
      next: (response) => {
        const token = response.access_token ?? response.token;
        const user = response.user ?? (token ? this.authService.getUserFromToken(token) : null);

        if (token) {
          this.authService.setAuth(token, user ?? { email: this.form.controls.email.value }, response.refresh_token);
        }

        this.successMessage = 'You are signed in successfully.';
        this.loading = false;
      },
      error: (error: unknown) => {
        this.errorMessage = this.getErrorMessage(error, 'Sign in failed. Check your email and password.');
        this.loading = false;
      },
    });
  }

  private getErrorMessage(error: unknown, fallback: string): string {
    if (typeof error === 'object' && error !== null && 'error' in error) {
      const httpError = error as { error?: { message?: string; error?: string } | string; message?: string };
      if (typeof httpError.error === 'string') {
        return httpError.error;
      }
      if (httpError.error?.message) {
        return httpError.error.message;
      }
      if (httpError.error?.error) {
        return httpError.error.error;
      }
      if (httpError.message) {
        return httpError.message;
      }
    }

    return fallback;
  }
}
