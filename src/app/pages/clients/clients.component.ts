import { Component, inject, signal } from '@angular/core';
import { ClientService } from '../../core/services/client.service';
import { AlertService } from '../../core/services/alert.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, switchMap, tap } from 'rxjs';
import { ClientListComponent } from './components/client-list/client-list.component';
import { ClientFormComponent } from './components/client-form/client-form.component';
import { Client } from '../../core/models/client.interface';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [ClientListComponent, ClientFormComponent],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss',
})
export class ClientsComponent {
  private readonly clientService = inject(ClientService);
  private readonly alertService = inject(AlertService);

  private refreshTrigger = new BehaviorSubject<void>(undefined);

  isLoading = signal<boolean>(true);
  showForm = signal<boolean>(false);
  editingClient = signal<Client | null>(null);

  // 🔥 Declarative State Management
  clients = toSignal(
    this.refreshTrigger.pipe(
      tap(() => this.isLoading.set(true)),
      switchMap(() => this.clientService.getClients()),
      tap(() => this.isLoading.set(false))
    ),
    { initialValue: [] as Client[] }
  );

  loadClients() {
    this.refreshTrigger.next();
  }

  toggleForm() {
    this.showForm.set(!this.showForm());
    if (!this.showForm()) {
      this.editingClient.set(null);
    }
  }

  editClient(client: Client) {
    this.editingClient.set(client);
    this.showForm.set(true);
  }

  async deleteClient(id: string) {
    const confirmed = await this.alertService.confirm(
      '¿Estás segura de que deseas eliminar este cliente? Esta acción no se puede deshacer.',
      'Eliminar cliente'
    );

    if (confirmed) {
      this.clientService.deleteClient(id).subscribe({
        next: () => {
          this.alertService.toast('Cliente eliminado correctamente');
          this.loadClients();
        },
        error: () => {
          this.alertService.error('Error al eliminar cliente');
        },
      });
    }
  }

  saveClient(clientData: Client) {
    if (clientData.id) {
      this.clientService.updateClient(clientData.id, clientData).subscribe({
        next: () => {
          this.alertService.toast('Cliente actualizado correctamente');
          this.loadClients();
          this.toggleForm();
        },
      });
    } else {
      this.clientService.createClient(clientData).subscribe({
        next: () => {
          this.alertService.toast('Cliente registrado correctamente');
          this.loadClients();
          this.toggleForm();
        },
      });
    }
  }
}
