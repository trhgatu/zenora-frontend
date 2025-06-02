import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { CategoryTable } from "@/features/admin/manage-categories/components/CategoryTable";
import { getAllCategories, softDeleteCategoryById } from "@/features/admin/manage-categories/services/categoryService";
import ROUTERS from "@/constants/router";
import { Button } from "@/components/ui/button";
import PageLoaderWrapper from "@/components/PageLoaderWrapper";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
import { toast } from "sonner";
import { ServiceCategory } from "@/types/category";

export const ManageCategoryPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [categoryToDelete, setCategoryToDelete] = useState<ServiceCategory | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getAllCategories(page + 1, 10);
      setCategories(res.data);
      setPageCount(res.totalPages);
      setLoading(false)
    } catch (err) {
      console.error(err)
      toast.error("Không thể tải danh sách vai trò.");
      setLoading(false);
    }
  };

  fetchCategories();
}, [page]);

  /* const handleEdit = (role: Role) => navigate(ROUTERS.ADMIN.role.edit(role.id));
  const handleShow = (role: Role) => navigate(ROUTERS.ADMIN.role.show(role.id)); */

  const confirmDelete = async () => {
    if (categoryToDelete) {
      try {
        await softDeleteCategoryById(categoryToDelete.id);
        setCategories((prev) => prev.filter((r) => r.id !== categoryToDelete.id));
        toast.success("Category deleted successfully");
      } catch {
        toast.error("Failed to delete category");
      } finally {
        setCategoryToDelete(null);
      }
    }
  };

  return (
    <PageLoaderWrapper loading={loading} tip="Đang tải danh mục...">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Quản lý danh mục</h2>
          <Button onClick={() => navigate(ROUTERS.ADMIN.category.create)}>Tạo danh mục</Button>
        </div>

        <CategoryTable
          data={categories}
          /* onEdit={handleEdit} */
          onDelete={(category) => setCategoryToDelete(category)}
          /* onShow={handleShow} */
          pagination={{
            pageIndex: page,
            pageCount: pageCount,
            onPageChange: setPage,
          }}
        />

        <ConfirmDeleteDialog
          open={!!categoryToDelete}
          itemName={categoryToDelete?.categoryName || ""}
          onCancel={() => setCategoryToDelete(null)}
          onConfirm={confirmDelete}
        />
      </div>
    </PageLoaderWrapper>
  );

};
