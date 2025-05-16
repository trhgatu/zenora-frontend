// src/features/admin/manage-ranks/pages/CreateRankPage.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createRankSchema } from "@/features/admin/manage-ranks/validators/rankValidators";
import { z } from "zod";
import { createRank } from "@/features/admin/manage-ranks/services/rankService";
import { useNavigate } from "react-router-dom";
import ROUTERS from "@/constants/router";
import { toast } from "sonner";

type FormData = z.infer<typeof createRankSchema>;

export const CreateRankPage = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(createRankSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await createRank(data);
      toast.success("Tạo rank thành công!");
      navigate(ROUTERS.ADMIN.rank.root);
    } catch (error) {
      console.error(error)
      toast.error("Tạo rank thất bại!");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Tạo Rank mới</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label className="mb-2" htmlFor="name">Tên Rank</Label>
          <Input id="name" {...register("name")} />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div>
          <Label className="mb-2" htmlFor="minPoints">Điểm tối thiểu</Label>
          <Input type="number" {...register("minPoints", { valueAsNumber: true })} />
          {errors.minPoints && <p className="text-red-500 text-sm">{errors.minPoints.message}</p>}
        </div>

        <div>
          <Label className="mb-2" htmlFor="discountPercent">Phần trăm giảm giá</Label>
          <Input type="number" {...register("discountPercent", { valueAsNumber: true })} />
          {errors.discountPercent && <p className="text-red-500 text-sm">{errors.discountPercent.message}</p>}
        </div>

        <div>
          <Label className="mb-2" htmlFor="description">Mô tả</Label>
          <Textarea id="description" rows={3} {...register("description")} />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>

        <Button type="submit" disabled={isSubmitting}>Tạo Rank</Button>
      </form>
    </div>
  );
}
