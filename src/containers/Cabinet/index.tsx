import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { MedicineBoxOutlined, BuildOutlined, FieldNumberOutlined } from '@ant-design/icons';

import { Template } from 'containers';

import CabinetModal from './Modal';

import { useStore } from 'stores';

import { ICabinet } from 'models';

import styles from './styles.module.scss';

const CABINET = {
  'ACCEPTANCE': 'Acceptance',
  'DRESSING_ROOM': 'Dressing room',
  'OPERATING_ROOM': 'Operation room',
};

const Cabinet: React.FC = () => {
  const { cabinetsStore } = useStore();

  const [cabinets, setCabinets] = useState<ICabinet[]>([]);

  const init = async () => {
    const _cabinets = await cabinetsStore.getCabinets();

    setCabinets(_cabinets);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <Template>
      <div className={styles.top}>
        <h1 className={styles.title}>Cabinet</h1>

        <CabinetModal update={init}>
          <Button icon={<MedicineBoxOutlined />} className={styles.create} size="large" style={{ width: '160px' }}>Create</Button>
        </CabinetModal>
      </div>

      <ul className={styles.list}>
        {cabinets.map(cabinet => {
          return (
            <li key={cabinet.id} className={styles.item}>
              <CabinetModal update={init} cabinet={cabinet}>
                <button className={styles.button}>
                  <div className={styles.type}>
                    {CABINET[cabinet.cabinetType]}
                  </div>

                  <div className={styles.info}>
                    <div className={styles.part}>
                      <FieldNumberOutlined />

                      <span>{cabinet.number}</span>
                    </div>

                    <div className={styles.part}>
                      <BuildOutlined />

                      <span>{cabinet.floor}</span>
                    </div>
                  </div>
                </button>
              </CabinetModal>
            </li>
          );
        })}
      </ul>
    </Template>
  );
};

export default Cabinet;
