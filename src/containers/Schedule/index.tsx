import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { CalendarOutlined, FieldNumberOutlined } from '@ant-design/icons';
import moment from 'moment';

import { Template } from 'containers';

import AppointmentModal from './Modal';

import { useStore } from 'stores';

import { ISchedule, Doctor, Patient } from 'models';

import styles from './styles.module.scss';

const Schedule: React.FC = () => {
  const { appointmentsStore } = useStore();
  const [appointments, setAppointments] = useState<ISchedule[]>([]);

  const init = async () => {
    const _appointments = await appointmentsStore.getAllAppointments();

    setAppointments(_appointments);
  };

  const getName = (obj: Doctor | Patient) => `${obj.firstName} ${obj.lastName}`; 

  useEffect(() => {
    init();
  }, []);

  return (
    <Template>
      <div className={styles.top}>
        <h1 className={styles.title}>Schedule</h1>

        <AppointmentModal update={init}>
          <Button icon={<CalendarOutlined />} className={styles.create} size="large" style={{ width: '160px' }}>Create</Button>
        </AppointmentModal>
      </div>

      <ul className={styles.list}>
        {appointments.map(a => (
          <li className={styles.item} key={a.id}>
            <AppointmentModal update={init} appointment={a}>
              <button className={styles.button}>
                <div className={styles.action}>
                  <span className={styles.patient}>
                    {getName(a.patient)}
                  </span>

                  <span className={styles.text}>
                    {` schedule appointment to `}
                  </span>

                  <span className={styles.doctor}>
                    {getName(a.doctor)}
                  </span>
                </div>

                <div className={styles.info}>
                  <span className={styles.date}>
                    {moment(a.date).format('DD MMM YYYY H:mm')}
                  </span>

                  <div className={styles.number}>
                    <FieldNumberOutlined style={{ marginRight: '12px', fontSize: '18px' }} />

                    <span>
                      {a.cabinet.number}
                    </span>
                  </div>
                </div>
              </button>
            </AppointmentModal>
          </li>
        ))}
      </ul>
    </Template>
  );
};

export default Schedule;
