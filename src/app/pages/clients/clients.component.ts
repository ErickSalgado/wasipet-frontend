import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientService, Client } from '../../core/services/client.service';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [ReactiveFormsModule], // <--- ¡Vital para que el formulario funcione!
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent implements OnInit {
  private readonly clientService = inject(ClientService);
  
  clients = signal<Client[]>([]);
  isLoading = signal<boolean>(true);
  
  // Señal para mostrar/ocultar el formulario
  showForm = signal<boolean>(false);

  // Definimos la estructura del formulario y sus validaciones
  clientForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    email: new FormControl(''),
  });

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this.isLoading.set(true);
    this.clientService.getClients().subscribe({
      next: (data) => {
        this.clients.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar clientes', err);
        this.isLoading.set(false);
      }
    });
  }

  toggleForm() {
    this.showForm.set(!this.showForm());
    if (!this.showForm()) {
      this.clientForm.reset(); // Limpia el form si lo cerramos
    }
  }

  saveClient() {
    if (this.clientForm.invalid) return; // Protegemos que no envíen datos vacíos

    const newClient = this.clientForm.value as Client;
    
    this.clientService.createClient(newClient).subscribe({
      next: (response) => {
        this.loadClients(); // 1. Recargamos la tabla para ver al nuevo cliente
        this.toggleForm();  // 2. Cerramos el formulario
      },
      error: (err) => console.error('Error al guardar cliente', err)
    });
  }
}