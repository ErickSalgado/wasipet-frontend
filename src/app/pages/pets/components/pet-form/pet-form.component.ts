import { Component, OnInit, inject, input, output } from '@angular/core';
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
    generalNotes: ['']
  });

  ngOnInit(): void {
    // Si estamos editando, rellenamos el formulario con los datos
    const petToEdit = this.pet();
    if (petToEdit) {
      this.petForm.patchValue(petToEdit);
    }
  }

  onSubmit() {
    if (this.petForm.valid) {
      // getRawValue() extrae los datos limpios sin casteos inseguros
      const formValue = this.petForm.getRawValue();
      
      // Emitimos el evento 'save', Angular ahora sabrá que esto es tipo 'Pet'
      this.save.emit(formValue as Pet);
    } else {
      this.petForm.markAllAsTouched();
    }
  }

  onCancel() {
    this.cancelForm.emit();
  }
}