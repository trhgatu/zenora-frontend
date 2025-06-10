import { z } from 'zod'

export const baseCategorySchema = z.object({
    categoryName: z
        .string()
        .min(3, 'Category name must be at least 3 characters long')
        .max(255, 'Category name must not exceed 255 characters'),
    isActive: z.boolean().optional(),
})