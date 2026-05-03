export interface Pet {
  id?: string;
  name: string;
  species: string; 
  breed?: string;
  sex?: string; 
  color?: string;
  age?: string; 
  weight?: number;
  photoUrl?: string;
  medicalNotes?: string;
  dietNotes?: string;
  generalNotes?: string;
  isActive?: boolean;
  
  // Relación obligatoria
  clientId: string; 
  
  // Objeto anidado que llega desde el backend cuando listamos
  client?: {
    firstName: string;
    lastName: string;
    documentId?: string;
  };
}