import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

const DEFAULT_AVATAR_URL = 'https://api.dicebear.com/7.x/pixel-art/svg?seed=OnlineShop';
const PHONE_INPUT_PATTERN = /^[+\d\s\-()]{8,20}$/;
const PHONE_API_PATTERN = /^\+\d{8,15}$/;

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss',
})
export class SignUp {
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);

  readonly form = this.formBuilder.nonNullable.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    age: [18, [Validators.required, Validators.min(13), Validators.max(120)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    address: ['', [Validators.required, Validators.minLength(4)]],
    phone: ['', [Validators.required, Validators.pattern(PHONE_INPUT_PATTERN)]],
    zipcode: ['', [Validators.required, Validators.minLength(3)]],
    avatar: [''],
    gender: ['MALE' as 'MALE' | 'FEMALE' | 'OTHER', [Validators.required]],
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

    const rawValue = this.form.getRawValue();
    const normalizedPhone = this.normalizePhone(rawValue.phone);

    if (!PHONE_API_PATTERN.test(normalizedPhone)) {
      this.errorMessage = 'Phone must be in international format, for example +995599123456.';
      this.loading = false;
      return;
    }

    const payload = {
      firstName: rawValue.firstName.trim(),
      lastName: rawValue.lastName.trim(),
      age: Number(rawValue.age),
      email: rawValue.email.trim(),
      password: rawValue.password,
      address: rawValue.address.trim(),
      phone: normalizedPhone,
      zipcode: rawValue.zipcode.trim(),
      avatar: rawValue.avatar.trim() || DEFAULT_AVATAR_URL,
      gender: rawValue.gender,
    };

    this.authService.signUp(payload).subscribe({
      next: () => {
        this.successMessage = 'Account created. Verify your email, then sign in to open your profile.';
        this.form.reset({
          firstName: '',
          lastName: '',
          age: 18,
          email: '',
          password: '',
          address: '',
          phone: '',
          zipcode: '',
          avatar: '',
          gender: 'MALE',
        });
        this.loading = false;
      },
      error: (error: unknown) => {
        this.errorMessage = this.getErrorMessage(error, 'Registration failed. Please check the fields and try again.');
        this.loading = false;
      },
    });
  }

  private normalizePhone(phone: string): string {
    const cleanedPhone = phone.replace(/[\s\-()]/g, '').trim();

    if (/^00\d+$/.test(cleanedPhone)) {
      return `+${cleanedPhone.slice(2)}`;
    }

    if (/^5\d{8}$/.test(cleanedPhone)) {
      return `+995${cleanedPhone}`;
    }

    return cleanedPhone;
  }

  private getErrorMessage(error: unknown, fallback: string): string {
    if (typeof error === 'object' && error !== null && 'error' in error) {
      const httpError = error as {
        error?: { message?: string; error?: string; errorKeys?: string[] } | string;
        message?: string;
      };
      if (typeof httpError.error === 'string') {
        return httpError.error;
      }
      if (httpError.error?.errorKeys?.length) {
        return this.mapErrorKeys(httpError.error.errorKeys);
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

  private mapErrorKeys(errorKeys: string[]): string {
    const knownMessages: Record<string, string> = {
      'errors.invalid_phone_number': 'Phone must be in international format, for example +995599123456.',
      'errors.invalid_avatar': 'Avatar must be a valid image URL. Leave it empty to use the default avatar.',
      'errors.email_already_exists': 'This email is already registered.',
      'errors.invalid_email': 'Email format is invalid.',
    };

    return errorKeys.map((key) => knownMessages[key] ?? key).join(' ');
  }
}
