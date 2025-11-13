import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@core/services/auth.service';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormFieldComponent } from '@shared/components/form-field/form-field.component/form-field.component';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, finalize, retry, switchMap, tap, timer } from 'rxjs';
import { Router } from '@angular/router';
import { merge, startWith } from 'rxjs';

interface LoginForm {
  username: FormControl<string>;
  password: FormControl<string>;
}

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

  showPassword = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  isError = signal<boolean>(false);
  errorMessage = signal<string>('');

  loginForm: FormGroup<LoginForm> = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(128)]],
  });

  // Convertir cambios del formulario a signals
  private usernameState = toSignal(
    merge(
      this.loginForm.controls.username.statusChanges,
      this.loginForm.controls.username.valueChanges,
      this.loginForm.controls.username.events, // Escucha todos los eventos incluyendo blur
    ).pipe(startWith(null), takeUntilDestroyed(this.destroyRef)),
    { initialValue: null },
  );

  private passwordState = toSignal(
    merge(
      this.loginForm.controls.password.statusChanges,
      this.loginForm.controls.password.valueChanges,
      this.loginForm.controls.password.events, // Escucha todos los eventos incluyendo blur
    ).pipe(startWith(null), takeUntilDestroyed(this.destroyRef)),
    { initialValue: null },
  );

  togglePasswordVisibility() {
    this.showPassword.update((value) => !value);
  }

  readonly usernameError = computed(() => {
    // Consumir usernameState para que el computed se reactive
    this.usernameState();

    const field = this.loginForm.controls.username;

    if (!field.touched || !field.errors) return '';

    const errors = field.errors;
    if (errors['required']) return 'Este campo es requerido';
    if (errors['minlength']) {
      return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
    }
    if (errors['maxlength']) {
      return `Máximo ${errors['maxlength'].requiredLength} caracteres`;
    }

    return '';
  });

  readonly passwordError = computed(() => {
    // Consumir passwordState para que el computed se reactive
    this.passwordState();

    const field = this.loginForm.controls.password;

    if (!field.touched || !field.errors) return '';

    const errors = field.errors;
    if (errors['required']) return 'Este campo es requerido';
    if (errors['minlength']) {
      return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
    }
    if (errors['maxlength']) {
      return `Máximo ${errors['maxlength'].requiredLength} caracteres`;
    }

    return '';
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.isError.set(false);
    const credentials = this.loginForm.getRawValue();

    this.authService
      .login(credentials)
      .pipe(
        // Reintentar en caso de errores de red
        retry({
          count: 2,
          delay: (error, retryCount) => {
            // Solo reintentar errores de red (status 0) o servidor (500+)
            if (error.status === 0 || error.status >= 500) {
              return timer(1000 * retryCount); // Backoff incremental
            }
            throw error; // No reintentar errores de autenticación
          },
        }),

        // Auto-cleanup cuando el componente se destruye
        takeUntilDestroyed(this.destroyRef),

        // Log de éxito (solo side effect)
        tap(() => console.log('Login successful')),

        // Manejo de errores
        catchError((error) => {
          this.handleLoginError(error);

          // Auto-dismiss en paralelo (no bloquea el finalize)
          timer(3000)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
              this.isError.set(false);
              this.errorMessage.set('');
            });

          return EMPTY; // Completa inmediatamente
        }),

        // Siempre ejecutar al final (éxito o error)
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: () => {
          this.loginForm.reset();
          this.loginForm.reset({
            username: '',
            password: '',
          });

          // Navegar después de breve feedback
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 500);
        },
      });
  }

  private handleLoginError(error: any) {
    let message = 'Usuario o contraseña incorrectos';

    switch (error.status) {
      case 401:
      case 403:
        message = 'Credenciales inválidas';
        break;
      case 429:
        message = 'Demasiados intentos. Inténtelo más tarde';
        break;
      case 0:
        message = 'Error de conexión';
        break;
      case 500:
      case 502:
      case 503:
        message = ' Error del servidor. Inténtelo más tarde';
        break;
    }

    this.errorMessage.set(message);
    this.isError.set(true);

    console.error('Login failed:', {
      status: error.status,
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}
