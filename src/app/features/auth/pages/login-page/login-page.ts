import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@core/services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldComponent } from '@shared/components/form-field/form-field.component/form-field.component';

@Component({
  selector: 'app-login-page',
  imports: [CommonModule, ReactiveFormsModule, FormFieldComponent],
  templateUrl: './login-page.html',
  styles: ``,
})
export class LoginPage {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  showPassword = signal<boolean>(false);
  isLoading = signal<boolean>(false);

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
    const { username, password } = this.loginForm.value;

    this.authService.login({ username, password }).subscribe({
      next: () => {
        console.log('Login realizado');
      },
      error: () => {
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      },
    });
  }
}
