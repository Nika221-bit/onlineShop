import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export type UserGender = 'MALE' | 'FEMALE' | 'OTHER';

export interface SignUpData {
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  password: string;
  address: string;
  phone: string;
  zipcode: string;
  avatar: string;
  gender: UserGender;
}

export type ProfileUpdateData = Omit<SignUpData, 'password'>;

interface SignInData {
  email: string;
  password: string;
}

interface AuthResponse {
  token?: string;
  access_token?: string;
  refresh_token?: string;
  user?: UserProfile;
  [key: string]: unknown;
}

export interface UserProfile {
  _id?: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  email: string;
  address?: string;
  role?: string;
  zipcode?: string;
  avatar?: string;
  gender?: UserGender | string;
  phone?: string;
  verified?: boolean;
  cartID?: string;
  chatIds?: string[];
  iat?: number;
  exp?: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://api.everrest.educata.dev/auth';
  private currentUserSubject = new BehaviorSubject<UserProfile | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const user = localStorage.getItem('currentUser');
    const token = localStorage.getItem('token');
    if (user && token) {
      try {
        this.currentUserSubject.next(JSON.parse(user) as UserProfile);
      } catch {
        this.clearAuth();
      }
    }
  }

  signUp(data: SignUpData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/sign_up`, data);
  }

  signIn(data: SignInData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/sign_in`, data);
  }

  signOut(): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/sign_out`, {}).pipe(tap(() => this.clearAuth()));
  }

  getCurrentUser(): Observable<UserProfile> {
    return this.http.get<UserProfile>(this.apiUrl).pipe(tap((user) => this.setCurrentUser(user)));
  }

  updateProfile(data: ProfileUpdateData): Observable<UserProfile> {
    return this.http.patch<UserProfile>(`${this.apiUrl}/update`, data).pipe(tap((user) => this.setCurrentUser(user)));
  }

  setAuth(token: string, user: UserProfile, refreshToken?: string): void {
    localStorage.setItem('token', token);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    this.setCurrentUser(user);
  }

  setCurrentUser(user: UserProfile): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  getCurrentUserSnapshot(): UserProfile | null {
    return this.currentUserSubject.value;
  }

  clearAuth(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserFromToken(token: string): UserProfile | null {
    try {
      const payload = token.split('.')[1];
      if (!payload) {
        return null;
      }

      const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
      const padding = (4 - (normalized.length % 4)) % 4;
      const decoded = atob(normalized.padEnd(normalized.length + padding, '='));
      const parsedPayload = JSON.parse(decoded) as Partial<UserProfile>;

      return parsedPayload.email ? (parsedPayload as UserProfile) : null;
    } catch {
      return null;
    }
  }

  verifyEmail(email: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/verify_email`, { email });
  }

  refreshToken(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, {});
  }
}
