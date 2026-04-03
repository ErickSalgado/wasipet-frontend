import { Component, effect, inject, output, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Client } from '../../../../core/models/client.interface';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './client-form.component.html'
})
export class ClientFormComponent {
  client = input<Client | null>(null);
  
  closeForm = output<void>();
  save = output<Client>();

  private readonly fb = inject(FormBuilder);

  clientForm = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    documentType: ['CEDULA'],
    documentId: [''],
    phone: ['', Validators.required],
    secondaryPhone: [''],
    email: [''],
    address: [''],
    notes: [''],
  });

  constructor() {
    effect(() => {
      const c = this.client();
      if (c) {
        this.clientForm.patchValue({
          firstName: c.firstName || '',
          lastName: c.lastName || '',
          documentType: c.documentType || 'CEDULA',
          documentId: c.documentId || '',
          phone: c.phone || '',
          secondaryPhone: c.secondaryPhone || '',
          email: c.email || '',
          address: c.address || '',
          notes: c.notes || ''
        });
      } else {
        this.clientForm.reset({ documentType: 'CEDULA' });
      }
    });
  }

  onSubmit() {
    if (this.clientForm.valid) {
      const formValue = this.clientForm.getRawValue();
      const clientData: Client = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        documentType: formValue.documentType as any,
        documentId: formValue.documentId,
        phone: formValue.phone,
        secondaryPhone: formValue.secondaryPhone,
        email: formValue.email,
        address: formValue.address,
        notes: formValue.notes
      };
      
      if (this.client()?.id) {
        clientData.id = this.client()!.id;
      }
      
      this.save.emit(clientData);
    }
  }
}
