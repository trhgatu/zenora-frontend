import React from 'react';

const AboutTeam = () => {
  const team = [
    { name: "Nguyễn Anh Tuấn", role: "CEO & Nhà sáng lập", image: "https://randomuser.me/api/portraits/men/1.jpg" },
    { name: "Trần Thị Minh", role: "Giám đốc Công nghệ", image: "https://randomuser.me/api/portraits/women/2.jpg" },
    { name: "Lê Hoàng Nam", role: "Trưởng phòng Marketing", image: "https://randomuser.me/api/portraits/men/3.jpg" },
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8 animate-fadeInUp tracking-tight">
          Đội ngũ phát triển
        </h2>
        <p className="text-gray-700 text-lg md:text-xl max-w-3xl mx-auto mb-12 animate-fadeInUp animation-delay-200 leading-relaxed">
          Zenora được xây dựng bởi đội ngũ chuyên gia trẻ, đam mê công nghệ và chăm sóc sức khỏe. Chúng tôi không ngừng đổi mới để mang lại giá trị tốt nhất cho khách hàng.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 animate-fadeInUp"
              style={{ animationDelay: `${(index + 1) * 200}ms` }}
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-cyan-100"
              />
              <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
              <p className="text-gray-600">{member.role}</p>
              <div className="mt-4 flex justify-center gap-4">
                <a href="#" className="text-cyan-600 hover:text-cyan-800 transition-colors">LinkedIn</a>
                <a href="#" className="text-cyan-600 hover:text-cyan-800 transition-colors">Twitter</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutTeam;