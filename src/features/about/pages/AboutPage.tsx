import React from 'react';
import AboutBanner from '../components/AboutBanner';
import AboutMission from '../components/AboutMission';
import AboutTeam from '../components/AboutTeam';
import AboutContact from '../components/AboutContact';

const AboutValues = () => {
  const values = [
    { title: "Chất lượng", description: "Hợp tác với các spa đạt tiêu chuẩn cao nhất.", icon: "🏆" },
    { title: "Đổi mới", description: "Ứng dụng công nghệ để tối ưu trải nghiệm.", icon: "💡" },
    { title: "Khách hàng", description: "Luôn đặt nhu cầu khách hàng làm trung tâm.", icon: "❤️" },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8 animate-fadeInUp tracking-tight">
          Giá trị cốt lõi
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="bg-gray-50 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 animate-fadeInUp"
              style={{ animationDelay: `${(index + 1) * 200}ms` }}
            >
              <div className="text-5xl mb-4">{value.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-200">
      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeInUp {
            animation: fadeInUp 1s ease-out forwards;
          }
          .animation-delay-200 {
            animation-delay: 200ms;
          }
          .animation-delay-400 {
            animation-delay: 400ms;
          }
        `}
      </style>
      <main className="flex-grow">
        <section className="relative">
          <AboutBanner />
        </section>
        <div className="space-y-12 md:space-y-16">
          <section className="py-8 md:py-16 bg-white">
            <AboutMission />
          </section>
          <section className="py-8 md:py-16">
            <AboutValues />
          </section>
          <section className="py-8 md:py-16 bg-gray-50">
            <AboutTeam />
          </section>
          <section className="py-8 md:py-16 bg-white">
            <AboutContact />
          </section>
        </div>
      </main>
    </div>
  );
};

export default AboutPage;