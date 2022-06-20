export type CabinetType = 'ACCEPTANCE' | 'OPERATING_ROOM' | 'DRESSING_ROOM';

export interface ICabinet extends CreateCabinet {
  id: number;
}

export interface CreateCabinet {
  number: number;
  floor: number;
  cabinetType: CabinetType;
}
