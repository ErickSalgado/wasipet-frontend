import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VaccineService } from '../../../../core/services/vaccine.service';
import { PetService } from '../../../../core/services/pet.service';
import { Vaccine } from '../../../../core/models/vaccine.interface';
import { Pet } from '../../../../core/models/pet.interface';
import { VaccineFormComponent } from '../vaccine-form/vaccine-form.component';

@Component({
  selector: 'app-pet-vaccines',
  standalone: true,
  imports: [CommonModule, VaccineFormComponent],
  templateUrl: './pet-vaccines.component.html',
})
export class PetVaccinesComponent implements OnInit {
  private readonly vaccineService = inject(VaccineService);
  private readonly petService = inject(PetService);

  viewMode = signal<'pets' | 'vaccines'>('pets');
  pets = signal<Pet[]>([]);
  vaccines = signal<Vaccine[]>([]);
  selectedPet = signal<Pet | null>(null);

  showForm = signal(false);
  editingVaccine = signal<Vaccine | null>(null);

  petSearchTerm = signal('');
  vaccineSearchTerm = signal('');
  dateFrom = signal('');
  dateTo = signal('');

  // ✨ Clean Code: Uso de Optional Chaining (?.)
  filteredPets = computed(() => {
    const term = this.petSearchTerm().toLowerCase();
    if (!term) return this.pets();

    return this.pets().filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.species?.toLowerCase().includes(term) ||
        p.breed?.toLowerCase().includes(term),
    );
  });

  // ✨ Clean Code: Uso de Optional Chaining (?.)
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

  ngOnInit() {
    this.loadPets();
  }

  loadPets() {
    this.petService.getPets().subscribe({
      next: (data: Pet[]) => this.pets.set(data), // ✨ Tipado estricto
      error: (err: any) => console.error('Error cargando mascotas', err), // ✨ Tipado estricto
    });
  }

  openPetRecords(pet: Pet) {
    this.selectedPet.set(pet);
    this.viewMode.set('vaccines');
    this.vaccineSearchTerm.set('');
    this.dateFrom.set('');
    this.dateTo.set('');

    if (pet.id) {
      this.loadVaccinesForPet(pet.id);
    }
  }

  backToPets() {
    this.viewMode.set('pets');
    this.selectedPet.set(null);
    this.showForm.set(false);
  }

  loadVaccinesForPet(petId: string) {
    this.vaccineService.getVaccinesByPet(petId).subscribe({
      next: (data: Vaccine[]) => this.vaccines.set(data), // ✨ Tipado estricto
      error: (err: any) => console.error('Error cargando vacunas', err), // ✨ Tipado estricto
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

  // ✨ Clean Code: Validación segura sin usar aserciones "!"
  deleteVaccine(id: string) {
    const petId = this.selectedPet()?.id;
    if (petId && confirm('¿Estás seguro de eliminar este registro médico?')) {
      this.vaccineService
        .deleteVaccine(id)
        .subscribe(() => this.loadVaccinesForPet(petId));
    }
  }

  // ✨ Clean Code: Validación segura sin usar aserciones "!"
  saveVaccine(data: Partial<Vaccine>) {
    const current = this.editingVaccine();
    const petId = this.selectedPet()?.id;

    if (!petId) return; // Seguridad extra

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
