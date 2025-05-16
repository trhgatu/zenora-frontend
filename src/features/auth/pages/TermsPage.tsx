import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function TermsPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-blue-50 to-gray-100 py-12">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl p-10 transform transition-all duration-500 hover:shadow-2xl">
        <h1 className="text-4xl font-extrabold mb-6 text-center text-gray-900 tracking-tight animate-fadeInUp">
          Điều khoản sử dụng
        </h1>

        <div className="space-y-6 text-gray-700 leading-relaxed max-h-[70vh] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-cyan-500 scrollbar-track-gray-100">
          <p className="text-lg animate-fadeInUp animation-delay-200">
            Chào mừng bạn đến với <span className="font-semibold text-cyan-600">Zenora</span> - nền tảng kết nối dịch vụ spa hàng đầu tại Việt Nam! Trước khi sử dụng dịch vụ của chúng tôi, xin bạn vui lòng đọc kỹ các Điều khoản sử dụng dưới đây để hiểu rõ quyền và nghĩa vụ của mình.
          </p>

          <div className="animate-fadeInUp animation-delay-400">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">1. Chấp nhận điều khoản</h2>
            <p>
              Khi bạn đăng ký tài khoản hoặc sử dụng dịch vụ của Zenora, bạn đồng ý tuân thủ các điều khoản và điều kiện sau. Nếu bạn không đồng ý với bất kỳ điều khoản nào, xin vui lòng ngừng sử dụng nền tảng ngay lập tức.
            </p>
          </div>

          <div className="animate-fadeInUp animation-delay-600">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">2. Quy tắc sử dụng</h2>
            <ul className="list-disc list-inside pl-4 space-y-3">
              <li>Không sử dụng dịch vụ cho bất kỳ mục đích nào vi phạm pháp luật Việt Nam hoặc quốc tế.</li>
              <li>Bảo mật thông tin đăng nhập (tên người dùng, mật khẩu) và không chia sẻ với bất kỳ ai.</li>
              <li>Tôn trọng quyền riêng tư, nội dung và thông tin cá nhân của người dùng khác trên nền tảng.</li>
              <li>Không phát tán nội dung gây tổn hại, kích động bạo lực, lừa đảo hoặc vi phạm đạo đức xã hội.</li>
              <li>Không sử dụng các công cụ tự động (bot, script) để truy cập hoặc khai thác dữ liệu từ nền tảng mà không được phép.</li>
              <li>Zenora có quyền tạm ngưng hoặc xóa tài khoản của bạn nếu phát hiện bất kỳ hành vi vi phạm nào.</li>
            </ul>
          </div>

          <div className="animate-fadeInUp animation-delay-800">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">3. Cập nhật điều khoản</h2>
            <p>
              Chúng tôi có thể cập nhật hoặc thay đổi các điều khoản này theo thời gian mà không cần thông báo trước. Mọi thay đổi sẽ có hiệu lực ngay khi được đăng tải trên nền tảng. Việc bạn tiếp tục sử dụng dịch vụ sau khi có thay đổi đồng nghĩa với việc bạn đã chấp nhận các điều khoản mới.
            </p>
          </div>

          <div className="animate-fadeInUp animation-delay-1000">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">4. Quyền và trách nhiệm của Zenora</h2>
            <p>
              Zenora cam kết bảo mật thông tin người dùng theo chính sách bảo mật của chúng tôi. Tuy nhiên, chúng tôi không chịu trách nhiệm cho bất kỳ thiệt hại nào phát sinh từ việc sử dụng sai mục đích hoặc vi phạm điều khoản từ phía người dùng.
            </p>
          </div>

          <div className="animate-fadeInUp animation-delay-1200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">5. Liên hệ hỗ trợ</h2>
            <p>
              Nếu bạn có bất kỳ câu hỏi, thắc mắc hoặc cần hỗ trợ về điều khoản sử dụng, vui lòng liên hệ với chúng tôi qua:
            </p>
            <ul className="list-none pl-4 space-y-2 mt-2">
              <li className="flex items-center gap-2">
                <i className="fas fa-envelope text-cyan-600" />
                <span><strong>Email:</strong> support@zenora.vn</span>
              </li>
              <li className="flex items-center gap-2">
                <i className="fas fa-phone text-cyan-600" />
                <span><strong>Hotline:</strong> 1900 6868</span>
              </li>
              <li className="flex items-center gap-2">
                <i className="fas fa-clock text-cyan-600" />
                <span><strong>Thời gian làm việc:</strong> 8:00 - 17:00, Thứ Hai - Thứ Bảy</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex justify-center animate-fadeInUp animation-delay-1400">
          <Link to="/register">
            <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl">
              Quay lại đăng ký
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};