import { Link } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaRegClock, FaHeart, FaRegHeart, FaArrowRight } from 'react-icons/fa';
import { IFacility } from '@/features/facility/types/facility';
// Sample data for different facility types
const facilityData: Record<string, IFacility[]> = {
  featured: [
    {
      _id: 1,
      name: "Lavender Spa & Wellness Center",
      imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      rating: 4.8,
      reviewCount: 124,
      category: "Spa & Massage",
      location: "Quận 1, TP.HCM",
      openHours: "09:00 - 21:00",
      priceRange: "$$",
      isFavorite: true,
      tags: ["Hot Stone", "Aromatherapy", "Facial"],
      link: "/facility/1"
    },
    {
      _id: 2,
      name: "Elite Fitness & Yoga Studio",
      imageUrl: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1075&q=80",
      rating: 4.6,
      reviewCount: 98,
      category: "Gym & Fitness",
      location: "Quận 7, TP.HCM",
      openHours: "06:00 - 22:00",
      priceRange: "$$$",
      isFavorite: false,
      tags: ["Yoga", "Personal Training", "Pool"],
      link: "/facility/2"
    },
    {
      _id: 3,
      name: "Aurora Beauty & Cosmetic Clinic",
      imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      rating: 4.9,
      reviewCount: 156,
      category: "Làm Đẹp",
      location: "Quận 3, TP.HCM",
      openHours: "10:00 - 20:00",
      priceRange: "$$$",
      isFavorite: true,
      tags: ["Facial", "Skin Care", "Anti-aging"],
      link: "/facility/3"
    },
    {
      _id: 4,
      name: "Zen Dental Care",
      imageUrl: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
      rating: 4.7,
      reviewCount: 78,
      category: "Nha Khoa",
      location: "Quận Phú Nhuận, TP.HCM",
      openHours: "08:00 - 19:00",
      priceRange: "$$",
      isFavorite: false,
      tags: ["Teeth Whitening", "Cleaning", "Orthodontics"],
      link: "/facility/4"
    }
  ],
  suggested: [
    {
      _id: 5,
      name: "Serenity Day Spa",
      imageUrl: "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      rating: 4.5,
      reviewCount: 87,
      category: "Spa & Massage",
      location: "Quận 2, TP.HCM",
      openHours: "10:00 - 22:00",
      priceRange: "$$",
      isFavorite: true,
      tags: ["Thai Massage", "Reflexology", "Sauna"],
      link: "/facility/5"
    },
    {
      _id: 6,
      name: "Glamour Hair & Nail Salon",
      imageUrl: "https://images.unsplash.com/photo-1635273051839-03c73069434b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      rating: 4.7,
      reviewCount: 112,
      category: "Tóc & Nail",
      location: "Quận 3, TP.HCM",
      openHours: "09:00 - 20:00",
      priceRange: "$$",
      isFavorite: false,
      tags: ["Hair Coloring", "Nail Art", "Extensions"],
      link: "/facility/6"
    },
    {
      _id: 7,
      name: "Vitality Wellness Center",
      imageUrl: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
      rating: 4.8,
      reviewCount: 94,
      category: "Wellness",
      location: "Quận 7, TP.HCM",
      openHours: "08:00 - 21:00",
      priceRange: "$$$",
      isFavorite: true,
      tags: ["Acupuncture", "Nutrition", "Therapy"],
      link: "/facility/7"
    },
    {
      _id: 8,
      name: "Pure Aesthetics Clinic",
      imageUrl: "https://images.unsplash.com/photo-1598887142487-3c854d51d2c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      rating: 4.9,
      reviewCount: 135,
      category: "Thẩm Mỹ",
      location: "Quận 1, TP.HCM",
      openHours: "09:00 - 18:00",
      priceRange: "$$$",
      isFavorite: false,
      tags: ["Botox", "Fillers", "Laser Treatment"],
      link: "/facility/8"
    }
  ],
  nearby: [
    {
      _id: 9,
      name: "Harmony Spa Retreat",
      imageUrl: "https://images.unsplash.com/photo-1610051276549-22e10a21bd12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      rating: 4.6,
      reviewCount: 68,
      category: "Spa & Massage",
      location: "Quận Bình Thạnh, TP.HCM",
      openHours: "10:00 - 21:00",
      priceRange: "$$",
      isFavorite: false,
      tags: ["Couple Massage", "Body Scrub", "Foot Massage"],
      link: "/facility/9"
    },
    {
      _id: 10,
      name: "FitLife Gym & Wellness",
      imageUrl: "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
      rating: 4.5,
      reviewCount: 85,
      category: "Gym & Fitness",
      location: "Quận 4, TP.HCM",
      openHours: "05:30 - 22:30",
      priceRange: "$$",
      isFavorite: true,
      tags: ["Crossfit", "Group Classes", "Cardio"],
      link: "/facility/10"
    },
    {
      _id: 11,
      name: "Crown Dental Clinic",
      imageUrl: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1168&q=80",
      rating: 4.8,
      reviewCount: 102,
      category: "Nha Khoa",
      location: "Quận Tân Bình, TP.HCM",
      openHours: "08:00 - 20:00",
      priceRange: "$$$",
      isFavorite: false,
      tags: ["Implants", "Cosmetic Dentistry", "Pediatric"],
      link: "/facility/11"
    },
    {
      _id: 12,
      name: "Chic Beauty Lounge",
      imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
      rating: 4.7,
      reviewCount: 73,
      category: "Làm Đẹp",
      location: "Quận Phú Nhuận, TP.HCM",
      openHours: "09:00 - 19:00",
      priceRange: "$$",
      isFavorite: true,
      tags: ["Makeup", "Facials", "Waxing"],
      link: "/facility/12"
    }
  ]
};

// Get the color class for the category
const getCategoryColor = (category: string): string => {
  const colorMap: Record<string, string> = {
    'Spa & Massage': 'from-purple-500 to-purple-600',
    'Gym & Fitness': 'from-green-500 to-green-600',
    'Làm Đẹp': 'from-pink-500 to-pink-600',
    'Tóc & Nail': 'from-yellow-500 to-yellow-600',
    'Nha Khoa': 'from-blue-500 to-blue-600',
    'Thẩm Mỹ': 'from-red-500 to-red-600',
    'Wellness': 'from-indigo-500 to-indigo-600'
  };

  return colorMap[category] || 'from-blue-500 to-blue-600';
};

interface FacilitySectionProps {
  title: string;
  subtitle: string;
  type: string;
}

const FacilitySection = ({ title, subtitle, type }: FacilitySectionProps) => {
  const facilities = facilityData[type] || [];

  return (
    <div className="container mx-auto px-4">
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="font-bold text-4xl py-2 text-gradient">{title}</h2>
        <div
          className="h-2 bg-gradient-to-r from-blue-300 to-blue-600 w-24 md:w-40 mt-1 origin-left rounded-r-full"
        />
        <p className="text-base mt-2">{subtitle}</p>
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {facilities.map((facility) => (
          <Link to={facility.link} key={facility._id} className="group">
            <div className="bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              {/* Image Container */}
              <div className="relative">
                <img
                  src={facility.imageUrl}
                  alt={facility.name}
                  className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Category Badge */}
                <div className={`absolute top-4 left-4 bg-gradient-to-r ${getCategoryColor(facility.category)} text-white text-xs font-medium px-2.5 py-1 rounded-full`}>
                  {facility.category}
                </div>

                {/* Favorite Button */}
                <button
                  className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md transition-transform duration-300 hover:scale-110 group-hover:bg-red-50"
                  aria-label={facility.isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  {facility.isFavorite ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <FaRegHeart className="text-gray-400 group-hover:text-red-500" />
                  )}
                </button>

                {/* Rating Badge */}
                <div className="absolute -bottom-3 right-4 bg-white px-3 py-1 rounded-full shadow-md flex items-center">
                  <FaStar className="text-yellow-400 mr-1" />
                  <span className="font-bold">{facility.rating}</span>
                  <span className="text-gray-500 text-xs ml-1">({facility.reviewCount})</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-grow flex flex-col">
                <h3 className="font-bold text-xl mb-2 group-hover:text-blue-600 transition-colors">{facility.name}</h3>

                {/* Info */}
                <div className="space-y-2 mb-3 text-sm text-gray-500">
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="text-blue-500 mr-2 min-w-4" />
                    <span className="truncate">{facility.location}</span>
                  </div>
                  <div className="flex items-center">
                    <FaRegClock className="text-blue-500 mr-2 min-w-4" />
                    <span>{facility.openHours}</span>
                    <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">Mở cửa</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-auto">
                  {facility.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs  text-gray-600 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Price Range */}
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-gray-500 text-sm">Giá: </span>
                    <span className="font-medium">{facility.priceRange}</span>
                  </div>
                  <span className="text-blue-600 group-hover:text-blue-800 flex items-center text-sm font-medium">
                    Chi tiết
                    <FaArrowRight className="ml-1 group-hover:ml-2 transition-all" size={12} />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* View All Button */}
      <div className="mt-10 text-center">
        <Link
          to={`/facilities/${type}`}
          className="btn-primary inline-flex items-center"
        >
          Xem tất cả
          <FaArrowRight className="ml-2" />
        </Link>
      </div>
    </div>
  );
};

export default FacilitySection;