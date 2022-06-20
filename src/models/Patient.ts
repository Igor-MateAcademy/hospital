export interface Patient extends CreatePatient {
  id: number;
}

export interface CreatePatient {
  firstName: string;
  lastName: string;
  phone: string;
}
