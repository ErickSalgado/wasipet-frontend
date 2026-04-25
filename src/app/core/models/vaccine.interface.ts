export interface Vaccine {
  id?: string;
  petId?: string; // Ahora es obligatorio para crear
  name: string;
  applicationDate: string;
  nextDoseDate?: string | null;
  veterinarian?: string;
  notes?: string;
  pet?: {
    // La info que viene de la relación de Prisma
    name: string;
    species: string;
    breed?: string;
  };
}
