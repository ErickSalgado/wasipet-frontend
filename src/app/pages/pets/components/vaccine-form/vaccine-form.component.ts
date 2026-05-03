import { Component, input, output, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Vaccine } from '../../../../core/models/vaccine.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vaccine-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './vaccine-form.component.html',
})
export class VaccineFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  vaccine = input<Vaccine | null>(null);
  pets = input<any[]>([]); // 🔥 Recibimos la lista de mascotas para el Select

  cancelForm = output<void>();
  save = output<Partial<Vaccine>>();

  vaccineForm = this.fb.nonNullable.group({
    petId: ['', [Validators.required]], // 🔥 Nuevo campo obligatorio
    name: ['', [Validators.required]],
    applicationDate: ['', [Validators.required]],
    nextDoseDate: [''],
    veterinarian: [''],
    notes: [''],
    weight: [''],
    dewormingDetails: [''],
  });

  ngOnInit() {
    const currentVaccine = this.vaccine();
    if (currentVaccine) {
      const appDate = currentVaccine.applicationDate
        ? currentVaccine.applicationDate.split('T')[0]
        : '';
      const nextDate = currentVaccine.nextDoseDate
        ? currentVaccine.nextDoseDate.split('T')[0]
        : '';

      this.vaccineForm.patchValue({
        petId: currentVaccine.petId || '', // Si estamos editando, ya sabemos de qué mascota es
        name: currentVaccine.name,
        applicationDate: appDate,
        nextDoseDate: nextDate,
        veterinarian: currentVaccine.veterinarian || '',
        notes: currentVaccine.notes || '',
        weight: currentVaccine.weight?.toString() || '',
        dewormingDetails: currentVaccine.dewormingDetails || '',
      });
    }
  }

  onSubmit() {
    if (this.vaccineForm.valid) {
      const formValues = this.vaccineForm.getRawValue();

      const payload: any = {
        petId: formValues.petId,
        name: formValues.name,
        applicationDate: formValues.applicationDate,

        // Para los opcionales: si tienen texto lo enviamos, si están vacíos enviamos null
        // para obligar a la base de datos a borrar el registro anterior.
        notes: formValues.notes?.trim() ? formValues.notes : null,
        veterinarian: formValues.veterinarian?.trim()
          ? formValues.veterinarian
          : null,
        dewormingDetails: formValues.dewormingDetails?.trim()
          ? formValues.dewormingDetails
          : null,

        nextDoseDate: formValues.nextDoseDate ? formValues.nextDoseDate : null,
        weight: formValues.weight ? Number.parseFloat(formValues.weight) : null,
      };

      this.save.emit(payload);
    }
  }
}
