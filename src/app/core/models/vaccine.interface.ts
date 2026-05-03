export interface Vaccine {
  id?: string;
  petId?: string; // Ahora es obligatorio para crear
  name: string;
  applicationDate: string;
  nextDoseDate?: string | null;
  veterinarian?: string;
  notes?: string;
  weight?: number;
  dewormingDetails?: string;
  pet?: {
    name: string;
    species: string;
    breed?: string;
  };
}
