import React, { useState } from 'react';
import { Modal, Form, Select, Input, Button } from 'antd';

import { useStore } from 'stores';

import { Doctor } from 'models';

interface Props {
  children: React.ReactNode;
  update: () => void;
  doctor?: Doctor;
}

const { useForm, Item } = Form;

const DoctorModal: React.FC<Props> = ({ children, update, doctor }) => {
  const [form] = useForm();
  const { doctorsStore } = useStore();

  const [open, setOpen] = useState<boolean>(false);
  const [info, setInfo] = useState<Partial<Doctor>>(doctor ? doctor : {});

  const onToggle = () => {
    !open && form.resetFields();

    setOpen(!open);
  };

  const submit = async () => {
    if (doctor) {
      await doctorsStore.updateDoctor(doctor.id, info);
    } else {
      await doctorsStore.createDoctor(info);
    }

    onToggle();
    await update();
  };

  const inputHandler = (field: keyof Doctor, value: string) => {
    setInfo({
      ...info,
      [field]: value,
    });
  };

  const deleteDoctor = async (id: number) => {
    await doctorsStore.deleteDoctor(id);

    onToggle();
    await update();
  };

  return (
    <>
      {React.cloneElement(children as React.ReactElement<any>, {
        onClick: onToggle,
      })}

      <Modal visible={open} footer={false} onCancel={onToggle} centered>
        <Form
          layout="vertical"
          validateTrigger={['onBlur', 'onChange', 'onSubmit']}
          onFinish={submit}
          form={form}
          initialValues={doctor ? { ...info } : {}}
        >
          <Item name="firstName" label="First Name" rules={[{ required: true, message: 'This field is required' }]}>
            <Input placeholder="Mike" onChange={e => {
              inputHandler('firstName', e.target.value);
            }} />
          </Item>

          <Item name="lastName" label="Last Name" rules={[{ required: true, message: 'This field is required' }]}>
            <Input placeholder="Vazovskiy" onChange={e => {
              inputHandler('lastName', e.target.value);
            }} />
          </Item>

          <Item name="specialistType" label="Specialization" rules={[{ required: true, message: 'This field is required' }]}>
            <Select
              placeholder="Category"
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
              onSelect={(e: string) => {
                inputHandler('specialistType', e);
              }}
            />
          </Item>

          <Button htmlType="submit">
            {doctor ? 'Update' : 'Create'}
          </Button>

          {doctor && (
            <Button onClick={() => {
              deleteDoctor(doctor.id);
            }} style={{ marginLeft: '20px' }} danger>
              Delete
            </Button>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default DoctorModal;