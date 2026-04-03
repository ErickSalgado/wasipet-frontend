import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pet } from '../../../../core/models/pet.interface';

@Component({
  selector: 'app-pet-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pet-list.component.html',
})
export class PetListComponent {
  // Entradas (Inputs)
  pets = input.required<Pet[]>();
  isLoading = input<boolean>(false); // 🔥 Añadimos esto para la animación de carga

  // Salidas (Outputs)
  edit = output<Pet>();
  delete = output<string>();
}