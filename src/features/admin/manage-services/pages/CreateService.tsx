import { useForm, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createService } from "@/features/admin/manage-services/services/serviceServices";
import { getAllCategories } from "@/features/admin/manage-categories/services/categoryService";
import { ServiceCategory } from "@/types/category";
import {
  Select,
  SelectContent,
  SelectLabel,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import ROUTERS from "@/constants/router";

const serviceSchema = z.object({
  serviceName: z.string().min(1, "Service name is required"),
  description: z.string().optional(),
  price: z.number({ invalid_type_error: "Price must be a number" }).min(0),
  duration: z.number({ invalid_type_error: "Duration must be a number" }).min(1),
  isAvailable: z.boolean({ required_error: "Availability is required" }),
  categoryId: z.string().min(1, "Category is required"),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

export const CreateServicePage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ServiceCategory[]>([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const res = await getAllCategories(1, 100);
        setCategories(res.data);
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    };
    fetchInitialData();
  }, []);

  const onSubmit = async (data: ServiceFormValues) => {
    const toastId = toast.loading("Creating service...");
    try {
      await createService({
        ...data,
        description: data.description ?? "",
      });
      toast.success("Service created successfully!", { id: toastId });
      navigate(ROUTERS.ADMIN.service.root)
    } catch (error) {
      console.error(error);
      toast.error("Failed to create service", { id: toastId });
    }
  };

  return (
    <div className="p-6 max-w-xl">
      <h2 className="text-xl font-semibold mb-4">Create New Service</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input {...register("serviceName")} placeholder="Service Name" />
          {errors.serviceName && <p className="text-sm text-red-500">{errors.serviceName.message}</p>}
        </div>

        <div>
          <Textarea {...register("description")} placeholder="Description (optional)" />
        </div>

        <div>
          <Input
            {...register("price", { valueAsNumber: true })}
            placeholder="Price"
            type="number"
          />
          {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
        </div>

        <div>
          <Input
            {...register("duration", { valueAsNumber: true })}
            placeholder="Duration (minutes)"
            type="number"
          />
          {errors.duration && <p className="text-sm text-red-500">{errors.duration.message}</p>}
        </div>

        <div>
          <Controller
            control={control}
            name="isAvailable"
            render={({ field }) => (
              <Select value={field.value?.toString()} onValueChange={(val) => field.onChange(val === "true")}>
                <SelectTrigger>
                  <SelectValue placeholder="Is Available?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Available</SelectItem>
                  <SelectItem value="false">Not Available</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.isAvailable && <p className="text-sm text-red-500">{errors.isAvailable.message}</p>}
        </div>

        <div>
          <Controller
            control={control}
            name="categoryId"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.categoryName}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {errors.categoryId && <p className="text-sm text-red-500">{errors.categoryId.message}</p>}
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Service"}
        </Button>
      </form>
    </div>
  );
};
