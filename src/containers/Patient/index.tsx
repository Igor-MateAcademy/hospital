import React, { useEffect, useState } from 'react';
import { Button, Avatar } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import stringToColor from 'string-to-color';

import { Template } from 'containers';
import PatientModal from './Modal';

import { useStore } from 'stores';

import { Patient as IPatient } from 'models';

import styles from './styles.module.scss';

const Patient: React.FC = () => {
  const { patientsStore } = useStore();

  const [patients, setPatients] = useState<IPatient[]>([]);

  const init = async () => {
    const _patients = await patientsStore.getPatients();

    setPatients(_patients);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <Template>
      <div className={styles.top}>
        <h1 className={styles.title}>Patient</h1>

        <PatientModal update={init}>
          <Button icon={<UserAddOutlined />} className={styles.create} size="large" style={{ width: '160px' }}>Create</Button>
        </PatientModal>
      </div>

      <ul className={styles.list}>
        {patients.map(patient => {
          const name = `${patient.firstName} ${patient.lastName}`;
          const initials = `${patient.firstName.split('')[0]}${patient.lastName.split('')[0]}`

          return (
            <li key={patient.id} className={styles.item}>
              <PatientModal update={init} patient={patient}>
                <button className={styles.button}>
                  <Avatar style={{ backgroundColor: stringToColor(name) }} size={56}>
                    {initials}
                  </Avatar>

                  <div className={styles.name}>
                    {name}
                  </div>

                  <div className={styles.phone}>
                    {patient.phone}
                  </div>
                </button>
              </PatientModal>
            </li>
          );
        })}
      </ul>
    </Template>
  );
};

export default Patient;
