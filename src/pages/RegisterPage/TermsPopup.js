import React from 'react';

const TermsPopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 m-4">
        <h2 className="text-2xl font-bold mb-4">Điều khoản và Chính sách</h2>
        
        <div className="space-y-4 text-gray-700">
          <section>
            <h3 className="text-lg font-semibold">1. Chấp nhận Điều khoản</h3>
            <p>
              Bằng việc sử dụng dịch vụ của LuxeStay, quý khách đồng ý tuân thủ các điều khoản và điều kiện được nêu trong tài liệu này. Nếu quý khách không đồng ý, vui lòng không sử dụng dịch vụ của chúng tôi.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold">2. Đặt phòng và Thanh toán</h3>
            <p>
              - Mọi đặt phòng phải được thực hiện qua hệ thống trực tuyến của LuxeStay.<br/>
              - Thanh toán phải được hoàn tất tại thời điểm đặt phòng hoặc theo chính sách cụ thể của từng loại phòng.<br/>
              - LuxeStay có quyền từ chối hoặc hủy đặt phòng nếu phát hiện gian lận hoặc vi phạm.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold">3. Chính sách Hủy phòng</h3>
            <p>
              - Hủy phòng miễn phí nếu được thực hiện trước 48 giờ so với ngày nhận phòng.<br/>
              - Phí hủy phòng sẽ được áp dụng theo chính sách cụ thể của từng loại phòng.<br/>
              - Không hoàn tiền cho các đặt phòng không thể hủy.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold">4. Quy định Sử dụng</h3>
            <p>
              - Khách hàng chịu trách nhiệm bảo vệ tài sản cá nhân trong suốt thời gian lưu trú.<br/>
              - Cấm hút thuốc trong phòng và các khu vực công cộng trong khách sạn.<br/>
              - Mọi thiệt hại đối với tài sản khách sạn sẽ được bồi thường theo giá trị thực tế.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold">5. Bảo mật Thông tin</h3>
            <p>
              - LuxeStay cam kết bảo vệ thông tin cá nhân của khách hàng theo quy định pháp luật.<br/>
              - Thông tin cá nhân chỉ được sử dụng để xử lý đặt phòng và cung cấp dịch vụ liên quan.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold">6. Trách nhiệm Pháp lý</h3>
            <p>
              LuxeStay không chịu trách nhiệm cho các thiệt hại gián tiếp hoặc ngẫu nhiên phát sinh từ việc sử dụng dịch vụ, trừ khi có quy định khác từ pháp luật.
            </p>
          </section>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-black/80 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsPopup;