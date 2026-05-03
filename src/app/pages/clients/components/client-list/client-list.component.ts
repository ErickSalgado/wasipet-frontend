import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Client } from '../../../../core/models/client.interface';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-list.component.html'
})
export class ClientListComponent {
  clients = input<Client[]>([]);
  isLoading = input<boolean>(false);
  
  edit = output<Client>();
  delete = output<string>();
}
