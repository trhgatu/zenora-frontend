import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRankById } from "@/features/admin/manage-ranks/services/rankService";
import { Rank } from "@/features/admin/manage-ranks/types/rank";

export const DetailRankPage = () => {
  const { id } = useParams<{ id: string }>();
  const [rank, setRank] = useState<Rank | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getRankById(id)
        .then((res) => {
          setRank(res);
        })
        .catch(() => {
          setRank(null);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!rank) return <p>Không tìm thấy rank.</p>;

  return (
    <div className="p-6 space-y-4 max-w-xl">
      <h2 className="text-2xl font-semibold">Chi tiết cấp bậc</h2>
      <div><strong>ID:</strong> {rank.id}</div>
      <div><strong>Tên cấp bậc:</strong> {rank.name}</div>
      <div><strong>Điểm tối thiểu:</strong> {rank.minPoints}</div>
      <div><strong>Giảm giá (%):</strong> {rank.discountPercent}</div>
      <div><strong>Mô tả:</strong> {rank.description || "Không có"}</div>
    </div>
  );
};
