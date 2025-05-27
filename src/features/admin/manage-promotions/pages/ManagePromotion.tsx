import { useState, useEffect } from "react";
import { getAllPromotions } from "@/features/admin/manage-promotions/services";
import { PromotionTable } from "@/features/admin/manage-promotions/components";
import { Promotion } from "@/features/admin/manage-promotions/types/promotion";
import { toast } from "sonner";
import PageLoaderWrapper from "@/components/PageLoaderWrapper";
import { useNavigate } from "react-router-dom";
import ROUTERS from "@/constants/router";

export const ManagePromotionPage = () => {
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchPromotions = async () => {
      setLoading(true);

      try {
        const res = await getAllPromotions(1, 10);
        setPromotions(res.data);
        setLoading(false)
      } catch (err) {
        console.error(err)
        toast.error("Không thể tải danh sách khuyến mãi.");
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);
  const handleEdit = (promotion: Promotion) => navigate(ROUTERS.ADMIN.promotion.edit(promotion.id));
  const handleShow = (promotion: Promotion) => navigate(ROUTERS.ADMIN.promotion.show(promotion.id));

  return (
    <PageLoaderWrapper loading={loading} tip="Đang tải danh sách khuyến mãi...">
      <div className="p-6">
        <PromotionTable
          data={promotions}
          onShow={handleShow}
          onEdit={handleEdit}
        />
      </div>
    </PageLoaderWrapper>
  )
}
