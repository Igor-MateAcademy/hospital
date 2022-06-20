import { createContext, useContext } from 'react';
import { configure, observable } from 'mobx';

import patientsStore from './Patient';
import doctorsStore from './Doctor';
import cabinetsStore from './Cabinet';

configure({ enforceActions: 'observed' });

class RootStore {
  @observable patientsStore = patientsStore;
  @observable doctorsStore = doctorsStore;
  @observable cabinetsStore = cabinetsStore;
}

const rootStore = new RootStore();

export const StoreContext = createContext<RootStore>(rootStore);

export const useStore = (): RootStore => useContext(StoreContext);

export default new RootStore();