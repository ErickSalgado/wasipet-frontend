import { Component, input, output } from '@angular/core';
import { Client } from '../../../../core/models/client.interface';

@Component({
  selector: 'app-client-list',
  standalone: true,
  templateUrl: './client-list.component.html'
})
export class ClientListComponent {
  clients = input<Client[]>([]);
  isLoading = input<boolean>(false);
  
  edit = output<Client>();
  delete = output<string>();
}
