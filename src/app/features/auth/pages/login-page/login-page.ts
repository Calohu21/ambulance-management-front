import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@core/services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldComponent } from '@shared/components/form-field/form-field.component/form-field.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { timer } from 'rxjs';

@Component({
  selector: 'app-login-page',
  imports: [CommonModule, ReactiveFormsModule, FormFieldComponent],
  templateUrl: './login-page.html',
  styles: ``,
})
export class LoginPage {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  showPassword = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  isError = signal<boolean>(false);

  loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(4)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  togglePasswordVisibility() {
    this.showPassword.update((value) => !value);
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (!field || !field.touched || !field.errors) {
      return '';
    }

    if (field.errors['required']) {
      return 'Este campo es requerido';
    }

    if (field.errors['username']) {
      return 'Nombre de usuario inválido';
    }

    if (field.errors['minlength']) {
      console.log(field.errors['minlength']);
      return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
    }

    return '';
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.isError.set(false);
    const { username, password } = this.loginForm.value;

    this.authService
      .login({ username, password })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isError.set(false);
        },
        error: () => {
          this.isError.set(true);
          this.isLoading.set(false);
          timer(3000)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.isError.set(false));
          this.loginForm.reset({
            username: '',
            password: '',
          });
        },
        complete: () => {
          this.isLoading.set(false);
        },
      });
  }
}
