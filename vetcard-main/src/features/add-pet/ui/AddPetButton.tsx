import { Button } from "@/shared/ui/Button";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const AddPetButton = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleAddPet = () => {
    navigate("/add-pet");
  };

  return (
    <Button onClick={handleAddPet}>
      <FaPlus className="mr-2" />
      {t("myPetsPage.addButton")}{" "}
    </Button>
  );
};
