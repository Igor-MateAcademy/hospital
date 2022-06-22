import React, { useState, useEffect } from 'react';
import { Select, Input, Form, Modal, Button, DatePicker, TimePicker, Divider } from 'antd';
import moment from 'moment';

import { useStore } from 'stores';

import { ISchedule, Patient, Doctor, ICabinet, CabinetType, SpecialistType, CreateSchedule } from 'models';

interface Props {
  children: React.ReactNode;
  update: () => void;
  appointment?: ISchedule;
}

const { Item, useForm } = Form;

const AppointmentModal: React.FC<Props> = ({ children, update, appointment }) => {
  const [form] = useForm();
  const { patientsStore, doctorsStore, cabinetsStore, appointmentsStore } = useStore();

  const [open, setOpen] = useState<boolean>(false);
  const [info, setInfo] = useState<Partial<ISchedule>>(appointment ? { ...appointment } : {});
  console.log(info);
  const [datePlanned, setDatePlanned] = useState<moment.Moment>(appointment ? moment(appointment.date) : moment());
  const [options, setOptions] = useState({
    doctor: '',
    cabinet: '',
  });
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [cabinets, setCabinets] = useState<ICabinet[]>([]);

  const onToggle = () => {
    !open && form.resetFields();

    setOpen(!open);
  };

  const init = async () => {
    const _patients = await patientsStore.getPatients();
    const _doctors = await doctorsStore.getDoctorsByDate(datePlanned);
    const _cabinets = await cabinetsStore.getCabinetsByDate(datePlanned);

    setCabinets(appointment ? [..._cabinets, appointment.cabinet] : _cabinets);
    setDoctors(appointment ? [..._doctors, appointment.doctor] : _doctors);
    setPatients(_patients);
  };

  const fetchByAdditionalOptions = async () => {
    const { cabinet, doctor } = options;

    setCabinets(cabinet ? [...await cabinetsStore.getCabinetsByDateAndType(datePlanned, cabinet as CabinetType)] : [...await cabinetsStore.getCabinetsByDate(datePlanned)]);

    setDoctors(doctor ? [...await doctorsStore.getDoctorsByDateAndType(datePlanned, doctor as SpecialistType)] : [...await doctorsStore.getDoctorsByDate(datePlanned)]);
  };

  const submit = async () => {
    if (appointment) {
      await appointmentsStore.updateSchedule(appointment.id, {
        doctor: typeof info.doctor === 'object' ? info.doctor?.id : info.doctor,
        patient: typeof info.patient === 'object' ? info.patient?.id : info.patient,
        cabinet: typeof info.cabinet === 'object' ? info.cabinet?.id : info.cabinet,
        diagnosis: info.diagnosis ? info.diagnosis : '',
        date: datePlanned,
      });
    } else {
      await appointmentsStore.createAppointment({
        doctor: info.doctor as unknown as number,
        patient: info.patient as unknown as number,
        cabinet: info.cabinet as unknown as number,
        diagnosis: info.diagnosis ? info.diagnosis : '',
        date: datePlanned,
      });
    }

    onToggle();
    await update();
  };

  const deleteSchedule = async () => {
    appointment && await appointmentsStore.deleteSchedule(appointment.id);

    onToggle();
    await update();
  };

  const infoHandler = (field: keyof ISchedule, value: string | number) => {
    setInfo({
      ...info,
      [field]: value,
    });
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    fetchByAdditionalOptions();
  }, [options]);

  return (
    <>
      {React.cloneElement(children as React.ReactElement<any>, {
        onClick: onToggle,
      })}

      <Modal footer={null} visible={open} centered onCancel={onToggle}>
        <Form
          form={form}
          layout="vertical"
          validateTrigger={['onChange', 'onBlur', 'onSubmit']}
          onFinish={submit}
          initialValues={appointment
            ? {
              doctor: appointment.doctor.id,
              patient: appointment.patient.id,
              cabinet: appointment.cabinet.id,
              date: datePlanned,
              time: datePlanned,
              diagnosis: appointment.diagnosis,
            }
            : { date: datePlanned, time: datePlanned }}>
          <div style={{
            display: 'flex',
            gap: '24px',
          }}>
            <Item name="date" label="Date" rules={[{ required: true, message: 'This field is required' }]}>
              <DatePicker value={datePlanned} format="DD MMM YYYY" onChange={e => {
                e && setDatePlanned(moment(datePlanned).date(e.date()));
              }} />
            </Item>

            <Item name="time" label="Time" rules={[{ required: true, message: 'This field is required' }]}>
              <TimePicker value={datePlanned} format="H:mm" onChange={e => {
                e && setDatePlanned(moment(datePlanned).hours(e.hours()).minutes(e.minutes()));
              }} />
            </Item>
          </div>

          <Divider />

          <Item name="doctor" label="Doctor" rules={[{ required: true, message: 'This field is required' }]}>
            <Select
              options={[
                ...doctors.map(d => ({ value: d.id, label: `${d.firstName} ${d.lastName}` }))
              ]}
              onSelect={(e: number) => {
                infoHandler('doctor', e);
              }}
            />
          </Item>

          <Item name="doctorType" label="Doctor type">
            <Select
              allowClear
              options={[
                {
                  label: 'Surgeon',
                  value: 'SURGEON',
                },
                {
                  label: 'Urologist',
                  value: 'UROLOGIST',
                },
                {
                  label: 'Neurologist',
                  value: 'NEUROLOGIST',
                },
                {
                  label: 'Psychiatrist',
                  value: 'PSYCHIATRIST',
                },
                {
                  label: 'Pediatrician',
                  value: 'PEDIATRICIAN',
                },
              ]}
              onChange={(e: string) => {
                setOptions({
                  ...options,
                  doctor: e,
                });
              }}
              onClear={() => {
                setOptions({
                  ...options,
                  doctor: '',
                });
              }}
            />
          </Item>

          <Divider />

          <Item name="cabinet" label="Cabinet" rules={[{ required: true, message: 'This field is required' }]}>
            <Select
              options={[
                ...cabinets.map(c => ({ value: c.id, label: `№ ${c.number}` }))
              ]}
              onSelect={(e: number) => {
                infoHandler('cabinet', e);
              }}
            />
          </Item>

          <Item name="cabinetType" label="Cabinet type">
            <Select
              allowClear
              options={[
                {
                  label: 'Acceptance',
                  value: 'ACCEPTANCE',
                },
                {
                  label: 'Operating room',
                  value: 'OPERATING_ROOM',
                },
                {
                  label: 'Dressing room',
                  value: 'DRESSING_ROOM',
                },
              ]}
              onChange={(e: string) => {
                setOptions({
                  ...options,
                  cabinet: e,
                });
              }}
              onClear={() => {
                setOptions({
                  ...options,
                  cabinet: '',
                });
              }}
            />
          </Item>

          <Divider />

          <Item name="patient" label="Patient" rules={[{ required: true, message: 'This field is required' }]}>
            <Select
              options={[
                ...patients.map(p => ({ value: p.id, label: `${p.firstName} ${p.lastName}` }))
              ]}
              onSelect={(e: number) => {
                infoHandler('patient', e);
              }}
            />
          </Item>

          <Divider />

          <Item name="diagnosis" label="Diagnosis">
            <Input placeholder="Diagnosis" onChange={e => {
              infoHandler('diagnosis', e.target.value);
            }} />
          </Item>

          <Button htmlType="submit">
            {appointment ? 'Update' : 'Schedule'}
          </Button>

          {appointment && (
            <Button onClick={deleteSchedule} style={{ marginLeft: '20px' }} danger>
              Delete
            </Button>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default AppointmentModal;
