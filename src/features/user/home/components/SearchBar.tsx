import { useState } from "react";
import { FaSearch, FaChevronDown, FaMapMarkerAlt, FaTags } from "react-icons/fa";

// Dữ liệu mẫu cho các khu vực
const districts = [
  "Quận 1", "Quận 2", "Quận 3", "Quận 4", "Quận 5", "Quận 6",
  "Quận 7", "Quận 8", "Quận 9", "Quận 10", "Quận 11", "Quận 12",
  "Quận Bình Thạnh", "Quận Phú Nhuận", "Quận Tân Bình", "Quận Tân Phú",
  "Quận Gò Vấp", "Quận Bình Tân", "Thủ Đức"
];

// Dữ liệu mẫu cho các danh mục
const categories = [
  { id: 1, name: "Tất cả" },
  { id: 2, name: "Spa & Massage" },
  { id: 3, name: "Làm Đẹp" },
  { id: 4, name: "Tóc & Nail" },
  { id: 5, name: "Gym & Fitness" },
  { id: 6, name: "Nha Khoa" },
  { id: 7, name: "Thẩm Mỹ" }
];

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [isDistrictOpen, setIsDistrictOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [filteredDistricts, setFilteredDistricts] = useState<string[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      searchTerm,
      selectedCategory,
      selectedDistrict
    });
    // Implement search functionality here
  };

  const handleDistrictFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelectedDistrict(value);

    if (value.trim() === "") {
      setFilteredDistricts(districts);
    } else {
      const filtered = districts.filter(district =>
        district.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredDistricts(filtered);
    }
  };

  return (
    <div className="relative mx-auto px-4 -mt-20 sm:-mt-24 md:-mt-32 z-30 max-w-6xl">

      <form
        onSubmit={handleSearch}
        className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg backdrop-blur-sm bg-opacity-90 border border-gray-100 relative z-10"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaSearch className="text-blue-500" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm địa điểm..."
              className="block w-full pl-12 pr-4 py-4 border-0 rounded-xl shadow-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Dropdown */}
          <div className="relative min-w-[180px]">
            <button
              type="button"
              className="flex items-center justify-between w-full px-4 py-4 border-0 rounded-xl bg-gray-50 text-gray-700 shadow-sm hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              onClick={() => {
                setIsCategoryOpen(!isCategoryOpen);
                setIsDistrictOpen(false);
              }}
            >
              <div className="flex items-center">
                <FaTags className="mr-3 text-blue-500" />
                <span className="truncate">
                  {selectedCategory || "Danh mục"}
                </span>
              </div>
              <FaChevronDown className={`ml-2 text-gray-400 transition-transform duration-200 ${isCategoryOpen ? 'transform rotate-180' : ''}`} />
            </button>

            {isCategoryOpen && (
              <div className="absolute left-0 right-0 mt-2 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 max-h-60 overflow-y-auto animate-slideDown">
                <div className="py-1">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      className={`w-full text-left px-4 py-3 text-sm hover:bg-blue-50 flex items-center ${selectedCategory === category.name ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                      onClick={() => {
                        setSelectedCategory(category.name);
                        setIsCategoryOpen(false);
                      }}
                    >
                      {selectedCategory === category.name && (
                        <span className="mr-2 text-blue-500">✓</span>
                      )}
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* District Dropdown */}
          <div className="relative min-w-[180px]">
            <button
              type="button"
              className="flex items-center justify-between w-full px-4 py-4 border-0 rounded-xl bg-gray-50 text-gray-700 shadow-sm hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              onClick={() => {
                setIsDistrictOpen(!isDistrictOpen);
                setIsCategoryOpen(false);
                if (!isDistrictOpen) {
                  setFilteredDistricts(districts);
                }
              }}
            >
              <div className="flex items-center">
                <FaMapMarkerAlt className="mr-3 text-blue-500" />
                <span className="truncate">
                  {selectedDistrict || "Khu vực"}
                </span>
              </div>
              <FaChevronDown className={`ml-2 text-gray-400 transition-transform duration-200 ${isDistrictOpen ? 'transform rotate-180' : ''}`} />
            </button>

            {isDistrictOpen && (
              <div className="absolute left-0 right-0 mt-2 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 animate-slideDown">
                <div className="p-3">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaSearch className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Tìm khu vực..."
                      className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={selectedDistrict}
                      onChange={handleDistrictFilter}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
                <div className="py-1 max-h-48 overflow-y-auto">
                  {filteredDistricts.length > 0 ? (
                    filteredDistricts.map((district) => (
                      <button
                        key={district}
                        type="button"
                        className={`w-full text-left px-4 py-3 text-sm hover:bg-blue-50 flex items-center ${selectedDistrict === district ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                        onClick={() => {
                          setSelectedDistrict(district);
                          setIsDistrictOpen(false);
                        }}
                      >
                        {selectedDistrict === district && (
                          <span className="mr-2 text-blue-500">✓</span>
                        )}
                        {district}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-500 text-center">
                      Không tìm thấy khu vực
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
          >
            <FaSearch className="mr-2" />
            Tìm kiếm
          </button>
        </div>

        {/* Popular searches */}
        <div className="mt-4 flex flex-wrap gap-2 text-sm text-gray-600">
          <span>Tìm kiếm phổ biến:</span>
          <a href="#" className="text-blue-600 hover:underline">Spa cao cấp</a>
          <span>•</span>
          <a href="#" className="text-blue-600 hover:underline">Massage thư giãn</a>
          <span>•</span>
          <a href="#" className="text-blue-600 hover:underline">Nails tại Quận 1</a>
        </div>
      </form>

      {/* Add animation classes to global CSS */}
      <style>
        {`
          @keyframes blob {
            0% { transform: scale(1); }
            33% { transform: scale(1.1); }
            66% { transform: scale(0.9); }
            100% { transform: scale(1); }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
          @keyframes slideDown {
            0% { opacity: 0; transform: translateY(-10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-slideDown {
            animation: slideDown 0.2s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
};

export default SearchBar;