import { IFacility } from "@/features/facility/types/facility";

export const facilityData: IFacility[] = [
  {
    _id: "1",
    name: "Lavender Spa & Wellness Center",
    imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1170&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1559628233-bf5a9721bf45?auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e5e4d?auto=format&fit=crop&w=1170&q=80"
    ],
    rating: 4.8,
    reviewCount: 124,
    phoneNumber: "028 1234 5678",
    categoryId: {
      _id: "cat1",
      name: "Spa & Massage",
      parentId: "catRoot1",
      description: "Dịch vụ thư giãn và trị liệu",
      icon: "spa",
      createdAt: new Date("2025-04-27"),
      updatedAt: new Date("2025-04-27")
    },
    location: "Quận 1, TP.HCM",
    description: "Trải nghiệm dịch vụ spa thư giãn và trị liệu chuyên nghiệp tại Lavender Spa.",
    address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
    openHours: "09:00 - 21:00",
    priceRange: "$$",
    isFavorite: true,
    tags: ["Hot Stone", "Aromatherapy", "Facial"],
    link: "/facility/1",
    createdAt: new Date("2025-04-27"),
    updatedAt: new Date("2025-04-27")
  },
  {
    _id: "2",
    name: "Elite Fitness & Yoga Studio",
    imageUrl: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1075&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1075&q=80",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1517960413843-0aee8e2b3281?auto=format&fit=crop&w=1170&q=80"
    ],
    rating: 4.6,
    reviewCount: 98,
    phoneNumber: "028 1234 5678",
    description: "Trung tâm thể hình và yoga hàng đầu với trang thiết bị hiện đại.",
    address: "456 Đường Nguyễn Thị Minh Khai, Quận 3, TP.HCM",
    categoryId: {
      _id: "cat2",
      name: "Gym & Fitness",
      parentId: "catRoot1",
      description: "Phòng gym và trung tâm thể hình",
      icon: "fitness_center",
      createdAt: new Date("2025-04-27"),
      updatedAt: new Date("2025-04-27")
    },
    location: "Quận 7, TP.HCM",
    openHours: "06:00 - 22:00",
    priceRange: "$$$",
    isFavorite: false,
    tags: ["Yoga", "Personal Training", "Pool"],
    link: "/facility/2",
    createdAt: new Date("2025-04-27"),
    updatedAt: new Date("2025-04-27")
  },
  {
    _id: "3",
    name: "Aurora Beauty & Cosmetic Clinic",
    imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1170&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e5e4d?auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1559628233-bf5a9721bf45?auto=format&fit=crop&w=1170&q=80"
    ],
    rating: 4.9,
    reviewCount: 156,
    phoneNumber: "028 1234 5678",
    description: "Phòng khám thẩm mỹ và làm đẹp hàng đầu với đội ngũ bác sĩ chuyên nghiệp.",
    address: "789 Đường Trần Hưng Đạo, Quận 5, TP.HCM",
    categoryId: {
      _id: "cat3",
      name: "Làm Đẹp",
      parentId: "catRoot1",
      description: "Dịch vụ chăm sóc sắc đẹp",
      icon: "face_retouching_natural",
      createdAt: new Date("2025-04-27"),
      updatedAt: new Date("2025-04-27")
    },
    location: "Quận 3, TP.HCM",
    openHours: "10:00 - 20:00",
    priceRange: "$$$",
    isFavorite: true,
    tags: ["Facial", "Skin Care", "Anti-aging"],
    link: "/facility/3",
    createdAt: new Date("2025-04-27"),
    updatedAt: new Date("2025-04-27")
  },
  {
    _id: "4",
    name: "Zen Dental Care",
    imageUrl: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1074&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1074&q=80",
      "https://images.unsplash.com/photo-1588776814546-bd35a2e06eb9?auto=format&fit=crop&w=1074&q=80",
      "https://images.unsplash.com/photo-1588776814746-3b8a57cfc826?auto=format&fit=crop&w=1074&q=80"
    ],
    rating: 4.7,
    reviewCount: 78,
    phoneNumber: "028 1234 5678",
    categoryId: {
      _id: "cat4",
      name: "Nha Khoa",
      parentId: "catRoot2",
      description: "Phòng khám và dịch vụ nha khoa",
      icon: "medical_services",
      createdAt: new Date("2025-04-27"),
      updatedAt: new Date("2025-04-27")
    },
    location: "Quận Phú Nhuận, TP.HCM",
    openHours: "08:00 - 19:00",
    priceRange: "10.000 - 500.000 VNĐ",
    description: "Dịch vụ chăm sóc răng miệng chuyên nghiệp và hiện đại.",
    isFavorite: false,
    tags: ["Teeth Whitening", "Cleaning", "Orthodontics"],
    link: "/facility/4",
    createdAt: new Date("2025-04-27"),
    updatedAt: new Date("2025-04-27")
  },
  {
    _id: "5",
    name: "Serenity Day Spa",
    imageUrl: "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?auto=format&fit=crop&w=1170&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1559628233-bf5a9721bf45?auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e5e4d?auto=format&fit=crop&w=1170&q=80"
    ],
    rating: 4.5,
    reviewCount: 87,
    phoneNumber: "028 1234 5678",
    categoryId: {
      _id: "cat1",
      name: "Spa & Massage",
      parentId: "catRoot1",
      description: "Dịch vụ thư giãn và trị liệu",
      icon: "spa",
      createdAt: new Date("2025-04-27"),
      updatedAt: new Date("2025-04-27")
    },
    location: "Quận 2, TP.HCM",
    openHours: "10:00 - 22:00",
    priceRange: "$$",
    isFavorite: true,
    tags: ["Thai Massage", "Reflexology", "Sauna"],
    link: "/facility/5",
    createdAt: new Date("2025-04-27"),
    updatedAt: new Date("2025-04-27")
  }
];
