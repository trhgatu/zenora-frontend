// src/pages/user/facilityDetailPage.tsx
import { useParams } from 'react-router-dom';
import { facilityData } from '@/features/facility/data/facilityData';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Share2,Tag, Clock, Landmark, MapPin, Phone, Star, DollarSign, ChevronRight, Truck, Shield, RotateCcw, Calendar } from 'lucide-react';

const TabContent: React.FC<{
  isActive: boolean;
  children: React.ReactNode;
  className?: string;
}> = ({ isActive, children, className = "" }) => {
  if (!isActive) return null;
  return (
    <div className={`bg-white p-4 rounded-md mt-4 ${className}`}>
      {children}
    </div>
  );
};

const FacilityDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const facility = facilityData.find(p => p._id === id);
  const [activeTab, setActiveTab] = useState("description");
  const [mainImage, setMainImage] = useState(facility?.imageUrl);

  if (!facility) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Không tìm thấy cơ sở nào</h2>
        <Button asChild>
          <a href="/">Quay lại trang chủ</a>
        </Button>
      </div>
    );
  }
  const handleImageClick = (imageUrl: string) => {
    setMainImage(imageUrl);
  };

  return (
    <div className="container mx-auto px-4">
      {/* Breadcrumb */}
      <div className="flex items-center py-4 text-sm text-gray-500">
        <a href="/" className="hover:text-blue-600">Trang chủ</a>
        <ChevronRight size={16} className="mx-1" />
        <a href={`/category/${facility.categoryId?._id}`} className="hover:text-blue-600">
          {facility.categoryId?.name}
        </a>
        <ChevronRight size={16} className="mx-1" />
        <span className="text-gray-700">{facility.name}</span>
      </div>

      {/* facility details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* facility Images */}
        <div>
          <div className="mb-4 border rounded-lg overflow-hidden bg-white p-4">
            <img
              src={mainImage}
              alt={facility.name}
              className="w-full h-[400px] object-contain"
            />
          </div>
          <div className="grid grid-cols-5 gap-2">
            {facility.gallery?.map((image, index) => (
              <div
                key={index}
                className={`border rounded-md cursor-pointer p-2 ${
                  mainImage === image ? 'border-blue-500' : 'border-gray-200'
                }`}
                onClick={() => handleImageClick(image)}
              >
                <img
                  src={image}
                  alt={`${facility.name} - ảnh ${index + 1}`}
                  className="w-full h-16 object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* facility Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{facility.name}</h1>

          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400 mr-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className={i < Math.floor(facility.rating) ? 'fill-current' : 'stroke-current fill-none'}
                />
              ))}
            </div>
            <span className="text-gray-500">
              {facility.rating} ({facility.reviewCount} đánh giá)
            </span>
            <span className="mx-2 text-gray-300">|</span>c
          </div>

          {/* <div className="mb-6">
            {discountedPrice ? (
              <div className="flex items-center">
                <span className="text-3xl font-bold text-red-600 mr-3">
                  {discountedPrice.toLocaleString('vi-VN')}₫
                </span>
                <span className="text-xl text-gray-500 line-through">
                  {facility.price.toLocaleString('vi-VN')}₫
                </span>
                <span className="ml-2 bg-red-100 text-red-700 px-2 py-1 rounded text-sm font-medium">
                  -{facility.discountPercent}%
                </span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-gray-800">
                {facility.price.toLocaleString('vi-VN')}₫
              </span>
            )}
          </div> */}
          <div className="flex gap-4 mb-8">
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
              <Calendar className="mr-2 h-5 w-5" />
              Đặt lịch
            </Button>
            <Button variant="outline" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
          <div className="space-y-3 mb-6">
              {facility.priceRange && (
                <div className="flex items-center text-sm">
                  <DollarSign className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Giá: <span className="font-medium">{facility.priceRange}</span></span>
                </div>
              )}

              {facility.location && (
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">{facility.location}</span>
                </div>
              )}

              {facility.address && (
                <div className="flex items-center text-sm">
                  <Landmark className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">{facility.address}</span>
                </div>
              )}

              {facility.phoneNumber && (
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0" />
                  <a href={`tel:${facility.phoneNumber}`} className="text-gray-700 hover:text-blue-600">
                    {facility.phoneNumber}
                  </a>
                </div>
              )}

              {facility.openHours && (
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">{facility.openHours}</span>
                </div>
              )}
            </div>

            {facility.tags && facility.tags.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center mb-2 text-sm">
                  <Tag className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="font-medium">Thẻ:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {facility.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="bg-gray-50">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <Truck className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm">Giao hàng miễn phí</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm">Bảo hành 12 tháng</span>
              </div>
              <div className="flex items-center">
                <RotateCcw className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm">Đổi trả trong 7 ngày</span>
              </div>
            </div>
          </div>

          <div className="prose prose-sm max-w-none">
            <p>{facility.description}</p>
          </div>
        </div>
      </div>

      {/* Custom Tabs Implementation */}
      <div className="mb-16">
        <div className="border-b border-gray-200">
          <div className="flex -mb-px">
          <button
              className={`py-2 px-4 font-medium text-sm ${
                activeTab === "services"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("services")}
            >
              Dịch vụ
            </button>
            <button
              className={`py-2 px-4 font-medium text-sm ${
                activeTab === "description"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("description")}
            >
              Mô tả
            </button>
            <button
              className={`py-2 px-4 font-medium text-sm ${
                activeTab === "location"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("location")}
            >
              Vị trí
            </button>
            <button
              className={`py-2 px-4 font-medium text-sm ${
                activeTab === "reviews"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("reviews")}
            >
              Đánh giá ({facility.reviewCount})
            </button>
          </div>
        </div>

        <TabContent isActive={activeTab === "description"}>
          <div className="prose prose-blue max-w-none">
            <p>
              {facility.description || 'Đang cập nhật thông tin chi tiết...'}
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies aliquam, mauris nisl aliquet nunc,
              vitae ultricies nisl nunc eget nunc. Nullam auctor, nisl eget ultricies aliquam, mauris nisl aliquet nunc, vitae ultricies nisl nunc eget nunc.
            </p>
          </div>
        </TabContent>



        <TabContent isActive={activeTab === "reviews"}>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Đánh giá của khách hàng</h3>
              <Button>Viết đánh giá</Button>
            </div>
            <div className="border-b pb-4 mb-4">
              <div className="flex items-center mb-2">
                <div className="flex text-yellow-400 mr-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i < 5 ? 'fill-current' : 'stroke-current fill-none'}
                    />
                  ))}
                </div>
                <span className="font-medium">Rất hài lòng</span>
              </div>
              <div className="flex justify-between mb-2">
                <div>
                  <span className="font-medium">Nguyễn Văn A</span>
                  <span className="mx-2 text-gray-300">|</span>
                  <span className="text-gray-500">20/05/2025</span>
                </div>
                <span className="text-green-600">Đã mua hàng</span>
              </div>
              <p className="text-gray-700">
                Sản phẩm rất tốt, đóng gói cẩn thận, giao hàng nhanh. Màn hình hiển thị sắc nét,
                pin dùng được cả ngày. Rất hài lòng với sản phẩm này!
              </p>
            </div>
          </div>
        </TabContent>
      </div>
    </div>
  );
};

export default FacilityDetailPage;