import { Doctor, Patient, ICabinet } from 'models';

export interface ISchedule {
  id: number;
  doctor: Doctor;
  patient: Patient;
  cabinet: ICabinet;
  diagnosis: string | null;
  date: string;
}

export interface CreateSchedule {
  doctor: number;
  cabinet: number;
  patient: number;
  date: moment.Moment;
  diagnosis: string;
}
