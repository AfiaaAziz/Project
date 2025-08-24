import React, { useState, useMemo } from "react";
import { Campaign } from "../../types";

interface SetPricingStepProps {
  data: Partial<Campaign>;
  onUpdate: (data: Partial<Campaign>) => void;
  onNext: () => void;
  onBack: () => void;
}

const SetPricingStep: React.FC<SetPricingStepProps> = ({
  data,
  onUpdate,
  onNext,
  onBack,
}) => {
  const [photoPrice, setPhotoPrice] = useState<number>(data.photo_price || 10);


  const { platformFeeAmount, processingFeeAmount, totalAmount } =
    useMemo(() => {
      const price = isNaN(photoPrice) ? 0 : photoPrice;
      const platformFee = 0.1; 
      const processingFee = 0.03; 

      const platformFeeAmount = price * platformFee;
      const processingFeeAmount = price * processingFee;
      const totalAmount = price + platformFeeAmount + processingFeeAmount;

      return {
        platformFeeAmount,
        processingFeeAmount,
        totalAmount,
      };
    }, [photoPrice]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isNaN(photoPrice) || photoPrice <= 0) {
      alert("Please enter a valid price greater than 0.");
      return;
    }
    onUpdate({
      photo_price: photoPrice,
      platform_fee: 10,
    });
    onNext();
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, ""); 
    setPhotoPrice(parseFloat(value) || 0);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-lg mx-auto">
      <div>
        <label
          htmlFor="photoPrice"
          className="block text-sm font-semibold text-gray-700 mb-1"
        >
          Suggested Amount per Photo
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
            $
          </span>
          <input
            id="photoPrice"
            type="text" 
            value={photoPrice === 0 ? "" : photoPrice}
            onChange={handlePriceChange}
            className="w-full pl-7 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
      </div>

      <div className="bg-gray-100 p-6 rounded-lg border border-gray-200">
        <h3 className="text-md font-semibold text-gray-800 mb-4">
          Pricing Preview
        </h3>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Photo price:</span>
            <span className="font-medium text-gray-800">
              ${photoPrice.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Platform fee (10%):</span>
            <span className="font-medium text-gray-800">
              ${platformFeeAmount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Payment processing (3%):</span>
            <span className="font-medium text-gray-800">
              ${processingFeeAmount.toFixed(2)}
            </span>
          </div>
          <div className="border-t border-gray-300 pt-3 mt-3 flex justify-between text-md font-bold text-gray-800">
            <span>Total customer pays:</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-6">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition-colors text-sm"
        >
          « Back
        </button>
        <button
          type="submit"
          className="px-8 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold transition-colors text-sm"
        >
          Next »
        </button>
      </div>
    </form>
  );
};

export default SetPricingStep;
