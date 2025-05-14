// src/types/category.ts
export interface ICategory {
    _id: string;
    name: string;
    parentId?: string;
    description?: string;
    icon?: string;
    createdAt: Date;
    updatedAt: Date;
  }