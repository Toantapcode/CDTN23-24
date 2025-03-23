import { Form, Modal, Input } from 'antd';
import { useEffect } from 'react';

const RoomTypeForm = ({ visible, title, initialValues, onOk, onCancel }) => {
    const [form] = Form.useForm();
    useEffect(() => {
        form.setFieldsValue(initialValues || {});
    }, [initialValues, form]);

    return (
        <Modal title={title} open={visible} onOk={() => onOk(form)} onCancel={onCancel}>
            <Form form={form} layout="vertical">
                <Form.Item label="Tên loại phòng" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên loại phòng!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Số khách tối đa" name="maxGuests" rules={[{ required: true, message: 'Vui lòng nhập số khách tối đa!' }]}>
                    <Input type="number" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default RoomTypeForm;