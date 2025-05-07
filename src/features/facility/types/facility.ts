import { ICategory } from "@/features/facility/types/category";

export interface IFacility {
    _id: number;
    name: string;
    imageUrl: string;
    category: string;
    rating: number;
    description?: string;
    address?: string;
    phoneNumber?: string;
    reviewCount: number;
    categoryId? : ICategory;
    servicesId?: string[];
    location: string;
    openHours: string;
    priceRange: string;
    isFavorite: boolean;
    tags: string[];
    link: string;
    gallery?: string[];
    createdAt?: Date;
    updatedAt?: Date;
  }