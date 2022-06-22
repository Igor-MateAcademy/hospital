import { makeAutoObservable, observable, action } from 'mobx';

import { api } from 'config';

import { ICabinet, CabinetType } from 'models';

class CabinetStore {
  constructor() {
    makeAutoObservable(this);
  }

  @observable cabinets: ICabinet[] = [];

  @action async getCabinets() {
    const { data } = await api.get('cabinets');

    this.cabinets = data;

    return data;
  }

  @action async createCabinet(dto: Partial<ICabinet>) {
    const { data } = await api.post('cabinets', dto);

    this.cabinets.push(data);
  }

  @action async patchCabinet(id: number, dto: Partial<ICabinet>) {
    await api.patch(`cabinets?cabinetId=${id}`, dto);
  }

  @action async deleteCabinet(id: number) {
    await api.delete(`cabinets?cabinetId=${id}`);
  }

  @action async getCabinetsByDate(date: moment.Moment) {
    const { data } = await api.get(`cabinets/free/at?date=${date.format('YYYY-MM-DD H:mm')}`);

    return data;
  }

  @action async getCabinetsByDateAndType(date: moment.Moment, type: CabinetType) {
    const { data } = await api.get(`cabinets/free/at/cabinet?date=${date.format('YYYY-MM-DD H:mm')}&cabinetType=${type}`);

    return data;
  }
}

export default new CabinetStore();
