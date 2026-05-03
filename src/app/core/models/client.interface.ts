export interface Client {
  id?: string;
  firstName: string;
  lastName: string;
  documentId?: string;
  documentType?: 'CEDULA' | 'RUC' | 'PASAPORTE' | 'OTRO';
  phone: string;
  secondaryPhone?: string;
  email?: string;
  address?: string;
  notes?: string;
  isActive?: boolean;
}