import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  // Inyección de dependencias moderna (Angular 14+)
  private fb = inject(FormBuilder);

  // Definición del formulario reactivo estrictamente tipado
  loginForm = this.fb.nonNullable.group({
    usuario: ['', [Validators.required, Validators.email]],
    clave: ['', [Validators.required, Validators.minLength(6)]]
  });

  // State Management usando Signals (Angular 16+)
  isLoading = signal<boolean>(false);
  showPassword = signal<boolean>(false);

  // Alternar la visibilidad de la contraseña
  togglePasswordVisibility(): void {
    this.showPassword.update(value => !value);
  }

  // Manejador del envío del formulario
  onSubmit(): void {
    // Verificar si el formulario es válido
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    // Cambiar estado a cargando
    this.isLoading.set(true);

    // Simulación de una petición HTTP
    console.log('Formulario válido, enviando datos:', this.loginForm.getRawValue());
    
    setTimeout(() => {
      this.isLoading.set(false);
      // Aquí se implementaría el ruteo o manejo de autenticación exitosa
      console.log('Login completado exitosamente');
    }, 2000);
  }
}
