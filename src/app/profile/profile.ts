import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, ProfileUpdateData, UserGender, UserProfile } from '../auth.service';

const DEFAULT_AVATAR_URL = 'https://api.dicebear.com/7.x/pixel-art/svg?seed=OnlineShop';
const PHONE_INPUT_PATTERN = /^[+\d\s\-()]{8,20}$/;
const PHONE_API_PATTERN = /^\+\d{8,15}$/;

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly fallbackAvatarUrl = DEFAULT_AVATAR_URL;
  readonly form = this.formBuilder.nonNullable.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    age: [18, [Validators.required, Validators.min(13), Validators.max(120)]],
    email: ['', [Validators.required, Validators.email]],
    address: ['', [Validators.required, Validators.minLength(4)]],
    phone: ['', [Validators.required, Validators.pattern(PHONE_INPUT_PATTERN)]],
    zipcode: ['', [Validators.required, Validators.minLength(3)]],
    avatar: [''],
    gender: ['MALE' as UserGender, [Validators.required]],
  });

  user: UserProfile | null = null;
  loading = false;
  saving = false;
  signOutLoading = false;
  successMessage = '';
  errorMessage = '';

  ngOnInit(): void {
    this.user = this.authService.getCurrentUserSnapshot();

    if (this.user) {
      this.patchForm(this.user);
    }

    if (this.hasSession) {
      this.loadProfile();
    }
  }

  get hasSession(): boolean {
    return !!this.authService.getToken();
  }

  loadProfile(): void {
    this.successMessage = '';
    this.loading = true;

    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.user = user;
        this.patchForm(user);
        this.loading = false;
      },
      error: (error: unknown) => {
        this.errorMessage = this.getErrorMessage(
          error,
          this.user
            ? 'Could not refresh the profile. Verify your email if this account was just created.'
            : 'Sign in again to open your profile.',
        );
        this.loading = false;
      },
    });
  }

  save(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.hasSession) {
      this.errorMessage = 'Sign in to update your profile.';
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.buildPayload();
    if (!PHONE_API_PATTERN.test(payload.phone)) {
      this.errorMessage = 'Phone must be in international format, for example +995599123456.';
      return;
    }

    this.saving = true;

    this.authService.updateProfile(payload).subscribe({
      next: (user) => {
        this.user = user;
        this.patchForm(user);
        this.successMessage = 'Profile updated successfully.';
        this.saving = false;
      },
      error: (error: unknown) => {
        this.errorMessage = this.getErrorMessage(error, 'Could not update profile.');
        this.saving = false;
      },
    });
  }

  signOut(): void {
    this.signOutLoading = true;

    this.authService.signOut().subscribe({
      next: () => {
        this.signOutLoading = false;
        void this.router.navigate(['/sign-in']);
      },
      error: () => {
        this.authService.clearAuth();
        this.signOutLoading = false;
        void this.router.navigate(['/sign-in']);
      },
    });
  }

  displayName(user: UserProfile): string {
    const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
    return fullName || user.email;
  }

  private buildPayload(): ProfileUpdateData {
    const rawValue = this.form.getRawValue();

    return {
      firstName: rawValue.firstName.trim(),
      lastName: rawValue.lastName.trim(),
      age: Number(rawValue.age),
      email: rawValue.email.trim(),
      address: rawValue.address.trim(),
      phone: this.normalizePhone(rawValue.phone),
      zipcode: rawValue.zipcode.trim(),
      avatar: rawValue.avatar.trim() || DEFAULT_AVATAR_URL,
      gender: rawValue.gender,
    };
  }

  private patchForm(user: UserProfile): void {
    this.form.patchValue({
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      age: user.age ?? 18,
      email: user.email ?? '',
      address: user.address ?? '',
      phone: user.phone ?? '',
      zipcode: user.zipcode ?? '',
      avatar: user.avatar ?? '',
      gender: this.isKnownGender(user.gender) ? user.gender : 'OTHER',
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

  private isKnownGender(gender: UserProfile['gender']): gender is UserGender {
    return gender === 'MALE' || gender === 'FEMALE' || gender === 'OTHER';
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
      'errors.invalid_email': 'Email format is invalid.',
    };

    return errorKeys.map((key) => knownMessages[key] ?? key).join(' ');
  }
}
