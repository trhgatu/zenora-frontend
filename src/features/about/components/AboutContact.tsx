import React from 'react';

const AboutContact = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-12 animate-fadeInUp tracking-tight">
          Liên hệ với chúng tôi
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="animate-fadeInUp bg-white p-8 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Gửi tin nhắn</h3>
            <div className="space-y-5">
              <input
                type="text"
                placeholder="Họ và tên"
                className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 bg-gray-50"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 bg-gray-50"
              />
              <textarea
                placeholder="Tin nhắn của bạn"
                rows={5}
                className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 bg-gray-50"
              ></textarea>
              <button className="w-full bg-cyan-600 text-white py-3 px-8 rounded-lg hover:bg-cyan-700 transition-colors duration-300 font-semibold shadow-md">
                Gửi
              </button>
            </div>
            <div className="mt-8 text-gray-700 space-y-3">
              <p className="flex items-center gap-2">
                <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l9 6 9-6M3 8v8l9 6 9-6V8" />
                </svg>
                <strong>Email:</strong> support@zenora.vn
              </p>
              <p className="flex items-center gap-2">
                <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <strong>Hotline:</strong> 1900 6868
              </p>
            </div>
          </div>
          <div className="animate-fadeInUp animation-delay-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.669756321662!2d106.67914431528148!3d10.759922362441496!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f1b7c3ed289%3A0xa06651894598e488!2sHo%20Chi%20Minh%20City%2C%20Vietnam!5e0!3m2!1sen!2s!4v1634567890123!5m2!1sen!2s"
              className="w-full h-96 rounded-2xl shadow-lg border border-gray-100"
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutContact;