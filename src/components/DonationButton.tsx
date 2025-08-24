import React, { useState } from "react";
import { Heart } from "lucide-react";
import PaymentModal from "./PaymentModal";
import { Campaign } from "../types";

interface DonationButtonProps {
  campaign: Campaign;
  amount?: number;
  variant?: "primary" | "secondary";
  className?: string;
  selectedPhotos?: string[];
}

const DonationButton: React.FC<DonationButtonProps> = ({
  campaign,
  amount,
  variant = "primary",
  className = "",
  selectedPhotos = [],
}) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const baseClasses =
    variant === "primary"
      ? "bg-orange-500 hover:bg-orange-600 text-white"
      : "border border-orange-500 text-orange-500 hover:bg-orange-50";

  return (
    <>
      <button
        onClick={() => setShowPaymentModal(true)}
        className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 ${baseClasses} ${className}`}
      >
        <Heart className="w-5 h-5" />
        <span>{amount ? `Donate $${amount}` : "Donate Now"}</span>
      </button>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        campaign={campaign}
        selectedPhotos={selectedPhotos}
      />
    </>
  );
};

export default DonationButton;
