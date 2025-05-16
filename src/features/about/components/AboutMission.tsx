import React from 'react';

const AboutMission = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-100">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-1/2 animate-fadeInUp">
          <div className="overflow-hidden rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-500">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
              alt="Sứ mệnh Zenora"
              className="w-full h-96 object-cover"
            />
          </div>
        </div>
        <div className="md:w-1/2 text-center md:text-left animate-fadeInUp animation-delay-200">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Sứ mệnh của chúng tôi
          </h2>
          <p className="text-gray-700 text-lg md:text-xl leading-relaxed max-w-lg">
            Zenora cam kết mang đến trải nghiệm thư giãn và chăm sóc sức khỏe tuyệt vời. Chúng tôi kết nối khách hàng với các spa chất lượng cao, sử dụng công nghệ tiên tiến để đảm bảo sự tiện lợi và hài lòng tối đa.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutMission;