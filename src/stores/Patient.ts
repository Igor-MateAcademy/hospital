import { makeAutoObservable, observable, action } from 'mobx';

import { api } from 'config';

import { Patient, CreatePatient } from 'models';

class PatientStore {
  constructor() {
    makeAutoObservable(this);
  }

  @observable patients: Patient[] = [];

  @action async getPatients() {
    const { data } = await api.get('/patients');

    this.patients = data;

    return data;
  }

  @action async createPatient(dto: Partial<CreatePatient>) {
    const { data } = await api.post('/patients', dto);

    this.patients.push(data);
  }

  @action async updatePatient(id: number, dto: Partial<Patient>) {
    await api.patch(`/patients?patientId=${id}`, dto);
  }

  @action async deletePatient(id: number) {
    await api.delete(`/patients?patientId=${id}`);
  }
}

export default new PatientStore();
