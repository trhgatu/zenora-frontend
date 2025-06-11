import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createPromotion } from "@/features/admin/manage-promotions/services/promotionService";
import { useNavigate } from "react-router-dom";
import ROUTERS from "@/constants/router";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define validation schema for promotion
const createPromotionSchema = z.object({
  promotionName: z.string().min(1, "Tên khuyến mãi là bắt buộc"),
  description: z.string().optional(),
  discountAmount: z.number().min(0, "Số tiền giảm giá phải lớn hơn hoặc bằng 0"),
  discountPercent: z.number().min(0, "Phần trăm giảm giá phải lớn hơn hoặc bằng 0").max(100, "Phần trăm giảm giá không được vượt quá 100"),
  quantity: z.number().min(0, "Số lượng phải lớn hơn hoặc bằng 0"),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Ngày bắt đầu không hợp lệ"),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Ngày kết thúc không hợp lệ"),
  rankId: z.string().uuid("Rank ID không hợp lệ"),
});

type FormData = z.infer<typeof createPromotionSchema>;

export const CreatePromotionPage = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(createPromotionSchema),
    defaultValues: {
      discountAmount: 0,
      discountPercent: 0,
      quantity: 0,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await createPromotion({
        ...data,
        rankIds: [data.rankId],
        description: data.description ?? "", 
      });
      toast.success("Tạo khuyến mãi thành công!");
      navigate(ROUTERS.ADMIN.promotion.root);
    } catch (error) {
      console.error(error);
      toast.error("Tạo khuyến mãi thất bại!");
    }
};

  // Mock rank options (in a real app, this would come from an API)
  const rankOptions = [
    { id: "3fa85f64-5717-4562-b3fc-2c963f66afa6", name: "Gold Rank" },
    { id: "4fb95g75-6828-5673-c4gd-3d074g77bgb7", name: "Silver Rank" },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Tạo Khuyến Mãi Mới</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label className="mb-2" htmlFor="promotionName">Tên Khuyến Mãi</Label>
          <Input id="promotionName" {...register("promotionName")} />
          {errors.promotionName && <p className="text-red-500 text-sm">{errors.promotionName.message}</p>}
        </div>

        <div>
          <Label className="mb-2" htmlFor="description">Mô Tả</Label>
          <Textarea id="description" rows={3} {...register("description")} />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>

        <div>
          <Label className="mb-2" htmlFor="discountAmount">Số Tiền Giảm Giá</Label>
          <Input type="number" id="discountAmount" {...register("discountAmount", { valueAsNumber: true })} />
          {errors.discountAmount && <p className="text-red-500 text-sm">{errors.discountAmount.message}</p>}
        </div>

        <div>
          <Label className="mb-2" htmlFor="discountPercent">Phần Trăm Giảm Giá</Label>
          <Input type="number" id="discountPercent" {...register("discountPercent", { valueAsNumber: true })} />
          {errors.discountPercent && <p className="text-red-500 text-sm">{errors.discountPercent.message}</p>}
        </div>

        <div>
          <Label className="mb-2" htmlFor="quantity">Số Lượng</Label>
          <Input type="number" id="quantity" {...register("quantity", { valueAsNumber: true })} />
          {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity.message}</p>}
        </div>

        <div>
          <Label className="mb-2" htmlFor="startDate">Ngày Bắt Đầu</Label>
          <Input type="datetime-local" id="startDate" {...register("startDate")} />
          {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate.message}</p>}
        </div>

        <div>
          <Label className="mb-2" htmlFor="endDate">Ngày Kết Thúc</Label>
          <Input type="datetime-local" id="endDate" {...register("endDate")} />
          {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate.message}</p>}
        </div>

        <div>
          <Label className="mb-2" htmlFor="rankId">Rank</Label>
          <Select onValueChange={(value) => setValue("rankId", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn rank" />
            </SelectTrigger>
            <SelectContent>
              {rankOptions.map((rank) => (
                <SelectItem key={rank.id} value={rank.id}>
                  {rank.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.rankId && <p className="text-red-500 text-sm">{errors.rankId.message}</p>}
        </div>

        <Button type="submit" disabled={isSubmitting}>Tạo Khuyến Mãi</Button>
      </form>
    </div>
  );
};