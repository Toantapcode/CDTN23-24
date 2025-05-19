import { Button, Modal, Descriptions } from "antd";

function ModalRoom({ open, setOpen, room }) {

    return (
        <Modal
            title={<h3>Thông tin phòng {room?.name || ''}</h3>}
            footer={
                <Button type="primary" onClick={() => setOpen(false)}>
                    Close
                </Button>
            }
            open={open}
            onCancel={() => setOpen(false)}
            styles={{
                mask: { backgroundColor: 'rgba(0, 0, 0, 0.4)' }
            }}
            centered
        >
            <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Mã đặt phòng">
                    {room?.booking?.bookingCode}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày nhận phòng">
                    {room?.booking?.checkInDate}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày trả phòng">
                    {room?.booking?.checkOutDate}
                </Descriptions.Item>
                <Descriptions.Item label="Người đặt">
                    {room?.booking?.user?.name} ({room?.booking?.user?.phone})
                </Descriptions.Item>
                <Descriptions.Item label="Email người đặt">
                    {room?.booking?.user?.email}
                </Descriptions.Item>
                <Descriptions.Item label="Số người lớn / trẻ em">
                    {room?.booking?.numOfAdults} người lớn, {room?.booking?.numOfChild} trẻ em
                </Descriptions.Item>
            </Descriptions>
        </Modal>
    );
}

export default ModalRoom;
