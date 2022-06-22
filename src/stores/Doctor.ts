import { makeAutoObservable, observable, action } from 'mobx';

import { api } from 'config';

import { CreateDoctor, Doctor, SpecialistType } from 'models';

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

  @action async getDoctorsByDate(date: moment.Moment) {
    const { data } = await api.get(`doctors/free/at?date=${date.format('YYYY-MM-DD H:mm')}`);

    return data;
  }

  @action async getDoctorsByDateAndType(date: moment.Moment, type: SpecialistType) {
    const { data } = await api.get(`doctors/free/at/specialist?date=${date.format('YYYY-MM-DD H:mm')}&specialistType=${type}`);

    return data;
  }
}

export default new DoctorStore();
