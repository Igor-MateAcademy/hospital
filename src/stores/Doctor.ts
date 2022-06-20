import { makeAutoObservable, observable, action } from 'mobx';

import { api } from 'config';

import { CreateDoctor, Doctor } from 'models';

class DoctorStore {
  constructor() {
    makeAutoObservable(this);
  }

  @observable doctors: Doctor[] = [];

  @action async getDoctors() {
    const { data } = await api.get('/doctors');

    this.doctors = data;

    return data;
  }

  @action async createDoctor(dto: Partial<CreateDoctor>) {
    const { data } = await api.post('/doctors', dto);

    this.doctors.push(data);
  }

  @action async updateDoctor(id: number, dto: Partial<CreateDoctor>) {
    await api.patch(`/doctors?doctorId=${id}`, dto);
  }

  @action async deleteDoctor(id: number) {
    await api.delete(`/doctors?doctorId=${id}`);
  }
}

export default new DoctorStore();
