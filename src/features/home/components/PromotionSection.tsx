import { Link } from 'react-router-dom';
import { FaRegClock, FaMapMarkerAlt, FaStar, FaAngleRight, FaArrowRight } from 'react-icons/fa';

interface Promotion {
  id: number;
  title: string;
  description: string;
  discount: string;
  imageUrl: string;
  location: string;
  expiry: string;
  rating: number;
  link: string;
}

const promotions: Promotion[] = [
  {
    id: 1,
    title: 'Spa Trị Liệu Mùa Hè',
    description: 'Trải nghiệm liệu pháp đá nóng và tinh dầu thiên nhiên giúp thư giãn cơ thể',
    discount: '30%',
    imageUrl: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    location: 'Quận 1, TP.HCM',
    expiry: '30/08/2023',
    rating: 4.8,
    link: '/promotion/1'
  },
  {
    id: 2,
    title: 'Chăm Sóc Da Toàn Diện',
    description: 'Liệu trình làm sạch sâu, đắp mặt nạ vàng 24k và massage mặt',
    discount: '25%',
    imageUrl: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    location: 'Quận 3, TP.HCM',
    expiry: '15/09/2023',
    rating: 4.6,
    link: '/promotion/2'
  },
  {
    id: 3,
    title: 'Combo Tóc & Nail',
    description: 'Cắt, nhuộm, phục hồi tóc kết hợp làm móng gel cao cấp',
    discount: '40%',
    imageUrl: 'https://images.unsplash.com/photo-1595867818082-083862f3aaf4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    location: 'Quận 7, TP.HCM',
    expiry: '10/09/2023',
    rating: 4.7,
    link: '/promotion/3'
  }
];

const PromotionSection = () => {
  return (
    <section className="bg-gradient-to-br from-indigo-50 to-blue-50 relative overflow-hidden mx-auto px-4 container">
      {/* Decorative elements */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-200 rounded-full filter blur-3xl opacity-30"></div>
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-200 rounded-full filter blur-3xl opacity-30"></div>


      <div className="section-container relative z-10">
        {/* Section header */}
        <div className="section-header">
          <h2 className="section-title">
            <span className="text-gradient">Ưu Đãi Đặc Biệt</span>
          </h2>
          <p className="section-subtitle">
            Khám phá những ưu đãi hấp dẫn từ các cơ sở làm đẹp và spa hàng đầu
          </p>
        </div>

        {/* Promotions grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {promotions.map((promo) => (
            <Link to={promo.link} key={promo.id} className="group">
              <div className="bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                {/* Image container */}
                <div className="relative">
                  <img
                    src={promo.imageUrl}
                    alt={promo.title}
                    className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Discount badge */}
                  <div className="absolute top-4 right-4 bg-red-500 text-white font-bold px-3 py-1 rounded-full shadow-lg">
                    {promo.discount} OFF
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-grow flex flex-col">
                  <h3 className="font-bold text-xl mb-2 group-hover:text-blue-600 transition-colors">{promo.title}</h3>
                  <p className="text-gray-600 mb-4 text-sm flex-grow">{promo.description}</p>

                  {/* Info */}
                  <div className="flex flex-wrap gap-3 mb-3 text-sm text-gray-500">
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="text-blue-500 mr-1" />
                      {promo.location}
                    </div>
                    <div className="flex items-center">
                      <FaRegClock className="text-blue-500 mr-1" />
                      Đến {promo.expiry}
                    </div>
                    <div className="flex items-center">
                      <FaStar className="text-yellow-500 mr-1" />
                      {promo.rating}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-auto pt-3 border-t border-gray-100">
                    <span className="inline-flex items-center text-blue-600 font-medium group-hover:text-blue-800">
                      Xem chi tiết
                      <FaAngleRight className="ml-1 group-hover:ml-2 transition-all" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View all promotions button */}
        <div className="mt-12 text-center">
          <Link to="/promotions" className="btn-primary inline-flex items-center px-8 py-4">
            Xem tất cả ưu đãi
            <FaArrowRight className="ml-2" />
          </Link>
        </div>
      </div>

      <div className="wave-divider absolute bottom-0 left-0 w-full">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" fill="#ffffff"></path>
        </svg>
      </div>
    </section>
  );
};

export default PromotionSection;