import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PetService } from '../../../../core/services/pet.service';
import { Pet } from '../../../../core/models/pet.interface';
import { DailyActivitiesComponent } from '../daily-activities/daily-activities.component';
import { PetVaccinesComponent } from '../pet-vaccines/pet-vaccines.component';

@Component({
  selector: 'app-patient-record',
  standalone: true,
  imports: [CommonModule, DailyActivitiesComponent, PetVaccinesComponent],
  templateUrl: './patient-record.component.html'
})
export class PatientRecordComponent implements OnInit {
  private readonly petService = inject(PetService);

  // Estados del contenedor
  viewMode = signal<'list' | 'detail'>('list');
  activeTab = signal<'activities' | 'vaccines'>('activities');
  
  pets = signal<Pet[]>([]);
  selectedPet = signal<Pet | null>(null);
  petSearchTerm = signal('');

  // Buscador reactivo
  filteredPets = computed(() => {
    const term = this.petSearchTerm().toLowerCase();
    if (!term) return this.pets();
    return this.pets().filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.species?.toLowerCase().includes(term) ||
      p.breed?.toLowerCase().includes(term)
    );
  });

  ngOnInit() {
    this.loadPets();
  }

  loadPets() {
    this.petService.findAllActive().subscribe({
      next: (data) => this.pets.set(data),
      error: (err) => console.error('Error cargando pacientes', err),
    });
  }

  openPetRecords(pet: Pet) {
    this.selectedPet.set(pet);
    this.viewMode.set('detail');
    this.activeTab.set('activities');
  }

  backToList() {
    this.viewMode.set('list');
    this.selectedPet.set(null);
  }
}