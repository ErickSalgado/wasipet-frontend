import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  // Inyección de dependencias moderna (Angular 14+)
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Definición del formulario reactivo estrictamente tipado
  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  // State Management usando Signals (Angular 16+)
  isLoading = signal<boolean>(false);
  showPassword = signal<boolean>(false);

  // Alternar la visibilidad de la contraseña
  togglePasswordVisibility(): void {
    this.showPassword.update((value) => !value);
  }

  // Manejador del envío del formulario
  onSubmit(): void {
    // Verificar si el formulario es válido
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const formValue = this.loginForm.getRawValue();

    this.authService
      .login({
        email: formValue.email,
        password: formValue.password,
      })
      .subscribe({
        next: () => {
          this.router.navigate(['/workspace-selector']);
        },
        error: (error) => {
          alert('Credenciales Incorrectas. Intenta de nuevo.');
          console.error(error);
        },
      });
  }
}
