import { Link } from 'react-router-dom';
import { FaSpa, FaPaintBrush, FaWalking, FaDumbbell, FaTooth, FaCut, FaHeart } from 'react-icons/fa';
import { ReactNode } from 'react';

interface Category {
  id: number;
  name: string;
  icon: ReactNode;
  color: string;
  description: string;
  link: string;
}

const categories: Category[] = [
  {
    id: 1,
    name: "Spa & Massage",
    icon: <FaSpa className="text-2xl md:text-3xl" />,
    color: "from-purple-500 to-purple-600",
    description: "Thư giãn với các dịch vụ spa và massage chất lượng cao",
    link: "/categories/spa-massage"
  },
  {
    id: 2,
    name: "Làm Đẹp",
    icon: <FaPaintBrush className="text-2xl md:text-3xl" />,
    color: "from-pink-500 to-pink-600",
    description: "Dịch vụ chăm sóc da, mỹ phẩm và làm đẹp toàn diện",
    link: "/categories/beauty"
  },
  {
    id: 3,
    name: "Tóc & Nail",
    icon: <FaCut className="text-2xl md:text-3xl" />,
    color: "from-yellow-500 to-yellow-600",
    description: "Tạo mẫu tóc, làm móng và các dịch vụ chăm sóc",
    link: "/categories/hair-nail"
  },
  {
    id: 4,
    name: "Gym & Fitness",
    icon: <FaDumbbell className="text-2xl md:text-3xl" />,
    color: "from-green-500 to-green-600",
    description: "Phòng tập thể dục, yoga và các lớp học thể hình",
    link: "/categories/gym-fitness"
  },
  {
    id: 5,
    name: "Nha Khoa",
    icon: <FaTooth className="text-2xl md:text-3xl" />,
    color: "from-blue-500 to-blue-600",
    description: "Chăm sóc nha khoa, tẩy trắng và điều trị răng miệng",
    link: "/categories/dental"
  },
  {
    id: 6,
    name: "Thẩm Mỹ",
    icon: <FaHeart className="text-2xl md:text-3xl" />,
    color: "from-red-500 to-red-600",
    description: "Các dịch vụ phẫu thuật thẩm mỹ và làm đẹp chuyên sâu",
    link: "/categories/cosmetic-surgery"
  },
  {
    id: 7,
    name: "Wellness",
    icon: <FaWalking className="text-2xl md:text-3xl" />,
    color: "from-indigo-500 to-indigo-600",
    description: "Chăm sóc sức khỏe toàn diện và liệu pháp phục hồi",
    link: "/categories/wellness"
  }
];

const CategorySection = () => {
  return (
    <section className="container mx-auto px-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-purple-200 rounded-full"></div>
        <div className="absolute top-1/2 -right-24 w-48 h-48 bg-blue-200 rounded-full"></div>
        <div className="absolute bottom-12 left-1/3 w-32 h-32 bg-pink-200 rounded-full"></div>
      </div>

      <div className="section-container relative z-10">
        {/* Section header */}
        <div className="mb-6">
          <h2 className="text-4xl font-bold py-2 text-gradient">Danh mục</h2>
          <div
            className="h-2 bg-gradient-to-r from-blue-300 to-blue-600 w-24 md:w-40 mt-1 origin-left rounded-r-full"
          />
          <p className="text-base mt-2">
            Tìm kiếm dịch vụ bạn cần từ hàng ngàn cơ sở làm đẹp và chăm sóc sức khỏe hàng đầu
          </p>
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link to={category.link} key={category.id} className="group">
              <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full flex flex-col">
                <div className={`bg-gradient-to-r ${category.color} p-6 flex justify-center items-center text-white`}>
                  <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center transform transition-transform group-hover:scale-110 group-hover:rotate-3">
                    {category.icon}
                  </div>
                </div>
                <div className="p-4 flex-grow">
                  <h3 className="font-bold text-lg mb-1">{category.name}</h3>
                  <p className="text-gray-600 text-sm">{category.description}</p>
                </div>
                <div className="px-4 pb-4">
                  <span className="text-sm font-medium text-blue-600 group-hover:text-blue-800 flex items-center">
                    Xem thêm
                    <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View all button */}
        <div className="mt-12 text-center">
          <Link to="/categories" className="btn-primary inline-flex items-center">
            Xem tất cả danh mục
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;