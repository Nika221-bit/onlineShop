import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { catchError, finalize, of, switchMap, throwError } from 'rxjs';
import { AuthService, UserProfile } from '../auth.service';

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
  private readonly router = inject(Router);

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

    this.authService
      .signIn(this.form.getRawValue())
      .pipe(
        switchMap((response) => {
          const token = response.access_token ?? response.token;
          if (!token) {
            return throwError(() => new Error('Sign in response did not include an access token.'));
          }

          const fallbackUser =
            response.user ??
            (token ? this.authService.getUserFromToken(token) : null) ??
            ({ email: this.form.controls.email.value } satisfies UserProfile);

          this.authService.setAuth(token, fallbackUser, response.refresh_token);

          return this.authService.getCurrentUser().pipe(catchError(() => of(fallbackUser)));
        }),
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe({
        next: () => {
          this.successMessage = 'You are signed in successfully.';
          void this.router.navigate(['/profile']);
        },
        error: (error: unknown) => {
          this.errorMessage = this.getErrorMessage(error, 'Sign in failed. Check your email and password.');
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
