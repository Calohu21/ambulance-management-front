import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthResponse, LoginRequest } from '@core/models/auth.model';
import { AUTH_ENDPOINTS, STORAGE_KEYS } from '@core/constants/api.constants';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { StorageService } from '@core/services/storage.service';
import { User } from '@core/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  storage = inject(StorageService);

  private tokenCache = signal<string | null>(null);
  readonly token = this.tokenCache.asReadonly();

  private currentUserCache = signal<User | null>(null);

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(AUTH_ENDPOINTS.LOGIN, credentials).pipe(
      tap((response) => this.handleAuthSuccess(response)),
      catchError((err) => {
        console.error('Login error:', err);
        return throwError(() => err);
      }),
    );
  }

  private handleAuthSuccess(response: AuthResponse) {
    this.tokenCache.set(response.token);
    this.storage.set(STORAGE_KEYS.JWT_TOKEN, response.token);

    const user: User = {
      id: response.employeeID ?? 0,
      username: response.username,
      email: response.email,
      role: response.role,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.currentUserCache.set(user);
    this.storage.set(STORAGE_KEYS.USER_INFO, user);
  }
}
