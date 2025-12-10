import { useNavigate } from "react-router-dom";
import { Button } from "./Button";
import { FaArrowLeft } from "react-icons/fa";

export const BackButton = ({ className = "" }: { className?: string }) => {
  const navigate = useNavigate();
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={() => navigate(-1)}
      className={`flex items-center gap-2 ${className}`}
    >
      <FaArrowLeft />
      Назад
    </Button>
  );
};
