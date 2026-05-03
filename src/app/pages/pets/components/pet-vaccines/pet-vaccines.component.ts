import {
  Component,
  inject,
  signal,
  computed,
  HostListener,
  input,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { VaccineService } from '../../../../core/services/vaccine.service';
import { Vaccine } from '../../../../core/models/vaccine.interface';
import { Pet } from '../../../../core/models/pet.interface';
import { VaccineFormComponent } from '../vaccine-form/vaccine-form.component';

@Component({
  selector: 'app-pet-vaccines',
  standalone: true,
  imports: [CommonModule, VaccineFormComponent],
  templateUrl: './pet-vaccines.component.html',
})
export class PetVaccinesComponent {
  private readonly vaccineService = inject(VaccineService);

  // 🚪 ¡LA PUERTA ESTÁ ABIERTA! Ahora recibe el paciente desde el Orquestador
  selectedPet = input<Pet | null>(null);

  vaccines = signal<Vaccine[]>([]);
  showForm = signal(false);
  editingVaccine = signal<Vaccine | null>(null);

  vaccineSearchTerm = signal('');
  dateFrom = signal('');
  dateTo = signal('');
  activeTooltip = signal<string | null>(null);

  constructor() {
    // ✨ Magia Reactiva: Cada vez que el Orquestador cambia la mascota,
    // este efecto se dispara y carga las vacunas de ese perrito automáticamente.
    effect(() => {
      const pet = this.selectedPet();
      if (pet?.id) {
        this.loadVaccinesForPet(pet.id);
      }
    });
  }

  @HostListener('document:click')
  closeTooltips() {
    this.activeTooltip.set(null);
  }

  toggleTooltip(id: string | undefined, event: Event) {
    event.stopPropagation();
    if (!id) return;
    this.activeTooltip.update((current) => (current === id ? null : id));
  }

  filteredVaccines = computed(() => {
    const term = this.vaccineSearchTerm().toLowerCase();
    const from = this.dateFrom() ? new Date(this.dateFrom()).getTime() : 0;
    const to = this.dateTo() ? new Date(this.dateTo()).getTime() : Infinity;

    return this.vaccines().filter((v) => {
      const matchText =
        v.name.toLowerCase().includes(term) ||
        v.veterinarian?.toLowerCase().includes(term) ||
        v.notes?.toLowerCase().includes(term);

      const appDate = new Date(v.applicationDate).getTime();
      const matchDate = appDate >= from && appDate <= to;

      return matchText && matchDate;
    });
  });

  loadVaccinesForPet(petId: string) {
    this.vaccineService.getVaccinesByPet(petId).subscribe({
      next: (data: Vaccine[]) => this.vaccines.set(data),
      error: (err: any) => console.error('Error cargando vacunas', err),
    });
  }

  toggleForm() {
    this.showForm.update((v) => !v);
    this.editingVaccine.set(null);
  }

  editVaccine(vaccine: Vaccine) {
    this.editingVaccine.set(vaccine);
    this.showForm.set(true);
  }

  deleteVaccine(id: string) {
    const petId = this.selectedPet()?.id;
    if (petId && confirm('¿Estás seguro de eliminar este registro médico?')) {
      this.vaccineService
        .deleteVaccine(id)
        .subscribe(() => this.loadVaccinesForPet(petId));
    }
  }

  saveVaccine(data: Partial<Vaccine>) {
    const current = this.editingVaccine();
    const petId = this.selectedPet()?.id;

    if (!petId) return;

    const payload = { ...data, petId };

    if (current?.id) {
      this.vaccineService.updateVaccine(current.id, payload).subscribe(() => {
        this.loadVaccinesForPet(petId);
        this.toggleForm();
      });
    } else {
      this.vaccineService.createVaccine(payload).subscribe(() => {
        this.loadVaccinesForPet(petId);
        this.toggleForm();
      });
    }
  }
}
