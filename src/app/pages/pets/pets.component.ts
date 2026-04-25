import { Component, inject, signal } from '@angular/core';
import { PetService } from '../../core/services/pet.service';
import { ClientService } from '../../core/services/client.service';
import { AlertService } from '../../core/services/alert.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, switchMap, tap } from 'rxjs';
import { PetListComponent } from './components/pet-list/pet-list.component';
import { PetFormComponent } from './components/pet-form/pet-form.component';
import { Pet } from '../../core/models/pet.interface';
import { CommonModule } from '@angular/common';
import { PetVaccinesComponent } from './components/pet-vaccines/pet-vaccines.component';

@Component({
  selector: 'app-pets',
  standalone: true,
  imports: [CommonModule, PetListComponent, PetFormComponent, PetVaccinesComponent],
  templateUrl: './pets.component.html',
})
export class PetsComponent {
  private readonly petService = inject(PetService);
  private readonly clientService = inject(ClientService);
  private readonly alertService = inject(AlertService);

  private readonly refreshTrigger = new BehaviorSubject<void>(undefined);

  // Mismos nombres de variables de estado que en Clientes
  isLoading = signal<boolean>(true);
  showForm = signal<boolean>(false);
  editingPet = signal<Pet | null>(null);

  // 🔥 Estado Declarativo estandarizado
  pets = toSignal(
    this.refreshTrigger.pipe(
      tap(() => this.isLoading.set(true)),
      switchMap(() => this.petService.getPets()),
      tap(() => this.isLoading.set(false))
    ),
    { initialValue: [] as Pet[] }
  );

  // Lista para el dropdown del formulario
  clients = toSignal(this.clientService.getClients(), { initialValue: [] });

  // Mismos métodos de control que en Clientes
  loadPets() {
    this.refreshTrigger.next();
  }

  toggleForm() {
    this.showForm.set(!this.showForm());
    if (!this.showForm()) {
      this.editingPet.set(null);
    }
  }

  editPet(pet: Pet) {
    this.editingPet.set(pet);
    this.showForm.set(true);
  }

  async deletePet(id: string) {
    const confirmed = await this.alertService.confirm(
      '¿Estás seguro de que deseas eliminar esta mascota? Esta acción no se puede deshacer.',
      'Eliminar mascota'
    );

    if (confirmed) {
      this.petService.deletePet(id).subscribe({
        next: () => {
          this.alertService.toast('Mascota eliminada correctamente');
          this.loadPets();
        },
        error: () => {
          this.alertService.error('Error al eliminar mascota');
        },
      });
    }
  }

  // Ahora el Smart Component se encarga de guardar, respetando la arquitectura
  savePet(petData: Pet) {
    if (petData.id) {
      this.petService.updatePet(petData.id, petData).subscribe({
        next: () => {
          this.alertService.toast('Mascota actualizada correctamente');
          this.loadPets();
          this.toggleForm();
        },
        error: () => this.alertService.error('Error al actualizar la mascota')
      });
    } else {
      this.petService.createPet(petData).subscribe({
        next: () => {
          this.alertService.toast('Mascota registrada correctamente');
          this.loadPets();
          this.toggleForm();
        },
        error: () => this.alertService.error('Error al registrar la mascota')
      });
    }
  }
}