import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import { createService } from "@/features/admin/manage-services/services/serviceServices";

const serviceSchema = z.object({
  serviceName: z.string().min(1, "Service name is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be non-negative"),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  isAvailable: z.boolean(),
  categoryId: z.string().uuid("Invalid category ID"),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

export const CreateServicePage = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
  });

  const onSubmit = async (data: ServiceFormValues) => {
    try {
      await createService({
        ...data,
        description: data.description ?? "",
      });
      toast.success("Service created successfully");
    } catch (error) {
      console.error(error)
      toast.error("Failed to create service");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Tạo dịch vụ mới</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input {...register("serviceName")} placeholder="Service Name" />
        {errors.serviceName && <p className="text-sm text-red-500">{errors.serviceName.message}</p>}

        <Textarea {...register("description")} placeholder="Description (optional)" />

        <Input
          {...register("price", { valueAsNumber: true })}
          placeholder="Price"
          type="number"
        />
        {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}

        <Input
          {...register("duration", { valueAsNumber: true })}
          placeholder="Duration (minutes)"
          type="number"
        />
        {errors.duration && <p className="text-sm text-red-500">{errors.duration.message}</p>}

        <Select onValueChange={(value) => setValue("isAvailable", value === "true")}>
          <SelectTrigger>
            <SelectValue placeholder="Is Available?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Yes</SelectItem>
            <SelectItem value="false">No</SelectItem>
          </SelectContent>
        </Select>
        {errors.isAvailable && <p className="text-sm text-red-500">{errors.isAvailable.message}</p>}

        <Input {...register("categoryId")} placeholder="Category ID" />
        {errors.categoryId && <p className="text-sm text-red-500">{errors.categoryId.message}</p>}

        <Button type="submit" disabled={isSubmitting}>Create Service</Button>
      </form>
    </div>

  );
}
