import { Component, input, output, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Organization } from '../../../../core/models/organization.interface';

@Component({
  selector: 'app-organization-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './organization-form.component.html',
})
export class OrganizationFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  // Entradas y Salidas
  org = input<Organization | null>(null);
  cancelForm = output<void>();
  save = output<{ name: string }>();

  // Formulario Reactivo (Solo el nombre)
  orgForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
  });

  ngOnInit() {
    const currentOrg = this.org();
    if (currentOrg) {
      this.orgForm.patchValue({ name: currentOrg.name });
    }
  }

  onSubmit() {
    if (this.orgForm.valid) {
      this.save.emit(this.orgForm.getRawValue());
    }
  }
}
