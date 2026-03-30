import { Component, OnInit, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ClientService, Client } from '../../core/services/client.service';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [ReactiveFormsModule], // <--- ¡Vital para que el formulario funcione!
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss',
})
export class ClientsComponent implements OnInit {
  private readonly clientService = inject(ClientService);

  clients = signal<Client[]>([]);
  isLoading = signal<boolean>(true);

  // Señal para mostrar/ocultar el formulario
  showForm = signal<boolean>(false);

  editingClientId = signal<string | null>(null);

  // Definimos la estructura del formulario y sus validaciones
  clientForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    documentType: new FormControl('CEDULA'),
    documentId: new FormControl(''),
    phone: new FormControl('', Validators.required),
    secondaryPhone: new FormControl(''),
    email: new FormControl(''),
    address: new FormControl(''),
    notes: new FormControl(''),
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
      },
    });
  }

  toggleForm() {
    this.showForm.set(!this.showForm());
    if (!this.showForm()) {
      this.clientForm.reset({ documentType: 'CEDULA' });
      this.editingClientId.set(null); // Limpiamos el estado de edición
    }
  }

  // 🔥 NUEVO: Cargar datos en el formulario para editar
  editClient(client: Client) {
    this.editingClientId.set(client.id!);
    this.clientForm.patchValue(client); // Llena el formulario mágicamente
    this.showForm.set(true);
  }

  // 🔥 NUEVO: Eliminar con confirmación básica
  deleteClient(id: string) {
    if (
      confirm(
        '¿Estás segura de que deseas eliminar este cliente? Esta acción no se puede deshacer.',
      )
    ) {
      this.clientService.deleteClient(id).subscribe({
        next: () => this.loadClients(),
        error: (err) => console.error(err),
      });
    }
  }

  saveClient() {
    if (this.clientForm.invalid) return;

    const clientData = this.clientForm.value as Client;
    const id = this.editingClientId();

    if (id) {
      // Si hay un ID, actualizamos
      this.clientService.updateClient(id, clientData).subscribe({
        next: () => {
          this.loadClients();
          this.toggleForm();
        },
      });
    } else {
      // Si no hay ID, creamos
      this.clientService.createClient(clientData).subscribe({
        next: () => {
          this.loadClients();
          this.toggleForm();
        },
      });
    }
  }
}
