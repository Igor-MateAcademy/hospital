import React, { useState } from 'react';
import { Modal, Form, Select, Button, Input } from 'antd';

import { useStore } from 'stores';

import { ICabinet } from 'models';

interface Props {
  children: React.ReactNode;
  update: () => void;
  cabinet?: ICabinet;
}

const { useForm, Item } = Form;

const Cabinet: React.FC<Props> = ({ children, update, cabinet }) => {
  const [form] = useForm();
  const { cabinetsStore } = useStore();

  const [open, setOpen] = useState<boolean>(false);
  const [info, setInfo] = useState<Partial<ICabinet>>(cabinet ? cabinet : {});
  console.log(cabinet);

  const onToggle = () => {
    !open && form.resetFields();

    setOpen(!open);
  };

  const submit = async () => {
    if (cabinet) {
      await cabinetsStore.patchCabinet(cabinet.id, info);
    } else {
      await cabinetsStore.createCabinet(info);
    }

    onToggle();
    await update();
  };

  const inputHandler = (field: keyof ICabinet, value: string | number) => {
    setInfo({
      ...info,
      [field]: value,
    });
  };

  const deleteCabinet = async (id: number) => {
    await cabinetsStore.deleteCabinet(id);

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
          initialValues={{ ...info }}
        >
          <Item name="number" label="Number" rules={[{ required: true, message: 'This field is required' }, { pattern: /^[0-9]+$/g, message: 'Incorrect format' }]}>
            <Input addonBefore={'№'} onChange={e => {
            inputHandler('number', +e.target.value)
          }} />
          </Item>

          <Item name="floor" label="Floor" rules={[{ required: true, message: 'This field is required' }, { pattern: /^[0-9]+$/g, message: 'Incorrect format' }]}>
          <Input addonAfter={'fl.'} onChange={e => {
            inputHandler('floor', +e.target.value)
          }} />
          </Item>

          <Item name="cabinetType" label="Cabinet Type" rules={[{ required: true, message: 'This field is required' }]}>
            <Select
              placeholder="Category"
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
              onSelect={(e: string) => {
                inputHandler('cabinetType', e);
              }}
            />
          </Item>

          <Button htmlType="submit">
            {cabinet ? 'Update' : 'Create'}
          </Button>

          {cabinet && (
            <Button onClick={() => {
              deleteCabinet(cabinet.id);
            }} style={{ marginLeft: '20px' }} danger>
              Delete
            </Button>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default Cabinet;