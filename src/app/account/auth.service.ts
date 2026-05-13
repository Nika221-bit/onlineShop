import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthResponse } from './auth.interface';

interface SignUpPayload {
  email: string;
  password: string;
  fullName: string;
}

interface SignInPayload {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = 'https://api.everrest.educata.dev/auth';
  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  signUp(payload: Record<string, unknown>): Observable<AuthResponse> {
    console.log('AuthService signUp payload:', payload);
    return this.http.post<AuthResponse>(`${this.baseUrl}/sign_up`, payload, this.httpOptions);
  }

  signIn(request: SignInPayload): Observable<AuthResponse> {
    const payload = {
      email: request.email,
      password: request.password,
    };
    return this.http.post<AuthResponse>(`${this.baseUrl}/sign_in`, payload, this.httpOptions);
  }
}
