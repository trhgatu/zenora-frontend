import Banner from "../components/Banner";
import CategorySection from "../components/CategorySection";
import FacilitySection from "../components/FacilitySection";
import PromotionSection from "../components/PromotionSection";
import SearchBar from "@/features/user/home/components/SearchBar";

export const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <section className="relative">
          <Banner />
          <div className="relative z-30">
            <SearchBar />
          </div>
        </section>
        <div className="animate-fadeIn space-y-8 md:space-y-0">
          <section className=" py-6 md:pt-6">
            <CategorySection />
          </section>
          <section className="md:py-12 bg-white">
            <PromotionSection />

          </section>

          <section className="py-6 md:py-6">
            <FacilitySection
              title="Địa điểm nổi bật"
              subtitle="Khám phá những địa điểm được đánh giá cao nhất"
              type="featured"
            />

          </section>

          <section className="bg-white py-6 md:py-6">
            <FacilitySection
              title="Địa điểm gần đây"
              subtitle="Các địa điểm tuyệt vời gần vị trí của bạn"
              type="nearby"
            />
          </section>
          <section className="py-6 md:py-6">
            <FacilitySection
              title="Gợi ý cho bạn"
              subtitle="Dựa trên sở thích và lịch sử của bạn"
              type="suggested"
            />
          </section>
        </div>
      </main>
    </div>
  );
};
