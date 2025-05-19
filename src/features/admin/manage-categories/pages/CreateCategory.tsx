import { useNavigate } from "react-router-dom"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { createCategory } from "@/features/admin/manage-categories/services/categoryService"
import { Checkbox } from "@/components/ui/checkbox"

const schema = z.object({
  categoryName: z
    .string()
    .min(3, 'Category name must be at least 3 characters long')
    .max(255, 'Category name must not exceed 255 characters'),
  isActive: z.boolean().optional(),
})

type CreateServiceCategoryFormData = z.infer<typeof schema>

export const CreateCategoryPage = () => {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateServiceCategoryFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      isActive: false,
    },
  })

  const onSubmit = async (data: CreateServiceCategoryFormData) => {
    const toastId = toast.loading("Creating category...")
    try {
      await createCategory(data)
      toast.success("Category created successfully!", { id: toastId })
      navigate("/admin/categories")
    } catch (error) {
      console.error(error)
      toast.error("Failed to create category.", { id: toastId })
    }
  }

  return (
    <div className="p-6 max-w-xl">
      <h2 className="text-xl font-semibold mb-4">Create Category</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label>Category Name</Label>
          <Input type="text" {...register("categoryName")} />
          {errors.categoryName && (
            <p className="text-sm text-red-500">{errors.categoryName.message}</p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <>
                <Checkbox
                  id="isActive"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label htmlFor="isActive">Active</Label>
              </>
            )}
          />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Category"}
        </Button>
      </form>
    </div>
  )
}
