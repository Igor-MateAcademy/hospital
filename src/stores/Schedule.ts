import { makeAutoObservable, observable, action } from 'mobx';

import { api } from 'config';

import { ISchedule, CreateSchedule } from 'models';

class ScheduleStore {
  constructor() {
    makeAutoObservable(this);
  }

  @observable appointments: ISchedule[] = [];

  @action async getAllAppointments() {
    const { data } = await api.get('schedules');

    this.appointments = data;

    return data;
  }

  @action async createAppointment(dto: Partial<CreateSchedule>) {
    const { data } = await api.post(`schedules?doctorId=${dto.doctor}&cabinetId=${dto.cabinet}&patientId=${dto.patient}&date=${dto.date?.format('YYYY-MM-DD H:mm')}`, { diagnosis: dto.diagnosis });

    this.appointments.push(data);
  }

  @action async updateSchedule(id: number, dto: Partial<CreateSchedule>) {
    await api.patch(`schedules?scheduleId=${id}&doctorId=${dto.doctor}&cabinetId=${dto.cabinet}&patientId=${dto.patient}&date=${dto.date?.format('YYYY-MM-DD H:mm')}`, { diagnosis: dto.diagnosis });
  }

  @action async deleteSchedule(id: number) {
    await api.delete(`schedules?scheduleId=${id}`);
  }
}

export default new ScheduleStore();