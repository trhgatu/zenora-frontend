// CreateRolePage.tsx
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createRole } from "../services/roleService";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const schema = z.object({
  roleName: z.string().min(2, "Role name is required"),
});

type CreateRoleFormData = z.infer<typeof schema>;

export const CreateRolePage = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateRoleFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: CreateRoleFormData) => {
    try {
      await createRole(data);
      toast.success("Role created successfully!");
      navigate("/admin/roles");
    } catch (error) {
      console.log(error)
      toast.error("Failed to create role.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Tạo vai trò mới</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Tên vai trò</label>
          <Input type="text" {...register("roleName")} />
          {errors.roleName && (
            <p className="text-sm text-red-500">{errors.roleName.message}</p>
          )}
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Role"}
        </Button>
      </form>
    </div>
  );
};

