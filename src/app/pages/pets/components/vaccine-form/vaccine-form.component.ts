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
      };

      if (formValues.nextDoseDate)
        payload.nextDoseDate = formValues.nextDoseDate;
      if (formValues.veterinarian)
        payload.veterinarian = formValues.veterinarian;
      if (formValues.notes) payload.notes = formValues.notes;

      this.save.emit(payload);
    }
  }
}
