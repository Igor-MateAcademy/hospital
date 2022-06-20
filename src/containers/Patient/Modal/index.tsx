import React, { useState } from 'react';
import { Modal, Form, Input, Button } from 'antd';

import { useStore } from 'stores';

import { Patient } from 'models';

interface Props {
  children: React.ReactNode;
  update: () => void;
  patient?: Patient;
}

const { useForm, Item } = Form;

const PatientModal: React.FC<Props> = ({ children, update, patient }) => {
  const [form] = useForm();
  const { patientsStore } = useStore();

  const [visible, setVisible] = useState<boolean>(false);
  const [info, setInfo] = useState<Partial<Patient>>(patient ? { ...patient } : {});

  const onToggle = () => {
    setVisible(!visible);
  };

  const submit = async () => {
    if (patient) {
      await patientsStore.updatePatient(patient.id, info);
    } else {
      await patientsStore.createPatient(info);
    }

    onToggle();
    await update();
  };

  const deletePatient = async (id: number) => {
    await patientsStore.deletePatient(id);

    onToggle();
    await update();
  };

  const inputHandler = (field: keyof Patient, value: string) => {
    setInfo({
      ...info,
      [field]: value,
    });
  };

  return (
    <>
      {React.cloneElement(children as React.ReactElement<any>, {
        onClick: onToggle,
      })}

      <Modal footer={null} centered onCancel={onToggle} visible={visible}>
        <Form
          layout="vertical"
          validateTrigger={['onChange', 'onBlur', 'onSubmit']}
          form={form}
          onFinish={submit}
          initialValues={{ ...info }}
        >
          <Item name="firstName" label="First Name" rules={[
            {
              required: true, message: 'Field is required',
            },
          ]}>
            <Input placeholder="John" onChange={e => {
              inputHandler('firstName', e.target.value);
            }} />
          </Item>

          <Item name="lastName" label="Last Name" rules={[
            {
              required: true, message: 'Field is required',
            },
          ]}>
            <Input placeholder="Smith" onChange={e => {
              inputHandler('lastName', e.target.value);
            }} />
          </Item>

          <Item name="phone" label="Phone" rules={[
            {
              required: true, message: 'Field is required',
            },
            {
              pattern: /^\+?[0-9]{0,15}$/g, message: 'Incorrect phone number. For example, +380123456789'
            },
          ]}>
            <Input placeholder="+380123456789" onChange={e => {
              inputHandler('phone', e.target.value);
            }} />
          </Item>

          <Button htmlType="submit">
            {patient ? 'Update' : 'Create'}
          </Button>

          {patient && (
            <Button onClick={() => {
              deletePatient(patient.id);
            }} style={{ marginLeft: '20px' }} danger>
              Delete
            </Button>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default PatientModal;
