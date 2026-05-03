export interface DailyActivity {
  id?: string;
  petId: string;
  activityType:
    | 'LLEGADA'
    | 'COMIDA'
    | 'PASEO'
    | 'BANO'
    | 'MEDICACION'
    | 'JUEGO'
    | 'SALIDA'
    | 'OTRO';
  description: string;
  timestamp: string; // 🔥 La fecha y hora de la actividad
  photoUrl?: string;
  notifiedToOwner?: boolean;
  branchId?: string;
  createdBy?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
