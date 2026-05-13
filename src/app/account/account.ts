import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { AuthService } from './auth.service';

interface SignInPayload {
  email: string;
  password: string;
}

interface SignUpPayload {
  email: string;
  password: string;
  fullName: string;
}

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './account.html',
  styleUrls: ['./account.scss'],
})
export class Account implements OnInit {
  activeTab: 'signIn' | 'signUp' = 'signIn';
  loading = false;
  successMessage = '';
  errorMessage = '';

  signInModel: SignInPayload = {
    email: '',
    password: '',
  };

  signUpModel: SignUpPayload = {
    email: '',
    password: '',
    fullName: '',
  };

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.resetMessages();
  }

  switchTab(tab: 'signIn' | 'signUp'): void {
    this.activeTab = tab;
    this.resetMessages();
  }

  resetMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  submitSignIn(): void {
    this.resetMessages();
    this.loading = true;

    this.authService.signIn(this.signInModel)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response) => {
          console.log('Sign in payload:', this.signInModel);
          console.log('Sign in response:', response);
          this.successMessage = response.message || 'Signed in successfully.';
          if (response.token) {
            localStorage.setItem('authToken', response.token);
          }
        },
        error: (error) => {
          console.error('Sign in failed:', error);
          this.errorMessage = this.parseError(error) || 'Sign in failed. Check your credentials.';
        },
      });
  }

  submitSignUp(): void {
    this.resetMessages();
    this.loading = true;
    const payload = this.buildSignUpPayload();
    console.log('Sign up payload:', payload);

    this.authService.signUp(payload)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response) => {
          console.log('Sign up response:', response);
          this.successMessage = response.message || 'Registration completed successfully.';
          this.activeTab = 'signIn';
          this.signInModel.email = this.signUpModel.email;
          this.signInModel.password = this.signUpModel.password;
          this.signUpModel = { email: '', password: '', fullName: '' };
        },
        error: (error) => {
          console.error('Sign up failed:', error);
          this.errorMessage = this.parseError(error) || 'Registration failed. Please try again.';
        },
      });
  }

  private buildSignUpPayload() {
    const [firstName, ...rest] = this.signUpModel.fullName.trim().split(/\s+/);
    const lastName = rest.length ? rest.join(' ') : firstName;
    return {
      email: this.signUpModel.email,
      password: this.signUpModel.password,
      full_name: this.signUpModel.fullName,
      name: this.signUpModel.fullName,
      firstName,
      lastName,
      age: 18,
      address: 'Unknown',
      phone: '0000000000',
      zipCode: '00000',
      avatar: '',
      gender: 'MALE',
    };
  }

  private parseError(error: unknown): string {
    const err = error as { error?: any };
    if (err?.error) {
      if (typeof err.error === 'string') {
        return err.error;
      }
      if (err.error.message) {
        return err.error.message;
      }
      if (err.error.errors) {
        return JSON.stringify(err.error.errors);
      }
      return JSON.stringify(err.error);
    }
    return 'Unknown error occurred.';
  }
}


