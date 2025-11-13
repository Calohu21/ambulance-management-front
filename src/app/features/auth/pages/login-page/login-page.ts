import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@core/services/auth.service';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { FormFieldComponent } from '@shared/components/form-field/form-field.component/form-field.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, finalize, Observable, timer } from 'rxjs';
import { Router } from '@angular/router';

interface LoginForm {
  username: FormControl<string>;
  password: FormControl<string>;
}

interface HttpError {
  status: number;
  message: string;
}

// Constantes de configuración
const LOGIN_CONFIG = {
  USERNAME_MIN_LENGTH: 4,
  USERNAME_MAX_LENGTH: 50,
  ERROR_DISMISS_DELAY: 3000,
} as const;

@Component({
  selector: 'app-login-page',
  imports: [CommonModule, ReactiveFormsModule, FormFieldComponent],
  templateUrl: './login-page.html',
  styles: ``,
})
export class LoginPage {
  private authService = inject(AuthService);
  private fb = inject(NonNullableFormBuilder);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  readonly isLoading = signal(false);
  readonly isError = signal(false);
  readonly errorMessage = signal('');

  loginForm: FormGroup<LoginForm> = this.fb.group({
    username: [
      '',
      [
        Validators.required,
        Validators.minLength(LOGIN_CONFIG.USERNAME_MIN_LENGTH),
        Validators.maxLength(LOGIN_CONFIG.USERNAME_MAX_LENGTH),
      ],
    ],
    password: ['', Validators.required],
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.isError.set(false);

    this.authService
      .login(this.loginForm.getRawValue())
      .pipe(
        catchError((err: HttpError) => this.handleLoginErrorStream(err)),
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => this.handleLoginSuccess(),
      });
  }

  private handleLoginSuccess() {
    this.loginForm.reset();
    void this.router.navigate(['/dashboard']);
  }

  private handleLoginErrorStream(error: HttpError): Observable<never> {
    this.handleLoginError(error);
    return EMPTY;
  }

  private handleLoginError(error: HttpError) {
    const message = this.getErrorMessageLogin(error.status);
    this.errorMessage.set(message);
    this.isError.set(true);

    timer(LOGIN_CONFIG.ERROR_DISMISS_DELAY)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.isError.set(false);
        this.errorMessage.set('');
      });
  }

  getFieldError(fieldName: string): string {
    const control = this.loginForm.get(fieldName);

    if (!control || !control.touched || !control.errors) {
      return '';
    }

    return this.parseValidationErrors(control.errors);
  }

  private parseValidationErrors(errors: ValidationErrors): string {
    if (errors['required']) return 'Este campo es requerido';
    if (errors['minlength']) return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
    if (errors['maxlength']) return `Máximo ${errors['maxlength'].requiredLength} caracteres`;
    return '';
  }

  private getErrorMessageLogin(status: number): string {
    const HTTP_ERROR_MESSAGES_LOGIN: Record<number, string> = {
      401: 'Credenciales inválidas',
      403: 'Credenciales inválidas',
      429: 'Demasiados intentos. Inténtelo más tarde',
      0: 'Error de conexión',
      500: 'Error del servidor. Inténtelo más tarde',
      502: 'Error del servidor. Inténtelo más tarde',
      503: 'Error del servidor. Inténtelo más tarde',
    };

    return HTTP_ERROR_MESSAGES_LOGIN[status] ?? 'Usuario o contraseña incorrecta';
  }
}
