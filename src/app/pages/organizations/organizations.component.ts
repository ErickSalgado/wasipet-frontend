import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationService } from '../../core/services/organization.service';
import { Organization } from '../../core/models/organization.interface';
import { OrganizationFormComponent } from './components/organization-form/organization-form.component';
// import { AlertService } from '../../core/services/alert.service'; // Descomenta si tienes tu servicio de alertas

@Component({
  selector: 'app-organizations',
  standalone: true,
  // 🔥 IMPORTANTE: Importamos el componente del formulario aquí
  imports: [CommonModule, OrganizationFormComponent],
  templateUrl: './organizations.component.html',
})
export class OrganizationsComponent implements OnInit {
  private readonly orgService = inject(OrganizationService);
  // private readonly alertService = inject(AlertService);

  // Estados reactivos
  organizations = signal<Organization[]>([]);
  showForm = signal(false);
  editingOrg = signal<Organization | null>(null);
  isLoading = signal(false); // Para mostrar algún spinner si lo deseas

  // 1. Cargar las organizaciones reales al iniciar el componente
  ngOnInit() {
    this.loadOrganizations();
  }

  // Método para consumir el GET del backend
  loadOrganizations() {
    this.isLoading.set(true);
    this.orgService.getOrganizations().subscribe({
      next: (data) => {
        this.organizations.set(data);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar organizaciones', error);
        this.isLoading.set(false);
      },
    });
  }

  toggleForm() {
    this.showForm.update((v) => !v);
    this.editingOrg.set(null);
  }

  editOrganization(org: Organization) {
    this.editingOrg.set(org);
    this.showForm.set(true);
  }

  // 2. La función que escucha al formulario (El Guardado)
  saveOrganization(data: { name: string }) {
    const currentOrg = this.editingOrg();
    this.isLoading.set(true);

    if (currentOrg?.id) {
      // MODO EDICIÓN (PUT)
      this.orgService.updateOrganization(currentOrg.id, data).subscribe({
        next: () => {
          this.loadOrganizations(); // Recargamos la tabla para ver el cambio
          this.toggleForm(); // Cerramos el formulario
          // this.alertService.toast('Organización actualizada con éxito');
        },
        error: (error) => {
          console.error('Error al actualizar', error);
          this.isLoading.set(false);
        },
      });
    } else {
      // MODO CREACIÓN (POST)
      this.orgService.createOrganization(data).subscribe({
        next: () => {
          this.loadOrganizations(); // Recargamos la tabla para ver la nueva organización
          this.toggleForm(); // Cerramos el formulario
          // this.alertService.toast('Organización creada con éxito');
        },
        error: (error) => {
          console.error('Error al crear', error);
          this.isLoading.set(false);
        },
      });
    }
  }
}
