import { Component, OnInit, inject, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Pet } from '../../../../core/models/pet.interface';
import { Client } from '../../../../core/models/client.interface';

@Component({
  selector: 'app-pet-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pet-form.component.html',
})
export class PetFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  // --- Entradas (Inputs) desde el Smart Component ---
  pet = input<Pet | null>(null); // Puede ser null si es "Nueva Mascota"
  clients = input.required<Client[]>(); // Obligatorio para pintar el <select> de dueños

  // --- Salidas (Outputs) hacia el Smart Component ---
  save = output<Pet>(); // ¡Esto arregla tu error! Le dice a Angular que $event será tipo Pet
  cancelForm = output<void>();

  // --- Computado para incluir dueño inactivo si es necesario ---
  mergedClients = computed(() => {
    const active = this.clients();
    const current = this.pet();
    
    if (current?.clientId && current.client) {
      const exists = active.some(c => c.id === current.clientId);
      if (!exists) {
        return [...active, {
          id: current.clientId,
          firstName: current.client.firstName,
          lastName: current.client.lastName + ' (Inactivo)',
          documentId: current.client.documentId
        } as Client];
      }
    }
    return active;
  });

  // --- Definición estricta del Formulario (NonNullable) ---
  petForm = this.fb.nonNullable.group({
    id: this.fb.control<string | undefined>(undefined),
    name: ['', [Validators.required, Validators.minLength(2)]],
    species: ['DOG', Validators.required],
    breed: [''],
    sex: ['MALE'],
    color: [''],
    age: [''],
    weight: this.fb.control<number | null>(null),
    clientId: ['', Validators.required], // El dueño es obligatorio
    medicalNotes: [''],
    dietNotes: [''],
    generalNotes: [''],
    isActive: this.fb.control<boolean | undefined>(undefined), // Control para Soft Delete
  });

  ngOnInit(): void {
    // Si estamos editando, rellenamos el formulario con los datos
    const petToEdit = this.pet();
    if (petToEdit) {
      this.petForm.patchValue(petToEdit);
    }
    // En creación el control isActive se inicializa como undefined y no se muestra en el HTML, por lo que el payload viaja limpio.
  }

  onSubmit() {
    if (this.petForm.valid) {
      // 1. Hacemos una copia exacta de los valores del formulario
      const payload: any = { ...this.petForm.getRawValue() };

      // 2. Si NO hay ID (es decir, estamos CREANDO un registro nuevo)
      if (!this.pet()?.id) {
        // 🔥 Eliminamos por completo la propiedad del objeto antes de enviarla
        delete payload.isActive;
      }

      // 3. ¡Despegue!
      this.save.emit(payload);
    }
  }

  onCancel() {
    this.cancelForm.emit();
  }
}
