import { ICategory } from "@/features/facility/types/category";

interface IService {
  _id: string;
  name: string;
  description?: string;
  price?: number;
  duration?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFacility {
    _id: string;
    name: string;
    imageUrl: string;
    rating: number;
    description?: string;
    address?: string;
    phoneNumber?: string;
    reviewCount: number;
    categoryId : ICategory;
    services?: IService[];
    location: string;
    openHours: string;
    priceRange: string;
    isFavorite: boolean;
    tags: string[];
    link: string;
    gallery?: string[];
    createdAt: Date;
    updatedAt: Date;
  }