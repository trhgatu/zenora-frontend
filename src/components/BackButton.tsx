import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const BackButton = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Button variant="outline" onClick={handleBack} className="flex items-center gap-2">
      <ArrowLeft className="w-4 h-4" />
      Quay lại
    </Button>
  );
};

export default BackButton;
