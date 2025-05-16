import React from 'react';

const AboutBanner = () => {
  return (
    <div className="relative bg-gradient-to-r from-blue-700 to-cyan-600 text-white py-28 px-6 text-center overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-25 bg-fixed"></div>
      <div className="relative z-10 animate-fadeInUp">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight drop-shadow-lg">Về Zenora</h1>
        <p className="mt-4 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
          Nền tảng kết nối dịch vụ spa hàng đầu tại Việt Nam, mang đến trải nghiệm thư giãn và chăm sóc sắc đẹp đỉnh cao cho mọi khách hàng.
        </p>
        <a
          href="/services"
          className="mt-8 inline-block bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-4 px-10 rounded-full hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-xl hover:shadow-2xl"
        >
          Khám Phá Dịch Vụ
        </a>
      </div>
    </div>
  );
};

export default AboutBanner;