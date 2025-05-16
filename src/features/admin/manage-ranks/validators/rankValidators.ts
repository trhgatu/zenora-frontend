// src/features/admin/manage-ranks/validators/rankValidator.ts
import { z } from "zod";

export const createRankSchema = z.object({
  name: z.string().min(1, "Tên không được để trống"),
  minPoints: z.number().min(0, "Điểm tối thiểu phải >= 0"),
  discountPercent: z.number().min(0).max(100),
  description: z.string().optional(),
});
