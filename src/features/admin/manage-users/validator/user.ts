import { z } from "zod"

export const EditUserSchema = z.object({
  avatarUrl: z.string().optional(),
  gender: z.enum(["male", "female", "other", ""]).optional(),
  dateOfBirth: z.string().optional(),
  fullName: z.string().min(1, "Họ và tên là bắt buộc"),
  addressDetail: z.string().min(1, "Địa chỉ chi tiết là bắt buộc"),
  provinceId: z.string().min(1, "Vui lòng chọn tỉnh/thành"),
  districtId: z.string().min(1, "Vui lòng chọn quận/huyện"),
  phoneNumber: z
    .string()
    .regex(/^\d{10,11}$/, "Số điện thoại không hợp lệ"),
})
