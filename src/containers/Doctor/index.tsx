import React, { useState, useEffect } from 'react';
import { Button, Avatar } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import stringToColor from 'string-to-color';

import { Template } from 'containers';

import DoctorModal from './Modal';

import { useStore } from 'stores';

import { Doctor as IDoctor } from 'models';

import styles from './styles.module.scss';

const CATEGORY = {
  'SURGEON': 'Surgeon', 'UROLOGIST': 'Urologist', 'NEUROLOGIST': 'Neurologist', 'PSYCHIATRIST': 'Psychiatrist', 'PEDIATRICIAN': 'Pediatrician'
};

const Doctor: React.FC = () => {
  const { doctorsStore } = useStore();

  const [doctors, setDoctors] = useState<IDoctor[]>([]);

  const init = async () => {
    const _doctors = await doctorsStore.getDoctors();

    setDoctors(_doctors);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <Template>
      <div className={styles.top}>
        <h1 className={styles.title}>Doctor</h1>

        <DoctorModal update={init}>
          <Button icon={<UserAddOutlined />} className={styles.create} size="large" style={{ width: '160px' }}>Create</Button>
        </DoctorModal>
      </div>

      <ul className={styles.list}>
        {doctors.map(doctor => {
          const name = `${doctor.firstName} ${doctor.lastName}`;
          const initials = `${doctor.firstName.split('')[0]}${doctor.lastName.split('')[0]}`

          return (
            <li key={doctor.id} className={styles.item}>
              <DoctorModal update={init} doctor={doctor}>
                <button className={styles.button}>
                  <Avatar style={{ backgroundColor: stringToColor(name) }} size={56}>
                    {initials}
                  </Avatar>

                  <div className={styles.name}>
                    {name}
                  </div>

                  <div className={styles.phone}>
                    {CATEGORY[doctor.specialistType]}
                  </div>
                </button>
              </DoctorModal>
            </li>
          );
        })}
      </ul>
    </Template>
  );
};

export default Doctor;
