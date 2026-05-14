import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

interface SignUpData {
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  password: string;
  address: string;
  phone: string;
  zipcode: string;
  avatar: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
}

interface SignInData {
  email: string;
  password: string;
}

interface AuthResponse {
  token?: string;
  access_token?: string;
  refresh_token?: string;
  user?: any;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://api.everrest.educata.dev/auth';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const user = localStorage.getItem('currentUser');
    const token = localStorage.getItem('token');
    if (user && token) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  signUp(data: SignUpData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/sign_up`, data);
  }

  signIn(data: SignInData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/sign_in`, data);
  }

  signOut(): Observable<string> {
    const result = this.http.post<string>(`${this.apiUrl}/sign_out`, {});
    result.subscribe(() => {
      this.clearAuth();
    });
    return result;
  }

  setAuth(token: string, user: any, refreshToken?: string): void {
    localStorage.setItem('token', token);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
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

  getUserFromToken(token: string): any | null {
    try {
      const payload = token.split('.')[1];
      if (!payload) {
        return null;
      }

      const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
      const decoded = atob(normalized);
      return JSON.parse(decoded);
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
