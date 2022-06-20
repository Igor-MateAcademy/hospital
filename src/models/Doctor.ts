export type SpecialistType = 'SURGEON' | 'UROLOGIST' | 'NEUROLOGIST' | 'PSYCHIATRIST' | 'PEDIATRICIAN';

export interface Doctor extends CreateDoctor {
  id: number;
}

export interface CreateDoctor {
  firstName: string;
  lastName: string;
  specialistType: SpecialistType;
}
